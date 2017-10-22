import { ODataBatch } from "@pnp/odata";
import { Util, mergeHeaders } from "@pnp/common";
import { Logger, LogLevel } from "@pnp/logging";
import { SPHttpClient } from "./net/sphttpclient";
import { SPRuntimeConfig } from "./config/splibconfig";
import { SPBatchParseException } from "./exceptions";
import { toAbsoluteUrl } from "./utils/toabsoluteurl";

/**
 * Manages a batch of OData operations
 */
export class SPBatch extends ODataBatch {

    constructor(private baseUrl: string) {
        super();
    }

    protected executeImpl(): Promise<void> {

        Logger.write(`[${this.batchId}] (${(new Date()).getTime()}) Executing batch with ${this.requests.length} requests.`, LogLevel.Info);

        // if we don't have any requests, don't bother sending anything
        // this could be due to caching further upstream, or just an empty batch
        if (this.requests.length < 1) {
            Logger.write(`Resolving empty batch.`, LogLevel.Info);
            return Promise.resolve();
        }

        // creating the client here allows the url to be populated for nodejs client as well as potentially
        // any other hacks needed for other types of clients. Essentially allows the absoluteRequestUrl
        // below to be correct
        const client = new SPHttpClient();

        // due to timing we need to get the absolute url here so we can use it for all the individual requests
        // and for sending the entire batch
        return toAbsoluteUrl(this.baseUrl).then(absoluteRequestUrl => {

            // build all the requests, send them, pipe results in order to parsers
            const batchBody: string[] = [];

            let currentChangeSetId = "";

            for (let i = 0; i < this.requests.length; i++) {
                const reqInfo = this.requests[i];

                if (reqInfo.method === "GET") {

                    if (currentChangeSetId.length > 0) {
                        // end an existing change set
                        batchBody.push(`--changeset_${currentChangeSetId}--\n\n`);
                        currentChangeSetId = "";
                    }

                    batchBody.push(`--batch_${this.batchId}\n`);

                } else {

                    if (currentChangeSetId.length < 1) {
                        // start new change set
                        currentChangeSetId = Util.getGUID();
                        batchBody.push(`--batch_${this.batchId}\n`);
                        batchBody.push(`Content-Type: multipart/mixed; boundary="changeset_${currentChangeSetId}"\n\n`);
                    }

                    batchBody.push(`--changeset_${currentChangeSetId}\n`);
                }

                // common batch part prefix
                batchBody.push(`Content-Type: application/http\n`);
                batchBody.push(`Content-Transfer-Encoding: binary\n\n`);

                const headers = new Headers();

                // this is the url of the individual request within the batch
                const url = Util.isUrlAbsolute(reqInfo.url) ? reqInfo.url : Util.combinePaths(absoluteRequestUrl, reqInfo.url);

                Logger.write(`[${this.batchId}] (${(new Date()).getTime()}) Adding request ${reqInfo.method} ${url} to batch.`, LogLevel.Verbose);

                if (reqInfo.method !== "GET") {

                    let method = reqInfo.method;

                    const castHeaders: any = reqInfo.options.headers;
                    if (reqInfo.hasOwnProperty("options") && reqInfo.options.hasOwnProperty("headers") && typeof castHeaders["X-HTTP-Method"] !== "undefined") {

                        method = castHeaders["X-HTTP-Method"];
                        delete castHeaders["X-HTTP-Method"];
                    }

                    batchBody.push(`${method} ${url} HTTP/1.1\n`);

                    headers.set("Content-Type", "application/json;odata=verbose;charset=utf-8");

                } else {
                    batchBody.push(`${reqInfo.method} ${url} HTTP/1.1\n`);
                }

                // merge global config headers
                mergeHeaders(headers, SPRuntimeConfig.headers);

                // merge per-request headers
                if (reqInfo.options) {
                    mergeHeaders(headers, reqInfo.options.headers);
                }

                // lastly we apply any default headers we need that may not exist
                if (!headers.has("Accept")) {
                    headers.append("Accept", "application/json");
                }

                if (!headers.has("Content-Type")) {
                    headers.append("Content-Type", "application/json;odata=verbose;charset=utf-8");
                }

                if (!headers.has("X-ClientService-ClientTag")) {
                    headers.append("X-ClientService-ClientTag", "PnPCoreJS:@pnp-$$Version$$");
                }

                // write headers into batch body
                headers.forEach((value: string, name: string) => {
                    batchBody.push(`${name}: ${value}\n`);
                });

                batchBody.push("\n");

                if (reqInfo.options.body) {
                    batchBody.push(`${reqInfo.options.body}\n\n`);
                }
            }

            if (currentChangeSetId.length > 0) {
                // Close the changeset
                batchBody.push(`--changeset_${currentChangeSetId}--\n\n`);
                currentChangeSetId = "";
            }

            batchBody.push(`--batch_${this.batchId}--\n`);

            const batchOptions = {
                "body": batchBody.join(""),
                "headers": {
                    "Content-Type": `multipart/mixed; boundary=batch_${this.batchId}`,
                },
                "method": "POST",
            };

            Logger.write(`[${this.batchId}] (${(new Date()).getTime()}) Sending batch request.`, LogLevel.Info);

            return client.fetch(Util.combinePaths(absoluteRequestUrl, "/_api/$batch"), batchOptions)
                .then(r => r.text())
                .then(this._parseResponse)
                .then((responses: Response[]) => {

                    if (responses.length !== this.requests.length) {
                        throw new SPBatchParseException("Could not properly parse responses to match requests in batch.");
                    }

                    Logger.write(`[${this.batchId}] (${(new Date()).getTime()}) Resolving batched requests.`, LogLevel.Info);

                    return responses.reduce((chain, response, index) => {

                        const request = this.requests[index];

                        Logger.write(`[${this.batchId}] (${(new Date()).getTime()}) Resolving batched request ${request.method} ${request.url}.`, LogLevel.Verbose);

                        return chain.then(_ => request.parser.parse(response).then(request.resolve).catch(request.reject));

                    }, Promise.resolve());
                });
        });
    }

    /**
     * Parses the response from a batch request into an array of Response instances
     *
     * @param body Text body of the response from the batch request
     */
    private _parseResponse(body: string): Promise<Response[]> {
        return new Promise((resolve, reject) => {
            const responses: Response[] = [];
            const header = "--batchresponse_";
            // Ex. "HTTP/1.1 500 Internal Server Error"
            const statusRegExp = new RegExp("^HTTP/[0-9.]+ +([0-9]+) +(.*)", "i");
            const lines = body.split("\n");
            let state = "batch";
            let status: number;
            let statusText: string;
            for (let i = 0; i < lines.length; ++i) {
                const line = lines[i];
                switch (state) {
                    case "batch":
                        if (line.substr(0, header.length) === header) {
                            state = "batchHeaders";
                        } else {
                            if (line.trim() !== "") {
                                throw new SPBatchParseException(`Invalid response, line ${i}`);
                            }
                        }
                        break;
                    case "batchHeaders":
                        if (line.trim() === "") {
                            state = "status";
                        }
                        break;
                    case "status":
                        const parts = statusRegExp.exec(line);
                        if (parts.length !== 3) {
                            throw new SPBatchParseException(`Invalid status, line ${i}`);
                        }
                        status = parseInt(parts[1], 10);
                        statusText = parts[2];
                        state = "statusHeaders";
                        break;
                    case "statusHeaders":
                        if (line.trim() === "") {
                            state = "body";
                        }
                        break;
                    case "body":
                        responses.push((status === 204) ? new Response() : new Response(line, { status: status, statusText: statusText }));
                        state = "batch";
                        break;
                }
            }
            if (state !== "status") {
                reject(new SPBatchParseException("Unexpected end of input"));
            }
            resolve(responses);
        });
    }
}

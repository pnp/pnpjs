import { ODataBatch } from "@pnp/odata";
import { Logger, LogLevel } from "@pnp/logging";
import { objectDefinedNotNull, extend, jsS } from "@pnp/common";
import { GraphRuntimeConfig } from "./config/graphlibconfig";
import { GraphHttpClient } from "./net/graphhttpclient";

interface GraphBatchRequestFragment {
    id: string;
    method: string;
    url: string;
    headers?: string[][] | {
        [key: string]: string;
    };
    body?: any;
}

interface GraphBatchRequest {
    requests: GraphBatchRequestFragment[];
}

interface GraphBatchResponseFragment {
    id: string;
    status: number;
    method: string;
    url: string;
    headers?: string[][] | {
        [key: string]: string;
    };
    body?: any;
}

interface GraphBatchResponse {
    responses: GraphBatchResponseFragment[];
    nextLink?: string;
}

export class GraphBatchParseException extends Error {

    constructor(msg: string) {
        super(msg);
        this.name = "GraphBatchParseException";
        Logger.log({ data: {}, level: LogLevel.Error, message: `[${this.name}]::${this.message}` });
    }
}

export class GraphBatch extends ODataBatch {

    constructor(private batchUrl = "https://graph.microsoft.com/beta/$batch") {
        super();
    }

    protected executeImpl(): Promise<void> {

        Logger.write(`[${this.batchId}] (${(new Date()).getTime()}) Executing batch with ${this.requests.length} requests.`, LogLevel.Info);

        const client = new GraphHttpClient();

        const batchRequest: GraphBatchRequest = {
            requests: this.formatRequests(),
        };

        const batchOptions = {
            body: jsS(batchRequest),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
        };

        Logger.write(`[${this.batchId}] (${(new Date()).getTime()}) Sending batch request.`, LogLevel.Info);

        // let nextLinkFlag = false;

        return client.fetch(this.batchUrl, batchOptions)
            .then(r => r.json())
            .then(this._parseResponse)
            .then((parsedResponse: { nextLink: string, responses: Response[] }) => {

                Logger.write(`[${this.batchId}] (${(new Date()).getTime()}) Resolving batched requests.`, LogLevel.Info);

                return parsedResponse.responses.reduce((chain, response, index) => {

                    const request = this.requests[index];

                    if (objectDefinedNotNull(request)) {

                        Logger.write(`[${this.batchId}] (${(new Date()).getTime()}) Resolving batched request ${request.method} ${request.url}.`, LogLevel.Verbose);

                        return chain.then(_ => request.parser.parse(response).then(request.resolve).catch(request.reject));

                    } else {

                        // do we have a next url? if no this is an error
                        if (parsedResponse.nextLink) {
                            throw new GraphBatchParseException("Could not properly parse responses to match requests in batch.");
                        }

                        // nextLinkFlag = true;
                        // keep the chain moving, but don't add anything for this request yet
                        // here we need to process the next link - so what do we do?
                        // need to append a .then()
                        // TODO::
                        return chain;
                    }

                }, Promise.resolve());
            });
    }

    private formatRequests(): GraphBatchRequestFragment[] {

        return this.requests.map((reqInfo, index) => {

            let requestFragment: GraphBatchRequestFragment = {
                id: `${++index}`,
                method: reqInfo.method,
                url: reqInfo.url,
            };

            let headers = {};

            // merge global config headers
            if (GraphRuntimeConfig.headers !== undefined && GraphRuntimeConfig.headers !== null) {

                headers = extend(headers, GraphRuntimeConfig.headers);
            }

            if (reqInfo.options !== undefined) {

                // merge per request headers
                if (reqInfo.options.headers !== undefined && reqInfo.options.headers !== null) {
                    headers = extend(headers, reqInfo.options.headers);
                }

                // add a request body
                if (reqInfo.options.body !== undefined && reqInfo.options.body !== null) {

                    requestFragment = extend(requestFragment, {
                        body: reqInfo.options.body,
                    });
                }
            }

            requestFragment = extend(requestFragment, {
                headers: headers,
            });

            return requestFragment;
        });
    }

    private _parseResponse(graphResponse: GraphBatchResponse): Promise<{ nextLink: string, responses: Response[] }> {

        return new Promise((resolve) => {

            const parsedResponses: Response[] = new Array(this.requests.length).fill(null);

            for (let i = 0; i < graphResponse.responses.length; ++i) {

                const response = graphResponse.responses[i];
                // we create the request id by adding 1 to the index, so we place the response by subtracting one to match
                // the array of requests and make it easier to map them by index
                const responseId = parseInt(response.id, 10) - 1;

                if (response.status === 204) {

                    parsedResponses[responseId] = new Response();
                } else {

                    parsedResponses[responseId] = new Response(null, {
                        headers: response.headers,
                        status: response.status,
                    });
                }
            }

            resolve({
                nextLink: graphResponse.nextLink,
                responses: parsedResponses,
            });
        });
    }
}


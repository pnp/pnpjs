import { Batch, IODataBatchRequestInfo } from "@pnp/odata";
import { Logger, LogLevel } from "@pnp/logging";
import { assign, jsS, isUrlAbsolute, hOP, Runtime, DefaultRuntime } from "@pnp/common";
import { IGraphConfigurationPart, IGraphConfigurationProps } from "./graphlibconfig.js";
import { GraphHttpClient } from "./graphhttpclient.js";
import { toAbsoluteUrl } from "./utils/toabsoluteurl.js";

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
    statusText?: string;
    method: string;
    url: string;
    headers?: string[][] | {
        [key: string]: string;
    };
    body?: any;
}

interface IGraphBatchResponse {
    error?: {
        code: string;
        innerError: { "request-id": string; date: string };
        message: string;
    };
    responses: GraphBatchResponseFragment[];
    nextLink?: string;
}

export class GraphBatch extends Batch {

    constructor(private batchUrl = "v1.0/$batch", private maxRequests = 20, private runtime = DefaultRuntime) {
        super();
    }

    public setRuntime(runtime: Runtime): this {
        this.runtime = runtime;
        return this;
    }

    protected async executeImpl(): Promise<void> {

        Logger.write(`[${this.batchId}] (${(new Date()).getTime()}) Executing batch with ${this.requests.length} requests.`, LogLevel.Info);

        if (this.requests.length < 1) {
            Logger.write("Resolving empty batch.", LogLevel.Info);
            return Promise.resolve();
        }

        const client = new GraphHttpClient(this.runtime);

        // create a working copy of our requests
        const requests = this.requests.slice();

        // this is the root of our promise chain
        while (requests.length > 0) {

            const requestsChunk = requests.splice(0, this.maxRequests);

            const batchRequest: GraphBatchRequest = {
                requests: this.formatRequests(requestsChunk),
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

            const queryUrl = await toAbsoluteUrl(this.batchUrl, this.runtime);

            await client.fetch(queryUrl, batchOptions)
                .then(r => r.json())
                .then((j) => this.parseResponse(requestsChunk, j))
                .then((parsedResponse: { nextLink: string; responses: Response[] }) => {

                    Logger.write(`[${this.batchId}] (${(new Date()).getTime()}) Resolving batched requests.`, LogLevel.Info);

                    parsedResponse.responses.reduce((chain, response, index) => {

                        const request = requestsChunk[index];

                        Logger.write(`[${this.batchId}] (${(new Date()).getTime()}) Resolving batched request ${request.method} ${request.url}.`, LogLevel.Verbose);

                        return chain.then(() => request.parser.parse(response).then(request.resolve).catch(request.reject));

                    }, Promise.resolve());
                }).catch(e => {
                    throw e;
                });
        }
    }

    /**
     * Urls come to the batch absolute, but the processor expects relative
     * @param url Url to ensure is relative
     */
    private makeUrlRelative(url: string): string {

        if (!isUrlAbsolute(url)) {
            // already not absolute, just give it back
            return url;
        }

        let index = url.indexOf("/v1.0/");

        if (index < 0) {

            index = url.indexOf("/beta/");

            if (index > -1) {

                // beta url
                return url.substr(index + 6);
            }

        } else {
            // v1.0 url
            return url.substr(index + 5);
        }

        // no idea
        return url;
    }

    private formatRequests(requests: IODataBatchRequestInfo[]): GraphBatchRequestFragment[] {

        return requests.map((reqInfo, index) => {

            let requestFragment: GraphBatchRequestFragment = {
                id: `${++index}`,
                method: reqInfo.method,
                url: this.makeUrlRelative(reqInfo.url),
            };

            let headers = {};

            // merge runtime headers
            headers = assign(headers, this.runtime.get<IGraphConfigurationPart, IGraphConfigurationProps>("graph")?.headers);

            if (reqInfo.options !== undefined) {

                // merge per request headers
                if (reqInfo.options.headers !== undefined && reqInfo.options.headers !== null) {
                    headers = assign(headers, reqInfo.options.headers);
                }

                // all non-get requests need their own content-type header
                if (reqInfo.method !== "GET") {
                    headers["Content-Type"] = "application/json";
                }

                // add a request body
                if (reqInfo.options.body !== undefined && reqInfo.options.body !== null) {

                    // we need to parse the body which was previously turned into a string
                    requestFragment = assign(requestFragment, {
                        body: JSON.parse(reqInfo.options.body),
                    });
                }
            }

            requestFragment = assign(requestFragment, {
                headers: headers,
            });

            return requestFragment;
        });
    }

    private parseResponse(requests: IODataBatchRequestInfo[], graphResponse: IGraphBatchResponse): Promise<{ nextLink: string; responses: Response[] }> {

        return new Promise((resolve, reject) => {

            // we need to see if we have an error and report that
            if (hOP(graphResponse, "error")) {
                return reject(Error(`Error Porcessing Batch: (${graphResponse.error.code}) ${graphResponse.error.message}`));
            }

            const parsedResponses: Response[] = new Array(requests.length).fill(null);

            for (let i = 0; i < graphResponse.responses.length; ++i) {

                const response = graphResponse.responses[i];
                // we create the request id by adding 1 to the index, so we place the response by subtracting one to match
                // the array of requests and make it easier to map them by index
                const responseId = parseInt(response.id, 10) - 1;

                if (response.status === 204) {

                    parsedResponses[responseId] = new Response();
                } else {

                    parsedResponses[responseId] = new Response(JSON.stringify(response.body), response);
                }
            }

            resolve({
                nextLink: graphResponse.nextLink,
                responses: parsedResponses,
            });
        });
    }
}

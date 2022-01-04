import { isUrlAbsolute, hOP, TimelinePipe, getGUID, CopyFrom, objectDefinedNotNull } from "@pnp/core";
import { parseBinderWithErrorCheck, Queryable, body, InjectHeaders } from "@pnp/queryable";
import { IGraphQueryable, _GraphQueryable } from "./graphqueryable.js";
import { graphPost } from "./operations.js";
import { GraphFI } from "./fi.js";

declare module "./fi" {
    interface GraphFI {

        /**
         * Creates a batch behavior and associated execute function
         *
         */
        batched(props?: IGraphBatchProps): [GraphFI, () => Promise<void>];
    }
}

GraphFI.prototype.batched = function (this: GraphFI, props?: IGraphBatchProps): [GraphFI, () => Promise<void>] {

    const batchedRest = new GraphFI(this._root);

    const [behavior, execute] = createBatch(batchedRest._root, props);

    batchedRest._root.using(behavior);

    return [batchedRest, execute];
};

interface IGraphBatchProps {
    maxRequests?: number;
}

interface IGraphBatchRequestFragment {
    id: string;
    method: string;
    url: string;
    headers?: HeadersInit;
    body?: any;
}

interface IGraphBatchRequest {
    requests: IGraphBatchRequestFragment[];
}

interface IGraphBatchResponseFragment {
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
    responses: IGraphBatchResponseFragment[];
    nextLink?: string;
}

type ParsedGraphResponse = { nextLink: string; responses: Response[] };

/**
 * The request record defines a tuple that is
 *
 * [0]: The queryable object representing the request
 * [1]: The request url
 * [2]: Any request init values (headers, etc)
 * [3]: The resolve function back to the promise for the original operation
 * [4]: The reject function back to the promise for the original operation
 */
type RequestRecord = [Queryable, string, RequestInit, (value: Response | PromiseLike<Response>) => void, (reason?: any) => void];

const RegistrationCompleteSym = Symbol.for("batch_reg_done");
const RequestCompleteSym = Symbol.for("batch_req_done");

function BatchParse(): TimelinePipe {

    return parseBinderWithErrorCheck(async (response): Promise<ParsedGraphResponse> => {

        const graphResponse: IGraphBatchResponse = await response.json();

        // we need to see if we have an error and report that
        if (hOP(graphResponse, "error")) {
            throw Error(`Error Porcessing Batch: (${graphResponse.error.code}) ${graphResponse.error.message}`);
        }

        return parseResponse(graphResponse);
    });
}

class BatchQueryable extends _GraphQueryable {

    constructor(base: IGraphQueryable, public requestBaseUrl = base.toUrl().replace(/[\\|/]v1\.0|beta[\\|/].*$/i, "")) {

        super(requestBaseUrl, "$batch");

        // this will copy over the current observables from the base associated with this batch
        this.using(CopyFrom(base, "replace"));

        // this will replace any other parsing present
        this.using(BatchParse());
    }
}

export function createBatch(base: IGraphQueryable, props?: IGraphBatchProps): [TimelinePipe, () => Promise<void>] {

    const registrationPromises: Promise<void>[] = [];
    const completePromises: Promise<void>[] = [];
    const requests: RequestRecord[] = [];
    const batchId = getGUID();
    const batchQuery = new BatchQueryable(base);

    batchQuery.using(InjectHeaders({
        "Accept": "application/json",
        "Content-Type": "application/json",
    }));

    const propsWithDefaults: Required<IGraphBatchProps> = {
        maxRequests: 30,
        ...props,
    };

    const execute = async () => {

        await Promise.all(registrationPromises);

        if (requests.length < 1) {
            return;
        }

        // create a working copy of our requests
        const requestsWorkingCopy = requests.slice();

        // this is the root of our promise chain
        while (requestsWorkingCopy.length > 0) {

            const requestsChunk = requestsWorkingCopy.splice(0, propsWithDefaults.maxRequests);

            const batchRequest: IGraphBatchRequest = {
                requests: formatRequests(requestsChunk, batchId),
            };

            const response: ParsedGraphResponse = await graphPost(batchQuery, body(batchRequest));

            // this structure ensures that we resolve the batched requests in the order we expect
            await response.responses.reduce((p, response, index) => p.then(() => {

                const [, , , resolve, reject] = requestsChunk[index];

                try {

                    resolve(response);

                } catch (e) {

                    reject(e);
                }

            }), Promise.resolve(void (0))).then(() => Promise.all(completePromises).then(() => void (0)));
        }
    };

    const register = (instance: Queryable) => {

        instance.on.init(function (this: Queryable) {

            // we need to ensure we wait to start execute until all our batch children hit the .send method to be fully registered
            registrationPromises.push(new Promise((resolve) => {
                (<any>this)[RegistrationCompleteSym] = resolve;
            }));

            return this;
        });

        // the entire request will be auth'd - we don't need to run this for each batch request
        instance.on.auth.clear();

        // we replace the send function with our batching logic
        instance.on.send.replace(async function (this: Queryable, url: URL, init: RequestInit) {

            let requestTuple: RequestRecord;

            const promise = new Promise<Response>((resolve, reject) => {
                requestTuple = [this, url.toString(), init, resolve, reject];
            });

            this.log(`[batch:${batchId}] (${(new Date()).getTime()}) Adding request ${init.method} ${url.toString()} to batch.`, 0);

            requests.push(requestTuple);

            // we need to ensure we wait to resolve execute until all our batch children have fully completed their request timelines
            completePromises.push(new Promise((resolve) => {
                (<any>this)[RequestCompleteSym] = resolve;
            }));

            (<any>this)[RegistrationCompleteSym]();

            return promise;
        });

        // we need to know when each request in the batch's timeline has completed
        instance.on.dispose(function () {

            // let things know we are done with this request
            (<any>this)[RequestCompleteSym]();

            // remove the symbol props we added for good hygene
            delete this[RegistrationCompleteSym];
            delete this[RequestCompleteSym];
        });

        return instance;
    };

    return [register, execute];
}

/**
 * Urls come to the batch absolute, but the processor expects relative
 * @param url Url to ensure is relative
 */
function makeUrlRelative(url: string): string {

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

function formatRequests(requests: RequestRecord[], batchId: string): IGraphBatchRequestFragment[] {

    return requests.map((reqInfo, index) => {

        const [queryable, url, init] = reqInfo;

        queryable.log(`[${batchId}] (${(new Date()).getTime()}) Adding request ${init.method} ${url} to batch.`, 0);

        let requestFragment: IGraphBatchRequestFragment = {
            id: `${++index}`,
            method: init.method,
            url: makeUrlRelative(url),
        };

        const headers = {
            ...init.headers,
        };

        if (init.method !== "GET") {
            headers["Content-Type"] = "application/json";
        }

        if (objectDefinedNotNull(init.body)) {

            requestFragment = {
                body: JSON.parse(<any>init.body),
                ...requestFragment,
            };
        }

        requestFragment = {
            headers,
            ...requestFragment,
        };

        return requestFragment;
    });
}

function parseResponse(graphResponse: IGraphBatchResponse): Promise<ParsedGraphResponse> {

    return new Promise((resolve, reject) => {

        // we need to see if we have an error and report that
        if (hOP(graphResponse, "error")) {
            return reject(Error(`Error Porcessing Batch: (${graphResponse.error.code}) ${graphResponse.error.message}`));
        }

        const parsedResponses: Response[] = new Array(graphResponse.responses.length).fill(null);

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

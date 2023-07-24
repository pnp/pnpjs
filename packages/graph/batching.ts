import { isUrlAbsolute, hOP, TimelinePipe, getGUID, CopyFrom, objectDefinedNotNull, isFunc, combine } from "@pnp/core";
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

type ParsedGraphResponse = { nextLink?: string; responses: Response[] };

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

const RegistrationCompleteSym = Symbol.for("batch_registration");
const RequestCompleteSym = Symbol.for("batch_request");

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

    constructor(base: IGraphQueryable, public requestBaseUrl = base.toUrl().replace(/[\\|/]v1\.0|beta[\\|/].*$/i || "", "")) {

        super(requestBaseUrl, "$batch");

        // this will copy over the current observables from the base associated with this batch
        this.using(CopyFrom(base, "replace"));

        // this will replace any other parsing present
        this.using(BatchParse(), InjectHeaders({
            "Accept": "application/json",
            "Content-Type": "application/json",
        }));

        // do a fix up on the url once other pre behaviors have had a chance to run
        this.on.pre(async function (this: BatchQueryable, url, init, result) {

            const versRegex = /(https:\/\/.*?[\\|/]v1\.0|beta[\\|/])/i;

            const m = url.match(versRegex);

            // if we don't have the match we expect we don't make any changes and hope for the best
            if (m && m.length > 0) {
                // fix up the url, requestBaseUrl, and the _url
                url = combine(m[0], "$batch");
                this.requestBaseUrl = url;
                this._url = url;
            }

            return [url, init, result];
        });

        this.on.dispose(() => {

            // there is a code path where you may invoke a batch, say on items.add, whose return
            // is an object like { data: any, item: IItem }. The expectation from v1 on is `item` in that object
            // is immediately usable to make additional queries. Without this step when that IItem instance is
            // created using "this.getById" within IITems.add all of the current observers of "this" are
            // linked to the IItem instance created (expected), BUT they will be the set of observers setup
            // to handle the batch, meaning invoking `item` will result in a half batched call that
            // doesn't really work. To deliver the expected functionality we "reset" the
            // observers using the original instance, mimicing the behavior had
            // the IItem been created from that base without a batch involved. We use CopyFrom to ensure
            // that we maintain the references to the InternalResolve and InternalReject events through
            // the end of this timeline lifecycle. This works because CopyFrom by design uses Object.keys
            // which ignores symbol properties.
            base.using(CopyFrom(this, "replace", (k) => /(auth|send|init)/i.test(k)));
        });
    }
}

export function createBatch(base: IGraphQueryable, props?: IGraphBatchProps): [TimelinePipe, () => Promise<void>] {

    const registrationPromises: Promise<void>[] = [];
    const completePromises: Promise<void>[] = [];
    const requests: RequestRecord[] = [];
    const batchId = getGUID();
    const batchQuery = new BatchQueryable(base);
    const refQuery = new BatchQueryable(base);

    const { maxRequests } = {
        maxRequests: 30,
        ...props,
    };

    const execute = async () => {

        await Promise.all(registrationPromises);

        if (requests.length < 1) {
            return Promise.all(completePromises).then(() => void (0));
        }

        // create a working copy of our requests
        const requestsWorkingCopy = requests.slice();

        // this is the root of our promise chain
        while (requestsWorkingCopy.length > 0) {

            const requestsChunk = requestsWorkingCopy.splice(0, maxRequests);

            const batchRequest: IGraphBatchRequest = {
                requests: formatRequests(requestsChunk, batchId),
            };

            const response: ParsedGraphResponse = await graphPost(batchQuery, body(batchRequest));

            return new Promise<void>((res, rej) => {

                try {

                    for (let index = 0; index < response.responses.length; index++) {
                        const [, , , resolve, reject] = requests[index];
                        try {
                            resolve(response.responses[index]);
                        } catch (e) {
                            reject(e);
                        }
                    }

                    // this small delay allows the promises to resolve correctly in order by dropping this resolve behind
                    // the other work in the event loop. Feels hacky, but it works so 🤷
                    setTimeout(res, 0);

                } catch (e) {

                    setTimeout(() => rej(e), 0);
                }

            }).then(() => Promise.all(completePromises)).then(() => void (0));
        }
    };

    const register = (instance: Queryable) => {

        instance.on.init(function (this: Queryable) {

            // if we've already added "this" in a batch we can't include it in a second batch (or again in the same batch). If you need to
            // make the same request twice in a single batch create a new instance of "this" to add to the batch:
            // const users = graph.users;
            // const [batchedBehavior, execute] = createBatch(users);
            // users.using(batchedBehavior);
            // users();
            // // The below line will throw the error because "users" is already in the batch
            // // users();
            // the solution is to create a second instance of users as shown here
            // graph.users.using(batchedBehavior)();
            // Another option would be to drop it through the factory
            // Users(users).using(batchedBehavior)();
            if (isFunc(this[RegistrationCompleteSym])) {
                throw Error("This instance is already part of a batch. Please review the docs at https://pnp.github.io/pnpjs/concepts/batching#reuse.");
            }

            // we need to ensure we wait to start execute until all our batch children hit the .send method to be fully registered
            registrationPromises.push(new Promise((resolve) => {
                this[RegistrationCompleteSym] = resolve;
            }));

            return this;
        });

        // the entire request will be auth'd - we don't need to run this for each batch request
        instance.on.auth.clear();

        // we replace the send function with our batching logic
        instance.on.send.replace(async function (this: Queryable, url: URL, init: RequestInit) {

            const promise = new Promise<Response>((resolve, reject) => {
                requests.push([this, url.toString(), init, resolve, reject]);
            });

            this.log(`[batch:${batchId}] (${(new Date()).getTime()}) Adding request ${init.method} ${url.toString()} to batch.`, 0);

            // we need to ensure we wait to resolve execute until all our batch children have fully completed their request timelines
            completePromises.push(new Promise((resolve) => {
                this[RequestCompleteSym] = resolve;
            }));

            this[RegistrationCompleteSym]();

            return promise;
        });

        // we need to know when each request in the batch's timeline has completed
        instance.on.dispose(function () {

            if (isFunc(this[RegistrationCompleteSym])) {

                // if this request is in a batch and caching is in play we need to resolve the registration promises to unblock processing of the batch
                // because the request will never reach the "send" moment as the result is returned from "pre"
                this[RegistrationCompleteSym]();

                // remove the symbol props we added for good hygene
                delete this[RegistrationCompleteSym];
            }

            if (isFunc(this[RequestCompleteSym])) {

                // let things know we are done with this request
                this[RequestCompleteSym]();
                delete this[RequestCompleteSym];

                // there is a code path where you may invoke a batch, say on items.add, whose return
                // is an object like { data: any, item: IItem }. The expectation from v1 on is `item` in that object
                // is immediately usable to make additional queries. Without this step when that IItem instance is
                // created using "this.getById" within IITems.add all of the current observers of "this" are
                // linked to the IItem instance created (expected), BUT they will be the set of observers setup
                // to handle the batch, meaning invoking `item` will result in a half batched call that
                // doesn't really work. To deliver the expected functionality we "reset" the
                // observers using the original instance, mimicing the behavior had
                // the IItem been created from that base without a batch involved. We use CopyFrom to ensure
                // that we maintain the references to the InternalResolve and InternalReject events through
                // the end of this timeline lifecycle. This works because CopyFrom by design uses Object.keys
                // which ignores symbol properties.
                this.using(CopyFrom(refQuery, "replace", (k) => /(auth|send|init|dispose)/i.test(k)));
            }
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
            return url.substring(index + 6);
        }

    } else {
        // v1.0 url
        return url.substring(index + 5);
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
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            method: init.method!,
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

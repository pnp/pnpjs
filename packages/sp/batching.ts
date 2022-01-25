import { getGUID, isUrlAbsolute, combine, CopyFrom, TimelinePipe, isFunc } from "@pnp/core";
import { InjectHeaders, parseBinderWithErrorCheck, Queryable } from "@pnp/queryable";
import { spPost } from "./operations.js";
import { ISPQueryable, SPQueryable, _SPQueryable } from "./spqueryable.js";
import { spfi, SPFI } from "./fi.js";
import { Web, IWeb, _Web } from "./webs/types.js";

declare module "./fi" {
    interface SPFI {

        /**
         * Creates a batch behavior and associated execute function
         *
         */
        batched(props?: ISPBatchProps): [SPFI, () => Promise<void>];
    }
}

declare module "./webs/types" {
    interface _Web {

        /**
         * Creates a batch behavior and associated execute function
         *
         */
        batched(props?: ISPBatchProps): [IWeb, () => Promise<void>];
    }
}

SPFI.prototype.batched = function (this: SPFI, props?: ISPBatchProps): [SPFI, () => Promise<void>] {

    const batched = spfi(this);

    const [behavior, execute] = createBatch(batched._root, props);

    batched.using(behavior);

    return [batched, execute];
};

_Web.prototype.batched = function (this: IWeb, props?: ISPBatchProps): [IWeb, () => Promise<void>] {

    const batched = Web(this);

    const [behavior, execute] = createBatch(batched, props);

    batched.using(behavior);

    return [batched, execute];
};

interface ISPBatchProps {
    /**
     * Controls the headers copied from the original request into the batched request, applied to all items
     * default: /Accept|Content-Type|IF-Match/i
     */
    headersCopyPattern?: RegExp;
}

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

/**
 * Tracks on a batched instance that registration is complete (the child request has gotten to the send moment and the request is included in the batch)
 */
const RegistrationCompleteSym = Symbol.for("batch_registration");

/**
 * Tracks on a batched instance that the child request timeline lifecycle is complete (called in child.dispose)
 */
const RequestCompleteSym = Symbol.for("batch_request");

/**
 * Tracks on a batched instance the original set of observers which are returned once the batch is complete
 */
const ObserverTrackerSym = Symbol.for("batch_original_observers");

/**
 * Special batch parsing behavior used to convert the batch response text into a set of Response objects for each request
 * @returns A parser behavior
 */
function BatchParse(): TimelinePipe {

    return parseBinderWithErrorCheck(async (response): Promise<Response[]> => {
        const text = await response.text();
        return parseResponse(text);
    });
}

/**
 * Internal class used to execute the batch request through the timeline lifecycle
 */
class BatchQueryable extends _SPQueryable {

    constructor(base: ISPQueryable, public requestBaseUrl = base.toUrl().replace(/_api[\\|/].*$/i, "")) {

        super(requestBaseUrl, "_api/$batch");

        // this will copy over the current observables from the base associated with this batch
        // this will replace any other parsing present
        this.using(CopyFrom(base, "replace"), BatchParse());
    }
}

/**
 * Creates a batched version of the supplied base, meaning that all chained fluent operations from the new base are part of the batch
 *
 * @param base The base from which to initialize the batch
 * @param props Any properties used to initialize the batch functionality
 * @returns A tuple of [behavior used to assign objects to the batch, the execute function used to resolve the batch requests]
 */
export function createBatch(base: ISPQueryable, props?: ISPBatchProps): [TimelinePipe, () => Promise<void>] {

    const registrationPromises: Promise<void>[] = [];
    const completePromises: Promise<void>[] = [];
    const requests: RequestRecord[] = [];
    const batchId = getGUID();
    const batchQuery = new BatchQueryable(base);

    const { headersCopyPattern } = {
        headersCopyPattern: /Accept|Content-Type|IF-Match/i,
        ...props,
    };

    const execute = async () => {

        await Promise.all(registrationPromises);

        if (requests.length < 1) {
            return;
        }

        const batchBody: string[] = [];
        let currentChangeSetId = "";

        for (let i = 0; i < requests.length; i++) {

            const [, url, init] = requests[i];

            if (init.method === "GET") {

                if (currentChangeSetId.length > 0) {
                    // end an existing change set
                    batchBody.push(`--changeset_${currentChangeSetId}--\n\n`);
                    currentChangeSetId = "";
                }

                batchBody.push(`--batch_${batchId}\n`);

            } else {

                if (currentChangeSetId.length < 1) {
                    // start new change set
                    currentChangeSetId = getGUID();
                    batchBody.push(`--batch_${batchId}\n`);
                    batchBody.push(`Content-Type: multipart/mixed; boundary="changeset_${currentChangeSetId}"\n\n`);
                }

                batchBody.push(`--changeset_${currentChangeSetId}\n`);
            }

            // common batch part prefix
            batchBody.push("Content-Type: application/http\n");
            batchBody.push("Content-Transfer-Encoding: binary\n\n");

            // these are the per-request headers
            const headers = new Headers(init.headers);

            // this is the url of the individual request within the batch
            const reqUrl = isUrlAbsolute(url) ? url : combine(batchQuery.requestBaseUrl, url);

            if (init.method !== "GET") {

                let method = init.method;

                if (headers.has("X-HTTP-Method")) {
                    method = headers.get("X-HTTP-Method");
                    headers.delete("X-HTTP-Method");
                }

                batchBody.push(`${method} ${reqUrl} HTTP/1.1\n`);

            } else {
                batchBody.push(`${init.method} ${reqUrl} HTTP/1.1\n`);
            }

            // lastly we apply any default headers we need that may not exist
            if (!headers.has("Accept")) {
                headers.append("Accept", "application/json");
            }

            if (!headers.has("Content-Type")) {
                headers.append("Content-Type", "application/json;charset=utf-8");
            }

            // write headers into batch body
            headers.forEach((value: string, name: string) => {
                if (headersCopyPattern.test(name)) {
                    batchBody.push(`${name}: ${value}\n`);
                }
            });

            batchBody.push("\n");

            if (init.body) {
                batchBody.push(`${init.body}\n\n`);
            }
        }

        if (currentChangeSetId.length > 0) {
            // Close the changeset
            batchBody.push(`--changeset_${currentChangeSetId}--\n\n`);
            currentChangeSetId = "";
        }

        batchBody.push(`--batch_${batchId}--\n`);

        // we need to set our own headers here
        batchQuery.using(InjectHeaders({
            "Content-Type": `multipart/mixed; boundary=batch_${batchId}`,
        }));

        const responses: Response[] = await spPost(batchQuery, { body: batchBody.join("") });

        if (responses.length !== requests.length) {
            throw Error("Could not properly parse responses to match requests in batch.");
        }

        // this structure ensures that we resolve the batched requests in the order we expect
        return responses.reduce((p, response, index) => p.then(async () => {

            const [, , , resolve, reject] = requests[index];

            try {

                resolve(response);

            } catch (e) {

                reject(e);
            }

        }), Promise.resolve(void (0))).then(() => Promise.all(completePromises).then(() => {
            requests.length = 0;
        }));
    };

    const register = (instance: ISPQueryable) => {

        instance.on.init(function (this: ISPQueryable) {

            if (isFunc(this[RegistrationCompleteSym])) {
                throw Error("This instance is already part of a batch. Please review the docs at https://pnp.github.io/pnpjs/concepts/batching#reuse.");
            }

            // we need to track the observers from the original instance and put them back later (see comment below)
            this[ObserverTrackerSym] = SPQueryable(this);

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

            let requestTuple: RequestRecord;

            // this is the promise that user code will see
            const promise = new Promise<Response>((resolve, reject) => {
                requestTuple = [this, url.toString(), init, resolve, reject];
            });

            this.log(`[batch:${batchId}] (${(new Date()).getTime()}) Adding request ${init.method} ${url.toString()} to batch.`, 0);

            // add the request information into the batch
            requests.push(requestTuple);

            // we need to ensure we wait to resolve execute until all our batch children have fully completed their request timelines
            completePromises.push(new Promise((resolve) => {
                this[RequestCompleteSym] = resolve;
            }));

            // indicate that registration of this request is complete
            this[RegistrationCompleteSym]();

            return promise.then((r) => {
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
                this.using(CopyFrom(this[ObserverTrackerSym], "replace"));
                return r;
            });
        });

        instance.on.dispose(function () {

            if (isFunc(this[RequestCompleteSym])) {

                // let things know we are done with this request
                this[RequestCompleteSym]();
                delete this[RequestCompleteSym];
            }

            if (isFunc(this[RegistrationCompleteSym])) {

                // remove the symbol props we added for good hygene
                delete this[RegistrationCompleteSym];
            }

            if (this[ObserverTrackerSym]) {

                // remove the symbol props we added for good hygene
                delete this[ObserverTrackerSym];
            }
        });

        return instance;
    };

    return [register, execute];
}

/**
 * Parses the text body returned by the server from a batch request
 *
 * @param body String body from the server response
 * @returns Parsed response objects
 */
function parseResponse(body: string): Response[] {

    const responses: Response[] = [];
    const header = "--batchresponse_";
    // Ex. "HTTP/1.1 500 Internal Server Error"
    const statusRegExp = new RegExp("^HTTP/[0-9.]+ +([0-9]+) +(.*)", "i");
    const lines = body.split("\n");
    let state = "batch";
    let status: number;
    let statusText: string;
    let headers = {};
    for (let i = 0; i < lines.length; ++i) {
        const line = lines[i];
        switch (state) {
            case "batch":
                if (line.substring(0, header.length) === header) {
                    state = "batchHeaders";
                } else {
                    if (line.trim() !== "") {
                        throw Error(`Invalid response, line ${i}`);
                    }
                }
                break;
            case "batchHeaders":
                if (line.trim() === "") {
                    state = "status";
                }
                break;
            case "status": {
                const parts = statusRegExp.exec(line);
                if (parts.length !== 3) {
                    throw Error(`Invalid status, line ${i}`);
                }
                status = parseInt(parts[1], 10);
                statusText = parts[2];
                state = "statusHeaders";
                break;
            }
            case "statusHeaders":
                if (line.trim() === "") {
                    state = "body";
                } else {
                    const headerParts = line.split(":");
                    if (headerParts?.length === 2) {
                        headers[headerParts[0].trim()] = headerParts[1].trim();
                    }
                }
                break;
            case "body":
                responses.push(new Response(status === 204 ? null : line, { status, statusText, headers }));
                state = "batch";
                headers = {};
                break;
        }
    }

    if (state !== "status") {
        throw Error("Unexpected end of input");
    }

    return responses;
}

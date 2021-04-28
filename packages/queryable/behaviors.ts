import { Queryable2 } from "./queryable-2.js";
import { isFunc, getHashCode, PnPClientStorage, dateAdd, getGUID, isUrlAbsolute, combine } from "@pnp/common";
import { LogLevel, Logger } from "@pnp/logging";
import { HttpRequestError } from "./parsers.js";

export function InjectHeaders(headers: Record<string, string>): (instance: Queryable2) => Queryable2 {

    return (instance: Queryable2) => {

        instance.on.pre(async function (url: string, init: RequestInit, result: any) {

            const keys = Object.getOwnPropertyNames(headers);

            for (let i = 0; i < keys.length; i++) {
                init.headers[keys[i]] = headers[keys[i]];
            }

            return [url, init, result];
        });

        return instance;
    };
}

export function PnPLogging(activeLevel: LogLevel): (instance: Queryable2) => Queryable2 {

    // we set the active level here
    Logger.activeLogLevel = activeLevel;

    return (instance: Queryable2) => {

        instance.on.log(function (message: string, level: LogLevel) {
            Logger.write(message, level);
        });

        return instance;
    };
}

export function Caching(store: "local" | "session" = "session", keyFactory?: (url: string) => string, expireFunc?: (url: string) => Date): (instance: Queryable2) => Queryable2 {

    const storage = new PnPClientStorage();
    const s = store === "session" ? storage.session : storage.local;

    if (!isFunc(keyFactory)) {
        keyFactory = (url: string) => getHashCode(url.toLowerCase()).toString();
    }

    if (!isFunc(expireFunc)) {
        // TODO:: tie this default timeline to config? or the config is having to create the function
        expireFunc = () => dateAdd(new Date(), "minute", 5);
    }

    return (instance: Queryable2) => {

        instance.on.pre(async function (this: Queryable2, url: string, init: RequestInit, result: any): Promise<[string, RequestInit, any]> {

            const key = keyFactory(url);

            const cached = s.get(key);

            if (cached === null) {

                // if we don't have a cached result we need to get it after the request is sent and parsed
                this.on.post(async function (url: string, result: any) {

                    s.put(key, result, expireFunc(url));

                    return [url, result];
                });

            } else {

                // we need to ensure that result stays "undefined" unless we mean to set null as the result
                result = cached;
            }

            return [url, init, result];
        });

        return instance;
    };
}

// TODO: this would live on sp or web or site and get the url from there
// eslint-disable-next-line max-len
export function createBatch(absoluteRequestUrl: string, runFetch: (...args: any[]) => Promise<Response>, hackAuthHeader: string): [(instance: Queryable2) => Queryable2, () => Promise<void>] {

    //  (this: IQueryable2, url: string, init: RequestInit) => Promise<Response>;
    // const h: QueryableSendObserver = null;

    type RequestRecord = [Queryable2, string, RequestInit, (value: Response | PromiseLike<Response>) => void, (reason?: any) => void];

    const registrationPromises: Promise<void>[] = [];
    const requests: RequestRecord[] = [];
    const batchId = getGUID();

    const execute = async () => {

        await Promise.all(registrationPromises);

        if (requests.length < 1) {
            return;
        }

        const batchBody: string[] = [];
        let currentChangeSetId = "";

        for (let i = 0; i < requests.length; i++) {

            const [queryable, url, init] = requests[i];

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
            const reqUrl = isUrlAbsolute(url) ? url : combine(absoluteRequestUrl, url);

            queryable.log(`[${batchId}] (${(new Date()).getTime()}) Adding request ${init.method} ${reqUrl} to batch.`, LogLevel.Verbose);

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
                headers.append("Content-Type", "application/json;odata=verbose;charset=utf-8");
            }

            if (!headers.has("X-ClientService-ClientTag")) {
                headers.append("X-ClientService-ClientTag", "PnPCoreJS:@pnp-$$Version$$:batch");
            }

            // write headers into batch body
            headers.forEach((value: string, name: string) => {
                batchBody.push(`${name}: ${value}\n`);
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

        batchBody.push(`--batch_${this.batchId}--\n`);

        const batchOptions = {
            "body": batchBody.join(""),
            "headers": {
                "Content-Type": `multipart/mixed; boundary=batch_${batchId}`,
                // TODO:: this is obviously a hack
                "Authorization": hackAuthHeader,
            },
            "method": "POST",
        };

        // TODO:: we need a way to specify the client within batches since we are replacing the send method
        const fetchResponse = await runFetch(combine(absoluteRequestUrl, "/_api/$batch"), batchOptions);

        if (!fetchResponse.ok) {
            // the entire batch resulted in an error and we need to handle that better #1356
            // things consistently with the rest of the http errors
            throw (await HttpRequestError.init(fetchResponse));
        }

        const text = await fetchResponse.text();
        const responses = parseResponse(text);

        if (responses.length !== requests.length) {
            throw Error("Could not properly parse responses to match requests in batch.");
        }

        // this structure ensures that we resolve the batched requests in the order we expect
        return responses.reduce((p, response, index) => p.then(() => {

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [, , , resolve, reject] = requests[index];

            try {

                resolve(response);

            } catch (e) {

                reject(e);
            }

        }), Promise.resolve(void (0)));
    };

    const register = (instance: Queryable2) => {

        let registrationResolver: (value: void | PromiseLike<void>) => void;

        // we need to ensure we wait to execute until all our batch children hit the .send method to be fully registered
        registrationPromises.push(new Promise((resolve) => {
            registrationResolver = resolve;
        }));

        // we setup this batch to "send" each of the requests, while saving the contextual "this" reference with each
        instance.on.send(async function (this: Queryable2, url: string, init: RequestInit) {

            let requestTuple: RequestRecord;

            const promise = new Promise<Response>((resolve, reject) => {
                requestTuple = [this, url, init, resolve, reject];
            });

            requests.push(requestTuple);

            registrationResolver();

            return promise;

        }, "replace");

        return instance;
    };

    return [register, execute];
}

function parseResponse(body: string): Response[] {

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
                }
                break;
            case "body":
                responses.push((status === 204) ? new Response() : new Response(line, { status: status, statusText: statusText }));
                state = "batch";
                break;
        }
    }

    if (state !== "status") {
        throw Error("Unexpected end of input");
    }

    return responses;
}

// NullErrorSink

// PnPLogging (take LogLevel)

// DefaultErrorBehavior

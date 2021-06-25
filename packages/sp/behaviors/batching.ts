import { getGUID, isUrlAbsolute, combine } from "@pnp/core";
import { LogLevel } from "@pnp/logging";
import { HttpRequestError, Queryable2 } from "@pnp/queryable";

// TODO:: this needs to be reworked as a behavior meaning all requests would batch? How does that play? maybe need the creatBatch concept so you can get the execute
// TODO: this would live on sp or web or site and get the url from there
// TODO: how do we handle auth here? Inherit a batch queryable from the parent like "web" and clear out the other settings?
// eslint-disable-next-line max-len
export function createBatch(absoluteRequestUrl: string, runFetch: (...args: any[]) => Promise<Response>, hackAuthHeader: string): [(instance: Queryable2) => Queryable2, () => Promise<void>] {

    /**
     * The request record defines a tuple that is
     *
     * [0]: The queryable object representing the request
     * [1]: The request url
     * [2]: Any request init values (headers, etc)
     * [3]: The resolve function back to the promise for the original operation
     * [4]: The reject function back to the promise for the original operation
     */
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
        instance.on.send(async function (this: Queryable2, url: URL, init: RequestInit) {

            let requestTuple: RequestRecord;

            const promise = new Promise<Response>((resolve, reject) => {
                requestTuple = [this, url.toString(), init, resolve, reject];
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

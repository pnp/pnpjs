import { LogLevel } from "@pnp/logging";
import { HttpRequestError, Queryable2 } from "@pnp/queryable";
import { default as nodeFetch } from "node-fetch";
import { delay, TimelinePipe } from "@pnp/core";

export function NodeFetch(): TimelinePipe<Queryable2> {

    return (instance: Queryable2) => {

        instance.on.send.replace(function (this: Queryable2, url: URL, init: RequestInit) {

            this.emit.log(`Fetch: ${init.method} ${url.toString()}`, LogLevel.Verbose);

            return nodeFetch(url.toString(), init);
        });

        return instance;
    };
}

export function NodeFetchWithRetry(retries = 3, interval = 200): TimelinePipe<Queryable2> {

    return (instance: Queryable2) => {

        instance.on.send.replace(function (this: Queryable2, url: URL, init: RequestInit): Promise<Response> {

            let response: Response;
            let wait = interval;
            let count = 1;

            const retry = async (): Promise<Response> => {

                // if we've tried too many times, throw
                if (count >= retries) {
                    throw new HttpRequestError(`Retry count exceeded (${retries}) for this request. ${response.status}: ${response.statusText};`, response);
                }

                if (typeof response === "undefined" || response?.status === 429 || response?.status === 503 || response?.status === 504) {
                    // this is our first try and response isn't defined yet
                    // we have been throttled OR http status code 503 or 504, we can retry this

                    if (typeof response !== "undefined") {

                        // this isn't our first try so we need to calculate delay
                        if (response.headers.has("Retry-After")) {

                            // if we have gotten a header, use that value as the delay value in seconds
                            wait = parseInt(response.headers.get("Retry-After"), 10) * 1000;
                        } else {

                            // Increment our counters.
                            wait *= 2;
                        }

                        this.emit.log(`Attempt #${count} to retry request which failed with ${response.status}: ${response.statusText}`, LogLevel.Verbose);
                        count++;

                        await delay(wait);
                    }

                    try {

                        this.emit.log(`Fetch: ${init.method} ${url.toString()}`, LogLevel.Verbose);

                        response = await nodeFetch(url.toString(), init);

                        // if we got a good response, return it, otherwise see if we can retry
                        return response.ok ? response : retry();

                    } catch (err) {

                        if (err && err.code && ["ETIMEDOUT", "ESOCKETTIMEDOUT", "ECONNREFUSED", "ECONNRESET"].indexOf(err.code.toUpperCase()) < 0) {
                            // this is some non-transient node error, no retry
                            throw err;
                        }

                        return retry();
                    }

                } else {

                    return response;
                }
            };

            // this the the first call to retry that starts the cycle
            // response is undefined and the other values have their defaults
            return retry();
        });

        return instance;
    };
}

import { LogLevel } from "@pnp/logging";
import { HttpRequestError, Queryable } from "@pnp/queryable";
import { default as nodeFetch } from "node-fetch";
import { delay, TimelinePipe } from "@pnp/core";

export interface INodeFetchProps {
    replace?: boolean;
}

export function NodeFetch(props?: INodeFetchProps): TimelinePipe<Queryable> {

    const { replace } = {
        replace: true,
        ...props,
    };

    return (instance: Queryable) => {

        if (replace) {
            instance.on.send.clear();
        }

        instance.on.send(function (this: Queryable, url: URL, init: RequestInit) {

            this.log(`Fetch: ${init.method} ${url.toString()}`, LogLevel.Verbose);

            return <any>nodeFetch(url.toString(), <any>init);
        });

        return instance;
    };
}

export interface INodeFetchWithRetryProps extends INodeFetchProps {
    retries?: number;
    interval?: number;
}

export function NodeFetchWithRetry(props?: INodeFetchWithRetryProps): TimelinePipe<Queryable> {

    const { interval, replace, retries } = {
        replace: true,
        interval: 200,
        retries: 3,
        ...props,
    };

    return (instance: Queryable) => {

        if (replace) {
            instance.on.send.clear();
        }

        instance.on.send(function (this: Queryable, url: URL, init: RequestInit): Promise<Response> {

            let response: Response;
            let wait = interval;
            let count = 0;
            let lastErr: Error;

            const retry = async (): Promise<Response> => {

                // if we've tried too many times, throw
                if (count >= retries) {
                    throw lastErr || new HttpRequestError(`Retry count exceeded (${retries}) for this request. ${response?.status}: ${response?.statusText};`, response || null);
                }

                count++;

                if (typeof response === "undefined" || response?.status === 429 || response?.status === 503 || response?.status === 504) {
                    // this is our first try and response isn't defined yet
                    // we have been throttled OR http status code 503 or 504, we can retry this

                    if (typeof response !== "undefined") {

                        // this isn't our first try so we need to calculate delay
                        if (response.headers.has("Retry-After")) {

                            // if we have gotten a header, use that value as the delay value in seconds
                            wait = parseInt(response?.headers?.get("Retry-After") || "1", 10) * 1000;

                        } else {

                            // Increment our counters.
                            wait *= 2;
                        }

                        this.log(`Attempt #${count} to retry request which failed with ${response.status}: ${response.statusText}`, LogLevel.Verbose);
                        await delay(wait);
                    }

                    try {

                        this.log(`Fetch: ${init.method} ${url.toString()}`, LogLevel.Verbose);

                        response = await <any>nodeFetch(url.toString(), <any>init);

                        // if we got a good response, return it, otherwise see if we can retry
                        return response.ok ? response : retry();

                    } catch (err) {

                        if (err && err.code && ["ETIMEDOUT", "ESOCKETTIMEDOUT", "ECONNREFUSED", "ECONNRESET"].indexOf(err.code.toUpperCase()) < 0) {
                            // this is some non-transient node error, no retry
                            throw err;
                        }

                        if (/AbortError/.test(err.name)) {
                            // don't retry canceled requests
                            throw err;
                        }

                        lastErr = err;
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

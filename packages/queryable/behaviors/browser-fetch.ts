import { Queryable } from "../queryable.js";
import { delay, TimelinePipe } from "@pnp/core";
import { HttpRequestError } from "./parsers.js";

interface BrowserFetchProps {
    replace?: boolean;
}

export function BrowserFetch(props?: BrowserFetchProps): TimelinePipe<Queryable> {

    const { replace } = {
        replace: true,
        ...props,
    };

    return (instance: Queryable) => {

        if (replace) {
            instance.on.send.clear();
        }

        instance.on.send(function (this: Queryable, url: URL, init: RequestInit): Promise<any> {

            this.log(`Fetch: ${init.method} ${url.toString()}`, 0);

            return fetch(url.toString(), init);

        });

        return instance;
    };
}

interface BrowserFetchWithRetryProps extends BrowserFetchProps {
    retries?: number;
    interval?: number;
}

export function BrowserFetchWithRetry(props?: BrowserFetchWithRetryProps): TimelinePipe<Queryable> {

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
                    throw lastErr || new HttpRequestError(`Retry count exceeded (${retries}) for this request. ${response.status}: ${response.statusText};`, response);
                }

                count++;

                if (typeof response === "undefined" || response?.status === 429 || response?.status === 503 || response?.status === 504) {
                    // this is our first try and response isn't defined yet
                    // we have been throttled OR http status code 503 or 504, we can retry this

                    if (typeof response !== "undefined") {

                        // this isn't our first try so we need to calculate delay
                        if (response.headers.has("Retry-After")) {

                            // if we have gotten a header, use that value as the delay value in seconds
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            wait = parseInt(response.headers.get("Retry-After")!, 10) * 1000;
                        } else {

                            // Increment our counters.
                            wait *= 2;
                        }

                        this.log(`Attempt #${count} to retry request which failed with ${response.status}: ${response.statusText}`, 0);

                        await delay(wait);
                    }

                    try {

                        const u = url.toString();

                        this.log(`Fetch: ${init.method} ${u}`, 0);

                        response = await fetch(u, init);

                        // if we got a good response, return it, otherwise see if we can retry
                        return response.ok ? response : retry();

                    } catch (err) {

                        if (/AbortError/.test(err.name)) {
                            // don't retry aborted requests
                            throw err;
                        }

                        // if there is no network the response is undefined and err is all we have
                        // so we grab the err and save it to throw if we exceed the number of retries
                        // #2226 first reported this
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

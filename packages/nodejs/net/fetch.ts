import { LogLevel } from "@pnp/logging";
import { Queryable2 } from "@pnp/queryable";
import { default as nodeFetch } from "node-fetch";
import { delay } from "@pnp/common";

// TODO:: remove
export function fetch(url: string, options: any): Promise<any> {
    return nodeFetch(url, options);
}

export function NodeFetch(): (instance: Queryable2) => Queryable2 {

    return (instance: Queryable2) => {

        instance.on.send((url: URL, init: RequestInit) => nodeFetch(url.toString(), init), "replace");

        return instance;
    };
}

export function NodeFetchWithRetry(retries = 3, interval = 200): (instance: Queryable2) => Queryable2 {

    return (instance: Queryable2) => {

        instance.on.send(function (this: Queryable2, url: URL, init: RequestInit): Promise<Response> {

            let response: Response;
            let wait = interval;
            let count = 1;

            const retry = async (): Promise<Response> => {

                if (response?.ok) {
                    return response;
                }

                if (count >= retries) {
                    throw Error(`Retry count exceeded (${retries}) for this request. ${response.status}: ${response.statusText};`);
                }

                // we have been throttled
                // http status code 503 or 504, we can retry this
                if (response?.status === 429 || response?.status === 503 || response?.status === 504) {

                    if (response.headers.has("Retry-After")) {

                        // if we have gotten a header, use that value as the delay value in seconds
                        wait = parseInt(response.headers.get("Retry-After"), 10) * 1000;
                    } else {

                        // Increment our counters.
                        wait *= 2;
                    }

                    count++;

                    await delay(wait);

                    this.emit.log(`Attempt #${count} to retry request which failed with ${response.status}: ${response.statusText}`, LogLevel.Verbose);
                    return retry();
                }

                try {

                    response = await nodeFetch(url.toString(), init);
                    return retry();

                } catch (err) {

                    if (err && err.code && ["ETIMEDOUT", "ESOCKETTIMEDOUT", "ECONNREFUSED", "ECONNRESET"].indexOf(err.code.toUpperCase()) < 0) {
                        // this is some non-transient node error, no retry
                        throw err;
                    }

                    return retry();
                }
            };

            // this the the first call to retry that starts the cycle
            // response is undefined and the other values have their defaults
            return retry();
        });

        return instance;
    };
}

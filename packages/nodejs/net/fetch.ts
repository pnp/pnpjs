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
        instance.on.send((url: string, init: RequestInit) => nodeFetch(url, init));
        return instance;
    };
}

export function NodeFetchWithRetry(retryCount = 3, retryInterval = 3000, minRetryInterval = 3000, maxRetryInterval = 90000): (instance: Queryable2) => Queryable2 {

    function updateRetryData(retryData: IRetryData, err: any): IRetryData {

        const data: IRetryData = retryData || {
            error: null,
            retryCount: 0,
            retryInterval: 0,
        };

        const newError = err || null;

        // Keep track of errors from previous retries
        // if they exist
        if (newError) {

            if (data.error) {
                newError.innerError = data.error;
            }

            data.error = newError;
        }

        // Adjust retry interval and cap based on the min and max intervals specified
        let incrementDelta = Math.pow(2, data.retryCount) - 1;
        const boundedRandDelta = retryInterval * 0.8 +
            Math.floor(Math.random() * (retryInterval * 1.2 - retryInterval * 0.8));
        incrementDelta *= boundedRandDelta;

        // Adjust retry count
        data.retryCount++;
        data.retryInterval = Math.min(minRetryInterval + incrementDelta, maxRetryInterval);

        return data;
    }

    return (instance: Queryable2) => {

        instance.on.send(async function (this: Queryable2, url: string, init: RequestInit) {

            const wrapper = async (retryData?: any): Promise<Response> => {

                try {

                    return await nodeFetch(url, init);

                } catch (err) {

                    // If there is no error code, this wasn't a transient error
                    // so we throw immediately.
                    if (!err.code) {
                        throw err;
                    }

                    // Get the latest retry information.
                    const retry = updateRetryData(retryData, err);

                    // Watching for specific error codes.
                    if (["ETIMEDOUT", "ESOCKETTIMEDOUT", "ECONNREFUSED", "ECONNRESET"].indexOf(err.code.toUpperCase()) > -1) {

                        this.emit.log(`Attempt #${retry.retryCount} - Retrying error code: ${err.code}...`, LogLevel.Verbose);

                        // If current amount of retries is less than the max amount, try again
                        if (retry.retryCount < retryCount) {

                            await delay(retry.retryInterval);
                            return await wrapper(retry);

                        } else { // max amount of retries reached, so throw the error
                            throw err;
                        }
                    }
                }
            };

            return await wrapper();
        });

        return instance;
    };
}

/**
 * Payload from transient errors
 */
interface IRetryData {
    retryCount: number;
    error: any;
    retryInterval: number;
}

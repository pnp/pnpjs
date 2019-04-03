import { HttpClientImpl } from "@pnp/common";
import { Logger, LogLevel } from "@pnp/logging";
import { fetch } from "./fetch";

/**
 * Payload from transient errors
 */
interface IRetryData {
    retryCount: number;
    error: any;
    retryInterval: number;
}

/**
 * Fetch client that encapsulates the node-fetch library and also adds retry logic
 * when encountering transient errors.
 */
export class NodeFetchClient implements HttpClientImpl {

    /**
     * 
     * @param retryCount: number - Maximum number of transient failure retries before throwing the error
     * @param retryInterval: number - Starting interval to delay the first retry attempt
     * @param minRetryInterval: number - Minimum retry delay boundary as retry intervals are randomly recalculated
     * @param maxRetryInterval: number - Maximum retry delay boundary as retry intervals are radnomaly recalculated
     */
    constructor(private retryCount = 3, private retryInterval = 3000, private minRetryInterval = 3000, private maxRetryInterval = 90000) { }

    public async fetch(url: string, options?: any): Promise<Response> {

        const wrapper = async (retryData: any): Promise<Response> => {

            try {

                // Try to make the request...
                return await fetch(url, options || {});

            } catch (err) {

                // Get the latest retry information.
                const retry = this.updateRetryData(retryData, err);

                // If there is no error code, this wasn't a transient error
                // so we throw immediately.
                if (!err.code) { throw err; }

                // Watching for specific error codes.
                if (["ETIMEDOUT", "ESOCKETTIMEDOUT", "ECONNREFUSED", "ECONNRESET"].indexOf(err.code.toUpperCase()) > -1) {

                    Logger.write(`Attempt #${retry.retryCount} - Retrying error code: ${err.code}...`, LogLevel.Verbose);

                    // If current amount of retries is less than the max amount,
                    // try again
                    if (this.shouldRetry(retry)) {
                        await this.delay(retry.retryInterval);
                        return await wrapper(retry);
                    }
                }

                throw err;
            }
        };

        return await wrapper(null);
    }

    private async delay(ms: number): Promise<any> {

        return new Promise((resolve: any) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });

    }

    private updateRetryData(retryData: IRetryData, err: any): IRetryData {

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
        const boundedRandDelta = this.retryInterval * 0.8 +
            Math.floor(Math.random() * (this.retryInterval * 1.2 - this.retryInterval * 0.8));
        incrementDelta *= boundedRandDelta;

        // Adjust retry count
        data.retryCount++;
        data.retryInterval = Math.min(this.minRetryInterval + incrementDelta, this.maxRetryInterval);

        return data;
    }

    private shouldRetry(retryData: IRetryData): boolean {

        if (!retryData) {
            throw new Error("ERROR: retryData cannot be null.");
        }

        const currentCount = (retryData && retryData.retryCount);
        return (currentCount < this.retryCount);
    }
}

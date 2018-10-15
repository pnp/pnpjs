declare var require: (path: string) => any;

import { HttpClientImpl } from "@pnp/common";
const nodeFetch = require("node-fetch").default;

/**
 * Represents the default client retry interval, in milliseconds.
 */
export const DEFAULT_CLIENT_RETRY_INTERVAL = 1000 * 30;

/**
 * Represents the default client retry count.
 */
export const DEFAULT_CLIENT_RETRY_COUNT = 3;

/**
 * Represents the default maximum retry interval, in milliseconds.
 */
export const DEFAULT_CLIENT_MAX_RETRY_INTERVAL = 1000 * 90;

/**
 * Represents the default minimum retry interval, in milliseconds.
 */
export const DEFAULT_CLIENT_MIN_RETRY_INTERVAL = 1000 * 3;

/**
 * Payload from transient errors
 */
export interface IRetryData {

    retryCount: number;
    error: any;
    retryInterval: number;

}

export class RetryNodeFetchClient implements HttpClientImpl {

    constructor(
        private retryCount: number = DEFAULT_CLIENT_RETRY_COUNT,
        private retryInterval: number = DEFAULT_CLIENT_RETRY_INTERVAL,
        private minRetryInterval: number = DEFAULT_CLIENT_MIN_RETRY_INTERVAL,
        private maxRetryInterval: number = DEFAULT_CLIENT_MAX_RETRY_INTERVAL,
    ) {

    }

    public async fetch(url: string, options?: any): Promise<Response> {

        const wrapper = async (retryData: any) => {

            try {

                return await nodeFetch(url, options || {});

            } catch (err) {

                const retry = this.updateRetryData(retryData, err);

                if (!err.code) { throw err; }

                if (
                    err.code === "ETIMEDOUT" ||
                    err.code === "ESOCKETTIMEDOUT" ||
                    err.code === "ECONNREFUSED" ||
                    err.code === "ECONNRESET") {

                    console.log(`Attempt #${retry.retryCount} - Retrying error code: ${err.code}...`);

                    if (this.shouldRetry(retry)) {
                        await this.delay(retry.retryInterval);
                        wrapper(retry);
                    } else {
                        throw err;
                    }

                }
            }
        };

        return await wrapper(null);
    }

    private delay(ms: number) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }

    private updateRetryData(retryData: IRetryData, err: any) {

        const data: IRetryData = retryData || {
            error: null,
            retryCount: 0,
            retryInterval: 0,
        };

        const newError = err || null;

        if (newError) {

            if (data.error) {
                newError.innerError = data.error;
            }

            data.error = newError;

        }
        // Adjust retry interval
        let incrementDelta = Math.pow(2, data.retryCount) - 1;
        const boundedRandDelta = this.retryInterval * 0.8 +
            Math.floor(Math.random() * (this.retryInterval * 1.2 - this.retryInterval * 0.8));
        incrementDelta *= boundedRandDelta;
        const retryInterval = Math.min(this.minRetryInterval + incrementDelta, this.maxRetryInterval);

        // Adjust retry count
        data.retryCount++;
        data.retryInterval = retryInterval;

        return data;

    }

    private shouldRetry(retryData: IRetryData) {

        if (!retryData) {
            throw new Error("ERROR: retryData cannot be null.");
        }

        const currentCount = (retryData && retryData.retryCount);
        return (currentCount < this.retryCount);

    }
}

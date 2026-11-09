import { delay } from "@pnp/core";

/**
 * Graph is eventually consistent: a freshly created directory object (group, user, etc.) can return a 404
 * for a short while, including when it is referenced by another request or deleted straight after creation.
 * Retries the supplied function while it fails with a 404, rethrowing any other error or the last 404.
 *
 * @param fn The request to run
 * @param attempts Maximum number of times to run fn
 * @param waitMs Time to wait between attempts, in milliseconds
 */
export default async function retryOnNotFound<T>(fn: () => Promise<T>, attempts = 5, waitMs = 2000): Promise<T> {

    for (let i = 1; ; i++) {
        try {
            return await fn();
        } catch (e) {
            if (!e?.isHttpRequestError || e.status !== 404 || i >= attempts) {
                throw e;
            }
            await delay(waitMs);
        }
    }
}

import { delay } from "@pnp/core";

/**
 * Some Graph results (e.g. membership checks) lag behind the changes that produced them, and return an empty or
 * partial result rather than an error. Re-runs the supplied function until the result is accepted, and returns the
 * last result either way so the caller's assertion reports what Graph actually returned.
 *
 * @param fn The request to run
 * @param isDone Returns true when the result is the one we are waiting for
 * @param attempts Maximum number of times to run fn
 * @param waitMs Time to wait between attempts, in milliseconds
 */
export default async function pollUntil<T>(fn: () => Promise<T>, isDone: (result: T) => boolean, attempts = 10, waitMs = 3000): Promise<T> {

    let result = await fn();

    for (let i = 1; i < attempts && !isDone(result); i++) {
        await delay(waitMs);
        result = await fn();
    }

    return result;
}

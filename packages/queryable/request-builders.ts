import { jsS } from "@pnp/core";

/**
 * takes the supplied object of type U, JSON.stringify's it, and sets it as the value of a "body" property
 */
export function body<T extends Partial<RequestInit>, U = any>(o: U, previous?: T): T & { body: string } {
    return Object.assign({ body: jsS(o) }, previous);
}

/**
 * Adds headers to an new/existing RequestInit
 *
 * @param o Headers to add
 * @param previous Any previous partial RequestInit
 * @returns RequestInit combining previous and specified headers
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function headers<T extends Partial<RequestInit>, U extends Record<string, string> = {}>(o: U, previous?: T): T & { headers: U } {
    return Object.assign({}, previous, { headers: { ...previous?.headers, ...o } });
}

/**
 * Adds the X-PnP-CacheAlways header to a request indicating to any caching observers this request should be cached. If
 * no caching observers are registered this has no effect.
 *
 * @param previous Any previous RequestInit to extend
 * @returns A RequestInit combining the caching header and any previous RequestInit
 */
export function cacheAlways<T extends Partial<RequestInit>>(previous?: T) {
    return headers({
        "X-PnP-CacheAlways": "1",
    }, previous);
}

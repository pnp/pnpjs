import { jsS } from "@pnp/core";

export * from "./queryable.js";

/**
 * Behavior exports
 */
export * from "./behaviors/bearer-token.js";
export * from "./behaviors/browser-fetch.js";
export * from "./behaviors/caching.js";
export * from "./behaviors/caching-pessimistic.js";
export * from "./behaviors/cancelable.js";
export * from "./behaviors/inject-headers.js";
export * from "./behaviors/parsers.js";
export * from "./behaviors/timeout.js";
export * from "./behaviors/resolvers.js";

/**
 * Adds a property to a target instance
 *
 * @param target The object to whose prototype we will add a property
 * @param name Property name
 * @param factory Factory method used to produce the property value
 * @param path Any additional path required to produce the value
 */
export function addProp<T, U>(target: { prototype: any }, name: string, factory: (arg: U, p?: string) => T, path?: string): void {

    Reflect.defineProperty(target.prototype, name, {
        configurable: true,
        enumerable: true,
        get: function (this: U): T {
            return factory(this, path || name);
        },
    });
}

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

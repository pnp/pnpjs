import { Queryable } from "../queryable.js";
import { getHashCode, PnPClientStorage, dateAdd, TimelinePipe, noInherit } from "@pnp/core";

export type CacheKeyFactory = (url: string) => string;
export type CacheExpireFunc = (url: string) => Date;

export interface ICachingProps {
    store?: "local" | "session";
    keyFactory?: CacheKeyFactory;
    expireFunc?: CacheExpireFunc;
}

/**
 * Behavior that forces caching for the request regardless of "method"
 *
 * @returns TimelinePipe
 */
export function CacheAlways() {

    return (instance: Queryable) => {

        instance.on.pre.prepend(async function (this: Queryable, url: string, init: RequestInit, result: any): Promise<[string, RequestInit, any]> {

            init.headers = { ...init.headers, "X-PnP-CacheAlways": "1" };

            return [url, init, result];
        });

        return instance;
    };
}


/**
 * Behavior that blocks caching for the request regardless of "method"
 *
 * Note: If both Caching and CacheAlways are present AND CacheNever is present the request will not be cached
 * as we give priority to the CacheNever case
 *
 * @returns TimelinePipe
 */
export function CacheNever() {

    return (instance: Queryable) => {

        instance.on.pre.prepend(async function (this: Queryable, url: string, init: RequestInit, result: any): Promise<[string, RequestInit, any]> {

            init.headers = { ...init.headers, "X-PnP-CacheNever": "1" };

            return [url, init, result];
        });

        return instance;
    };
}

/**
 * Behavior that allows you to specify a cache key for a request
 *
 * @param key The key to use for caching
  */
export function CacheKey(key: string) {

    return (instance: Queryable) => {

        instance.on.pre.prepend(async function (this: Queryable, url: string, init: RequestInit, result: any): Promise<[string, RequestInit, any]> {

            init.headers = { ...init.headers, "X-PnP-CacheKey": key };

            return [url, init, result];
        });

        return instance;
    };
}

/**
 * Adds caching to the requests based on the supplied props
 *
 * @param props Optional props that configure how caching will work
 * @returns TimelinePipe used to configure requests
 */
export function Caching(props?: ICachingProps): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.on.pre(async function (this: Queryable, url: string, init: RequestInit, result: any): Promise<[string, RequestInit, any]> {

            const [shouldCache, getCachedValue, setCachedValue] = bindCachingCore(url, init, props);

            // only cache get requested data or where the CacheAlways header is present (allows caching of POST requests)
            if (shouldCache) {

                const cached = getCachedValue();

                // we need to ensure that result stays "undefined" unless we mean to set null as the result
                if (cached === null) {

                    // if we don't have a cached result we need to get it after the request is sent. Get the raw value (un-parsed) to store into cache
                    this.on.rawData(noInherit(async function (response) {
                        setCachedValue(response);
                    }));

                } else {
                    // if we find it in cache, override send request, and continue flow through timeline and parsers.
                    this.on.auth.clear();
                    this.on.send.replace(async function (this: Queryable) {
                        return new Response(cached, {});
                    });
                }
            }

            return [url, init, result];
        });

        return instance;
    };
}

const storage = new PnPClientStorage();

/**
 * Based on the supplied properties, creates bound logic encapsulating common caching configuration
 * sharable across implementations to more easily provide consistent behavior across behaviors
 *
 * @param props Any caching props used to initialize the core functions
 */
export function bindCachingCore(url: string, init: RequestInit, props?: Partial<ICachingProps>): [boolean, () => any, (any) => void] {

    const { store, keyFactory, expireFunc } = {
        store: "local",
        keyFactory: (url: string) => getHashCode(url.toLowerCase()).toString(),
        expireFunc: () => dateAdd(new Date(), "minute", 5),
        ...props,
    };

    const s = store === "session" ? storage.session : storage.local;

    const key = init?.headers["X-PnP-CacheKey"] ? init.headers["X-PnP-CacheKey"] : keyFactory(url);

    return [
        // calculated value indicating if we should cache this request
        (/get/i.test(init.method) || (init?.headers["X-PnP-CacheAlways"] ?? false)) && !(init?.headers["X-PnP-CacheNever"] ?? false),
        // gets the cached value
        () => s.get(key),
        // sets the cached value
        (value: any) => s.put(key, value, expireFunc(url)),
    ];
}

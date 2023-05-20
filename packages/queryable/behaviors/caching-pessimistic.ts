import { noInherit, objectDefinedNotNull, TimelinePipe } from "@pnp/core";
import { Queryable } from "../queryable.js";
import { bindCachingCore, ICachingProps } from "./caching.js";

/**
 * Pessimistic Caching Behavior
 * Always returns the cached value if one exists but asynchronously executes the call and updates the cache.
 * If a expireFunc is included then the cache update only happens if the cache has expired.
 *
 * @param store Use local or session storage
 * @param keyFactory: a function that returns the key for the cache value, if not provided a default hash of the url will be used
 * @param expireFunc: a function that returns a date of expiration for the cache value, if not provided the cache never expires but is always updated.
 */
export function CachingPessimisticRefresh(props?: ICachingProps): TimelinePipe {

    return (instance: Queryable) => {

        const pre = async function (this: Queryable, url: string, init: RequestInit, result: any): Promise<[string, RequestInit, any]> {

            const [shouldCache, getCachedValue, setCachedValue] = bindCachingCore(url, init, props);

            if (!shouldCache) {
                return [url, init, result];
            }

            const cached = getCachedValue();

            if (objectDefinedNotNull(cached)) {

                // set our result
                result = cached;

                setTimeout(async () => {

                    const q = new Queryable(this);
                    const a = q.on.pre.toArray();
                    q.on.pre.clear();
                    // filter out this pre handler from the original queryable as we don't want to re-run it
                    a.filter(v => v !== pre).map(v => q.on.pre(v));

                    // in this case the init should contain the correct "method"
                    const value = await q(init);

                    setCachedValue(value);

                }, 0);

            } else {

                // register the post handler to cache the value as there is not one already in the cache
                // and we need to run this request as normal
                this.on.post(noInherit(async function (url: URL, result: any) {

                    setCachedValue(result);

                    return [url, result];
                }));
            }

            return [url, init, result];
        };

        instance.on.pre(pre);

        return instance;
    };
}

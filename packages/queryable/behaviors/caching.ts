import { Queryable2 } from "../queryable-2.js";
import { isFunc, getHashCode, PnPClientStorage, dateAdd, TimelinePipe } from "@pnp/core";

export type CacheKeyFactory = (url: string) => string;
export type CacheExpireFunc = (url: string) => Date;

export function Caching(store: "local" | "session" = "session", keyFactory?: CacheKeyFactory, expireFunc?: CacheExpireFunc): TimelinePipe<Queryable2> {

    const storage = new PnPClientStorage();
    const s = store === "session" ? storage.session : storage.local;

    if (!isFunc(keyFactory)) {
        keyFactory = (url: string) => getHashCode(url.toLowerCase()).toString();
    }

    if (!isFunc(expireFunc)) {
        // TODO:: tie this default timeline to config? or the config is having to create the function
        expireFunc = () => dateAdd(new Date(), "minute", 5);
    }

    return (instance: Queryable2) => {
        // Regardless of cached result, update cache async
        // instance.AsyncOverride = lazy;
        instance.on.pre(async function (this: Queryable2, url: string, init: RequestInit, result: any): Promise<[string, RequestInit, any]> {

            const key = keyFactory(url.toString());

            const cached = s.get(key);

            // we need to ensure that result stays "undefined" unless we mean to set null as the result
            if (cached === null) {

                // if we don't have a cached result we need to get it after the request is sent and parsed
                this.on.post(async function (url: URL, result: any) {

                    s.put(key, result, expireFunc(url.toString()));

                    return [url, result];
                });

            } else {

                result = cached;
            }

            return [url, init, result];
        });

        return instance;
    };
}

import { Queryable } from "../queryable.js";
import { isFunc, getHashCode, PnPClientStorage, dateAdd, TimelinePipe } from "@pnp/core";

export type CacheKeyFactory = (url: string) => string;
export type CacheExpireFunc = (url: string) => Date;

export function Caching(store: "local" | "session" = "session", keyFactory?: CacheKeyFactory, expireFunc?: CacheExpireFunc): TimelinePipe<Queryable> {

    const storage = new PnPClientStorage();
    const s = store === "session" ? storage.session : storage.local;

    if (!isFunc(keyFactory)) {
        keyFactory = (url: string) => getHashCode(url.toLowerCase()).toString();
    }

    if (!isFunc(expireFunc)) {
        expireFunc = () => dateAdd(new Date(), "minute", 5);
    }

    return (instance: Queryable) => {

        instance.on.pre(async function (this: Queryable, url: string, init: RequestInit, result: any): Promise<[string, RequestInit, any]> {

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

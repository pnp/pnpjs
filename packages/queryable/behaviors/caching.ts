import { Queryable } from "../queryable.js";
import { getHashCode, PnPClientStorage, dateAdd, TimelinePipe } from "@pnp/core";

export type CacheKeyFactory = (url: string) => string;
export type CacheExpireFunc = (url: string) => Date;

export interface ICachingProps {
    store?: "local" | "session";
    keyFactory?: CacheKeyFactory;
    expireFunc?: CacheExpireFunc;
}

export function Caching(props?: ICachingProps): TimelinePipe<Queryable> {

    const storage = new PnPClientStorage();

    const { store, keyFactory, expireFunc } = {
        store: "local",
        keyFactory: (url: string) => getHashCode(url.toLowerCase()).toString(),
        expireFunc: () => dateAdd(new Date(), "minute", 5),
        ...props,
    };

    const s = store === "session" ? storage.session : storage.local;

    return (instance: Queryable) => {

        instance.on.pre(async function (this: Queryable, url: string, init: RequestInit, result: any): Promise<[string, RequestInit, any]> {

            // only cache get requested data or where the CacheAlways header is present (allows caching of POST requests)
            if (/get/i.test(init.method) || init?.headers["X-PnP-CacheAlways"]) {

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
            }

            return [url, init, result];
        });

        return instance;
    };
}

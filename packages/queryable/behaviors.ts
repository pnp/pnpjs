import { Queryable2 } from "./queryable-2.js";
import { isFunc, getHashCode, PnPClientStorage, dateAdd } from "@pnp/common";

export function InjectHeaders(headers: Record<string, string>): (instance: Queryable2) => Promise<void> {

    return async (instance: Queryable2) => {

        instance.on.pre(async function (url: string, init: RequestInit, result: any) {

            const keys = Object.getOwnPropertyNames(headers);

            for (let i = 0; i < keys.length; i++) {
                init.headers[keys[i]] = headers[keys[i]];
            }

            return [url, init, result];
        });
    };
}

export function Caching(store: "local" | "session" = "session", keyFactory?: (url: string) => string, expireFunc?: (url: string) => Date): (instance: Queryable2) => Promise<void> {

    const storage = new PnPClientStorage();
    const s = store === "session" ? storage.session : storage.local;

    if (!isFunc(keyFactory)) {
        keyFactory = (url: string) => getHashCode(url.toLowerCase()).toString();
    }

    if (!isFunc(expireFunc)) {
        // TODO:: tie this default timeline to config? or the config is having to create the function
        expireFunc = () => dateAdd(new Date(), "minute", 5);
    }

    return async (instance: Queryable2) => {

        instance.on.pre(async function (this: Queryable2, url: string, init: RequestInit, result: any): Promise<[string, RequestInit, any]> {

            const key = keyFactory(url);

            const cached = s.get(key);

            if (cached === null) {

                // if we don't have a cached result we need to get it after the request is sent and parsed
                this.on.post(async function (url: string, result: any) {

                    s.put(key, result, expireFunc(url));

                    return [url, result];
                });

            } else {

                // we need to ensure that result stays "undefined" unless we mean to set null as the result
                result = cached;
            }

            return [url, init, result];
        });
    };
}

// NullErrorSink

// PnPLogging (take LogLevel)

// DefaultErrorBehavior

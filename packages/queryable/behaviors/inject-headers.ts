import { objectDefinedNotNull } from "@pnp/core";
import { Queryable2 } from "../queryable-2.js";

export function InjectHeaders(headers: Record<string, string>): (instance: Queryable2) => Queryable2 {

    return (instance: Queryable2) => {

        instance.on.pre(async function (url: string, init: RequestInit, result: any) {

            const keys = Object.getOwnPropertyNames(headers);

            if (!objectDefinedNotNull(init.headers)) {
                init.headers = {};
            }

            for (let i = 0; i < keys.length; i++) {
                init.headers[keys[i]] = headers[keys[i]];
            }

            return [url, init, result];
        });

        return instance;
    };
}

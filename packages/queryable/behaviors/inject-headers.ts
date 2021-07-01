import { ensureHeaders } from "@pnp/core";
import { Queryable2 } from "../queryable-2.js";

export function InjectHeaders(headers: Record<string, string>): (instance: Queryable2) => Queryable2 {

    return (instance: Queryable2) => {

        instance.on.pre(async function (url: string, init: RequestInit, result: any) {

            init = ensureHeaders(init, headers);

            return [url, init, result];
        });

        return instance;
    };
}

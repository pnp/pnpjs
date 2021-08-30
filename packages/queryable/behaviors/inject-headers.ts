import { TimelinePipe } from "@pnp/core";
import { Queryable } from "../queryable.js";

export function InjectHeaders(headers: Record<string, string>): TimelinePipe {

    return (instance: Queryable) => {

        instance.on.pre(async function (url: string, init: RequestInit, result: any) {

            init.headers = { ...init.headers, ...headers };

            return [url, init, result];
        });

        return instance;
    };
}

import { TimelinePipe } from "@pnp/core";
import { Queryable } from "../queryable.js";

export function InjectHeaders(headers: Record<string, string>, prepend = false): TimelinePipe {

    return (instance: Queryable) => {

        const f = async function (url: string, init: RequestInit, result: any): Promise<[string, RequestInit, any]> {

            init.headers = { ...init.headers, ...headers };

            return [url, init, result];
        };

        if (prepend) {
            instance.on.pre.prepend(f);
        } else {
            instance.on.pre(f);
        }

        return instance;
    };
}

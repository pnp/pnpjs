import { Queryable2 } from "./queryable-2.js";

export function InjectHeaders(headers: Record<string, string>): (instance: Queryable2) => Promise<void> {

    return async (instance: Queryable2) => {

        instance.on.pre(async function (url: string, init: RequestInit) {

            const keys = Object.getOwnPropertyNames(headers);

            for (let i = 0; i < keys.length; i++) {
                init.headers[keys[i]] = headers[keys[i]];
            }

            return [url, init];
        });
    };
}

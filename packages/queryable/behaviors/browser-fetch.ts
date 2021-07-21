import { Queryable2 } from "../queryable-2.js";
import { LogLevel } from "@pnp/logging";

export function BrowserFetch(): (instance: Queryable2) => Queryable2 {

    return (instance: Queryable2) => {

        instance.on.send.replace(function (this: Queryable2, url: URL, init: RequestInit): Promise<any> {

            this.emit.log(`Fetch: ${init.method} ${url.toString()}`, LogLevel.Verbose);

            return fetch(url.toString(), init);

        });

        return instance;
    };
}

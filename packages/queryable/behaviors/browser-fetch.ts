import { Queryable2 } from "../queryable-2.js";

export function BrowserFetch(): (instance: Queryable2) => Queryable2 {

    return (instance: Queryable2) => {

        instance.on.send(function (url: URL, init: RequestInit): Promise<any> {

            return fetch(url.toString(), init);

        }, "replace");

        return instance;
    };
}

import { combine, isUrlAbsolute, TimelinePipe } from "@pnp/core";
import { InjectHeaders, Queryable } from "@pnp/queryable";

export function DefaultInit(graphUrl = "https://graph.microsoft.com/v1.0"): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.on.pre(async (url, init, result) => {

            init.cache = "default";
            init.credentials = "same-origin";

            if (!isUrlAbsolute(url)) {
                url = combine(graphUrl, url);
            }

            return [url, init, result];
        });

        return instance;
    };
}

export function DefaultHeaders(): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance
            .using(InjectHeaders({
                "Content-Type": "application/json",
            }));

        return instance;
    };
}

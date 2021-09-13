import { TimelinePipe } from "@pnp/core";
import { InjectHeaders, Queryable } from "@pnp/queryable";

export function DefaultInit(): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.on.pre(async (url, init, result) => {

            init.cache = "default";
            init.credentials = "same-origin";

            return [url, init, result];
        });

        return instance;
    };
}

export function DefaultHeaders(): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance
            .using(InjectHeaders({
                "Accept": "application/json",
                "Content-Type": "application/json",
                "User-Agent": "NONISV|SharePointPnP|PnPjs",
                "SdkVersion": "PnPCoreJS/3.0.0-exp",
            }));

        return instance;
    };
}

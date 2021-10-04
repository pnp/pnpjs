import { TimelinePipe } from "@pnp/core";
import { InjectHeaders, Queryable } from "@pnp/queryable";
import { Telemetry } from "..";

export function DefaultInit(): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.on.pre(async (url, init, result) => {

            init.cache = "no-cache";
            init.credentials = "same-origin";

            return [url, init, result];
        });

        Telemetry()(instance);

        return instance;
    };
}

export function DefaultHeaders(): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance
            .using(InjectHeaders({
                "Accept": "application/json",
                "Content-Type": "application/json;charset=utf-8",
                "User-Agent": "NONISV|SharePointPnP|PnPjs",
            }));

        return instance;
    };
}

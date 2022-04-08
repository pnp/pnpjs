import { TimelinePipe } from "@pnp/core";
import { InjectHeaders, Queryable, RejectOnError, ResolveOnData } from "@pnp/queryable";
import { Telemetry } from "./telemetry.js";

export function DefaultInit(): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.on.pre(async (url, init, result) => {

            init.cache = "no-cache";
            init.credentials = "same-origin";

            return [url, init, result];
        });

        instance.using(
            Telemetry(),
            RejectOnError(),
            ResolveOnData());

        return instance;
    };
}

export function DefaultHeaders(): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance
            .using(InjectHeaders({
                "Accept": "application/json",
                "Content-Type": "application/json;charset=utf-8",
            }));

        return instance;
    };
}

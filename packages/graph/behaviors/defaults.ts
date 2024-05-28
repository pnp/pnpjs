import { combine, isUrlAbsolute, TimelinePipe } from "@pnp/core";
import { InjectHeaders, Queryable, RejectOnError, ResolveOnData } from "@pnp/queryable";
import { Telemetry } from "./telemetry.js";
import { DEFAULT_GRAPH_URL } from "../index.js";

export function DefaultInit(graphUrl = DEFAULT_GRAPH_URL): TimelinePipe<Queryable> {

    if (!isUrlAbsolute(graphUrl)) {
        throw Error("Graph baseUrl must be absolute.");
    }

    return (instance: Queryable) => {

        instance.using(
            Telemetry(),
            RejectOnError(),
            ResolveOnData());

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

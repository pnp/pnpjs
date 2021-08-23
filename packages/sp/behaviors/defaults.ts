import { InjectHeaders, Queryable2 } from "@pnp/queryable";

export function DefaultInit(): (instance: Queryable2) => Queryable2 {

    return (instance: Queryable2) => {

        instance.on.pre(async (url, init, result) => {

            init.cache = "no-cache";
            init.credentials = "same-origin";

            return [url, init, result];
        });

        return instance;
    };
}

export function DefaultHeaders(): (instance: Queryable2) => Queryable2 {

    return (instance: Queryable2) => {

        instance
            .using(InjectHeaders({
                "Accept": "application/json",
                "Content-Type": "application/json;charset=utf-8",
                "User-Agent": "NONISV|SharePointPnP|PnPjs",
                "X-ClientService-ClientTag": "PnPCoreJS:3.0.0-exp",
            }));

        return instance;
    };
}

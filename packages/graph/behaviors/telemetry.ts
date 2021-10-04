import { TimelinePipe } from "@pnp/core";
import { Queryable } from "@pnp/queryable";

export function Telemetry(): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.on.pre(async function (this: Queryable, url, init, result) {

            init.headers = { ...init.headers, ["SdkVersion"]: "PnPCoreJS/$$Version$$" };

            return [url, init, result];
        });

        return instance;
    };
}

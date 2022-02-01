import { TimelinePipe } from "@pnp/core";
import { Queryable } from "@pnp/queryable";

export function Telemetry(): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.on.pre(async function (this: Queryable, url, init, result) {

            init.headers = { ...init.headers, SdkVersion: "PnPCoreJS/$$Version$$" };
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/dot-notation
            this.log(`Request Tag: ${init.headers!["SdkVersion"]}`, 0);

            return [url, init, result];
        });

        return instance;
    };
}

import { TimelinePipe } from "@pnp/core";
import { Queryable } from "@pnp/queryable";

export function GraphTagging(): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.on.pre(async function (this: Queryable, url, init, result) {

            // eslint-disable-next-line @typescript-eslint/dot-notation
            init.headers["SdkVersion"] = "PnPCoreJS/$$Version$$";

            return [url, init, result];
        });

        return instance;
    };
}

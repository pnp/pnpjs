import { TimelinePipe } from "@pnp/core";
import { Queryable } from "@pnp/queryable";

export function SPTelemetry(): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.on.pre(async function (this: Queryable, url, init, result) {

            let clientTag = "PnPCoreJS:$$Version$$:";

            // make our best guess based on url to the method called
            const { pathname } = new URL(url);

            // remove anything before the _api as that is potentially PII and we don't care, just want to get the called path to the REST API
            clientTag += pathname.substr(pathname.indexOf("_api/") + 5).split("/").map((value, index, arr) => index === arr.length - 1 ? value : value[0]).join(".");

            if (clientTag.length > 32) {
                clientTag = clientTag.substr(0, 32);
            }

            init.headers = { ...init.headers, ["X-ClientService-ClientTag"]: clientTag };

            return [url, init, result];
        });

        return instance;
    };
}

import { ITestingSettings } from "../../test/load-settings.js";
import { SPDefault, GraphDefault } from "@pnp/nodejs";
import { spfi, SPFI } from "@pnp/sp";
import { GraphFI, graphfi } from "@pnp/graph";
import { LogLevel, PnPLogging } from "@pnp/logging";
import { Queryable } from "@pnp/queryable";

export function spSetup(settings: ITestingSettings): SPFI {

    const sp = spfi(settings.testing.sp.url).using(SPDefault({
        msal: {
            config: settings.testing.sp.msal.init,
            scopes: settings.testing.sp.msal.scopes,
        },
    })).using(
        PnPLogging(LogLevel.Verbose),
        function (instance: Queryable) {

            instance.on.pre(async (url, init, result) => {

                // we remove telemetry for debugging
                delete init.headers["X-ClientService-ClientTag"];
                return [url, init, result];
            });
        });

    return sp;
}

export function graphSetup(settings: ITestingSettings): GraphFI {

    const graph = graphfi().using(GraphDefault({
        msal: {
            config: settings.testing.graph.msal.init,
            scopes: settings.testing.graph.msal.scopes,
        },
    })).using(
        PnPLogging(LogLevel.Verbose),
        function (instance: Queryable) {

            instance.on.pre(async (url, init, result) => {

                // we remove telemetry for debugging
                delete init.headers["SdkVersion"];
                return [url, init, result];
            });
        });

    return graph;
}

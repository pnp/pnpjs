import { ITestingSettings } from "../../test/load-settings.js";
import { SPDefault, GraphDefault } from "@pnp/nodejs";
import { spfi, SPFI } from "@pnp/sp";
import { GraphFI, graphfi } from "@pnp/graph";
import { LogLevel, PnPLogging } from "@pnp/logging";

export function spSetup(settings: ITestingSettings): SPFI {

    const sp = spfi(settings.testing.sp.url).using(SPDefault({
        msal: {
            config: settings.testing.sp.msal.init,
            scopes: settings.testing.sp.msal.scopes,
        },
    })).using(PnPLogging(LogLevel.Verbose));

    return sp;
}

export function graphSetup(settings: ITestingSettings): GraphFI {

    const graph = graphfi().using(GraphDefault({
        msal: {
            config: settings.testing.graph.msal.init,
            scopes: settings.testing.graph.msal.scopes,
        },
    })).using(PnPLogging(LogLevel.Verbose));

    return graph;
}

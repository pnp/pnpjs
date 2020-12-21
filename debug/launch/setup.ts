import { ITestingSettings } from "../../test/settings.js";
import { SPFetchClient, MsalFetchClient, AdalFetchClient } from "@pnp/nodejs";
import { sp } from "@pnp/sp";
import { graph } from "@pnp/graph";

export async function spSetup(settings: ITestingSettings): Promise<void> {

    // if we have an msal section, use that one
    if (settings.testing.sp.msal) {
        sp.setup({
            sp: {
                baseUrl: settings.testing.sp.url,
                fetchClientFactory: () => {
                    return new MsalFetchClient(settings.testing.sp.msal.init, settings.testing.sp.msal.scopes);
                },
            },
        });

    } else {
        // configure your node options
        sp.setup({
            sp: {
                fetchClientFactory: () => {
                    return new SPFetchClient(settings.testing.sp.url, settings.testing.sp.id, settings.testing.sp.secret);
                },
            },
        });
    }
}

export async function graphSetup(settings: ITestingSettings): Promise<void> {

    // if we have an msal section, use that one
    if (settings.testing.graph.msal) {
        graph.setup({
            graph: {
                fetchClientFactory: () => {
                    return new MsalFetchClient(settings.testing.graph.msal.init, settings.testing.graph.msal.scopes);
                },
            },
        });

    } else {
        // configure your node options
        graph.setup({
            graph: {
                fetchClientFactory: () => {
                    return new AdalFetchClient(settings.testing.graph.tenant, settings.testing.graph.id, settings.testing.graph.secret);
                },
            },
        });
    }
}

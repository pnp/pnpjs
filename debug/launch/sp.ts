// import { Logger, LogLevel } from "../../packages/logging";
import { sp } from "@pnp/sp/presets/all";
import { SPFetchClient } from "@pnp/nodejs";
import "@pnp/odata/src/debug";

declare var process: { exit(code?: number): void };

export async function Example(settings: any) {

    // configure your node options
    sp.setup({
        sp: {
            fetchClientFactory: () => {
                return new SPFetchClient(settings.testing.sp.url, settings.testing.sp.id, settings.testing.sp.secret);
            },
        },
    });

    sp.web.__enableDeepTrace();

    const d = await sp.web.addClientSidePage("test123.aspx");

    const y = 9;

    console.log(y);

    console.log(JSON.stringify(d.__json(), null, 2));

    process.exit();
}

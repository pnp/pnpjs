// import { Logger, LogLevel } from "../../packages/logging";
import { sp } from "@pnp/sp/presets/all";
// import "@pnp/sp/src/webs";
// import "@pnp/sp/src/features/web";
// import { sp } from "@pnp/sp";
import { SPFetchClient } from "@pnp/nodejs";

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

    const d = await sp.web();

    console.log(JSON.stringify(d, null, 2));

    process.exit();
}

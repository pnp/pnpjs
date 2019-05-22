// import { Logger, LogLevel } from "../../packages/logging";
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/clientside-pages/web";
import { SPFetchClient } from "@pnp/nodejs";
import "@pnp/odata/src/debug";
import "./myweb";

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

    const f = await sp.web.addClientSidePage("asdfasdf111.aspx");

    console.log(JSON.stringify(f.__json(), null, 2));

    process.exit();
}

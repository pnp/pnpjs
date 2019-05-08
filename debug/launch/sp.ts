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

    const y = await sp.web();

    // const y = await sp.site.features();

    console.log(JSON.stringify(y, null, 2));

    // const u = new getable(Web)(settings.testing.sp.url);

    // // const y = new Web(settings.testing.sp.url);

    // const d = await u();

    // console.log(JSON.stringify(d, null, 2));

    // // @ ts-ignore
    // const uu = u.features;

    // uu.get().then(r => {
    //     console.log(JSON.stringify(r, null, 2));
    // });
}

// import { Logger, LogLevel } from "../../packages/logging";
import { sp } from "@pnp/sp";
import { Web } from "@pnp/sp/src/webs";
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

    const listData2 = await Web(sp.web).orderedLists();

    console.log(JSON.stringify(listData2, null, 2));

    const listData = await sp.web.orderedLists();

    console.log(JSON.stringify(listData, null, 2));

    // const web = sp.web;


    // hookObj(web, {
    //     __json: () => {
    //         return { override: true };
    //     },
    // });

    // const lists = web.lists;

    // web.__enableDeepTrace();

    // const d = await web.select("Title");

    // const dd = await lists();

    // console.log(JSON.stringify(d.__json(), null, 2));

    // console.log(JSON.stringify(lists.__json(), null, 2));

    // console.log(JSON.stringify(dd, null, 2));

    process.exit();
}

import { ITestingSettings } from "../../test/settings.js";
import { ConsoleListener, Logger, LogLevel } from "@pnp/logging";
import { Queryable2, InjectHeaders, CachingPessimisticRefresh, DefaultParse } from "@pnp/queryable";
import { NodeFetchWithRetry, MSAL } from "@pnp/nodejs";
import { ISharePointQueryable, sp2, _SharePointQueryable } from "@pnp/sp";
import "@pnp/sp/webs";

declare var process: { exit(code?: number): void };

function testingConfig(settings: ITestingSettings): (instance: Queryable2) => Queryable2 {

    return (instance) => {

        instance
            .using(MSAL(settings.testing.sp.msal.init, settings.testing.sp.msal.scopes))
            .using(InjectHeaders({
                "Accept": "application/json",
                "Content-Type": "application/json;odata=verbose;charset=utf-8",
                "User-Agent": "NONISV|SharePointPnP|PnPjs",
                "X-ClientService-ClientTag": "PnPCoreJS:3.0.0-exp",
            }))
            .using(NodeFetchWithRetry())
            .using(DefaultParse())
            .using(CachingPessimisticRefresh("session"))
            .on.error((err) => {
                console.error("caught it");
                console.error(err);
            })
            .on.log(function (message, level) {

                if (level >= LogLevel.Verbose) {

                    console.log(`Cheap log: ${message}.`);
                }

            }).on.post(async (_url: URL, result: any) => {

                console.log(JSON.stringify(result));

                return [_url, result];

            });

        return instance;
    };
}


export async function Example(settings: ITestingSettings) {
    // TODO:: a way to wrap up different sets of configurations like below.
    // Need a lib default, plus others like Node default, etc.
    // Maybe a default with caching always on, etc.

    try {
        const tc = testingConfig(settings);
        const sp = sp2(settings.testing.sp.url).using(tc);

        const w = sp.web;

        const u = await w();

        const u2 = await w();

        console.log("here");

    } catch (e) {

        console.error(e);
    }

}

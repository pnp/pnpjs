import { ITestingSettings } from "../../test/settings.js";
import { SPDefault } from "@pnp/nodejs";
import { LogLevel, PnPLogging, Logger, ConsoleListener } from "@pnp/logging";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/files";
import { combine } from "@pnp/core";

declare var process: { exit(code?: number): void };


export async function Example(settings: ITestingSettings) {
    try {
        const sp2 = sp(settings.testing.sp.url).using(SPDefault({
            msal: {
                config: settings.testing.sp.msal.init,
                scopes: settings.testing.sp.msal.scopes,
            },
        })).using(PnPLogging(LogLevel.Verbose));

        const w = await sp2.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
        const path = combine("/", w.ServerRelativeUrl, "SitePages", "Home.aspx");
        const file = await sp2.web.getFileByServerRelativePath(path)();

        console.log(JSON.stringify(file));

    } catch (e) {

        console.error(e);
    }

}


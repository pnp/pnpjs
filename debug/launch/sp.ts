import { ITestingSettings } from "../../test/settings.js";
import { Logger, LogLevel } from "@pnp/logging";
import { sp } from "@pnp/sp";
import { spSetup } from "./setup.js";
import "@pnp/sp/webs";
import "@pnp/sp/site-designs";

declare var process: { exit(code?: number): void };

export async function Example(settings: ITestingSettings) {

    spSetup(settings);

    const sd = await sp.siteDesigns.createSiteDesign({
        Title: "PnPTest1",
        WebTemplate: "68",
    });

    Logger.log({ data: null, level: LogLevel.Info, message: sd.Id });
    await sp.siteDesigns.addSiteDesignTaskToCurrentWeb(sd.Id)
    //await sp.siteDesigns.deleteSiteDesign(sd.Id);

    Logger.log({
        data: sd,
        level: LogLevel.Info,
        message: "List of Web Data",
    });

    process.exit(0);
}

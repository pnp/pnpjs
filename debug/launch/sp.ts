import { ITestingSettings } from "../../test/settings.js";
import { Logger, LogLevel } from "@pnp/logging";
import { sp } from "@pnp/sp";
import { spSetup } from "./setup.js";
import "@pnp/sp/webs";

declare var process: { exit(code?: number): void };

export async function Example(settings: ITestingSettings) {

    spSetup(settings);

    const w = await sp.web();

    Logger.log({
        data: w,
        level: LogLevel.Info,
        message: "List of Web Data",
    });

    process.exit(0);
}

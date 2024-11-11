import { ITestingSettings } from "../../test/load-settings.js";
import { Logger, LogLevel } from "@pnp/logging";
import { spSetup } from "./setup.js";
import "@pnp/sp/webs";
import "@pnp/sp/lists";

declare var process: { exit(code?: number): void };

export async function Example(settings: ITestingSettings) {

  const sp = spSetup(settings);

  const w = await sp.web.lists();

  Logger.log({
    data: w,
    level: LogLevel.Info,
    message: "Web Data",
  });
  
  process.exit(0);
}

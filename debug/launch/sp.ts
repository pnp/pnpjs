import { ITestingSettings } from "../../test/load-settings.js";
import { Logger, LogLevel } from "@pnp/logging";
import { spSetup } from "./setup.js";
import "@pnp/sp/webs";

declare var process: { exit(code?: number): void };

export async function Example(settings: ITestingSettings) {

  const sp = spSetup(settings);

  const w = await sp.web();

  Logger.log({
    data: w,
    level: LogLevel.Info,
    message: "Web Data",
  });

  process.exit(0);
}

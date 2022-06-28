import { ITestingSettings } from "../../test/load-settings.js";
import { Logger, LogLevel } from "@pnp/logging";
import { spSetup } from "./setup.js";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import { Cancelable } from "@pnp/queryable";

declare var process: { exit(code?: number): void };

export async function Example(settings: ITestingSettings) {

  const sp = spSetup(settings).using(Cancelable());

  const w = await sp.web.lists();

  Logger.log({
    data: w,
    level: LogLevel.Info,
    message: "List of Web Data",
  });

  process.exit(0);
}

import { ITestingSettings } from "../../test/load-settings.js";
import { Logger, LogLevel } from "@pnp/logging";
import { spSetup } from "./setup.js";
import "@pnp/sp/webs";
import "@pnp/sp/folders";

declare var process: { exit(code?: number): void };

export async function Example(settings: ITestingSettings) {

  const sp = spSetup(settings);

  const w = await sp.web.getFolderByServerRelativePath("/sites/dev/shared documents/target-moved-3").moveByPath("/sites/dev/shared documents/target", {
    KeepBoth: true,
    RetainEditorAndModifiedOnMove: true,
    ShouldBypassSharedLocks: false,
  });

  const y = w();


  Logger.log({
    data: y,
    level: LogLevel.Info,
    message: "Web Data",
  });

  process.exit(0);
}

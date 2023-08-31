import { ITestingSettings } from "../../test/load-settings.js";
import { Logger, LogLevel } from "@pnp/logging";
import { spSetup } from "./setup.js";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

declare var process: { exit(code?: number): void };

export async function Example(settings: ITestingSettings) {

  const sp = spSetup(settings);


  // https://318studios.sharepoint.com/sites/dev/_api/web/lists/getByTitle('FolderTest')/items?$select=FileRef&$orderby=FileRef

  const w = await sp.web.lists.getByTitle("FolderTest").items.select("FileRef").orderBy("FileRef")();


  const y = w.map(i => i.FileRef);

  const u = y.sort();



  Logger.log({
    data: w,
    level: LogLevel.Info,
    message: "Web Data",
  });

  process.exit(0);
}

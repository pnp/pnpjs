import { ITestingSettings } from "../../test/settings.js";
import { Logger, LogLevel } from "@pnp/logging";
import { sp } from "@pnp/sp";
import { spSetup } from "./setup.js";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { getRandomString } from "@pnp/common";

declare var process: { exit(code?: number): void };

export async function Example(settings: ITestingSettings) {

  spSetup(settings);

  const items = sp.web.lists.getByTitle("a new list").items;

await items.add({
    Title: `t-${getRandomString(4)}`
  });

  await items.add({
    Title: `t-${getRandomString(4)}`
  });

  await items.add({
    Title: `t-${getRandomString(4)}`
  });

  await items.add({
    Title: `t-${getRandomString(4)}`
  });

  // Logger.log({
  //   data: w,
  //   level: LogLevel.Info,
  //   message: "List of Web Data",
  // });

  process.exit(0);
}

import { ITestingSettings } from "../../test/load-settings.js";
import { Logger, LogLevel } from "@pnp/logging";
import { spAdminSetup } from "./setup.js";
import "@pnp/sp-admin/index.js";

declare var process: { exit(code?: number): void };

export async function Example(settings: ITestingSettings) {

  const spAdmin = spAdminSetup(settings);

  const s = await spAdmin.admin.tenant.getSitePropertiesByUrl('https://sympjt.sharepoint.com/sites/pnpjsteam', true);

  Logger.log({
    data: s,
    level: LogLevel.Info,
    message: "Web Data",
  });

  process.exit(0);
}

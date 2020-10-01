import { SPFetchClient } from "@pnp/nodejs";
import { Logger, LogLevel } from "@pnp/logging";
import { ISPConfigurationPart, sp } from "@pnp/sp";
import "@pnp/sp/webs";

declare var process: { exit(code?: number): void };

export async function Example(settings: any) {

  // configure your node options
  sp.setup({
    sp: {
      fetchClientFactory: () => {
        return new SPFetchClient(settings.testing.sp.url, settings.testing.sp.id, settings.testing.sp.secret);
      },
    },
  });

  const w = await sp.web.select("Title")();

  const specialWeb = sp.web.setRuntimeConfig<ISPConfigurationPart>(true, {
    sp: {
      fetchClientFactory: () => {
        return new SPFetchClient("https://318studios.sharepoint.com/sites/dev/6b6baf3e-e344-41e3-aa42-c47d4ad1be24", settings.testing.sp.id, settings.testing.sp.secret);
      },
    },
  });

  const ww = await specialWeb.select("Title")();

  Logger.log({
    data: w,
    level: LogLevel.Info,
    message: "List of Web Data",
  });

  Logger.log({
    data: ww,
    level: LogLevel.Info,
    message: "List of Web Data",
  });

  process.exit(0);
}

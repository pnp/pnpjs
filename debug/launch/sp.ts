import { SPFetchClient } from "@pnp/nodejs";
import { Logger, LogLevel } from "@pnp/logging";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/clientside-pages";
import { CreateClientsidePage, PromotedState } from "@pnp/sp/clientside-pages";

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

  const w = await CreateClientsidePage(sp.web, "test-promote-3", "My Title", "Article", PromotedState.PromoteOnPublish);

  // const w = await sp.web.addClientsidePage("test-promote-1", "My Title", "Article", PromotedState.NotPromoted);

  await w.save(true);

  Logger.log({
    data: w,
    level: LogLevel.Info,
    message: "List of Web Data",
  });

  process.exit(0);
}

import { SPFetchClient } from "@pnp/nodejs";

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import { sp } from "@pnp/sp";
import "@pnp/sp/sputilities";
import { ICreateWikiPageResult } from "@pnp/sp/sputilities";

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


  let newPage : ICreateWikiPageResult = await sp.utility.createWikiPage({
      ServerRelativeUrl: "/sites/dev/SitePages/mynewpage.aspx",
      WikiHtmlContent: "This is my <b>page</b> content. It supports rich html.",
  });

  process.exit();
}

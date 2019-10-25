import { SPFetchClient } from "@pnp/nodejs";
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/site-users/web";
import "@pnp/sp/src/sharing/web";
import { SharingLinkKind } from "@pnp/sp/src/sharing";
import { dateAdd } from "@pnp/common";
import {  ISiteUserProps } from "@pnp/sp/src/site-users/types";

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
  let user: ISiteUserProps;
   user = await sp.web.siteUsers.getByEmail("valeras.narbutas@macaw.nl")();
  const r = await sp.web.shareWith(user.LoginName);

  console.log(JSON.stringify(r, null, 2));
  console.log(user.Title);
  console.log(user.Title);

  process.exit();
}

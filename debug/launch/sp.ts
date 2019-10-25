import { SPFetchClient } from "@pnp/nodejs";

import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
<<<<<<< HEAD
=======
import "@pnp/sp/src/site-users/web";
import "@pnp/sp/src/sharing/web";
import { SharingLinkKind } from "@pnp/sp/src/sharing";
import { dateAdd } from "@pnp/common";
<<<<<<< HEAD
import {  ISiteUserProps } from "@pnp/sp/src/site-users/types";
>>>>>>> Adding Documentation for site Users
=======
>>>>>>> rollback

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
<<<<<<< HEAD
<<<<<<< HEAD

  const r = await sp.web();
=======
  let user: ISiteUserProps;
   user = await sp.web.siteUsers.getByEmail("valeras.narbutas@macaw.nl")();
=======

  const user = await sp.web.siteUsers.getByEmail("patrick@three18studios.com")();

>>>>>>> rollback
  const r = await sp.web.shareWith(user.LoginName);
>>>>>>> Adding Documentation for site Users

  console.log(JSON.stringify(r, null, 2));

  process.exit();
}

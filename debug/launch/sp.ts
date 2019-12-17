import { SPFetchClient } from "@pnp/nodejs";

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/security/web";

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

  
  const defs = await sp.web.roleAssignments();

  const def = defs.find(v => true);


  const user = await sp.web.currentUser();

  const r = await sp.web.roleAssignments.add(user.Id, defs[0].Id);

  console.log(JSON.stringify(defs, null, 2));

  process.exit();
}

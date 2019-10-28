import { SPFetchClient } from "@pnp/nodejs";
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/site-users/web";
import "@pnp/sp/src/sharing/web";


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



  const r = await sp.web();

  const user = await sp.web.siteUsers.getByEmail("patrick@three18studios.com")();


  console.log(JSON.stringify(r, null, 2));

  process.exit();
}

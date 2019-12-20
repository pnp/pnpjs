import { SPFetchClient } from "@pnp/nodejs";

import { sp } from "@pnp/sp";
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

  const w = await sp.web();

  console.log(JSON.stringify(w, null, 2));

  process.exit();
}

import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/lists/web";
import { SPFetchClient } from "@pnp/nodejs";

import "@pnp/sp/src/webs";
import "@pnp/sp/src/lists";
import "@pnp/sp/src/fields";
// import { ISocialActorInfo, SocialActorType } from "@pnp/sp/src/social";

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

  // const f = await sp.web();

  // const actor: ISocialActorInfo = {
  //   ActorType: SocialActorType.Site,
  //   ContentUri: settings.testing.sp.url,
  // };
  // const f = await sp.social.isFollowed(actor);
  // const f = await sp.social.follow(actor);
  // const testFieldId = "060E50AC-E9C1-4D3C-B1F9-DE0BCAC300F6";

  process.exit();
}

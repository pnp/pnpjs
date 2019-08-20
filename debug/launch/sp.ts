import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
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

  // const f = await sp.web.fields.getById(testFieldId);
  // console.log(JSON.stringify(f, null, 2));
  const testFieldSchema = '<Field ID="{060E50AC-E9C1-4D3C-B1F9-DE0BCAC300F6}" \
          Name="Amount" \
          DisplayName="Amount" \
          Type="Currency" \
          Decimals="2" \
          Min="0" \
          Required="FALSE" \
          Group="Financial Columns" />';
  const field = await sp.web.lists.getByTitle("Documents").fields.createFieldAsXml(testFieldSchema);
  await sp.web.fields.getById("060E50AC-E9C1-4D3C-B1F9-DE0BCAC300F6").delete();


  process.exit();
}

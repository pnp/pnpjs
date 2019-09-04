
import { expect } from "chai";
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/social";
import { testSettings } from "../main";
import { ISocialActorInfo, SocialActorType } from "@pnp/sp/src/social";

describe("Social", function () {
  if (testSettings.enableWebTests) {
    it("gets my social", function () {
      return expect(sp.social.my).to.not.be.null;
    });
    it("get followed sites uri", function () {
      return expect(sp.social.getFollowedSitesUri).to.eventually.be.fulfilled;
    });
    it("get followed documents uri", function () {
      return expect(sp.social.getFollowedDocumentsUri).to.eventually.be.fulfilled;
    });
    it("follow (test site)", async function () {
      const actor: ISocialActorInfo = {
        ActorType: SocialActorType.Site,
        ContentUri: testSettings.sp.url,
      };
      const f = await sp.social.follow(actor);
      return expect(f).to.not.be.null;
    });
    it("is followed (test site)", function () {
      const actor: ISocialActorInfo = {
        ActorType: SocialActorType.Site,
        ContentUri: testSettings.sp.url,
      };
      return expect(sp.social.isFollowed(actor)).to.eventually.be.fulfilled;
    });
  }
});

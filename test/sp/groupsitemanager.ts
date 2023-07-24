import { expect } from "chai";
import "@pnp/graph/groups";
import "@pnp/sp/groupsitemanager";
import { stringIsNullOrEmpty } from "@pnp/core/util";

describe.skip("GroupSiteManager (without group context)", function () {
    // skip because app only tests.
    it("canUserCreateGroup", async function () {
        const isGroupCreationEnable = await this.pnp.sp.groupSiteManager.canUserCreateGroup();
        return expect(isGroupCreationEnable).to.be.false;
    });

    it("getAllOrgLabels", async function () {
        const orgLabels = await this.pnp.sp.groupSiteManager.getAllOrgLabels(0);
        return expect(orgLabels).to.not.be.null;
    });

    it("getGroupCreationContext", async function () {
        const groupCreationCtx = await this.pnp.sp.groupSiteManager.getGroupCreationContext();
        return expect(groupCreationCtx).to.not.be.null;
    });

    it("getGroupSiteConversionData", async function () {
        const grpSiteConversationData = await this.pnp.sp.groupSiteManager.getGroupSiteConversionData();
        return expect(grpSiteConversationData).to.not.be.null;
    });

    it("getUserSharedChannelMemberGroups", async function () {
        if (this.pnp.settings.testUser?.length < 1) {
            this.skip();
        }

        const sharedChannel = await this.pnp.sp.groupSiteManager.getUserSharedChannelMemberGroups(this.pnp.settings.testUser.split("|")[2]);
        return expect(sharedChannel).to.contain("Exchange.MemberGroup");
    });

    it("getUserTeamConnectedMemberGroups", async function () {
        if (this.pnp.settings.testUser?.length < 1) {
            this.skip();
        }

        const teamConnected = await this.pnp.sp.groupSiteManager.getUserTeamConnectedMemberGroups(this.pnp.settings.testUser.split("|")[2]);
        return expect(teamConnected).to.contain("Exchange.MemberGroup");
    });

    it("getValidSiteUrlFromAlias", async function () {
        const validSiteUrl = await this.pnp.sp.groupSiteManager.getValidSiteUrlFromAlias("contoso");
        return expect(validSiteUrl).to.not.be.null;
    });

    it("isTeamifyPromptHidden", async function () {
        const teamifyHidden = await this.pnp.sp.groupSiteManager.isTeamifyPromptHidden(this.pnp.settings.sp.url);
        return expect(teamifyHidden).to.not.be.null;
    });
});

describe("GroupSiteManager (group context)", function () {

    before(async function () {
        if (stringIsNullOrEmpty(this.pnp.settings.testGroupId)) {
            this.skip();
        }
    });

    it("create", async function () {
        const grpSite = await this.pnp.sp.groupSiteManager.create(this.pnp.settings.testGroupId);
        return expect(grpSite.SiteStatus).to.eq(2);
    });

    it("getSiteStatus", async function () {
        const parentGrp = await this.pnp.sp.groupSiteManager.getSiteStatus(this.pnp.settings.testGroupId);
        return expect(parentGrp.SiteStatus).to.to.eq(2);
    });

    it("notebook", async function () {
        const grpNotebook = await this.pnp.sp.groupSiteManager.notebook(this.pnp.settings.testGroupId);
        console.log(grpNotebook);
        return expect(grpNotebook).to.contain("SiteAssets");
    });

    // Remove the test data we created
    after(async function () {
        if (!stringIsNullOrEmpty(this.pnp.settings.testGroupId)) {
            await this.pnp.graph.groups.getById(this.pnp.settings.testGroupId).delete();
        }
        return;
    });
});

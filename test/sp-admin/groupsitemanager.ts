import { expect } from "chai";
import "@pnp/sp-admin";
import "@pnp/graph/groups";

describe("GroupSiteManager (without group context)", function () {

    it("CanUserCreateGroup", async function () {
        const isGroupCreationEnable = await this.pnp.sp.admin.groupSiteManager.CanUserCreateGroup();
        return expect(isGroupCreationEnable).to.be.false;
    });

    it("GetAllOrgLabels", async function () {
        const orgLabels = await this.pnp.sp.admin.groupSiteManager.GetAllOrgLabels(0);
        return expect(orgLabels).to.not.be.null;
    });

    it("GetGroupCreationContext", async function () {
        const groupCreationCtx = await this.pnp.sp.admin.groupSiteManager.GetGroupCreationContext();
        return expect(groupCreationCtx).to.not.be.null;
    });

    it("GetGroupSiteConversionData", async function () {
        const grpSiteConversationData = await this.pnp.sp.admin.groupSiteManager.GetGroupSiteConversionData();
        return expect(grpSiteConversationData).to.not.be.null;
    });

    it("GetUserSharedChannelMemberGroups", async function () {
        if (this.pnp.settings.testUser?.length < 1) {
            this.skip();
        }

        const sharedChannel = await this.pnp.sp.admin.groupSiteManager.GetUserSharedChannelMemberGroups(this.pnp.settings.testUser.split("|")[2]);
        return expect(sharedChannel).to.contain("Exchange.MemberGroup");
    });

    it("GetUserTeamConnectedMemberGroups", async function () {
        if (this.pnp.settings.testUser?.length < 1) {
            this.skip();
        }

        const teamConnected = await this.pnp.sp.admin.groupSiteManager.GetUserTeamConnectedMemberGroups(this.pnp.settings.testUser.split("|")[2]);
        return expect(teamConnected).to.contain("Exchange.MemberGroup");
    });

    it("GetValidSiteUrlFromAlias", async function () {
        const validSiteUrl = await this.pnp.sp.admin.groupSiteManager.GetValidSiteUrlFromAlias("contoso");
        return expect(validSiteUrl).to.not.be.null;
    });

    it("IsTeamifyPromptHidden", async function () {
        const teamifyHidden = await this.pnp.sp.admin.groupSiteManager.IsTeamifyPromptHidden(this.pnp.settings.sp.url);
        return expect(teamifyHidden).to.not.be.null;
    });
});

describe("GroupSiteManager (group context)", function () {

    before(async function () {
        if (!this.pnp.settings.enableGroupTests || this.pnp.settings.enableGroupTests && !this.pnp.settings.graph.groupId) {
            this.skip();
        }
    });

    it("Create", async function () {
        const grpSite = await this.pnp.sp.admin.groupSiteManager.Create(this.pnp.settings.graph.groupId);
        return expect(grpSite.SiteStatus).to.eq(2);
    });

    it("GetSiteStatus", async function () {
        const parentGrp = await this.pnp.sp.admin.groupSiteManager.GetSiteStatus(this.pnp.settings.graph.groupId);
        return expect(parentGrp.SiteStatus).to.to.eq(2);
    });

    it("Notebook", async function () {
        const grpNotebook = await this.pnp.sp.admin.groupSiteManager.Notebook(this.pnp.settings.graph.groupId);
        console.log(grpNotebook);
        return expect(grpNotebook).to.contain("SiteAssets");
    });
});

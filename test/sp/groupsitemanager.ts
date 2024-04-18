import { expect } from "chai";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import "@pnp/graph/groups";
import "@pnp/sp/groupsitemanager";
import { GroupType } from "@pnp/graph/groups";

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

// skipping. Asycnchrocity of test causes intermittent failures.
describe.skip("GroupSiteManager (group context)", function () {
    let groupId = "";

    before(async function () {
        const props = {
            groupName: `TestGroup_${getRandomString(4)}`,
        };

        const groupAddResult = await this.pnp.graph.groups.add(props.groupName, props.groupName, GroupType.Office365);
        groupId = groupAddResult.id;
    });

    it("create", async function () {
        if (stringIsNullOrEmpty(groupId)) {
            this.skip();
        }
        const grpSite = await this.pnp.sp.groupSiteManager.create(groupId);
        return expect(grpSite.SiteStatus).to.eq(2);
    });

    it("getSiteStatus", async function () {
        const parentGrp = await this.pnp.sp.groupSiteManager.getSiteStatus(groupId);
        return expect(parentGrp.SiteStatus).to.to.eq(2);
    });

    it("notebook", async function () {
        const grpNotebook = await this.pnp.sp.groupSiteManager.notebook(groupId);
        return expect(grpNotebook).to.contain("SiteAssets");
    });

    // Remove the test data we created
    after(async function () {
        if (!stringIsNullOrEmpty(groupId)) {
            await this.pnp.graph.groups.getById(groupId).delete();
        }
        return;
    });
});

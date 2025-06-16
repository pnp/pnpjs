import { expect } from "chai";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import "@pnp/graph/groups";
import "@pnp/sp/groupsitemanager";
import { GroupType } from "@pnp/graph/groups";
import { pnpTest } from  "../pnp-test.js";

describe.skip("GroupSiteManager (without group context)", function () {
    // skip because app only tests.
    it("canUserCreateGroup", pnpTest("137efaf8-58cf-4578-8e96-bd3800b35c9a", async function () {
        const isGroupCreationEnable = await this.pnp.sp.groupSiteManager.canUserCreateGroup();
        return expect(isGroupCreationEnable).to.be.false;
    }));

    it("getAllOrgLabels", pnpTest("3a652bef-f065-449a-8143-87abfafc8fbd", async function () {
        const orgLabels = await this.pnp.sp.groupSiteManager.getAllOrgLabels(0);
        return expect(orgLabels).to.not.be.null;
    }));

    it("getGroupCreationContext", pnpTest("8f0ca91b-b47c-4e72-88e8-ab2f86ce9d8a", async function () {
        const groupCreationCtx = await this.pnp.sp.groupSiteManager.getGroupCreationContext();
        return expect(groupCreationCtx).to.not.be.null;
    }));

    it("getGroupSiteConversionData", pnpTest("a8a49416-3c88-4075-96e5-04a6b46e92e4", async function () {
        const grpSiteConversationData = await this.pnp.sp.groupSiteManager.getGroupSiteConversionData();
        return expect(grpSiteConversationData).to.not.be.null;
    }));

    it("getUserSharedChannelMemberGroups", pnpTest("9dbbc028-40c0-4ba5-b7c2-30d787549c0c", async function () {
        if (this.pnp.settings.testUser?.length < 1) {
            this.skip();
        }

        const sharedChannel = await this.pnp.sp.groupSiteManager.getUserSharedChannelMemberGroups(this.pnp.settings.testUser.split("|")[2]);
        return expect(sharedChannel).to.contain("Exchange.MemberGroup");
    }));

    it("getUserTeamConnectedMemberGroups", pnpTest("eec3da90-6bb5-4bf1-8624-4769edde4a97", async function () {
        if (this.pnp.settings.testUser?.length < 1) {
            this.skip();
        }

        const teamConnected = await this.pnp.sp.groupSiteManager.getUserTeamConnectedMemberGroups(this.pnp.settings.testUser.split("|")[2]);
        return expect(teamConnected).to.contain("Exchange.MemberGroup");
    }));

    it("getValidSiteUrlFromAlias", pnpTest("2f1bbd8f-dedd-4c92-b90a-67f5997779af", async function () {
        const validSiteUrl = await this.pnp.sp.groupSiteManager.getValidSiteUrlFromAlias("contoso");
        return expect(validSiteUrl).to.not.be.null;
    }));

    it("isTeamifyPromptHidden", pnpTest("bb24f2e7-0ecb-48df-8d00-a41111adba45", async function () {
        const teamifyHidden = await this.pnp.sp.groupSiteManager.isTeamifyPromptHidden(this.pnp.settings.sp.url);
        return expect(teamifyHidden).to.not.be.null;
    }));
});

// skipping. Asycnchrocity of test causes intermittent failures.
describe.skip("GroupSiteManager (group context)", function () {
    let groupId = "";

    before(pnpTest("2e38aa6b-6f88-4bdc-a8dc-f135b7ebe011", async function () {
        const props = {
            groupName: `TestGroup_${getRandomString(4)}`,
        };

        const groupAddResult = await this.pnp.graph.groups.add(props.groupName, props.groupName, GroupType.Microsoft365);
        groupId = groupAddResult.id;
    }));

    it("create", pnpTest("fb905205-1331-4e81-af2c-92da36220b9e", async function () {
        if (stringIsNullOrEmpty(groupId)) {
            this.skip();
        }
        const grpSite = await this.pnp.sp.groupSiteManager.create(groupId);
        return expect(grpSite.SiteStatus).to.eq(2);
    }));

    it("getSiteStatus", pnpTest("7781f95c-c64c-4db5-8735-5d07c037f2c2", async function () {
        const parentGrp = await this.pnp.sp.groupSiteManager.getSiteStatus(groupId);
        return expect(parentGrp.SiteStatus).to.to.eq(2);
    }));

    it("notebook", pnpTest("7922c570-5c4f-4130-9839-17db7d2e6c1d", async function () {
        const grpNotebook = await this.pnp.sp.groupSiteManager.notebook(groupId);
        return expect(grpNotebook).to.contain("SiteAssets");
    }));

    // Remove the test data we created
    after(pnpTest("3f9fc1bb-b5f6-488c-9482-9260d8ed4f39", async function () {
        if (!stringIsNullOrEmpty(groupId)) {
            await this.pnp.graph.groups.getById(groupId).delete();
        }
        return;
    }));
});

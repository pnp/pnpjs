import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/site-groups";
import "@pnp/sp/site-users/web";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { ISiteGroupInfo } from "@pnp/sp/site-groups";


describe("SiteGroups", function () {

    let newGroup: ISiteGroupInfo;
    let testuserId: number;

    before(async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const groupName = `test_new_sitegroup_${getRandomString(6)}`;
        newGroup = await this.pnp.sp.web.siteGroups.add({ "Title": groupName });
        if (this.pnp.settings.testUser?.length > 0) {
            const ensureTestUser = await this.pnp.sp.web.ensureUser(this.pnp.settings.testUser);
            testuserId = ensureTestUser.Id;
        }
    });

    describe("Web", function () {
        it("siteGroups()", function () {
            return expect(this.pnp.sp.web.siteGroups()).to.eventually.be.fulfilled;
        });

        it("associatedOwnerGroup()", function () {
            return expect(this.pnp.sp.web.associatedOwnerGroup()).to.eventually.be.fulfilled;
        });

        it("associatedMemberGroup()", function () {
            return expect(this.pnp.sp.web.associatedMemberGroup()).to.eventually.be.fulfilled;
        });

        it("associatedVisitorGroup()", function () {
            return expect(this.pnp.sp.web.associatedVisitorGroup()).to.eventually.be.fulfilled;
        });

        // requires Custom Scripts to be enabled. Set-PnPSite -Identity <SiteURL> -NoScriptSite $false
        // Skipping as "custom scripts" feature disabled as of March 2024
        it.skip("createDefaultAssociatedGroups()", async function () {
            await this.pnp.sp.web.ensureUser(this.pnp.settings.testUser);
            const groupName = `TestGroup_${getRandomString(4)}`;
            let sucess = true;
            try {
                await this.pnp.sp.web.createDefaultAssociatedGroups(groupName,
                    this.pnp.settings.testUser,
                    false,
                    false);
            } catch (err) {
                sucess = false;
            }
            return expect(sucess).to.be.true;
        });
    });

    it("getById()", async function () {
        return expect(this.pnp.sp.web.siteGroups.getById(newGroup.Id)());
    });

    it("add()", async function () {
        const newGroupTitle = `test_add_new_sitegroup_${getRandomString(8)}`;
        const newGroup = await this.pnp.sp.web.siteGroups.add({ "Title": newGroupTitle });
        return expect(newGroup.Title).to.equal(newGroupTitle);
    });

    it("getByName()", function () {
        return expect(this.pnp.sp.web.siteGroups.getByName(newGroup.Title)()).to.be.eventually.fulfilled;
    });

    it("removeById()", async function () {
        const newGroupTitle = `test_remove_group_by_id_${getRandomString(8)}`;
        const g = await this.pnp.sp.web.siteGroups.add({ "Title": newGroupTitle });
        return expect(this.pnp.sp.web.siteGroups.removeById(g.Id)).to.be.eventually.fulfilled;
    });

    it("removeByLoginName()", async function () {
        const newGroupTitle = `test_remove_group_by_name_${getRandomString(8)}`;
        const g = await this.pnp.sp.web.siteGroups.add({ "Title": newGroupTitle });
        return expect(this.pnp.sp.web.siteGroups.removeByLoginName(g.LoginName)).to.be.eventually.fulfilled;
    });

    it("users()", async function () {
        return expect(this.pnp.sp.web.siteGroups.getById(newGroup.Id).users()).to.be.eventually.fulfilled;
    });

    it("update()", async function () {
        const newTitle = `Updated_${newGroup.Title}`;
        await this.pnp.sp.web.siteGroups.getByName(newGroup.Title).update({ "Title": newTitle });
        const p = this.pnp.sp.web.siteGroups.getById(newGroup.Id).select("Title")<{ "Title": string }>().then(g2 => {
            if (newTitle !== g2.Title) {
                throw Error("Failed to update the group!");
            }
        });
        return expect(p).to.be.eventually.fulfilled;
    });

    it("setUserAsOwner()", async function () {
        return expect(this.pnp.sp.web.siteGroups.getById(newGroup.Id).setUserAsOwner(testuserId)).to.be.eventually.fulfilled;
    });
});

import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/site-groups";
import "@pnp/sp/site-users/web";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { ISiteGroupInfo } from "@pnp/sp/site-groups";
import { pnpTest } from  "../pnp-test.js";


describe("SiteGroups", function () {

    let newGroup: ISiteGroupInfo;
    let testuserId: number;

    before(pnpTest("f958a683-6955-4efc-91d0-fe3a124db042", async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }
        const { groupName } = await this.props({
            groupName: `test_new_sitegroup_${getRandomString(6)}`,
        });

        newGroup = await this.pnp.sp.web.siteGroups.add({ "Title": groupName });
        if (this.pnp.settings.testUser?.length > 0) {
            const ensureTestUser = await this.pnp.sp.web.ensureUser(this.pnp.settings.testUser);
            testuserId = ensureTestUser.Id;
        }
    }));

    describe("Web", function () {
        it("siteGroups()", pnpTest("39df30c7-55e6-461a-a89c-7e982f65f619", function () {
            return expect(this.pnp.sp.web.siteGroups()).to.eventually.be.fulfilled;
        }));

        it("associatedOwnerGroup()", pnpTest("d26281ea-71bd-4388-b951-7544fc0fb5cb", function () {
            return expect(this.pnp.sp.web.associatedOwnerGroup()).to.eventually.be.fulfilled;
        }));

        it("associatedMemberGroup()", pnpTest("1e4906a0-9e2e-4f6e-8d7b-ea18092f0fc6", function () {
            return expect(this.pnp.sp.web.associatedMemberGroup()).to.eventually.be.fulfilled;
        }));

        it("associatedVisitorGroup()", pnpTest("86f6f8d0-8b2c-467b-9c13-b6a7d2508d55", function () {
            return expect(this.pnp.sp.web.associatedVisitorGroup()).to.eventually.be.fulfilled;
        }));

        // requires Custom Scripts to be enabled. Set-PnPSite -Identity <SiteURL> -NoScriptSite $false
        // Skipping as "custom scripts" feature disabled as of March 2024
        it.skip("createDefaultAssociatedGroups()", pnpTest("0b0eb1c8-ae62-41a5-ba8f-d4b1b30f724d", async function () {
            await this.pnp.sp.web.ensureUser(this.pnp.settings.testUser);
            const { groupName } = await this.props({
                groupName: `TestGroup_${getRandomString(4)}`,
            });

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
        }));
    });

    it("getById()", pnpTest("83f0c468-158b-4096-8188-eaa694b5efaa", async function () {
        return expect(this.pnp.sp.web.siteGroups.getById(newGroup.Id)());
    }));

    it("add()", pnpTest("c009757e-8e91-4969-854c-e0a48d72b0cb", async function () {
        const { newGroupTitle } = await this.props({
            newGroupTitle: `test_add_new_sitegroup_${getRandomString(8)}`,
        });
        const newGroup = await this.pnp.sp.web.siteGroups.add({ "Title": newGroupTitle });
        return expect(newGroup.Title).to.equal(newGroupTitle);
    }));

    it("getByName()", pnpTest("9a07cffe-7c77-46e4-b900-be5a8781e14b", function () {
        return expect(this.pnp.sp.web.siteGroups.getByName(newGroup.Title)()).to.be.eventually.fulfilled;
    }));

    it("removeById()", pnpTest("2d296846-de73-40ec-b95d-efad4512b64d", async function () {
        const { newGroupTitle } = await this.props({
            newGroupTitle: `test_remove_group_by_id_${getRandomString(8)}`,
        });
        const g = await this.pnp.sp.web.siteGroups.add({ "Title": newGroupTitle });
        return expect(this.pnp.sp.web.siteGroups.removeById(g.Id)).to.be.eventually.fulfilled;
    }));

    it("removeByLoginName()", pnpTest("da126e08-aade-415e-9c32-164dbb61187b", async function () {
        const { newGroupTitle } = await this.props({
            newGroupTitle: `test_remove_group_by_name_${getRandomString(8)}`,
        });
        const g = await this.pnp.sp.web.siteGroups.add({ "Title": newGroupTitle });
        return expect(this.pnp.sp.web.siteGroups.removeByLoginName(g.LoginName)).to.be.eventually.fulfilled;
    }));

    it("users()", pnpTest("9f8f8c17-d344-4ab4-96cc-718d39d966ab", async function () {
        return expect(this.pnp.sp.web.siteGroups.getById(newGroup.Id).users()).to.be.eventually.fulfilled;
    }));

    it("update()", pnpTest("764caf1e-ae9c-42a0-80b3-407d7beaa9b4", async function () {
        const newTitle = `Updated_${newGroup.Title}`;
        await this.pnp.sp.web.siteGroups.getByName(newGroup.Title).update({ "Title": newTitle });
        const p = this.pnp.sp.web.siteGroups.getById(newGroup.Id).select("Title")<{ "Title": string }>().then(g2 => {
            if (newTitle !== g2.Title) {
                throw Error("Failed to update the group!");
            }
        });
        return expect(p).to.be.eventually.fulfilled;
    }));

    it("setUserAsOwner()", pnpTest("35afc24c-ac07-46b9-9b3d-de14c26f3382", async function () {
        return expect(this.pnp.sp.web.siteGroups.getById(newGroup.Id).setUserAsOwner(testuserId)).to.be.eventually.fulfilled;
    }));
});

import { expect } from "chai";
import { getSP } from "../main.js";
import "@pnp/sp/webs";
import "@pnp/sp/site-groups";
import "@pnp/sp/site-users/web";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { IGroupAddResult } from "@pnp/sp/site-groups";
import { SPFI } from "@pnp/sp";

describe("SiteGroups", function () {

    let _spfi: SPFI = null;
    let newGroup: IGroupAddResult;
    let testuserId: number;

    before(async function () {

        if (!this.settings.enableWebTests || stringIsNullOrEmpty(this.settings.testUser)) {
            this.skip();
        }

        _spfi = getSP();
        const groupName = `test_new_sitegroup_${getRandomString(6)}`;
        newGroup = await _spfi.web.siteGroups.add({ "Title": groupName });
        if (this.settings.testUser?.length > 0) {
            const ensureTestUser = await _spfi.web.ensureUser(this.settings.testUser);
            testuserId = ensureTestUser.data.Id;
        }
    });

    describe("Web", function () {
        it("siteGroups()", function () {
            return expect(_spfi.web.siteGroups()).to.eventually.be.fulfilled;
        });

        it("associatedOwnerGroup()", function () {
            return expect(_spfi.web.associatedOwnerGroup()).to.eventually.be.fulfilled;
        });

        it("associatedMemberGroup()", function () {
            return expect(_spfi.web.associatedMemberGroup()).to.eventually.be.fulfilled;
        });

        it("associatedVisitorGroup()", function () {
            return expect(_spfi.web.associatedVisitorGroup()).to.eventually.be.fulfilled;
        });

        it("createDefaultAssociatedGroups()", async function () {

            await _spfi.web.ensureUser(this.settings.testUser);
            const groupName = `TestGroup_${getRandomString(4)}`;
            return expect(_spfi.web.createDefaultAssociatedGroups(groupName,
                this.settings.testUser,
                false,
                false)).to.be.eventually.fulfilled;
        });
    });

    it("getById()", async function () {
        return expect(_spfi.web.siteGroups.getById(newGroup.data.Id)());
    });

    it("add()", function () {
        const newGroupTitle = `test_add_new_sitegroup_${getRandomString(8)}`;
        return expect(_spfi.web.siteGroups.add({ "Title": newGroupTitle })).to.be.eventually.fulfilled;
    });

    it("getByName()", function () {
        return expect(_spfi.web.siteGroups.getByName(newGroup.data.Title)()).to.be.eventually.fulfilled;
    });

    it("removeById()", async function () {
        const newGroupTitle = `test_remove_group_by_id_${getRandomString(8)}`;
        const g = await _spfi.web.siteGroups.add({ "Title": newGroupTitle });
        return expect(_spfi.web.siteGroups.removeById(g.data.Id)).to.be.eventually.fulfilled;
    });

    it("removeByLoginName()", async function () {
        const newGroupTitle = `test_remove_group_by_name_${getRandomString(8)}`;
        const g = await _spfi.web.siteGroups.add({ "Title": newGroupTitle });
        return expect(_spfi.web.siteGroups.removeByLoginName(g.data.LoginName)).to.be.eventually.fulfilled;
    });

    it("users()", async function () {
        return expect(_spfi.web.siteGroups.getById(newGroup.data.Id).users()).to.be.eventually.fulfilled;
    });

    it("update()", async function () {
        const newTitle = `Updated_${newGroup.data.Title}`;
        await _spfi.web.siteGroups.getByName(newGroup.data.Title).update({ "Title": newTitle });
        const p = _spfi.web.siteGroups.getById(newGroup.data.Id).select("Title")<{ "Title": string }>().then(g2 => {
            if (newTitle !== g2.Title) {
                throw Error("Failed to update the group!");
            }
        });
        return expect(p).to.be.eventually.fulfilled;
    });

    it("setUserAsOwner()", async function () {
        return expect(_spfi.web.siteGroups.getById(newGroup.data.Id).setUserAsOwner(testuserId)).to.be.eventually.fulfilled;
    });
});

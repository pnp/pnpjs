import { expect } from "chai";
import { getSP, testSettings } from "../main.js";
import "@pnp/sp/webs";
import "@pnp/sp/site-groups";
import "@pnp/sp/site-users/web";
import { getRandomString } from "@pnp/core";
import { IGroupAddResult } from "@pnp/sp/site-groups";
import { SPRest } from "@pnp/sp";

describe("Web.SiteGroups", function () {

    if (testSettings.enableWebTests) {
        let _spRest: SPRest = null;
        let newGroup: IGroupAddResult;
        let testuserId: number;

        before(async function () {
            _spRest = getSP();
            this.timeout(0);
            const groupName = `test_new_sitegroup_${getRandomString(6)}`;
            newGroup = await _spRest.web.siteGroups.add({ "Title": groupName });
            if (testSettings.testUser?.length > 0) {
                const ensureTestUser = await _spRest.web.ensureUser(testSettings.testUser);
                testuserId = ensureTestUser.data.Id;
            }
        });

        it("siteGroups()", function () {
            return expect(_spRest.web.siteGroups()).to.eventually.be.fulfilled;
        });

        it("associatedOwnerGroup()", function () {
            return expect(_spRest.web.associatedOwnerGroup()).to.eventually.be.fulfilled;
        });

        it("associatedMemberGroup()", function () {
            return expect(_spRest.web.associatedMemberGroup()).to.eventually.be.fulfilled;
        });

        it("associatedVisitorGroup()", function () {
            return expect(_spRest.web.associatedVisitorGroup()).to.eventually.be.fulfilled;
        });

        if (testSettings.testUser?.length > 0) {
            it(".createDefaultAssociatedGroups()", async function () {
                await _spRest.web.ensureUser(testSettings.testUser);
                const groupName = `TestGroup_${getRandomString(4)}`;
                return expect(_spRest.web.createDefaultAssociatedGroups(groupName,
                    testSettings.testUser,
                    false,
                    false)).to.be.eventually.fulfilled;
            });
        }

        it(".getById()", async function () {
            return expect(_spRest.web.siteGroups.getById(newGroup.data.Id)());
        });

        it(".add()", function () {
            const newGroupTitle = `test_add_new_sitegroup_${getRandomString(8)}`;
            return expect(_spRest.web.siteGroups.add({ "Title": newGroupTitle })).to.be.eventually.fulfilled;
        });

        it(".getByName()", function () {
            return expect(_spRest.web.siteGroups.getByName(newGroup.data.Title)()).to.be.eventually.fulfilled;
        });

        it(".removeById()", async function () {
            const newGroupTitle = `test_remove_group_by_id_${getRandomString(8)}`;
            const g = await _spRest.web.siteGroups.add({ "Title": newGroupTitle });
            return expect(_spRest.web.siteGroups.removeById(g.data.Id)).to.be.eventually.fulfilled;
        });

        it(".removeByLoginName()", async function () {
            const newGroupTitle = `test_remove_group_by_name_${getRandomString(8)}`;
            const g = await _spRest.web.siteGroups.add({ "Title": newGroupTitle });
            return expect(_spRest.web.siteGroups.removeByLoginName(g.data.LoginName)).to.be.eventually.fulfilled;
        });

        it("SiteGroup.users()", async function () {
            return expect(_spRest.web.siteGroups.getById(newGroup.data.Id).users()).to.be.eventually.fulfilled;
        });

        // TODO: Bug with select and typings
        it("SiteGroup.update()", async function () {
            const newTitle = `Updated_${newGroup.data.Title}`;
            await _spRest.web.siteGroups.getByName(newGroup.data.Title).update({ "Title": newTitle });
            // const p = _spRest.web.siteGroups.getById(newGroup.data.Id).select("Title")<{ "Title": string }>().then(g2 => {
            //     if (newTitle !== g2.Title) {
            //         throw Error("Failed to update the group!");
            //     }
            // });
            // return expect(p).to.be.eventually.fulfilled;
            return true;
        });

        it("SiteGroup.setUserAsOwner()", async function () {
            return expect(_spRest.web.siteGroups.getById(newGroup.data.Id).setUserAsOwner(testuserId)).to.be.eventually.fulfilled;
        });
    }
});

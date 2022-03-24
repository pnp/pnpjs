import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/groups";
import "@pnp/graph/directory-objects";
import { GroupType } from "@pnp/graph/groups";
import { getRandomString, getGUID, stringIsNullOrEmpty } from "@pnp/core";
import getValidUser from "./utilities/getValidUser.js";

describe("Directory Objects", function () {

    let testUserName = "";
    let testChildGroupID = "";
    let testParentGroupID = "";
    const testGUID = getGUID();
    let userInfo = null;

    before(async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        // Get a sample user
        userInfo = await getValidUser.call(this);
        testUserName = userInfo.userPrincipalName;

        // Create a test group to ensure we have a directory object
        let groupName = `TestGroup_${getRandomString(4)}`;
        let result = await this.pnp.graph.groups.add(groupName, groupName, GroupType.Security, {
            "members@odata.bind": [
                "https://graph.microsoft.com/v1.0/users/" + userInfo.id,
            ],
            "owners@odata.bind": [
                "https://graph.microsoft.com/v1.0/users/" + userInfo.id,
            ],
        });
        testChildGroupID = result.data.id;

        groupName = `TestGroup_${getRandomString(4)}`;
        result = await this.pnp.graph.groups.add(groupName, groupName, GroupType.Security, {
            "members@odata.bind": [
                "https://graph.microsoft.com/v1.0/users/" + userInfo.id,
                "https://graph.microsoft.com/v1.0/groups/" + testChildGroupID,
            ],
            "owners@odata.bind": [
                "https://graph.microsoft.com/v1.0/users/" + userInfo.id,
            ],
        });
        testParentGroupID = result.data.id;
    });

    it("delete", async function () {
        const groupName = `TestGroup_${getRandomString(4)}`;
        const result = await this.pnp.graph.groups.add(groupName, groupName, GroupType.Security, {
            "members@odata.bind": [
                "https://graph.microsoft.com/v1.0/users/" + userInfo.id,
            ],
            "owners@odata.bind": [
                "https://graph.microsoft.com/v1.0/users/" + userInfo.id,
            ],
        });
        const testDeleteGroupID = result.data.id;
        return expect(this.pnp.graph.groups.getById(testDeleteGroupID).delete()).eventually.be.fulfilled;
    });

    it("Get User Member Objects", async function () {
        const memberObjects = await this.pnp.graph.users.getById(testUserName).getMemberObjects();
        return expect(memberObjects).contains(testChildGroupID);
    });

    it("Get Group Member Objects", async function () {
        const memberObjects = await this.pnp.graph.groups.getById(testChildGroupID).getMemberObjects(true);
        return expect(memberObjects).contains(testParentGroupID);
    });

    it("Get User Member Groups", async function () {
        const memberObjects = await this.pnp.graph.users.getById(testUserName).getMemberGroups(true);
        return expect(memberObjects).contains(testChildGroupID);
    });

    it("Get Group Member Objects", async function () {
        const memberObjects = await this.pnp.graph.groups.getById(testChildGroupID).getMemberGroups();
        return expect(memberObjects).contains(testParentGroupID);
    });

    it("Check User Member Groups (1)", async function () {
        const memberGroups = await this.pnp.graph.users.getById(testUserName).checkMemberGroups([testChildGroupID, testParentGroupID, testGUID]);
        return expect(memberGroups.length).is.equal(2);
    });

    it("Check User Member Groups (2)", async function () {
        const memberGroups = await this.pnp.graph.groups.getById(testChildGroupID).checkMemberGroups([testChildGroupID, testParentGroupID, testGUID]);
        return expect(memberGroups.length).is.equal(1);
    });

    it("Get directory object by ID", async function () {
        const dirObj = await this.pnp.graph.directoryObjects.getById(testChildGroupID);
        return expect(dirObj).is.not.null;
    });

    it("Check MemberOf", async function () {
        const memberObjects = await this.pnp.graph.users.getById(testUserName).memberOf();
        return expect(memberObjects.length).greaterThan(0);
    });

    // Remove the test data we created
    after(async function () {
        const promises = [Promise.resolve()];
        if (this.pnp.settings.enableWebTests && !stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            promises.push(this.pnp.graph.groups.getById(testChildGroupID).delete());
            promises.push(this.pnp.graph.groups.getById(testParentGroupID).delete());
        }
        return Promise.all(promises);
    });
});

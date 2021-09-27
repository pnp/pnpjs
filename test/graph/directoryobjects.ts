import { expect } from "chai";
import { testSettings } from "../main-2.js";
import { graph } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/groups";
import "@pnp/graph/directory-objects";
import { GroupType } from "@pnp/graph/groups";
import { getRandomString, getGUID } from "@pnp/core";
import getValidUser from "./utilities/getValidUser.js";

describe("Directory Objects", function () {

    // We can't test for graph.me calls in an application context
    if (testSettings.enableWebTests && testSettings.testUser?.length > 0) {
        let testUserName = "";
        let testChildGroupID = "";
        let testParentGroupID = "";
        const testGUID = getGUID();

        this.beforeAll(async function () {
            // Get a sample user
            const userInfo = await getValidUser();
            testUserName = userInfo.userPrincipalName;

            // Create a test group to ensure we have a directory object
            let groupName = `TestGroup_${getRandomString(4)}`;
            let result = await graph.groups.add(groupName, groupName, GroupType.Security, {
                "members@odata.bind": [
                    "https://graph.microsoft.com/v1.0/users/" + userInfo.id,
                ],
                "owners@odata.bind": [
                    "https://graph.microsoft.com/v1.0/users/" + userInfo.id,
                ],
            });
            testChildGroupID = result.data.id;

            groupName = `TestGroup_${getRandomString(4)}`;
            result = await graph.groups.add(groupName, groupName, GroupType.Security, {
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

        it("Get User Member Objects", async function () {
            const memberObjects = await graph.users.getById(testUserName).getMemberObjects();
            return expect(memberObjects).contains(testChildGroupID);
        });

        it("Get Group Member Objects", async function () {
            const memberObjects = await graph.groups.getById(testChildGroupID).getMemberObjects(true);
            return expect(memberObjects).contains(testParentGroupID);
        });

        it("Get User Member Groups", async function () {
            const memberObjects = await graph.users.getById(testUserName).getMemberGroups(true);
            return expect(memberObjects).contains(testChildGroupID);
        });

        it("Get Group Member Objects", async function () {
            const memberObjects = await graph.groups.getById(testChildGroupID).getMemberGroups();
            return expect(memberObjects).contains(testParentGroupID);
        });

        it("Check User Member Groups", async function () {
            const memberGroups = await graph.users.getById(testUserName).checkMemberGroups([testChildGroupID, testParentGroupID, testGUID]);
            return expect(memberGroups.length).is.equal(2);
        });

        it("Check User Member Groups", async function () {
            const memberGroups = await graph.groups.getById(testChildGroupID).checkMemberGroups([testChildGroupID, testParentGroupID, testGUID]);
            return expect(memberGroups.length).is.equal(1);
        });

        it("Get directory object by ID", async function () {
            const dirObj = await graph.directoryObjects.getById(testChildGroupID);
            return expect(dirObj).is.not.null;
        });

        it("Check MemberOf", async function () {
            const memberObjects = await graph.users.getById(testUserName).memberOf();
            return expect(memberObjects.length).greaterThan(0);
        });

        // This is not supported in an application context
        // it("Delete Directory Object", async function () {
        //     await graph.directoryObjects.getById(testChildGroupID).delete();
        //     return expect(true).is.not.null;
        // });

        // Remove the test data we created
        this.afterAll(async function () {
            await graph.groups.getById(testChildGroupID).delete();
            await graph.groups.getById(testParentGroupID).delete();
        });
    }

});

import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/groups";
import "@pnp/graph/directory-objects";
import { GroupType } from "@pnp/graph/groups";
import { getRandomString, getGUID, stringIsNullOrEmpty } from "@pnp/core";
import getValidUser from "./utilities/getValidUser.js";
import { pnpTest } from "../pnp-test.js";

describe("Directory Objects", function () {

    let testUserName = "";
    let testChildGroupID = "";
    let testParentGroupID = "";
    let testGUID;
    let userId = null;

    before(pnpTest("3adea3f7-de9b-4872-92c4-82f964a072a8", async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        // Get a sample user
        const userInfo = await getValidUser.call(this);

        const props = await this.props({
            groupName1: `TestGroup_${getRandomString(4)}`,
            groupName2: `TestGroup_${getRandomString(4)}`,
            userId: userInfo.id,
            userName: userInfo.userPrincipalName,
            testGuid: getGUID(),
        });

        testUserName = props.userName;
        userId = props.userId;
        testGUID = props.testGuid;

        // Create a test group to ensure we have a directory object

        let result = await this.pnp.graph.groups.add(props.groupName1, props.groupName1, GroupType.Security, {
            "members@odata.bind": [
                "https://graph.microsoft.com/v1.0/users/" + props.userId,
            ],
            "owners@odata.bind": [
                "https://graph.microsoft.com/v1.0/users/" + props.userId,
            ],
        });
        testChildGroupID = result.id;

        result = await this.pnp.graph.groups.add(props.groupName2, props.groupName2, GroupType.Security, {
            "members@odata.bind": [
                "https://graph.microsoft.com/v1.0/users/" + props.userId,
                "https://graph.microsoft.com/v1.0/groups/" + testChildGroupID,
            ],
            "owners@odata.bind": [
                "https://graph.microsoft.com/v1.0/users/" + props.userId,
            ],
        });
        testParentGroupID = result.id;
    }));

    it("delete", pnpTest("e1d8a9b8-43c1-4c02-85b3-92ef980d0ee2", async function () {

        const props = await this.props({
            groupName: `TestGroup_${getRandomString(4)}`,
        });

        const result = await this.pnp.graph.groups.add(props.groupName, props.groupName, GroupType.Security, {
            "members@odata.bind": [
                "https://graph.microsoft.com/v1.0/users/" + userId,
            ],
            "owners@odata.bind": [
                "https://graph.microsoft.com/v1.0/users/" + userId,
            ],
        });
        const testDeleteGroupID = result.id;
        return expect(this.pnp.graph.groups.getById(testDeleteGroupID).delete()).eventually.be.fulfilled;
    }));

    it("Get User Member Objects", pnpTest("ba2c72fb-d9f0-412d-988e-527d0ce9b7a6", async function () {
        const memberObjects = await this.pnp.graph.users.getById(testUserName).getMemberObjects();
        return expect(memberObjects).contains(testChildGroupID);
    }));

    it("Get Group Member Objects", pnpTest("37fe45e5-5c9b-4b45-a8a5-bd8536ecb512", async function () {
        const memberObjects = await this.pnp.graph.groups.getById(testChildGroupID).getMemberObjects(true);
        return expect(memberObjects).contains(testParentGroupID);
    }));

    it("Get User Member Groups", pnpTest("a66c2661-e9c1-4880-a5cf-f85c04c1fc09", async function () {
        const memberObjects = await this.pnp.graph.users.getById(testUserName).getMemberGroups(true);
        return expect(memberObjects).contains(testChildGroupID);
    }));

    it("Get Group Member Objects", pnpTest("a41f6893-7942-4584-a688-5cdef1304329", async function () {
        const memberObjects = await this.pnp.graph.groups.getById(testChildGroupID).getMemberGroups();
        return expect(memberObjects).contains(testParentGroupID);
    }));

    it("Check User Member Groups (1)", pnpTest("fff79512-3b81-4b1f-8de2-c8c65ff3985e", async function () {
        const memberGroups = await this.pnp.graph.users.getById(testUserName).checkMemberGroups([testChildGroupID, testParentGroupID, testGUID]);
        return expect(memberGroups.length).is.equal(2);
    }));

    it("Check User Member Groups (2)", pnpTest("02172c11-b086-4fb8-a70b-216d24f17d3d", async function () {
        const memberGroups = await this.pnp.graph.groups.getById(testChildGroupID).checkMemberGroups([testChildGroupID, testParentGroupID, testGUID]);
        return expect(memberGroups.length).is.equal(1);
    }));

    it("Get directory object by ID", pnpTest("501eef0b-1cb8-4b1e-b716-0876114f677c", async function () {
        const dirObj = await this.pnp.graph.directoryObjects.getById(testChildGroupID);
        return expect(dirObj).is.not.null;
    }));

    it("Check MemberOf", pnpTest("cfcd853b-8cba-4fea-8d1d-16afc35ba392", async function () {
        const memberObjects = await this.pnp.graph.users.getById(testUserName).memberOf();
        return expect(memberObjects.length).greaterThan(0);
    }));

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

import { getRandomString } from "@pnp/core";
import { expect } from "chai";
import { GroupType } from "@pnp/graph/groups";
import "@pnp/graph/sites/group";

describe("Groups", function () {

    let groupID = "";

    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    beforeEach(async function () {
        // Clear out groupID
        groupID = "";
    });

    it("add", async function () {
        const groupName = `TestGroup_${getRandomString(4)}`;
        const groupAddResult = await this.pnp.graph.groups.add(groupName, groupName, GroupType.Office365);
        const group = await groupAddResult.group();
        groupID = groupAddResult.data.id;
        return expect(group.displayName).is.not.undefined;
    });

    it("delete", async function () {
        // Create a new group
        const groupName = `TestGroup_${getRandomString(4)}`;
        const groupAddResult = await this.pnp.graph.groups.add(groupName, groupName, GroupType.Office365);
        // Delete the group
        // Potential Bug. Delete is only available off of getByID
        await this.pnp.graph.groups.getById(groupAddResult.data.id).delete();
        // Check to see if the group exists
        const groups = await this.pnp.graph.groups();
        let groupExists = false;
        groups.forEach(element => {
            if (element.id === groupAddResult.data.id) {
                groupExists = true;
                return groupExists === true;
            }
        });
        return expect(groupExists).is.not.true;
    });

    it("getById", async function () {
        // Create a new group
        const groupName = `TestGroup_${getRandomString(4)}`;
        const groupAddResult = await this.pnp.graph.groups.add(groupName, groupName, GroupType.Office365);
        // Get the group by ID
        const group = await this.pnp.graph.groups.getById(groupAddResult.data.id);
        return expect(group).is.not.undefined;
    });

    it("update", async function () {
        // Create a new group
        const groupName = `TestGroup_${getRandomString(4)}`;
        const groupAddResult = await this.pnp.graph.groups.add(groupName, groupName, GroupType.Office365);
        groupID = groupAddResult.data.id;

        // Update the display name of the group
        const newName = '"Updated_' + groupAddResult.data.displayName + '"';
        // Potential Bug. Update is only available off of getByID
        await this.pnp.graph.groups.getById(groupID).update({ displayName: newName });

        // Get the group to check and see if the names are different
        const group = await this.pnp.graph.groups.getById(groupID)();

        return expect(groupName === group.displayName).is.not.true;
    });

    it("sites.root.sites", async function () {
        // Find an existing group
        // This has to be tested on existing groups. On a newly created group, this returns an error often
        // "Resource provisioning is in progress. Please try again.". This is expected as the team site provisioning takes a few seconds when creating a new group
        const groups = await this.pnp.graph.groups();
        const grpID = groups[0].id;

        // Get sites within this group
        const sitesPromise = this.pnp.graph.groups.getById(grpID).sites.root.sites();

        return expect(sitesPromise).to.eventually.be.fulfilled;
    });

    it("sites.root", async function () {
        // Find an existing group
        const groups = await this.pnp.graph.groups();
        const grpID = groups[0].id;

        // Get the group team site
        const root = await this.pnp.graph.groups.getById(grpID).sites.root();

        return expect(root).is.not.null;
    });

    // it("addFavorite()", async function () {
    //   // This is a user context function. Can't test in application context
    //   return expect(true).is.true;
    // });
    // it("removeFavorite()", async function () {
    //   // This is a user context function. Can't test in application context
    //   return expect(true).is.true;
    // });
    // it("resetUnseenCount()", async function () {
    //   // This is a user context function. Can't test in application context
    //   return expect(true).is.true;
    // });
    // it("subscribeByMail()", async function () {
    //   // This is a user context function. Can't test in application context
    //   return expect(true).is.true;
    // });
    // it("unsubscribeByMail()", async function () {
    //   // This is a user context function. Can't test in application context
    //   return expect(true).is.true;
    // });
    // it("getCalendarView(start: Date, end: Date)", async function () {
    //   // This is a user context function. Can't test in application context
    //   return expect(true).is.true;
    // });

    afterEach(async function () {
        if (groupID !== "") {
            return this.pnp.graph.groups.getById(groupID).delete();
        }
        return;
    });
});

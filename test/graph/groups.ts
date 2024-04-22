import { getRandomString } from "@pnp/core";
import { expect } from "chai";
import { GroupType } from "@pnp/graph/groups";
import "@pnp/graph/sites/group";
import { pnpTest } from "../pnp-test.js";

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

    it("add", pnpTest("022e5336-56a1-4bd3-80a2-74139f386e40", async function () {

        const props = await this.props({
            groupName: `TestGroup_${getRandomString(4)}`,
        });

        const groupAddResult = await this.pnp.graph.groups.add(props.groupName, props.groupName, GroupType.Office365);
        const group = await this.pnp.graph.groups.getById(groupAddResult.id)();
        groupID = groupAddResult.id;
        return expect(group.displayName).is.not.undefined;
    }));

    it("delete", pnpTest("c6d59c80-332b-4d6d-8dbd-54c111cdcf12", async function () {

        const props = await this.props({
            groupName: `TestGroup_${getRandomString(4)}`,
        });

        // Create a new group
        const groupAddResult = await this.pnp.graph.groups.add(props.groupName, props.groupName, GroupType.Office365);
        // Delete the group
        // Potential Bug. Delete is only available off of getByID
        await this.pnp.graph.groups.getById(groupAddResult.id).delete();
        // Check to see if the group exists
        const groups = await this.pnp.graph.groups();
        let groupExists = false;
        groups.forEach(element => {
            if (element.id === groupAddResult.id) {
                groupExists = true;
                return groupExists === true;
            }
        });
        return expect(groupExists).is.not.true;
    }));

    it("getById", pnpTest("ea5ae8ab-570c-48fc-b01f-331f3e6ad366", async function () {

        const props = await this.props({
            groupName: `TestGroup_${getRandomString(4)}`,
        });

        // Create a new group
        const groupAddResult = await this.pnp.graph.groups.add(props.groupName, props.groupName, GroupType.Office365);
        // Get the group by ID
        const group = await this.pnp.graph.groups.getById(groupAddResult.id)();
        return expect(group).is.not.undefined;
    }));

    it("update", pnpTest("d1845967-2d71-4995-90e0-58e8967a249a", async function () {

        const props = await this.props({
            groupName: `TestGroup_${getRandomString(4)}`,
        });

        // Create a new group
        const groupAddResult = await this.pnp.graph.groups.add(props.groupName, props.groupName, GroupType.Office365);
        groupID = groupAddResult.id;

        // Update the display name of the group
        const newName = '"Updated_' + groupAddResult.displayName + '"';
        // Potential Bug. Update is only available off of getByID
        await this.pnp.graph.groups.getById(groupID).update({ displayName: newName });

        // Get the group to check and see if the names are different
        const group = await this.pnp.graph.groups.getById(groupID)();

        return expect(props.groupName === group.displayName).is.not.true;
    }));

    it("sites.root.sites", pnpTest("ae59d162-bb17-40f0-b606-a9b5bab3ec6c", async function () {
        // Find an existing group
        // This has to be tested on existing groups. On a newly created group, this returns an error often
        // "Resource provisioning is in progress. Please try again.". This is expected as the team site provisioning takes a few seconds when creating a new group
        const groups = await this.pnp.graph.groups();
        const grpID = groups[0].id;

        // Get sites within this group
        const sitesPromise = this.pnp.graph.groups.getById(grpID).sites.root.sites();

        return expect(sitesPromise).to.eventually.be.fulfilled;
    }));

    it("sites.root", pnpTest("b5fce16b-aa14-40e3-98c5-28a828050c04", async function () {
        // Find an existing group
        const groups = await this.pnp.graph.groups();
        const grpID = groups[0].id;

        // Get the group team site
        const root = await this.pnp.graph.groups.getById(grpID).sites.root();

        return expect(root).is.not.null;
    }));

    afterEach(async function () {
        if (groupID !== "") {
            return this.pnp.graph.groups.getById(groupID).delete();
        }
        return;
    });
});

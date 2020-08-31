import { getRandomString } from "@pnp/common";
import { expect } from "chai";
import { testSettings } from "../main";
import { graph } from "@pnp/graph";
import { GroupType } from "@pnp/graph/groups";

describe("Groups", function () {

  if (testSettings.enableWebTests) {
    let groupID = "";

    beforeEach(async function () {
      // Clear out groupID
      groupID = "";
    });

    it("add()", async function () {
      const groupName = `TestGroup_${getRandomString(4)}`;
      const groupAddResult = await graph.groups.add(groupName, groupName, GroupType.Office365);
      const group = await groupAddResult.group();
      groupID = groupAddResult.data.id;
      return expect(group.displayName).is.not.undefined;
    });

    it("delete", async function () {
      // Create a new group
      const groupName = `TestGroup_${getRandomString(4)}`;
      const groupAddResult = await graph.groups.add(groupName, groupName, GroupType.Office365);
      // Delete the group
      // Potential Bug. Delete is only available off of getByID
      await graph.groups.getById(groupAddResult.data.id).delete();
      // Check to see if the group exists
      const groups = await graph.groups();
      let groupExists = false;
      groups.forEach(element => {
        if (element.id === groupAddResult.data.id) {
          groupExists = true;
          return groupExists === true;
        }
      });
      return expect(groupExists).is.not.true;
    });

    it("getById()", async function () {
      // Create a new group
      const groupName = `TestGroup_${getRandomString(4)}`;
      const groupAddResult = await graph.groups.add(groupName, groupName, GroupType.Office365);
      // Get the group by ID
      const group = await graph.groups.getById(groupAddResult.data.id);
      return expect(group).is.not.undefined;
    });

    it("update", async function () {
      // Create a new group
      const groupName = `TestGroup_${getRandomString(4)}`;
      const groupAddResult = await graph.groups.add(groupName, groupName, GroupType.Office365);
      groupID = groupAddResult.data.id;

      // Update the display name of the group
      const newName = '"Updated_' + groupAddResult.data.displayName + '"';
      // Potential Bug. Update is only available off of getByID
      await graph.groups.getById(groupID).update({ displayName: newName });

      // Get the group to check and see if the names are different
      const group = await graph.groups.getById(groupID).get();

      return expect(groupName === group.displayName).is.not.true;
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
        await graph.groups.getById(groupID).delete();
      }
    });
  }
});

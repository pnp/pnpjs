import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/files";
import "@pnp/graph/sites";
import "@pnp/graph/lists";
import "@pnp/graph/list-item";
import "@pnp/graph/analytics";
import { List } from "@microsoft/microsoft-graph-types";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { IAnalyticsOptions } from "@pnp/graph/analytics";
import getTestingGraphSPSite from "./utilities/getTestingGraphSPSite.js";

describe.only("Analytics", function () {
    let testUserName = "";
    let site = null;
    let driveId = null;
    let listResultId = null;
    let listItemId = null;

    const fileOptions = {
        content: "This is some test content",
        filePathName: "pnpTest.txt",
        contentType: "text/plain;charset=utf-8",
    };
    const sampleList: List = {
        displayName: "PnPGraphTestListItemAnalytics",
        list: { "template": "genericList" },
    };

    // Ensure we have the data to test against
    before(async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        // Create a sample list
        try {
            site = await getTestingGraphSPSite(this);
            const listResult = await site.lists.add(sampleList);
            listResultId = listResult.data.id;
            const listItemProps: any = {
                fields: {
                    title: "Test Item",
                },
            };
            const listItem = await site.lists.getById(listResultId).items.add(listItemProps);
            listItemId = listItem.data.id;
        } catch (err) {
            console.log("Could not create a sample list and item.");
        }
        // Get a sample user
        try {
            testUserName = this.pnp.settings.testUser.substring(this.pnp.settings.testUser.lastIndexOf("|") + 1);
            const drives = await this.pnp.graph.users.getById(testUserName).drives();
            if (drives.length > 0) {
                driveId = drives[0].id;
            }
        } catch (err) {
            console.log("Could not retrieve user's drives");
        }
    });

    it("Get Drive Item Analytics - Last Seven Days", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const testFileName = `TestFile_${getRandomString(4)}.txt`;
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        const analytics = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.data.id).analytics();
        return expect(analytics).to.haveOwnProperty("@odata.context").eq("https://graph.microsoft.com/v1.0/$metadata#microsoft.graph.itemActivityStat");
    });

    it("Get List Item Analytics - Last Seven Days", async function () {
        if (stringIsNullOrEmpty(listItemId)) {
            this.skip();
        }
        const analytics = await site.lists.getById(listResultId).items.getById(listItemId).analytics();
        return expect(analytics).to.haveOwnProperty("@odata.context").eq("https://graph.microsoft.com/v1.0/$metadata#microsoft.graph.itemActivityStat");
    });

    it("Get Site Analytics - Last Seven Days", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const site = this.pnp.graph.sites.getById(this.pnp.settings.graph.id);
        const analytics = await site.analytics();
        return expect(analytics).to.haveOwnProperty("@odata.context").eq("https://graph.microsoft.com/v1.0/$metadata#microsoft.graph.itemActivityStat");
    });

    it("Get Drive Item Analytics - All Time", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const testFileName = `TestFile_${getRandomString(4)}.txt`;
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        const options: IAnalyticsOptions = { timeRange: "allTime" };
        const analytics = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.data.id).analytics(options);
        return expect(analytics).to.haveOwnProperty("@odata.context").eq("https://graph.microsoft.com/v1.0/$metadata#microsoft.graph.itemActivityStat");
    });

    it("Get List Item Analytics - All Time", async function () {
        if (stringIsNullOrEmpty(listItemId)) {
            this.skip();
        }
        const options: IAnalyticsOptions = { timeRange: "allTime" };
        const analytics = await site.lists.getById(listResultId).items.getById(listItemId).analytics(options);
        return expect(analytics).to.haveOwnProperty("@odata.context").eq("https://graph.microsoft.com/v1.0/$metadata#microsoft.graph.itemActivityStat");
    });

    it("Get Site Analytics - All Time", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const site = this.pnp.graph.sites.getById(this.pnp.settings.graph.id);
        const options: IAnalyticsOptions = { timeRange: "allTime" };
        const analytics = await site.analytics(options);
        return expect(analytics).to.haveOwnProperty("@odata.context").eq("https://graph.microsoft.com/v1.0/$metadata#microsoft.graph.itemActivityStat");
    });

    // Remove the test contact we created
    after(async function () {

        if (!stringIsNullOrEmpty(listResultId)) {
            try {
                await site.lists.getById(listResultId).delete();
            } catch (err) {
                console.error(`Cannot clean up test contact: ${listResultId}`);
            }
        }
        return;
    });
});

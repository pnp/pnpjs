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
import getValidUser from "./utilities/getValidUser.js";
import { pnpTest } from "../pnp-test.js";
import { IUser } from "@pnp/graph/users";

describe("Analytics", function () {
    let user: IUser = null;
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
    before(pnpTest("6ffe9e49-a6d0-48a5-9adb-64cd85f7ef73", async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const userInfo = await getValidUser.call(this);
        user = this.pnp.graph.users.getById(userInfo.userPrincipalName);

        // Create a sample list
        try {
            site = await getTestingGraphSPSite(this);
            const props = await this.props({
                title: "Test Item",
            });

            const listResult = await site.lists.add(sampleList);
            listResultId = listResult.id;
            const listItemProps: any = {
                title: props.title,
            };
            const listItem = await site.lists.getById(listResultId).items.add(listItemProps);
            listItemId = listItem.id;
        } catch (err) {
            console.log("Could not create a sample list and item.");
        }
        // Get a sample user
        try {
            const drives = await user.drives();
            if (drives.length > 0) {
                driveId = drives[0].id;
            }
        } catch (err) {
            console.log("Could not retrieve user's drives");
        }

        if (listResultId === null || listItemId === null || driveId === null) {
            this.skip();
        }
    }));

    it("Get Drive Item Analytics - Last Seven Days", pnpTest("4915eeb3-97cf-447c-b7a6-d4ab445a41b9", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const props = await this.props({
            testFileName: `TestFile_${getRandomString(4)}.txt`,
        });
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = props.testFileName;
        const children = await user.drives.getById(driveId).root.upload(fo);
        const analytics = await user.drives.getById(driveId).getItemById(children.id).analytics();
        return expect(analytics).to.haveOwnProperty("@odata.context").eq("https://graph.microsoft.com/v1.0/$metadata#microsoft.graph.itemActivityStat");
    }));

    // Analytics is not working on list items, returning item not found error.
    it.skip("Get List Item Analytics - Last Seven Days", pnpTest("48aeeeca-0301-4af1-a47c-dd60e9ba459b", async function () {
        if (stringIsNullOrEmpty(listItemId)) {
            this.skip();
        }
        const analytics = await site.lists.getById(listResultId).items.getById(listItemId).analytics();
        return expect(analytics).to.haveOwnProperty("@odata.context").eq("https://graph.microsoft.com/v1.0/$metadata#microsoft.graph.itemActivityStat");
    }));

    it("Get Site Analytics - Last Seven Days", pnpTest("815b48d8-7604-4883-b085-59de28493d77", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const analytics = await site.analytics();
        return expect(analytics).to.haveOwnProperty("@odata.context").eq("https://graph.microsoft.com/v1.0/$metadata#microsoft.graph.itemActivityStat");
    }));

    it("Get Drive Item Analytics - All Time", pnpTest("721f17f5-836e-4c8d-a52a-a3b7068ac07d", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }

        const props = await this.props({
            testFileName: `TestFile_${getRandomString(4)}.txt`,
        });
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = props.testFileName;
        const children = await user.drives.getById(driveId).root.upload(fo);
        const options: IAnalyticsOptions = { timeRange: "allTime" };
        const analytics = await user.drives.getById(driveId).getItemById(children.id).analytics(options);
        return expect(analytics).to.haveOwnProperty("@odata.context").eq("https://graph.microsoft.com/v1.0/$metadata#microsoft.graph.itemActivityStat");
    }));

    // Analytics is not working on list items, returning item not found error.
    it.skip("Get List Item Analytics - All Time", pnpTest("37ffc5dc-ed88-4442-b7d7-aac068d25bbf", async function () {
        if (stringIsNullOrEmpty(listItemId)) {
            this.skip();
        }
        const options: IAnalyticsOptions = { timeRange: "allTime" };
        const analytics = await site.lists.getById(listResultId).items.getById(listItemId).analytics(options);
        return expect(analytics).to.haveOwnProperty("@odata.context").eq("https://graph.microsoft.com/v1.0/$metadata#microsoft.graph.itemActivityStat");
    }));

    it("Get Site Analytics - All Time", pnpTest("94d06ed1-9414-4c39-be5a-0c0553b7a882", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const options: IAnalyticsOptions = { timeRange: "allTime" };
        const analytics = await site.analytics(options);
        return expect(analytics).to.haveOwnProperty("@odata.context").eq("https://graph.microsoft.com/v1.0/$metadata#microsoft.graph.itemActivityStat");
    }));

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

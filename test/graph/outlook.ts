import { expect } from "chai";
import { graph } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/outlook";
import { testSettings } from "../main";
import { OutlookCategory } from "@microsoft/microsoft-graph-types";
import { getRandomString } from "@pnp/common";

describe("Outlook", function () {
    // We can't test for graph.me calls in an application context
    if (testSettings.enableWebTests) {

        it("Get current Outlook user", async function () {
            const outlookUser = await graph.me.outlook();
            return expect(outlookUser).is.not.null;
        });

        it("Get all categories for current user", async function () {
            const categories = await graph.me.outlook.masterCategories();
            return expect(categories.length).is.gt(0);
        });

        it("Add category for current user", async function () {
            // there is no method to clean up after add, so generate a random name
            const presetCategory: OutlookCategory = {
                displayName: `Test category-${getRandomString(8)}`,
                color: "preset2",
            };

            const addedCategory = await graph.me.outlook.masterCategories.add(presetCategory);

            return expect(addedCategory).is.not.null;
        });
    }
});

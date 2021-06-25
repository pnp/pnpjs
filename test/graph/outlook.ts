import { expect } from "chai";
import { graph } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/outlook";
import { testSettings } from "../main";
import { OutlookCategory } from "@microsoft/microsoft-graph-types";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";

import getValidUser from "./utilities/getValidUser.js";

describe("Outlook", function () {
    if (testSettings.enableWebTests) {
        let testUserName = "";
        const testCategoryList: string[] = [];

        // Ensure we have the data to test against
        this.beforeAll(async function () {

            const userInfo = await getValidUser();
            testUserName = userInfo.userPrincipalName;

        });

        // Clean up testing categories
        this.afterAll(async function () {
            if (!stringIsNullOrEmpty(testUserName) && testCategoryList.length > 0) {
                for (let i = 0; i < testCategoryList.length; i++) {
                    await graph.users.getById(testUserName).outlook.masterCategories.getById(testCategoryList[i]).delete();
                }
            }
        });

        it("Get current Outlook user", async function () {
            const outlookUser = await graph.users.getById(testUserName).outlook();
            return expect(outlookUser).is.not.null;
        });

        it("Get all categories for current user", async function () {
            const categories = await graph.users.getById(testUserName).outlook.masterCategories();
            return expect(categories.length).is.gt(0);
        });

        it("Add category for current user", async function () {
            // there is no method to clean up after add, so generate a random name
            const testCategory: OutlookCategory = {
                displayName: `Test category-${getRandomString(8)}`,
                color: "preset2",
            };

            const addedCategory = await graph.users.getById(testUserName).outlook.masterCategories.add(testCategory);
            testCategoryList.push(addedCategory.data.id);

            return expect(addedCategory).is.not.null;
        });

        it("Modify category for current user", async function () {
            const testCategory: OutlookCategory = {
                displayName: `Test category-${getRandomString(8)}`,
                color: "preset2",
            };

            const addedCategory = await graph.users.getById(testUserName).outlook.masterCategories.add(testCategory);
            testCategoryList.push(addedCategory.data.id);

            const updateCategory: OutlookCategory = {
                color: "preset3",
            };

            const updatedCategory = graph.users.getById(testUserName).outlook.masterCategories.getById(addedCategory.data.id).update(updateCategory);

            return expect(updatedCategory).to.eventually.be.fulfilled;
        });

        it("Delete category for current user", async function () {
            const testCategory: OutlookCategory = {
                displayName: `Test category-${getRandomString(8)}`,
                color: "preset2",
            };

            const addedCategory = await graph.users.getById(testUserName).outlook.masterCategories.add(testCategory);

            const deleteCategory = graph.users.getById(testUserName).outlook.masterCategories.getById(addedCategory.data.id).delete();

            return expect(deleteCategory).to.eventually.be.fulfilled;
        });
    }
});

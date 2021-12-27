import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/outlook";
import { getGraph } from "../main.js";
import { GraphFI } from "@pnp/graph";
import { OutlookCategory } from "@microsoft/microsoft-graph-types";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";

import getValidUser from "./utilities/getValidUser.js";

describe("Outlook", function () {

    let _graphfi: GraphFI = null;
    let testUserName = "";
    const testCategoryList: string[] = [];

    // Ensure we have the data to test against
    this.beforeAll(async function () {

        if (!this.settings.enableWebTests || stringIsNullOrEmpty(this.settings.testUser)) {
            this.skip();
        }

        _graphfi = getGraph();
        const userInfo = await getValidUser(this.settings.testUser);
        testUserName = userInfo.userPrincipalName;
    });

    // Clean up testing categories
    this.afterAll(async function () {
        if (!stringIsNullOrEmpty(testUserName) && testCategoryList.length > 0) {
            for (let i = 0; i < testCategoryList.length; i++) {
                await _graphfi.users.getById(testUserName).outlook.masterCategories.getById(testCategoryList[i]).delete();
            }
        }
    });

    it("outlook", async function () {
        const outlookUser = await _graphfi.users.getById(testUserName).outlook();
        return expect(outlookUser).is.not.null;
    });

    describe("Master Categories", function () {
        it("masterCategories", async function () {
            const categories = await _graphfi.users.getById(testUserName).outlook.masterCategories();
            return expect(categories.length).is.gt(0);
        });

        it("add", async function () {
            // there is no method to clean up after add, so generate a random name
            const testCategory: OutlookCategory = {
                displayName: `Test category-${getRandomString(8)}`,
                color: "preset2",
            };

            const addedCategory = await _graphfi.users.getById(testUserName).outlook.masterCategories.add(testCategory);
            testCategoryList.push(addedCategory.data.id);

            return expect(addedCategory).is.not.null;
        });

        it("update", async function () {
            const testCategory: OutlookCategory = {
                displayName: `Test category-${getRandomString(8)}`,
                color: "preset2",
            };

            const addedCategory = await _graphfi.users.getById(testUserName).outlook.masterCategories.add(testCategory);
            testCategoryList.push(addedCategory.data.id);

            const updateCategory: OutlookCategory = {
                color: "preset3",
            };

            const updatedCategory = _graphfi.users.getById(testUserName).outlook.masterCategories.getById(addedCategory.data.id).update(updateCategory);

            return expect(updatedCategory).to.eventually.be.fulfilled;
        });

        it("delete", async function () {
            const testCategory: OutlookCategory = {
                displayName: `Test category-${getRandomString(8)}`,
                color: "preset2",
            };

            const addedCategory = await _graphfi.users.getById(testUserName).outlook.masterCategories.add(testCategory);

            const deleteCategory = _graphfi.users.getById(testUserName).outlook.masterCategories.getById(addedCategory.data.id).delete();

            return expect(deleteCategory).to.eventually.be.fulfilled;
        });
    });
});

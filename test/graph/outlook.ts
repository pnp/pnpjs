import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/outlook";
import { OutlookCategory } from "@microsoft/microsoft-graph-types";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import getValidUser from "./utilities/getValidUser.js";

describe("Outlook", function () {

    let testUserName = "";
    const testCategoryList: string[] = [];

    // Ensure we have the data to test against
    before(async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const userInfo = await getValidUser.call(this);
        testUserName = userInfo.userPrincipalName;
    });

    // Clean up testing categories
    after(async function () {
        if (!stringIsNullOrEmpty(testUserName) && testCategoryList.length > 0) {
            for (let i = 0; i < testCategoryList.length; i++) {
                const testCategoryListId = testCategoryList[i];
                try {
                    await this.pnp.graph.users.getById(testUserName).outlook.masterCategories.getById(testCategoryListId).delete();
                } catch (err) {
                    // Do nothing, can't clean up
                    console.error(`Cannot clean up test category: ${testCategoryListId}`);
                }
            }
        }
        return;
    });

    it("outlook", async function () {
        const outlookUser = await this.pnp.graph.users.getById(testUserName).outlook();
        return expect(outlookUser).is.not.null;
    });

    describe("Master Categories", function () {
        it("masterCategories", async function () {
            const categories = await this.pnp.graph.users.getById(testUserName).outlook.masterCategories();
            return expect(categories.length).is.gt(0);
        });

        it("add", async function () {
            // there is no method to clean up after add, so generate a random name
            const testCategory: OutlookCategory = {
                displayName: `Test category-${getRandomString(8)}`,
                color: "preset2",
            };

            const addedCategory = await this.pnp.graph.users.getById(testUserName).outlook.masterCategories.add(testCategory);
            testCategoryList.push(addedCategory.data.id);

            return expect(addedCategory).is.not.null;
        });

        it("update", async function () {
            const testCategory: OutlookCategory = {
                displayName: `Test category-${getRandomString(8)}`,
                color: "preset2",
            };

            const addedCategory = await this.pnp.graph.users.getById(testUserName).outlook.masterCategories.add(testCategory);
            testCategoryList.push(addedCategory.data.id);

            const updateCategory: OutlookCategory = {
                color: "preset3",
            };

            const updatedCategory = this.pnp.graph.users.getById(testUserName).outlook.masterCategories.getById(addedCategory.data.id).update(updateCategory);

            return expect(updatedCategory).to.eventually.be.fulfilled;
        });

        it("delete", async function () {
            const testCategory: OutlookCategory = {
                displayName: `Test category-${getRandomString(8)}`,
                color: "preset2",
            };

            const addedCategory = await this.pnp.graph.users.getById(testUserName).outlook.masterCategories.add(testCategory);

            const deleteCategory = this.pnp.graph.users.getById(testUserName).outlook.masterCategories.getById(addedCategory.data.id).delete();

            return expect(deleteCategory).to.eventually.be.fulfilled;
        });
    });
});

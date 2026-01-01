import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/mail";
import { OutlookCategory } from "@microsoft/microsoft-graph-types";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import getValidUser from "./utilities/getValidUser.js";
import { pnpTest } from "../pnp-test.js";

describe("Mail: Categories", function () {

    let testUserName = "";
    const testCategoryList: string[] = [];

    // Ensure we have the data to test against
    before(pnpTest("3bbcc618-05c3-4412-9576-4a049dcfe8bb",async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const userInfo = await getValidUser.call(this);
        testUserName = userInfo.userPrincipalName;
    }));

    // Clean up testing categories
    after(pnpTest("39c7859d-f5ac-464a-a866-6000ca1f006e", async function () {
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
    }));

    it("Mail: Categories", pnpTest("e78201c2-070a-4778-9802-b95b314adfd7", async function () {
        const outlookUser = await this.pnp.graph.users.getById(testUserName).outlook();
        return expect(outlookUser).is.not.null;
    }));

    describe("Master Categories", function () {
        it("masterCategories", pnpTest("9338742b-8d3a-4a48-8f17-d0bd04d2eb37", async function () {
            const categories = await this.pnp.graph.users.getById(testUserName).outlook.masterCategories();
            return expect(categories.length).is.gt(0);
        }));

        it("add", pnpTest("a946daa6-71b1-47d6-b47c-f97e9212c10f", async function () {
            // there is no method to clean up after add, so generate a random name
            const testCategory: OutlookCategory = await this.props({
                displayName: `Test category-${getRandomString(8)}`,
                color: "preset2",
            });
            const addedCategory = await this.pnp.graph.users.getById(testUserName).outlook.masterCategories.add(testCategory);
            testCategoryList.push(addedCategory.id);

            return expect(addedCategory).is.not.null;
        }));

        it("update", pnpTest("db7b3b65-f094-486a-8c83-197353725ba9", async function () {
            const testCategory: OutlookCategory = await this.props({
                displayName: `Test category-${getRandomString(8)}`,
                color: "preset2",
            });

            const addedCategory = await this.pnp.graph.users.getById(testUserName).outlook.masterCategories.add(testCategory);
            testCategoryList.push(addedCategory.id);

            const updateCategory: OutlookCategory = {
                color: "preset3",
            };

            const updatedCategory = this.pnp.graph.users.getById(testUserName).outlook.masterCategories.getById(addedCategory.id).update(updateCategory);

            return expect(updatedCategory).to.eventually.be.fulfilled;
        }));

        it("delete", pnpTest("ce338014-9de6-416e-a66e-45e321138431", async function () {
            const testCategory: OutlookCategory = await this.props({
                displayName: `Test category-${getRandomString(8)}`,
                color: "preset2",
            });

            const addedCategory = await this.pnp.graph.users.getById(testUserName).outlook.masterCategories.add(testCategory);

            const deleteCategory = this.pnp.graph.users.getById(testUserName).outlook.masterCategories.getById(addedCategory.id).delete();

            return expect(deleteCategory).to.eventually.be.fulfilled;
        }));
    });
});

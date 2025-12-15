import { expect } from "chai";
import "@pnp/graph/groups";
import "@pnp/graph/users";
import "@pnp/graph/sites";
import "@pnp/graph/lists";
import getTestingGraphSPSite from "./utilities/getTestingGraphSPSite.js";
import { getRandomString } from "@pnp/core";
import { graphPost, GraphCollection, IGraphCollection } from "@pnp/graph";
import { body } from "@pnp/queryable";
import { pnpTest } from "../pnp-test.js";

describe("Groups", function () {

    let itemsCol: IGraphCollection;

    before(pnpTest("30e40639-acb3-4f77-a39d-4d647eeac9c0", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
            return;
        }

        const site = await getTestingGraphSPSite(this);
        const { displayName, title } = await this.props({
            displayName: `Test_${getRandomString(4)}`,
            title: `Test_${getRandomString(4)}`,
        });
        const listInfo = await site.lists.add({
            displayName: displayName,
            list: { "template": "genericList" },
        });

        itemsCol = GraphCollection(site.lists.getById(listInfo.id), "items");

        for (let i = 0; i < 11; i++) {
            await graphPost(itemsCol, body({
                Title: title,
            }));
        }
    }));

    it("pages all users", pnpTest("8fe8318c-a48d-4ab2-bea4-c35e82c071cd", async function () {

        const allUsers = [];

        for await (const users of this.pnp.graph.users.top(20).select("displayName")) {
            allUsers.push(...users);
        }

        expect(allUsers.length).to.be.greaterThan(0);
    }));

    it("pages groups", pnpTest("1ec0183c-cf52-4e21-b148-b599eee2edc1", async function () {

        const allGroups = [];

        for await (const groups of this.pnp.graph.groups.top(20).select("displayName")) {
            allGroups.push(...groups);
        }

        expect(allGroups.length).to.be.greaterThan(0);
    }));

    it("pages items", pnpTest("83aec789-5439-43af-aaf5-f15f47ff78f9", async function () {

        const allItems = [];

        for await (const items of itemsCol) {
            allItems.push(...items);
        }

        expect(allItems.length).to.be.gt(0);
    }));
});

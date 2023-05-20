import { expect } from "chai";
import "@pnp/graph/sites";
import "@pnp/graph/lists";
import { List } from "@microsoft/microsoft-graph-types";
import { ISite } from "@pnp/graph/sites";
import { getRandomString } from "@pnp/core";
import getTestingGraphSPSite from "./utilities/getTestingGraphSPSite.js";

describe("Lists", function () {
    let site: ISite;
    const sampleList: List = {
        displayName: "PnPGraphTestList",
        list: { "template": "genericList" },
    };

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        site = await getTestingGraphSPSite(this);
    });

    it("lists", async function () {
        const lists = await site.lists();
        return expect(lists).to.be.an("array") && expect(lists[0]).to.haveOwnProperty("id");
    });

    it("getById()", async function () {
        let passed = true;
        const lists = await site.lists();
        if (lists.length > 0) {
            const list = await site.lists.getById(lists[0].id)();
            passed = (list.id === lists[0].id);
        }
        return expect(passed).is.true;
    });

    it("add", async function () {
        const listTemplate = JSON.parse(JSON.stringify(sampleList));
        listTemplate.displayName += getRandomString(5) + "Add";
        const list = await site.lists.add(listTemplate);
        await site.lists.getById(list.data.id).delete();
        return expect((list.data.displayName === listTemplate.displayName)).to.be.true;
    });

    it("update", async function () {
        const listTemplate = JSON.parse(JSON.stringify(sampleList));
        listTemplate.displayName += getRandomString(5) + "Update";
        const newListName = `${listTemplate.displayName}-CHANGED`;
        const list = await site.lists.add(listTemplate);
        await site.lists.getById(list.data.id).update({ displayName: newListName });
        const updateList = await site.lists.getById(list.data.id)();
        await site.lists.getById(list.data.id).delete();
        return expect((updateList.displayName === newListName)).to.be.true;
    });

    it("delete", async function () {
        const listTemplate = JSON.parse(JSON.stringify(sampleList));
        listTemplate.displayName += getRandomString(5) + "Delete";
        const list = await site.lists.add(listTemplate);
        await site.lists.getById(list.data.id).delete();
        let deletedList: List = null;
        try {
            deletedList = await site.lists.getById(list.data.id)();
        } catch (err) {
            // do nothing
        }
        return expect(deletedList).to.be.null;
    });
});

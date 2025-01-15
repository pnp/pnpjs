import { expect } from "chai";
import "@pnp/graph/sites";
import "@pnp/graph/lists";
import "@pnp/graph/files";
import { List } from "@microsoft/microsoft-graph-types";
import { ISite } from "@pnp/graph/sites";
import { getRandomString } from "@pnp/core";
import getTestingGraphSPSite from "./utilities/getTestingGraphSPSite.js";
import { pnpTest } from "../pnp-test.js";

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

    it("lists", pnpTest("016307d3-a0e3-4c8c-94e8-4f1c8566ffbd", async function () {
        const lists = await site.lists();
        return expect(lists).to.be.an("array") && expect(lists[0]).to.haveOwnProperty("id");
    }));

    it("getById()", pnpTest("657e7fc0-bf7d-40ed-b903-d75fe0b91d65", async function () {
        let passed = true;
        const lists = await site.lists();
        if (lists.length > 0) {
            const list = await site.lists.getById(lists[0].id)();
            passed = (list.id === lists[0].id);
        }
        return expect(passed).is.true;
    }));

    it("add", pnpTest("a5b3a404-53bb-4895-815d-6681cc36fe7f", async function () {

        const props = await this.props({
            displayName: getRandomString(5) + "Add",
        });

        const listTemplate = JSON.parse(JSON.stringify(sampleList));
        listTemplate.displayName += props.displayName;
        const list = await site.lists.add(listTemplate);
        await site.lists.getById(list.id).delete();
        return expect((list.displayName === listTemplate.displayName)).to.be.true;
    }));

    it("update", pnpTest("a386a85a-03ce-4846-8ca8-2472075694f5", async function () {

        const props = await this.props({
            displayName: getRandomString(5) + "Update",
        });

        const listTemplate = JSON.parse(JSON.stringify(sampleList));
        listTemplate.displayName += props.displayName;
        const newListName = `${listTemplate.displayName}-CHANGED`;
        const list = await site.lists.add(listTemplate);
        await site.lists.getById(list.id).update({ displayName: newListName });
        const updateList = await site.lists.getById(list.id)();
        await site.lists.getById(list.id).delete();
        return expect((updateList.displayName === newListName)).to.be.true;
    }));

    // This logs to the console when it passes, ignore those messages
    it("delete", pnpTest("3d070839-0713-4a3e-a718-f89bb378cbe1", async function () {

        const props = await this.props({
            displayName: getRandomString(5) + "Delete",
        });

        const listTemplate = JSON.parse(JSON.stringify(sampleList));
        listTemplate.displayName += props.displayName;
        const list = await site.lists.add(listTemplate);
        await site.lists.getById(list.id).delete();
        let deletedList: List = null;
        try {
            deletedList = await site.lists.getById(list.id)();
        } catch (err) {
            // do nothing
        }
        return expect(deletedList).to.be.null;
    }));

    it("drive", pnpTest("3a9243d6-738d-4583-b185-ffe0ac4a1158", async function () {
        const lists = await site.lists();
        let listId = "";
        if (lists.length > 0) {
            lists.forEach((o) => {
                if(o.displayName === "Documents"){
                    listId = o.id;
                }
            });
        }
        let listDrive = null;
        if(listId.length > 0){
            listDrive = await site.lists.getById(listId).drive();
        }
        return expect(listDrive).to.not.be.null && expect(listDrive).to.haveOwnProperty("id");
    }));
});

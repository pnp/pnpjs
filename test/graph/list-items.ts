import { expect } from "chai";
import "@pnp/graph/sites";
import "@pnp/graph/lists";
import { List } from "@microsoft/microsoft-graph-types";
import { ISite } from "@pnp/graph/sites";
import { getRandomString } from "@pnp/core";
import getTestingGraphSPSite from "./utilities/getTestingGraphSPSite.js";
import { pnpTest } from "../pnp-test.js";
import { IList } from "@pnp/graph/lists";
import { IListItem } from "@pnp/graph/list-item/types.js";

describe("List-Items", function () {
    let site: ISite;
    let list: IList;
    let item: IListItem;

    const sampleList: List = {
        displayName: "PnPGraphTestList",
        list: { "template": "ItemTestList-Graph" },
    };

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        site = await getTestingGraphSPSite(this);

        const props = await this.props({
            displayName: getRandomString(5) + "Add",
        });

        const listTemplate = JSON.parse(JSON.stringify(sampleList));
        listTemplate.displayName += props.displayName;
        const list = (await site.lists.add(listTemplate)).list;

        // add test items. Document set can be added later
        if(list){
            await list.items.add({Title: `Item ${getRandomString(4)}`} as any);
            await list.items.add({Title: `Item ${getRandomString(4)}`} as any);
        //  can't do  until Graph Drives is done.
            /*  const documentSetCT = await site.contentTypes.getById("0x0120D520")();
            await list.contentTypes.add(documentSetCT);
            // create item
            const itemData = await list.items.select("Id").top(1)<{ Id: number }[]>();
            item = list.items.getById(itemData[0].Id?.toString());

            // add document set version to item
            item.documentSetVersions.add("Test");
        */
        }

    });

    it("items", pnpTest("3e0e16a0-5683-4c3a-aa3d-f35bb6912de1", async function () {
        const items = await list.items();
        return expect(items).to.be.an("array") && expect(items[0]).to.haveOwnProperty("id");
    }));

    it("getById()", pnpTest("6f9592fd-1568-4d9c-a3f5-7f45165d84f2", async function () {
        const itemData = await list.items.select("Id").top(1)<{ Id: number }[]>();
        return expect(itemData[0].Id).is.not.null;
    }));

    it("add", pnpTest("587e280b-0342-4515-a166-1b05cee9f242", async function () {
        // fieldvalueset. ugh. Casting as any.
        const itemAdded = await list.items.add({fields:
            {
                title: getRandomString(5) + "Add",
            },
        } as any);

        return expect((itemAdded.data.id)).is.not.null;
    }));

    it("update", pnpTest("5766613a-51b8-4f88-ba0f-2436d160b86b", async function () {
        // fieldvalueset. ugh. Casting as any.
        const itemUpdated = await item.update({fields:
            {
                title: getRandomString(5) + "Update",
            },
        } as any);


        return expect(itemUpdated).is.not.null;
    }));

    it("delete", pnpTest("e55bf53f-1316-4e47-97c1-b0c0cdd860ef", async function () {
        const item = await list.items.add({fields:
            {
                title: getRandomString(5) + "Add",
            },
        } as any);
        const r = await list.items.filter(`Id eq '${item.data.id}'`)();
        return expect(r.length).to.eq(0);
    }));

    it.skip("documentSetVersions", pnpTest("c2889ca3-0230-4c6e-879d-71cc9cd08e83", async function () {
        const versions = await item.documentSetVersions();
        return expect(versions).to.be.an("array") && expect(versions[0]).to.haveOwnProperty("id");
    }));

    it.skip("documentSetVersions - getById()", pnpTest("35226d93-204b-4877-9041-26e04e437914", async function () {
        const versions = await item.documentSetVersions();

        const version = await item.documentSetVersions.getById(versions[0].id);
        return expect(version).to.not.be.null && expect(version).to.haveOwnProperty("id");
    }));

    it.skip("documentSetVersions - add()", pnpTest("a192e096-fe84-4c2c-adc5-b1b9021c0031", async function () {
        const documentSetVersion = await item.documentSetVersions.add("New Comment");
        return expect(documentSetVersion).to.not.be.null && expect(documentSetVersion).to.haveOwnProperty("id");
    }));

    it.skip("documentSetVersions - restore()", pnpTest("8814b247-4087-4c87-9a8f-af997f7d8745", async function () {
        const restore = await item.documentSetVersions[0].restore();
        return expect(restore).to.be.fulfilled;
    }));

    // Remove the test list we created
    after(async function () {
        if (list) {
            try {
                await list.delete();
            } catch (err) {
                console.error("Cannot clean up test list");
            }
        }
        return;
    });

});

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
    let itemUpdate: IListItem;
    let itemDelete: IListItem;
    let itemDeleteId: string;

    const sampleList: List = {
        displayName: "PnPGraphTestList",
        list: { template: "genericList" },
    };

    before(pnpTest("b4387653-1d11-49f3-b722-8a305f8f6495", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        site = await getTestingGraphSPSite(this);

        const props = await this.props({
            displayName: `Add${getRandomString(5)}`,
        });

        const listTemplate = JSON.parse(JSON.stringify(sampleList));
        listTemplate.displayName += props.displayName;
        list = (await site.lists.add(listTemplate)).list;

        // add test items. Document set can be added later
        if(list){
            const newItem = await list.items.add({Title: `Item ${getRandomString(4)}`} as any);
            itemUpdate = list.items.getById(newItem.id);
            const newItem2 = await list.items.add({Title: `Item ${getRandomString(4)}`} as any);
            itemDeleteId = newItem2.id;
            itemDelete = list.items.getById(newItem2.id);
        }

    }));

    it("items", pnpTest("3e0e16a0-5683-4c3a-aa3d-f35bb6912de1", async function () {
        const items = await list.items();
        return expect(items).to.be.an("array") && expect(items[0]).to.haveOwnProperty("id");
    }));

    it("getById()", pnpTest("6f9592fd-1568-4d9c-a3f5-7f45165d84f2", async function () {
        const itemData = await list.items.select("Id").top(1)<{ Id: number }[]>();
        return expect(itemData[0].Id).is.not.null;
    }));

    it("add", pnpTest("587e280b-0342-4515-a166-1b05cee9f242", async function () {
        const itemAdded = await list.items.add({fields:
            {
                Title: `Add ${getRandomString(5)}`,
            },
        } as any);

        return expect((itemAdded.id)).length.is.gt(0);
    }));

    it("update", pnpTest("5766613a-51b8-4f88-ba0f-2436d160b86b", async function () {
        const newTitle = `Updated ${getRandomString(5)}`;
        const itemUpdated = await itemUpdate.update({fields:
            {
                Title: newTitle,
            },
        } as any);


        return expect(itemUpdated.fields.Title).is.eq(newTitle);
    }));

    it("delete", pnpTest("e55bf53f-1316-4e47-97c1-b0c0cdd860ef", async function () {
        await itemDelete.delete();
        let passed = false;
        try{
            const r = await list.items.getById(itemDeleteId)();
        }catch(err){
            passed = true;
        }
        return expect(passed).to.be.true;
    }));

    it.skip("documentSetVersions", pnpTest("c2889ca3-0230-4c6e-879d-71cc9cd08e83", async function () {
        const versions = await itemUpdate.documentSetVersions();
        return expect(versions).to.be.an("array") && expect(versions[0]).to.haveOwnProperty("id");
    }));

    it.skip("documentSetVersions - getById()", pnpTest("35226d93-204b-4877-9041-26e04e437914", async function () {
        const versions = await itemUpdate.documentSetVersions();

        const version = await itemUpdate.documentSetVersions.getById(versions[0].id);
        return expect(version).to.not.be.null && expect(version).to.haveOwnProperty("id");
    }));

    it.skip("documentSetVersions - add()", pnpTest("a192e096-fe84-4c2c-adc5-b1b9021c0031", async function () {
        const documentSetVersion = await itemUpdate.documentSetVersions.add({comment:"Test Comment"});
        return expect(documentSetVersion).to.not.be.null && expect(documentSetVersion).to.haveOwnProperty("id");
    }));

    it.skip("documentSetVersions - restore()", pnpTest("8814b247-4087-4c87-9a8f-af997f7d8745", async function () {
        const restore = await itemUpdate.documentSetVersions[0].restore();
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

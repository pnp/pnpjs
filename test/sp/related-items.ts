import { expect } from "chai";
import { getSP, testSettings } from "../main.js";
import "@pnp/sp/webs";
import "@pnp/sp/related-items/web";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import "@pnp/sp/folders/list";
import "@pnp/sp/files/folder";
import { IList } from "@pnp/sp/lists";
import { getRandomString } from "@pnp/core";
import { SPFI } from "@pnp/sp";

describe("Related Items", function () {

    let _spfi: SPFI = null;
    let sourceList: IList = null;
    let targetList: IList = null;
    let sourceListName = "";
    let targetListName = "";
    let webUrl = "";

    before(async function () {

        if (!testSettings.enableWebTests) {
            this.skip();
            return;
        }

        _spfi = getSP();

        // we need two lists to use for creating related items.
        const ler1 = await _spfi.web.lists.ensure("RelatedItemsSourceList", "", 107);
        const ler2 = await _spfi.web.lists.ensure("RelatedItemsTargetList", "", 107);

        webUrl = await _spfi.web.select("ServerRelativeUrl")().then(r => r.ServerRelativeUrl);

        sourceList = ler1.list;
        targetList = ler2.list;

        sourceListName = ler1.data.Id;
        targetListName = ler2.data.Id;
    });

    it("addSingleLink", async function () {

        const sourceItem = await sourceList.items.add({ Title: `Item ${getRandomString(4)}` });
        const targetItem = await targetList.items.add({ Title: `Item ${getRandomString(4)}` });
        return expect(_spfi.web.relatedItems.addSingleLink(sourceListName, sourceItem.data.Id, webUrl, targetListName, targetItem.data.Id, webUrl)).to.eventually.be.fulfilled;
    });

    it("addSingleLinkToUrl", async function () {

        const file = await _spfi.web.defaultDocumentLibrary.rootFolder.files
            .addUsingPath(`test${getRandomString(4)}.txt`, "Test File", { Overwrite: true });
        const targetItem = await targetList.items.add({ Title: `Item ${getRandomString(4)}` });

        return expect(_spfi.web.relatedItems.addSingleLinkToUrl(targetListName, targetItem.data.Id, file.data.ServerRelativeUrl)).to.eventually.be.fulfilled;
    });

    it("deleteSingleLink", async function () {

        const sourceItem = await sourceList.items.add({ Title: `Item ${getRandomString(4)}` });
        const targetItem = await targetList.items.add({ Title: `Item ${getRandomString(4)}` });
        await _spfi.web.relatedItems.addSingleLink(sourceListName, sourceItem.data.Id, webUrl, targetListName, targetItem.data.Id, webUrl);

        const promise = _spfi.web.relatedItems.deleteSingleLink(sourceListName, sourceItem.data.Id, webUrl, targetListName, targetItem.data.Id, webUrl);

        return expect(promise).to.eventually.be.fulfilled;
    });

    it("getRelatedItems", async function () {

        const sourceItem = await sourceList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);
        const targetItem = await targetList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);
        await _spfi.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl);

        const targetItem2 = await targetList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);
        await _spfi.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem2.Id, webUrl);

        const items = await _spfi.web.relatedItems.getRelatedItems(sourceListName, sourceItem.Id);

        return expect(items).to.be.an.instanceOf(Array).and.have.lengthOf(2);
    });

    it("getPageOneRelatedItems", async function () {

        const sourceItem = await sourceList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);
        const targetItem = await targetList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);
        await _spfi.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl);

        const targetItem2 = await targetList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);
        await _spfi.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem2.Id, webUrl);

        const items = await _spfi.web.relatedItems.getPageOneRelatedItems(sourceListName, sourceItem.Id);

        return expect(items).to.be.an.instanceOf(Array).and.have.lengthOf(2);
    });
});

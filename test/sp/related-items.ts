import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/related-items/web";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import "@pnp/sp/folders/list";
import "@pnp/sp/files/folder";
import { IList } from "@pnp/sp/lists";
import { getRandomString } from "@pnp/core";


describe("Related Items", function () {

    let sourceList: IList = null;
    let targetList: IList = null;
    let sourceListName = "";
    let targetListName = "";
    let webUrl = "";

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        // we need two lists to use for creating related items.
        const ler1 = await this.pnp.sp.web.lists.ensure("RelatedItemsSourceList", "", 107);
        const ler2 = await this.pnp.sp.web.lists.ensure("RelatedItemsTargetList", "", 107);

        webUrl = await this.pnp.sp.web.select("ServerRelativeUrl")().then(r => r.ServerRelativeUrl);

        sourceList = this.pnp.sp.web.lists.getById(ler1.Id);
        targetList = this.pnp.sp.web.lists.getById(ler2.Id);

        sourceListName = ler1.Id;
        targetListName = ler2.Id;
    });

    it("addSingleLink", async function () {

        const sourceItem = await sourceList.items.add({ Title: `Item ${getRandomString(4)}` });
        const targetItem = await targetList.items.add({ Title: `Item ${getRandomString(4)}` });
        const p = this.pnp.sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl);
        return expect(p).to.eventually.be.fulfilled;
    });

    it("addSingleLinkToUrl", async function () {

        const file = await this.pnp.sp.web.defaultDocumentLibrary.rootFolder.files
            .addUsingPath(`test${getRandomString(4)}.txt`, "Test File", { Overwrite: true });
        const targetItem = await targetList.items.add({ Title: `Item ${getRandomString(4)}` });

        return expect(this.pnp.sp.web.relatedItems.addSingleLinkToUrl(targetListName, targetItem.Id, file.ServerRelativeUrl)).to.eventually.be.fulfilled;
    });

    it("deleteSingleLink", async function () {

        const sourceItem = await sourceList.items.add({ Title: `Item ${getRandomString(4)}` });
        const targetItem = await targetList.items.add({ Title: `Item ${getRandomString(4)}` });
        await this.pnp.sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl);

        const promise = this.pnp.sp.web.relatedItems.deleteSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl);

        return expect(promise).to.eventually.be.fulfilled;
    });

    it("getRelatedItems", async function () {

        const sourceItem = await sourceList.items.add({ Title: `Item ${getRandomString(4)}` });
        const targetItem = await targetList.items.add({ Title: `Item ${getRandomString(4)}` });
        await this.pnp.sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl);

        const targetItem2 = await targetList.items.add({ Title: `Item ${getRandomString(4)}` });
        await this.pnp.sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem2.Id, webUrl);

        const items = await this.pnp.sp.web.relatedItems.getRelatedItems(sourceListName, sourceItem.Id);

        return expect(items).to.be.an.instanceOf(Array).and.have.lengthOf(2);
    });

    it("getPageOneRelatedItems", async function () {

        const sourceItem = await sourceList.items.add({ Title: `Item ${getRandomString(4)}` });
        const targetItem = await targetList.items.add({ Title: `Item ${getRandomString(4)}` });
        await this.pnp.sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl);

        const targetItem2 = await targetList.items.add({ Title: `Item ${getRandomString(4)}` });
        await this.pnp.sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem2.Id, webUrl);

        const items = await this.pnp.sp.web.relatedItems.getPageOneRelatedItems(sourceListName, sourceItem.Id);

        return expect(items).to.be.an.instanceOf(Array).and.have.lengthOf(2);
    });
});

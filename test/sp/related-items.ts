import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/related-items/web";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import "@pnp/sp/folders/list";
import "@pnp/sp/files/folder";
import { IList } from "@pnp/sp/lists";
import { getRandomString } from "@pnp/core";
import { pnpTest } from  "../pnp-test.js";


describe("Related Items", function () {

    let sourceList: IList = null;
    let targetList: IList = null;
    let sourceListName = "";
    let targetListName = "";
    let webUrl = "";

    before(pnpTest("c0bf0039-c28d-4540-b7c5-00b000a47a46", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        // we need two lists to use for creating related items.
        const ler1 = await this.pnp.sp.web.lists.ensure("RelatedItemsSourceList", "", 107);
        const ler2 = await this.pnp.sp.web.lists.ensure("RelatedItemsTargetList", "", 107);

        webUrl = await this.pnp.sp.web.select("ServerRelativeUrl")().then(r => r.ServerRelativeUrl);

        sourceList = ler1.list;
        targetList = ler2.list;

        sourceListName = ler1.data.Id;
        targetListName = ler2.data.Id;
    }));

    it("addSingleLink", pnpTest("473d255a-d9f5-42d1-b641-301fdbb02611", async function () {
        const { title, title2 } = await this.props({
            title: `Item  ${getRandomString(4)}`,
            title2: `Item  ${getRandomString(4)}`,
        });
        const sourceItem = await sourceList.items.add({ Title: title });
        const targetItem = await targetList.items.add({ Title: title2 });
        const p = this.pnp.sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl);
        return expect(p).to.eventually.be.fulfilled;
    }));

    it("addSingleLinkToUrl", pnpTest("c1848c60-6d3d-47e9-b6a8-2bc294606697", async function () {
        const { title,testTitle } = await this.props({
            title: `Item  ${getRandomString(4)}`,
            testTitle: `Test File ${getRandomString(4)}`,
        });
        const file = await this.pnp.sp.web.defaultDocumentLibrary.rootFolder.files
            .addUsingPath(testTitle, "Test File", { Overwrite: true });

        const targetItem = await targetList.items.add({ Title: title });

        return expect(this.pnp.sp.web.relatedItems.addSingleLinkToUrl(targetListName, targetItem.Id, file.ServerRelativeUrl)).to.eventually.be.fulfilled;
    }));

    it("deleteSingleLink", pnpTest("700a3e9b-1a1f-4c0e-9ec5-460ff4f8a990", async function () {
        const { title, title2 } = await this.props({
            title: `Item  ${getRandomString(4)}`,
            title2: `Item  ${getRandomString(4)}`,
        });
        const sourceItem = await sourceList.items.add({ Title: title });
        const targetItem = await targetList.items.add({ Title: title2 });
        await this.pnp.sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl);

        const promise = this.pnp.sp.web.relatedItems.deleteSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl);

        return expect(promise).to.eventually.be.fulfilled;
    }));

    it("getRelatedItems", pnpTest("f5b9d638-217d-4e9a-a99c-8e10bcb20c85", async function () {
        const { title, title2, title3 } = await this.props({
            title: `Item  ${getRandomString(4)}`,
            title2: `Item  ${getRandomString(4)}`,
            title3: `Item  ${getRandomString(4)}`,
        });
        const sourceItem = await sourceList.items.add({ Title: title });
        const targetItem = await targetList.items.add({ Title: title2});
        await this.pnp.sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl);

        const targetItem2 = await targetList.items.add({ Title: title3 });
        await this.pnp.sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem2.Id, webUrl);

        const items = await this.pnp.sp.web.relatedItems.getRelatedItems(sourceListName, sourceItem.Id);

        return expect(items).to.be.an.instanceOf(Array).and.have.lengthOf(2);
    }));

    it("getPageOneRelatedItems", pnpTest("ab6a0315-b7c9-4b2f-8096-9e8c8519c683", async function () {
        const { title, title2, title3 } = await this.props({
            title: `Item  ${getRandomString(4)}`,
            title2: `Item  ${getRandomString(4)}`,
            title3: `Item  ${getRandomString(4)}`,
        });
        const sourceItem = await sourceList.items.add({ Title: title });
        const targetItem = await targetList.items.add({ Title: title2 });
        await this.pnp.sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl);

        const targetItem2 = await targetList.items.add({ Title: title3 });
        await this.pnp.sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem2.Id, webUrl);

        const items = await this.pnp.sp.web.relatedItems.getPageOneRelatedItems(sourceListName, sourceItem.Id);

        return expect(items).to.be.an.instanceOf(Array).and.have.lengthOf(2);
    }));
});

import { expect } from "chai";
import { testSettings } from "../main";
import { sp, extractWebUrl } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/related-items/web";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import "@pnp/sp/folders/list";
import "@pnp/sp/files/folder";
import { IList } from "@pnp/sp/lists";
import { getRandomString } from "@pnp/common";

describe("Related Items", () => {

    if (testSettings.enableWebTests) {

        let sourceList: IList = null;
        let targetList: IList = null;
        let sourceListName = "";
        let targetListName = "";
        const webUrl = extractWebUrl(testSettings.sp.webUrl);

        before(async function () {

            // we need two lists to use for creating related items.
            const ler1 = await sp.web.lists.ensure("RelatedItemsSourceList", "", 107);
            const ler2 = await sp.web.lists.ensure("RelatedItemsTargetList", "", 107);

            sourceList = ler1.list;
            targetList = ler2.list;

            sourceListName = await sourceList.select("Id")().then(r => r.Id);
            targetListName = await targetList.select("Id")().then(r => r.Id);
        });

        it("addSingleLink", async function () {

            const sourceItem = await sourceList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);
            const targetItem = await targetList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);

            return expect(sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl)).to.eventually.be.fulfilled;
        });

        it("addSingleLinkToUrl", async function () {

            const file = await sp.web.defaultDocumentLibrary.rootFolder.files.add(`test${getRandomString(4)}.txt`, "Test File", true).then(r => r.data);
            const targetItem = await targetList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);

            return expect(sp.web.relatedItems.addSingleLinkToUrl(targetListName, targetItem.Id, file.ServerRelativeUrl)).to.eventually.be.fulfilled;
        });

        // I can't figure out a reason for this method to exist or how to really test it.
        it("addSingleLinkFromUrl");

        it("deleteSingleLink", async function () {

            const sourceItem = await sourceList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);
            const targetItem = await targetList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);
            await sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl);

            const p = sp.web.relatedItems.deleteSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl);

            return expect(p).to.eventually.be.fulfilled;
        });

        it("getRelatedItems", async function () {

            const sourceItem = await sourceList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);
            const targetItem = await targetList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);
            await sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl);

            const targetItem2 = await targetList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);
            await sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem2.Id, webUrl);

            const p = sp.web.relatedItems.getRelatedItems(sourceListName, sourceItem.Id);

            return expect(p).to.eventually.be.fulfilled.and.is.instanceOf(Array).and.has.length(2);
        });

        it("getPageOneRelatedItems", async function () {

            const sourceItem = await sourceList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);
            const targetItem = await targetList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);
            await sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl);

            const targetItem2 = await targetList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);
            await sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem2.Id, webUrl);

            const p = sp.web.relatedItems.getPageOneRelatedItems(sourceListName, sourceItem.Id);

            return expect(p).to.eventually.be.fulfilled.and.is.instanceOf(Array).and.has.length(2);
        });
    }
});

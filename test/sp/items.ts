import { getRandomString } from "@pnp/common";
import { testSettings } from "../main";
import { expect } from "chai";
import { sp } from "@pnp/sp";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import { IList } from "@pnp/sp/lists";

describe("Items", () => {

    if (testSettings.enableWebTests) {

        let list: IList = null;

        before(async function () {

            const ler = await sp.web.lists.ensure("ItemTestList", "Used to test item operations");
            list = ler.list;

            if (ler.created) {

                // add a few items to get started
                const batch = sp.web.createBatch();
                list.items.inBatch(batch).add({ Title: `Item ${getRandomString(4)}` });
                list.items.inBatch(batch).add({ Title: `Item ${getRandomString(4)}` });
                list.items.inBatch(batch).add({ Title: `Item ${getRandomString(4)}` });
                list.items.inBatch(batch).add({ Title: `Item ${getRandomString(4)}` });
                list.items.inBatch(batch).add({ Title: `Item ${getRandomString(4)}` });
                await batch.execute();
            }
        });

        it("get items", async function () {

            const items = await list.items();
            expect(items.length).to.be.gt(0);
        });

        it("get by id", async function () {

            const items = await list.items.select("Id").top(1)();
            const item = items[0];
            return expect(list.items.getById(item.Id)()).to.eventually.be.fulfilled;
        });

        it("get paged", async function () {

            let page = await list.items.top(2).getPaged();
            // tslint:disable-next-line:no-unused-expression
            expect(page.hasNext).to.be.true;
            expect(page.results.length).to.eql(2);
            page = await page.getNext();
            // tslint:disable-next-line:no-unused-expression
            expect(page.hasNext).to.be.true;
            expect(page.results.length).to.eql(2);
        });

        it("get all", async function () {

            const itemCount = await list.select("ItemCount")().then(r => r.ItemCount);
            const page = await list.items.getAll();
            return expect(page.length).to.eq(itemCount);
        });

        it("effectiveBasePermissions", async function () {

            const item = await list.items.top(1)().then(r => r[0]);
            return expect(list.items.getById(item.Id).effectiveBasePermissions()).to.eventually.be.fulfilled;
        });

        it("effectiveBasePermissionsForUI", async function () {

            const item = await list.items.top(1)().then(r => r[0]);
            return expect(list.items.getById(item.Id).effectiveBasePermissionsForUI()).to.eventually.be.fulfilled;
        });

        it("fieldValuesAsHTML", async function () {

            const item = await list.items.top(1)().then(r => r[0]);
            return expect(list.items.getById(item.Id).fieldValuesAsHTML()).to.eventually.be.fulfilled;
        });

        it("fieldValuesAsText", async function () {

            const item = await list.items.top(1)().then(r => r[0]);
            return expect(list.items.getById(item.Id).fieldValuesAsText()).to.eventually.be.fulfilled;
        });

        it("versions", async function () {

            const item = await list.items.top(1)().then(r => r[0]);
            return expect(list.items.getById(item.Id).versions()).to.eventually.be.fulfilled;
        });

        it("list", async function () {

            const item = await list.items.top(1)().then(r => r[0]);
            const listTitle = await list.select("Title")().then(r => r.Title);
            const itemListTitle = await list.items.getById(item.Id).list.select("Title")().then(r => r.Title);
            return expect(listTitle).to.eq(itemListTitle);
        });

        it("update", async function () {

            const item = await list.items.select("Id").top(1)().then(r => r[0]);
            const iur = await list.items.getById(item.Id).update({
                Title: `Item ${getRandomString(4)}`,
            });
            // tslint:disable-next-line:no-unused-expression
            expect(iur).to.not.be.null;
        });

        it("recycle", async function () {

            const item = await list.items.add({
                Title: "Recycle Me",
            });
            return expect(item.item.recycle()).to.eventually.be.fulfilled;
        });

        /**
         * Skipped because only system accounts can call this method for items.
         */
        it.skip("delete item with params", async function () {

            const title = `test_delparams_${getRandomString(4)}`;

            const item = await list.items.add({
                Title: title,
            });

            await item.item.deleteWithParams({
                BypassSharedLock: false,
            });

            const r = await list.items.filter(`Title eq '${title}'`)();
            expect(r.length).to.eq(0);
        });

        it("getWopiFrameUrl", async function () {

            const item = await list.items.select("Id").top(1)().then(r => r[0]);
            return expect(list.items.getById(item.Id).getWopiFrameUrl()).to.eventually.be.fulfilled;
        });
    }
});

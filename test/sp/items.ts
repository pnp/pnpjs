import { getRandomString } from "@pnp/core";
import { expect } from "chai";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import "@pnp/sp/items/get-all";
import "@pnp/sp/batching";
import { IList } from "@pnp/sp/lists";
import testSPInvokables from "../test-invokable-props.js";
import { IItem } from "@pnp/sp/items";

describe("Items", function () {

    let list: IList = null;
    let item: IItem = null;
    const listTitle = "ItemTestList";

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        const ler = await this.pnp.sp.web.lists.ensure(listTitle, "Used to test item operations");
        list = ler.list;

        if (ler.created) {
            // add a few items to get started
            const [spBatch, execute] = this.pnp.sp.batched();
            spBatch.web.lists.getByTitle(listTitle).items.add({ Title: `Item ${getRandomString(4)}` });
            spBatch.web.lists.getByTitle(listTitle).items.add({ Title: `Item ${getRandomString(4)}` });
            spBatch.web.lists.getByTitle(listTitle).items.add({ Title: `Item ${getRandomString(4)}` });
            spBatch.web.lists.getByTitle(listTitle).items.add({ Title: `Item ${getRandomString(4)}` });
            spBatch.web.lists.getByTitle(listTitle).items.add({ Title: `Item ${getRandomString(4)}` });
            await execute();
        }

        const itemData = await this.pnp.sp.web.lists.getByTitle(listTitle).items.select("Id").top(1)<{ Id: number }[]>();
        item = this.pnp.sp.web.lists.getByTitle(listTitle).items.getById(itemData[0].Id);
    });

    after(async function () {
        // Cleanup list
        if (list != null) {
            list.delete();
        }
    });

    describe("Invokable Properties - IItem", testSPInvokables(() => item,
        "effectiveBasePermissions",
        "effectiveBasePermissionsForUI",
        "fieldValuesAsHTML",
        "fieldValuesAsText",
        "fieldValuesForEdit",
        "versions",
        "getParentInfos",
        "list",
        "getWopiFrameUrl"));

    it("items", async function () {

        const items = await list.items();
        expect(items.length).to.be.gt(0);
    });

    it("getById", async function () {

        const items = await list.items.select("Id").top(1)();
        const item = items[0];
        return expect(list.items.getById(item.Id)()).to.eventually.be.fulfilled;
    });

    it("getPaged", async function () {

        let page = await list.items.top(2).getPaged();
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(page.hasNext).to.be.true;
        expect(page.results.length).to.eql(2);
        page = await page.getNext();
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(page.hasNext).to.be.true;
        expect(page.results.length).to.eql(2);
    });

    it("getAll", async function () {

        const itemCount = await list.select("ItemCount")().then(r => r.ItemCount);
        const page = await list.items.getAll();
        return expect(page.length).to.eq(itemCount);
    });


    it("getAll top(2)", async function () {

        const itemCount = await list.select("ItemCount")().then(r => r.ItemCount);
        const page = await list.items.top(2).getAll();
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
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
    it.skip(".deleteWithParams", async function () {

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
});

import { getRandomString } from "@pnp/core";
import { expect } from "chai";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import "@pnp/sp/batching";
import { IList } from "@pnp/sp/lists";
import testSPInvokables from "../test-invokable-props.js";
import { IItem } from "@pnp/sp/items";
import { pnpTest } from  "../pnp-test.js";

describe("Items", function () {

    let list: IList = null;
    let item: IItem = null;
    const listTitle = "ItemTestList";

    before(pnpTest("0ec05f87-f048-4449-918e-a92023173dc2", async function () {

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
    }));

    after(pnpTest("d0fb15a8-5e8c-455e-8769-25a8e860479e", async function () {
        // Cleanup list
        if (list != null) {
            list.delete();
        }
    }));

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

    it("items", pnpTest("f309fd13-c0f7-4fd8-b737-ba7745814e47", async function () {
        const items = await list.items();
        expect(items.length).to.be.gt(0);
    }));

    it("getById", pnpTest("d0d205bb-6130-42a5-89e1-5757a727be8c", async function () {
        const items = await list.items.select("Id").top(1)();
        const item = items[0];
        return expect(list.items.getById(item.Id)()).to.eventually.be.fulfilled;
    }));

    it("getAll", pnpTest("0450474b-3d91-4bb1-bcf3-dda65708c724", async function () {
        const a = [];
        const itemCount = await list.select("ItemCount")().then(r => r.ItemCount);
        for await (const items of list.items) {
            a.push(...items);
        }
        return expect(a.length).to.eq(itemCount);
    }));

    it("effectiveBasePermissions", pnpTest("70faeb62-28be-4393-9d66-eee9594e059f", async function () {
        const item = await list.items.top(1)().then(r => r[0]);
        return expect(list.items.getById(item.Id).effectiveBasePermissions()).to.eventually.be.fulfilled;
    }));

    it("effectiveBasePermissionsForUI", pnpTest("064521fe-20e0-4668-925c-82e7dde81350", async function () {
        const item = await list.items.top(1)().then(r => r[0]);
        return expect(list.items.getById(item.Id).effectiveBasePermissionsForUI()).to.eventually.be.fulfilled;
    }));

    it("fieldValuesAsHTML", pnpTest("51277a8a-b51d-49c9-a1e2-cf3f4fff051f", async function () {
        const item = await list.items.top(1)().then(r => r[0]);
        return expect(list.items.getById(item.Id).fieldValuesAsHTML()).to.eventually.be.fulfilled;
    }));

    it("fieldValuesAsText", pnpTest("a72781e0-6e87-4426-8d1d-3f8aee37ca71", async function () {
        const item = await list.items.top(1)().then(r => r[0]);
        return expect(list.items.getById(item.Id).fieldValuesAsText()).to.eventually.be.fulfilled;
    }));

    it("versions", pnpTest("73cfa267-65cb-4908-bf82-3f992929117d", async function () {
        const item = await list.items.top(1)().then(r => r[0]);
        return expect(list.items.getById(item.Id).versions()).to.eventually.be.fulfilled;
    }));

    it("list", pnpTest("85b7acc5-f47c-4df0-b148-6356b7840bcb", async function () {
        const item = await list.items.top(1)().then(r => r[0]);
        const listTitle = await list.select("Title")().then(r => r.Title);
        const itemListTitle = await list.items.getById(item.Id).list.select("Title")().then(r => r.Title);
        return expect(listTitle).to.eq(itemListTitle);
    }));

    it("update", pnpTest("93aa7d1f-d3ae-4e54-bc84-d06db0d294da", async function () {
        const item = await list.items.select("Id").top(1)().then(r => r[0]);
        const { title } = await this.props({
            title: `Item ${getRandomString(4)}`,
        });
        const iur = await list.items.getById(item.Id).update({
            Title: title,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(iur).to.not.be.null;
    }));

    it("recycle", pnpTest("b930a07a-db10-41ea-b6c6-c5384aecd1af", async function () {
        const r = await list.items.add({
            Title: "Recycle Me",
        });
        const item = list.items.getById(r.Id);
        return expect(item.recycle()).to.eventually.be.fulfilled;
    }));

    /**
     * Skipped because only system accounts can call this method for items.
     */
    it.skip(".deleteWithParams", pnpTest("ab856e12-28c2-41a0-a683-1d4c76ef0eb7", async function () {
        const { title } = await this.props({
            title: `test_delparams_${getRandomString(4)}`,
        });
        const itemAdd = await list.items.add({
            Title: title,
        });
        const item = list.items.getById(itemAdd.Id);

        await item.deleteWithParams({
            BypassSharedLock: false,
        });

        const r = await list.items.filter(`Title eq '${title}'`)();
        expect(r.length).to.eq(0);
    }));

    it("getWopiFrameUrl", pnpTest("10835f10-7594-49f1-aa3a-4fcccfe9dba0", async function () {
        const item = await list.items.select("Id").top(1)().then(r => r[0]);
        return expect(list.items.getById(item.Id).getWopiFrameUrl()).to.eventually.be.fulfilled;
    }));
});

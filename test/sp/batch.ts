import { assert, expect } from "chai";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import "@pnp/sp/files/item";
import "@pnp/sp/folders/list";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/site-users/web";
import { createBatch } from "@pnp/sp/batching";
import { CheckinType } from "@pnp/sp/files";
import { getSP } from "../main.js";
import { SPFI } from "@pnp/sp";
import { AssignFrom, getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { IItem } from "@pnp/sp/items";

describe("Batching", function () {
    this.timeout(120000);

    let _spfi: SPFI = null;

    before(function () {

        if (!this.settings.enableWebTests) {
            this.skip();
        }

        _spfi = getSP();
    });

    it("Single Request", async function () {
        const order: number[] = [];
        const expected: number[] = [1, 2];

        const [batchedSP, execute] = _spfi.batched();

        batchedSP.web().then(function () {
            order.push(1);
        });

        await execute();
        order.push(2);

        return expect(order.toString()).to.eql(expected.toString());
    });

    it("Even # Requests", async function () {
        const order: number[] = [];
        const expected: number[] = [1, 2, 3];

        const [batchedSP, execute] = _spfi.batched();

        batchedSP.web().then(function () {
            order.push(1);
        });

        batchedSP.web.lists().then(function () {
            order.push(2);
        });

        await execute();

        order.push(3);

        return expect(order.toString()).to.eql(expected.toString());
    });

    it("Odd # Requests", async function () {
        const order: number[] = [];
        const expected: number[] = [1, 2, 3, 4];

        const [batchedSP, execute] = _spfi.batched();

        batchedSP.web().then(function () {
            order.push(1);
        });

        batchedSP.web.lists().then(function () {
            order.push(2);
        });

        batchedSP.web.lists.top(1)().then(function () {
            order.push(3);
        });

        await execute();

        order.push(4);
        return expect(order.toString()).to.eql(expected.toString());
    });

    it("Cloned Requests", async function () {
        const order: number[] = [];
        const expected: number[] = [1, 2, 3];
        const listTitle = "BatchItemAddTest";

        const ler = await _spfi.web.lists.ensure(listTitle);

        if (ler.data) {
            const [batchedSP, execute] = _spfi.batched();

            batchedSP.web.lists.getByTitle(listTitle).items.add({ Title: "Hello 1" }).then(function () {
                order.push(1);
            });

            batchedSP.web.lists.getByTitle(listTitle).items.add({ Title: "Hello 2" }).then(function () {
                order.push(2);
            });

            await execute();

            order.push(3);
            return expect(order.toString()).to.eql(expected.toString());
        } else {
            assert.fail(`Did not succesfully create list ${listTitle}`);
        }
    });

    it("Cloned Requests (not items.add)", async function () {

        if (stringIsNullOrEmpty(this.settings.testUser)) {
            this.skip();
        }

        const order: number[] = [];
        const expected: number[] = [1, 2, 3];

        const { Id: groupId } = await _spfi.web.associatedVisitorGroup.select("Id")<{ Id: number }>();

        if (groupId !== undefined) {
            const [batchedSP, execute] = _spfi.batched();

            batchedSP.web.siteGroups.getById(groupId).users().then(function () {
                order.push(1);
            });

            batchedSP.web.siteGroups.getById(groupId).users.add(this.settings.testUser).then(function () {
                order.push(2);
            });

            await execute();

            order.push(3);
            return expect(order.toString()).to.eql(expected.toString());
        } else {
            assert.fail("Did not succesfully retrieve visitors group id");
        }
    });

    it("Complex Ordering", async function () {
        const order: number[] = [];
        const expected: number[] = [1, 2, 3, 4];
        const listTitle = "BatchOrderingTest";

        const ler = await _spfi.web.lists.ensure(listTitle, "", 101);

        // ensure we have a file
        const far = await ler.list.rootFolder.files.addUsingPath(`MyFile${getRandomString(4)}.txt`, "Some content");

        const item = await far.file.getItem();

        const [batchedSP, execute] = _spfi.batched();

        // reset item to use batching even though it was created elsewhere
        item.using(AssignFrom(batchedSP.web));

        item.file.checkout().then(function () {
            order.push(1);
        });

        item.update({
            Title: "test.txt",
        }).then(function () {
            order.push(2);
        });

        item.file.checkin("", CheckinType.Major).then(function () {
            order.push(3);
        });

        await execute();

        order.push(4);

        return expect(order.toString()).to.eql(expected.toString());
    });

    it("Web batch", async function () {

        const order: number[] = [];
        const expected: number[] = [1, 2, 3];

        const [batchedWeb, execute] = await _spfi.web.batched();

        batchedWeb().then(() => order.push(1));

        batchedWeb.lists().then(() => order.push(2));

        await execute().then(() => order.push(3));

        return expect(order.toString()).to.eql(expected.toString());
    });

    it("Should work with the same Queryable when properly cloned (Advanced)", async function () {

        const web = _spfi.web;

        const [batchedBehavior, execute] = createBatch(web);
        web.using(batchedBehavior);

        web();
        _spfi.web.using(batchedBehavior)();
        _spfi.web.using(batchedBehavior)();
        _spfi.web.using(batchedBehavior)();

        return expect(execute()).to.eventually.be.fulfilled;
    });

    it("Should work with the same Queryable when properly cloned by factory (Advanced)", async function () {

        const web = _spfi.web;

        const [batchedBehavior, execute] = createBatch(web);
        web.using(batchedBehavior);

        Web(web).using(batchedBehavior)();
        Web(web).using(batchedBehavior)();
        Web(web).using(batchedBehavior)();

        return expect(execute()).to.eventually.be.fulfilled;
    });

    it("Should fail with the same Queryable (Advanced)", async function () {

        const web = _spfi.web;

        const [batchedBehavior, execute] = createBatch(web);
        web.using(batchedBehavior);

        web();

        const p = web();

        const p2 = execute();

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(p).to.eventually.be.rejected;

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(p2).to.eventually.be.fulfilled;
    });

    it.only("Should rebase all objects to allow queries on returned objects", async function () {

        const res: IItem[] = [];
        const ids: number[] = [];
        const titles = [
            getRandomString(5),
            getRandomString(5),
            getRandomString(5),
        ];

        const titles2 = [
            getRandomString(5),
            getRandomString(5),
            getRandomString(5),
        ];

        const listName = "BatchTestRebase";
        const { list } = await _spfi.web.lists.ensure(listName);

        const [batchedBehavior, execute] = createBatch(list);
        list.using(batchedBehavior);
        list.on.log((m) => {

            console.log(m);
        });

        for (let i = 0; i < 3; i++) {
            list.items.add({ Title: titles[i] }).then(r => {
                ids.push(r.data.Id);
                res.push(r.item);
            });
        }

        await execute();

        for (let i = 0; i < 3; i++) {
            const y = await res[i].select("Title")();
            expect(y).to.haveOwnProperty("Title", titles[i]);
        }

        const updateList = _spfi.web.lists.getByTitle(listName);
        const [batchedBehavior2, execute2] = createBatch(updateList);
        updateList.using(batchedBehavior2);
        updateList.on.log((m) => {

            console.log(m);
        });

        res.length = 0;

        for (let i = 0; i < 3; i++) {
            updateList.items.getById(ids[i]).update({
                Title: titles2[i],
            }).then(r => {
                res.push(r.item);
            });
        }

        await execute2();

        for (let i = 0; i < 3; i++) {
            const y = await res[i].select("Title")();
            expect(y).to.haveOwnProperty("Title", titles2[i]);
        }
    });
});

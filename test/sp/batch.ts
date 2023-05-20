import { assert, expect } from "chai";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import "@pnp/sp/files/item";
import "@pnp/sp/folders/list";
import "@pnp/sp/lists";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/site-users/web";
import { createBatch } from "@pnp/sp/batching";
import { CheckinType } from "@pnp/sp/files";
import { AssignFrom, getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { IItem } from "@pnp/sp/items";
import { pnpTest } from "../pnp-test.js";

describe("Batching", function () {

    let listId = "";

    before(pnpTest("a43c9e3a-4851-4b64-9818-cda698380aff", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        const props = await this.props({
            listTitle: `BatchingTest_${getRandomString(4)}`,
        });

        const { data, created } = await this.pnp.sp.web.lists.ensure(props.listTitle);

        listId = data.Id;

        if (created) {

            const [batch, execute] = this.pnp.sp.web.batched();

            const list = batch.lists.getById(data.Id);

            list.items.add({
                Title: "Item 1",
            });

            list.items.add({
                Title: "Item 2",
            });

            list.items.add({
                Title: "Item 3",
            });

            await execute();
        }

    }));

    it("Single Request", pnpTest("7fdd5c90-d114-409e-b4c2-cdd5e4d8f55e", async function () {
        const order: number[] = [];
        const expected: number[] = [1, 2];

        const [batchedSP, execute] = this.pnp.sp.batched();

        batchedSP.web().then(function () {
            order.push(1);
        });

        await execute();
        order.push(2);

        return expect(order.toString()).to.eql(expected.toString());
    }));

    it("Even # Requests", pnpTest("ef00c520-fa8f-4395-b47d-c11d3f114a32", async function () {
        const order: number[] = [];
        const expected: number[] = [1, 2, 3];

        const [batchedSP, execute] = this.pnp.sp.batched();

        batchedSP.web().then(function () {
            order.push(1);
        });

        batchedSP.web.lists().then(function () {
            order.push(2);
        });

        await execute();

        order.push(3);

        return expect(order.toString()).to.eql(expected.toString());
    }));

    it("Odd # Requests", pnpTest("56318b9d-6808-4caf-bb80-5fb83a196bb6", async function () {
        const order: number[] = [];
        const expected: number[] = [1, 2, 3, 4];

        const [batchedSP, execute] = this.pnp.sp.batched();

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
    }));

    it("Cloned Requests", pnpTest("e663666a-21cf-4953-b6e1-055aa08623c8", async function () {
        const order: number[] = [];
        const expected: number[] = [1, 2, 3];

        const props = await this.props({
            listTitle: "BatchItemAddTest",
        });

        const ler = await this.pnp.sp.web.lists.ensure(props.listTitle);

        if (ler.data) {
            const [batchedSP, execute] = this.pnp.sp.batched();

            batchedSP.web.lists.getByTitle(props.listTitle).items.add({ Title: "Hello 1" }).then(function () {
                order.push(1);
            });

            batchedSP.web.lists.getByTitle(props.listTitle).items.add({ Title: "Hello 2" }).then(function () {
                order.push(2);
            });

            await execute();

            order.push(3);

            return expect(order.toString()).to.eql(expected.toString());

        } else {

            assert.fail(`Did not succesfully create list ${props.listTitle}`);
        }
    }));

    it("Cloned Requests (not items.add)", pnpTest("3a0cfb90-3f86-44ea-b573-6f2d22339e9d", async function () {

        if (stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const order: number[] = [];
        const expected: number[] = [1, 2, 3];

        const { Id: groupId } = await this.pnp.sp.web.associatedVisitorGroup.select("Id")<{ Id: number }>();

        if (groupId !== undefined) {
            const [batchedSP, execute] = this.pnp.sp.batched();

            batchedSP.web.siteGroups.getById(groupId).users().then(function () {
                order.push(1);
            });

            batchedSP.web.siteGroups.getById(groupId).users.add(this.pnp.settings.testUser).then(function () {
                order.push(2);
            });

            await execute();

            order.push(3);
            return expect(order.toString()).to.eql(expected.toString());
        } else {
            assert.fail("Did not succesfully retrieve visitors group id");
        }
    }));

    it("Complex Ordering", pnpTest("5c76caaa-0eac-4afd-8eb2-3ea9d996d48c", async function () {
        const order: number[] = [];
        const expected: number[] = [1, 2, 3, 4];

        const props = await this.props({
            listTitle: "BatchOrderingTest",
            fileName: `MyFile${getRandomString(4)}.txt`,
            fileName2: "test.txt",
            content: "Some content",
        });

        const ler = await this.pnp.sp.web.lists.ensure(props.listTitle, "", 101);

        // ensure we have a file
        const far = await ler.list.rootFolder.files.addUsingPath(props.fileName, props.content);

        const item = await far.file.getItem();

        const [batchedSP, execute] = this.pnp.sp.batched();

        // reset item to use batching even though it was created elsewhere
        item.using(AssignFrom(batchedSP.web));

        item.file.checkout().then(function () {
            order.push(1);
        });

        item.update({
            Title: props.fileName2,
        }).then(function () {
            order.push(2);
        });

        item.file.checkin("", CheckinType.Major).then(function () {
            order.push(3);
        });

        await execute();

        order.push(4);

        return expect(order.sort().toString()).to.eql(expected.toString());
    }));

    it("Web batch", pnpTest("1c62186c-cce9-4359-8386-043bf8081f66", async function () {

        const order: number[] = [];
        const expected: number[] = [1, 2, 3];

        const [batchedWeb, execute] = await this.pnp.sp.web.batched();

        batchedWeb().then(() => order.push(1));

        batchedWeb.lists().then(() => order.push(2));

        await execute().then(() => order.push(3));

        return expect(order.toString()).to.eql(expected.toString());
    }));

    it("Should work with the same Queryable when properly cloned (Advanced)", pnpTest("91489d5c-453a-4620-b13c-e649876a4660", async function () {

        const web = this.pnp.sp.web;

        const [batchedBehavior, execute] = createBatch(web);
        web.using(batchedBehavior);

        web();
        this.pnp.sp.web.using(batchedBehavior)();
        this.pnp.sp.web.using(batchedBehavior)();
        this.pnp.sp.web.using(batchedBehavior)();

        return expect(execute()).to.eventually.be.fulfilled;
    }));

    it("Should work with the same Queryable when properly cloned by factory (Advanced)", pnpTest("9faa1780-9ca7-493b-b8e3-f00a6dcb116f", async function () {

        const web = this.pnp.sp.web;

        const [batchedBehavior, execute] = createBatch(web);
        web.using(batchedBehavior);

        Web(web).using(batchedBehavior)();
        Web(web).using(batchedBehavior)();
        Web(web).using(batchedBehavior)();

        return expect(execute()).to.eventually.be.fulfilled;
    }));

    it("Should fail with the same Queryable (Advanced)", pnpTest("d9535bc2-c59a-49ba-8666-b3d80510aca5", async function () {

        const web = this.pnp.sp.web;

        const [batchedBehavior, execute] = createBatch(web);
        web.using(batchedBehavior);

        web();

        const p = web();

        const p2 = execute();

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(p).to.eventually.be.rejected;

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(p2).to.eventually.be.fulfilled;
    }));

    it("Should rebase objects to allow queries on returned objects", pnpTest("d9535bc2-c59a-49ba-8666-b3d80510aca5", async function () {

        const props = await this.props({
            listName: "BatchTestRebase",
            titles: [
                getRandomString(5),
                getRandomString(5),
                getRandomString(5),
            ],
            titles2: [
                getRandomString(5),
                getRandomString(5),
                getRandomString(5),
            ],
        });

        const res: IItem[] = [];
        const ids: number[] = [];

        const { list } = await this.pnp.sp.web.lists.ensure(props.listName);

        const [batchedBehavior, execute] = createBatch(list);
        list.using(batchedBehavior);

        for (let i = 0; i < 3; i++) {
            list.items.add({ Title: props.titles[i] }).then(r => {
                ids.push(r.data.Id);
                res.push(r.item);
            });
        }

        await execute();

        for (let i = 0; i < 3; i++) {
            const y = await res[i].select("Title")();
            expect(y, `Failed on add then select title ${i}`).to.haveOwnProperty("Title", props.titles[i]);
        }

        const updateList = this.pnp.sp.web.lists.getByTitle(props.listName);
        const [batchedBehavior2, execute2] = createBatch(updateList);
        updateList.using(batchedBehavior2);

        res.length = 0;

        for (let i = 0; i < 3; i++) {
            updateList.items.getById(ids[i]).update({
                Title: props.titles2[i],
            }).then(r => {
                res.push(r.item);
            });
        }

        await execute2();

        for (let i = 0; i < 3; i++) {
            const y = await res[i].select("Title")();
            expect(y, `Failed on update then select title ${i}`).to.haveOwnProperty("Title", props.titles2[i]);
        }
    }));

    it("Should work for multi-line responses (renderListDataAsStream)", pnpTest("b0192288-db64-496e-a306-61a6f8f6b7a4", async function () {

        const [batch, execute] = this.pnp.sp.web.batched();

        batch.lists.getById(listId).renderListDataAsStream({ AddAllFields: true }).then(v => {

            expect(v).to.have.property("Row").is.a("Array");
        });

        await execute();
    }));
});

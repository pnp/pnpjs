import { expect } from "chai";
import { Web } from "@pnp/sp/src/webs";
import "@pnp/sp/src/lists/web";
import "@pnp/sp/src/items/list";
import "@pnp/sp/src/site-groups/web";
import "@pnp/sp/src/site-users/web";
import { testSettings } from "../main";

describe("Batching", () => {

    if (testSettings.enableWebTests) {

        it("Should execute batches in the expected order for a single request", async function () {

            const web = Web(testSettings.sp.webUrl);

            const order: number[] = [];

            const batch = web.createBatch();

            web.inBatch(batch).get().then(_ => {
                order.push(1);
            });

            await batch.execute();
            order.push(2);

            expect(order).to.eql([1, 2]);
        });

        it("Should execute batches in the expected order for an even number of requests", async function () {

            const web = Web(testSettings.sp.webUrl);

            const order: number[] = [];

            const batch = web.createBatch();

            web.inBatch(batch)().then(_ => {
                order.push(1);
            });

            web.lists.inBatch(batch)().then(_ => {
                order.push(2);
            });

            web.lists.top(2).inBatch(batch)().then(_ => {
                order.push(3);
            });

            web.lists.select("Title").inBatch(batch)().then(_ => {
                order.push(4);
            });

            await batch.execute();

            order.push(5);

            expect(order).eql([1, 2, 3, 4, 5]);
        });

        it("Should execute batches in the expected order for an odd number of requests", async function () {

            const web = Web(testSettings.sp.webUrl);

            const order: number[] = [];

            const batch = web.createBatch();

            web.inBatch(batch)().then(_ => {
                order.push(1);
            });

            web.lists.inBatch(batch)().then(_ => {
                order.push(2);
            });

            web.lists.top(2).inBatch(batch)().then(_ => {
                order.push(3);
            });

            await batch.execute();
            order.push(4);

            expect(order).to.eql([1, 2, 3, 4]);
        });

        it("Should execute batches that have internally cloned requests", async function () {

            const web = Web(testSettings.sp.webUrl);

            const order: number[] = [];

            const batch = web.createBatch();

            const ler = await web.lists.ensure("BatchItemAddTest");

            const list = ler.list;

            const entityType = await list.getListItemEntityTypeFullName();

            list.items.inBatch(batch).add({ Title: "Hello 1" }, entityType).then(_ => order.push(1));

            list.items.inBatch(batch).add({ Title: "Hello 2" }, entityType).then(_ => order.push(2));

            await batch.execute();

            order.push(3);

            expect(order).to.eql([1, 2, 3]);
        });

        it("Should execute batches that have internally cloned requests but aren't items.add", async function () {

            const web = Web(testSettings.sp.webUrl);

            const order = [];

            const batch = web.createBatch();

            const groupId = await web.associatedVisitorGroup.select("id")().then(r => r.Id);
            const loginName = await web.siteUsers.top(1).select("loginName")().then(r => r[0].LoginName);

            web.siteGroups.getById(groupId).users.inBatch(batch)().then(() => {
                order.push(1);
            });

            web.siteGroups.getById(groupId).users.inBatch(batch).add(loginName).then(() => {
                order.push(2);
            });

            web.siteGroups.getById(groupId).users.inBatch(batch).get().then(() => {
                order.push(3);
            });

            await batch.execute();
            order.push(4);
            expect(order).to.eql([1, 2, 3, 4]);
        });
    }
});

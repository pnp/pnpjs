import { expect } from "chai";
import { Web } from "../";
import { testSettings } from "../../../test/main";

describe("Batching", () => {

    if (testSettings.enableWebTests) {

        it("Should execute batches in the expected order for a single request", () => {

            const web = new Web(testSettings.sp.webUrl);

            const order: number[] = [];

            const batch = web.createBatch();

            web.inBatch(batch).get().then(_ => {
                order.push(1);
            });

            return expect(batch.execute().then(_ => {
                order.push(2);
                return order;
            })).to.eventually.be.fulfilled.and.eql([1, 2]);
        });

        it("Should execute batches in the expected order for an even number of requests", () => {

            const web = new Web(testSettings.sp.webUrl);

            const order: number[] = [];

            const batch = web.createBatch();

            web.inBatch(batch).get().then(_ => {
                order.push(1);
            });

            web.lists.inBatch(batch).get().then(_ => {
                order.push(2);
            });

            web.lists.top(2).inBatch(batch).get().then(_ => {
                order.push(3);
            });

            web.lists.select("Title").inBatch(batch).get().then(_ => {
                order.push(4);
            });

            return expect(batch.execute().then(_ => {
                order.push(5);
                return order;
            })).to.eventually.be.fulfilled.and.eql([1, 2, 3, 4, 5]);
        });

        it("Should execute batches in the expected order for an odd number of requests", () => {

            const web = new Web(testSettings.sp.webUrl);

            const order: number[] = [];

            const batch = web.createBatch();

            web.inBatch(batch).get().then(_ => {
                order.push(1);
            });

            web.lists.inBatch(batch).get().then(_ => {
                order.push(2);
            });

            web.lists.top(2).inBatch(batch).get().then(_ => {
                order.push(3);
            });

            return expect(batch.execute().then(_ => {
                order.push(4);
                return order;
            })).to.eventually.be.fulfilled.and.eql([1, 2, 3, 4]);
        });

        it("Should execute batches that have internally cloned requests", () => {

            const web = new Web(testSettings.sp.webUrl);

            const order: number[] = [];

            const batch = web.createBatch();

            return expect(web.lists.ensure("BatchItemAddTest").then(ler => {

                const list = ler.list;

                return list.getListItemEntityTypeFullName().then(ent => {

                    list.items.inBatch(batch).add({ Title: "Hello 1" }, ent).then(_ => order.push(1));

                    list.items.inBatch(batch).add({ Title: "Hello 2" }, ent).then(_ => order.push(2));

                    return batch.execute().then(_ => {
                        order.push(3);
                        return order;
                    });
                });
            })).to.eventually.eql([1, 2, 3]);
        });

        it("Should execute batches that have internally cloned requests but aren't items.add", () => {

            const web = new Web(testSettings.sp.webUrl);

            const order = [];
            let groupId = -1;
            let loginName = "";

            const batch = web.createBatch();

            expect(Promise.all([
                web.associatedVisitorGroup.select("id").get().then(r => groupId = r.Id),
                web.siteUsers.top(1).select("loginName").get().then(r => loginName = r[0].LoginName),
            ]).then(() => {

                web.siteGroups.getById(groupId).users.inBatch(batch).get().then(() => {
                    order.push(1);
                });

                web.siteGroups.getById(groupId).users.inBatch(batch).add(loginName).then(() => {
                    order.push(2);
                });

                web.siteGroups.getById(groupId).users.inBatch(batch).get().then(() => {
                    order.push(3);
                });

                return batch.execute().then(() => {
                    order.push(4);
                    return order;
                });

            })).to.eventually.eql([1, 2, 3, 4]);
        });
    }
});

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
    }
});

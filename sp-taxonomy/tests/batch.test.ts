import { expect } from "chai";
import { taxonomy } from "../";
import { testSettings } from "../../../test/main";

describe("Batching", () => {

    if (testSettings.enableWebTests) {

        it("Should execute batches in the expected order for a single request", () => {

            const order: number[] = [];

            const batch = taxonomy.createBatch();

            taxonomy.termStores.inBatch(batch).get().then(_ => {
                order.push(1);
            });

            return expect(batch.execute().then(_ => {
                order.push(2);
                return order;

            })).to.eventually.be.fulfilled.and.eql([1, 2]);
        });

        it("Should execute batches in the expected order for an even number of requests", () => {

            const order: number[] = [];

            const batch = taxonomy.createBatch();

            taxonomy.termStores.inBatch(batch).get().then(_ => {
                order.push(1);
            });

            taxonomy.termStores.select("Name").inBatch(batch).get().then(_ => {
                order.push(2);
            });

            taxonomy.getDefaultSiteCollectionTermStore().getSiteCollectionGroup(false).inBatch(batch).get().then(_ => {
                order.push(3);
            });

            taxonomy.getDefaultSiteCollectionTermStore().inBatch(batch).get().then(_ => {
                order.push(4);
            });

            return expect(batch.execute().then(_ => {
                order.push(5);
                return order;
            })).to.eventually.be.fulfilled.and.eql([1, 2, 3, 4, 5]);
        });

        it("Should execute batches in the expected order for an odd number of requests", () => {

            const order: number[] = [];

            const batch = taxonomy.createBatch();

            taxonomy.termStores.inBatch(batch).get().then(_ => {
                order.push(1);
            });

            taxonomy.termStores.select("Name").inBatch(batch).get().then(_ => {
                order.push(2);
            });

            taxonomy.getDefaultSiteCollectionTermStore().getSiteCollectionGroup(false).inBatch(batch).get().then(_ => {
                order.push(3);
            });

            return expect(batch.execute().then(_ => {
                order.push(4);
                return order;
            })).to.eventually.be.fulfilled.and.eql([1, 2, 3, 4]);
        });
    }
});

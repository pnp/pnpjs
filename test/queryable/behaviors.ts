import { assert, expect } from "chai";
import { Caching, CachingPessimisticRefresh } from "@pnp/queryable";
import { sp } from "@pnp/sp";

import { getTestTimeline, testSettings } from "../main-2.js";
import "@pnp/sp/webs";

describe("Behaviors", () => {
    describe("Queryable", () => {

        it("CachingPessimistic", async () => {
            try {
                // Testing a behavior, creating new instance of sp
                const spInstance = sp(testSettings.sp.webUrl).using(getTestTimeline()).using(CachingPessimisticRefresh("session"));

                // Test caching behavior
                const startCheckpoint = new Date();
                const u = await spInstance.web();
                const midCheckpoint = new Date();
                const u2 = await spInstance.web();
                const endCheckpoint = new Date();

                // Results should be the same
                const test1 = JSON.stringify(u) === JSON.stringify(u2);

                // Assume first call should take longer as it's not cached
                const call1Time = (midCheckpoint.getTime() - startCheckpoint.getTime());
                const call2Time = (endCheckpoint.getTime() - midCheckpoint.getTime());
                const test2 = call1Time > call2Time;
                expect(test1 && test2).to.be.true;
            } catch (err) {
                assert.fail(`Behaviors/Queryable/CachingPessimistic - ${err.message}`);
            }
        });

        it("Caching", async () => {
            try {
                // Testing a behavior, creating new instance of sp
                const spInstance = sp(testSettings.sp.webUrl).using(getTestTimeline()).using(Caching("session"));

                // Test caching behavior
                const startCheckpoint = new Date();
                const u = await spInstance.web();
                const midCheckpoint = new Date();
                const u2 = await spInstance.web();
                const endCheckpoint = new Date();

                // Results should be the same
                const test1 = JSON.stringify(u) === JSON.stringify(u2);

                // Assume first call should take longer as it's not cached
                const call1Time = (midCheckpoint.getTime() - startCheckpoint.getTime());
                const call2Time = (endCheckpoint.getTime() - midCheckpoint.getTime());
                const test2 = call1Time > call2Time;
                expect(test1 && test2).to.be.true;
            } catch (err) {
                assert.fail(`Behaviors/Queryable/Caching - ${err.message}`);
            }
        });
    });
});

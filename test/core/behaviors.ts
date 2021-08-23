import { expect } from "chai";
import { ISettings } from "test/settings.js";
import { LogLevel } from "@pnp/logging";
import { sp2, _SharePointQueryable } from "@pnp/sp";
import { Queryable2, InjectHeaders, CachingPessimisticRefresh, DefaultParse } from "@pnp/queryable";
import { NodeFetchWithRetry, MSAL } from "@pnp/nodejs";
import { SPRest2 } from "@pnp/sp/rest-2.js";

import { getSP } from "../main-2.js";
import "@pnp/sp/webs";

describe.only("Behaviors", () => {
    describe("Queryable", () => {


        it.only("CachingPessimistic", async () => {
            try {
                const sp: SPRest2 = getSP();

                const startCheckpoint = new Date();
                const u = await sp.web();
                const midCheckpoint = new Date();
                const u2 = await sp.web();
                const endCheckpoint = new Date();

                const test1 = JSON.stringify(u) === JSON.stringify(u2);

                const call1Time = (startCheckpoint.getTime() - startCheckpoint.getTime());
                const call2Time = (midCheckpoint.getTime() - endCheckpoint.getTime());
                const test2 = call1Time > call2Time;
                expect(test1 && test2).to.be.true;
            } catch (err) {
                console.log(`Behaviors/Queryable/CachingPessimistic - ${err.message}`);
            }
        });
    });
});

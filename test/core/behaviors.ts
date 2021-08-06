import { expect } from "chai";
import { PnPClientStorageWrapper } from "@pnp/core";
import { MockStorage } from "../types.js";
import { ISettings } from "test/settings.js";
import { LogLevel } from "@pnp/logging";
import { sp2, _SharePointQueryable } from "@pnp/sp";
import { Queryable2, InjectHeaders, CachingPessimisticRefresh, DefaultParse } from "@pnp/queryable";
import { NodeFetchWithRetry, MSAL } from "@pnp/nodejs";

import { testSettings } from "../main.js";

describe("Behaviors", () => {
    describe("Queryable", () => {
        it.only("CachingPessimistic", async () => {
            function testingConfig(settings: ISettings): (instance: Queryable2) => Queryable2 {
                return (instance) => {
                    instance
                        .using(MSAL(settings.sp.msal.init, settings.sp.msal.scopes))
                        .using(InjectHeaders({
                            "Accept": "application/json",
                            "Content-Type": "application/json;odata=verbose;charset=utf-8",
                            "User-Agent": "NONISV|SharePointPnP|PnPjs",
                            "X-ClientService-ClientTag": "PnPCoreJS:3.0.0-exp",
                        }))
                        .using(NodeFetchWithRetry())
                        .using(DefaultParse())
                        .using(CachingPessimisticRefresh("session"))
                        .on.error((err) => {
                            console.error("caught it");
                            console.error(err);
                        })
                        .on.log(function (message, level) {

                            if (level >= LogLevel.Verbose) {

                                console.log(`Cheap log: ${message}.`);
                            }

                        }).on.post(async (_url: URL, result: any) => {

                            console.log(JSON.stringify(result));

                            return [_url, result];

                        });

                    return instance;
                };
            }

            const tc = testingConfig(testSettings);
            const sp = sp2(testSettings.sp.url).using(tc);
            const w = sp.web;

            const startCheckpoint = new Date();
            const u = await w();
            const midCheckpoint = new Date();
            const u2 = await w();
            const endCheckpoint = new Date();

            const test1 = JSON.stringify(u) === JSON.stringify(u2);

            const call1Time = (startCheckpoint.getTime() - startCheckpoint.getTime());
            const call2Time = (midCheckpoint.getTime() - endCheckpoint.getTime());
            const test2 = call1Time > call2Time;
            expect(test1 && test2).to.be.true;
        });
    });
});

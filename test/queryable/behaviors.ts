import { assert, expect } from "chai";
import {
    Caching,
    CachingPessimisticRefresh,
    BearerToken,
    Queryable,
    InjectHeaders,
    Timeout,
    RejectOnError,
    ResolveOnData,
} from "@pnp/queryable";
import { spfi } from "@pnp/sp";
import { AbortController } from "node-abort-controller";
import { default as nodeFetch } from "node-fetch";

import { getSP } from "../main.js";
import "@pnp/sp/webs";
import { getRandomString } from "@pnp/core";


describe("Behaviors", function () {

    it("CachingPessimistic", async function () {

        if (!this.settings.enableWebTests) {
            this.skip();
        }

        try {
            // Testing a behavior, creating new instance of sp
            const spInstance = spfi(getSP()).using(CachingPessimisticRefresh("session"));

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
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(test1 && test2).to.be.true;
        } catch (err) {
            assert.fail(`Behaviors/Queryable/CachingPessimistic - ${err.message}`);
        }
    });

    it("CachingPessimistic (headers)", async function () {

        if (!this.settings.enableWebTests) {
            this.skip();
        }

        try {
            // Testing a behavior, creating new instance of sp
            const spInstance = spfi(getSP()).using(CachingPessimisticRefresh("session"));

            // Add a text field, which augments header, to validate that CachingPessimisticRefresh execute function honors header
            const testFieldNameRand = `CachingPessimisticRefreshField_${getRandomString(10)}`;
            const f = await spInstance.web.fields.addText(testFieldNameRand);
            await f.field.delete();

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
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(test1 && test2).to.be.true;
        } catch (err) {
            assert.fail(`Behaviors/Queryable/CachingPessimistic - ${err.message}`);
        }
    });

    it("Caching", async function () {

        if (!this.settings.enableWebTests) {
            this.skip();
        }

        try {
            // Testing a behavior, creating new instance of sp
            const spInstance = spfi(getSP()).using(Caching("session"));

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
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(test1 && test2).to.be.true;
        } catch (err) {
            assert.fail(`Behaviors/Queryable/Caching - ${err.message}`);
        }
    });

    it("Bearer Token", async function () {

        const query = new Queryable("https://bing.com");
        query.using(BearerToken("!!token!!"));

        query.on.send.replace((url, init) => {

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(init.headers).to.not.be.undefined.and.to.not.be.null;

            expect(init.headers).to.have.property("Authorization", "Bearer !!token!!");

            return null;
        });

        query.on.parse.replace(async function (this: Queryable, url, response, result) {

            this.emit[this.InternalResolveEvent](null);

            return [url, response, result];
        });

        await query();
    });

    it("Inject Headers", async function () {

        const query = new Queryable("https://bing.com");
        query.using(InjectHeaders({
            "header1": "header1-value",
            "header2": "header2-value",
        }));

        query.on.send.replace((url, init) => {

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(init.headers).to.not.be.undefined.and.to.not.be.null;

            expect(init.headers).to.have.property("header1", "header1-value");

            expect(init.headers).to.have.property("header2", "header2-value");

            return null;
        });

        query.on.parse.replace(async function (this: Queryable, url, response, result) {

            this.emit[this.InternalResolveEvent](null);

            return [url, response, result];
        });

        await query();
    });

    it("Timeout", async function () {

        // must patch in node < 15
        const controller = new AbortController();

        const query = new Queryable("https://bing.com");
        query.using(Timeout(controller.signal));
        query.using(ResolveOnData(), RejectOnError());

        query.on.send.replace(async (url, init) => <any>nodeFetch(url.toString(), <any>init));

        try {

            controller.abort();
            await query();

            expect.fail("Timeout should cause error and we end up in catch before this line.");

        } catch (e) {

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(e).to.not.be.null;

            // we expect this to be the error from the abort signal
            expect(e).property("name").to.eq("AbortError");
        }
    });
});

import { expect } from "chai";
import {
    Caching,
    CachingPessimisticRefresh,
    BearerToken,
    Queryable,
    InjectHeaders,
    Timeout,
    RejectOnError,
    ResolveOnData,
    CacheKey,
} from "@pnp/queryable";
import { default as nodeFetch } from "node-fetch";
import "@pnp/sp/webs";
import "@pnp/sp/fields";
import { getRandomString } from "@pnp/core";
import { spfi } from "@pnp/sp";
import { pnpTest } from "../pnp-test.js";

describe("Behaviors", function () {

    it.skip("CachingPessimistic", pnpTest("84909f5f-ce49-4de9-8dd6-eb79a57b0a10", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        // Testing a behavior, creating new instance of sp
        const spInstance = spfi(this.pnp._sp).using(CachingPessimisticRefresh({store: "session"}),CacheKey("CachingPessimistic"));

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
        return expect(test1 && test2).to.be.true;
    }));

    it.skip("CachingPessimistic (headers)", pnpTest("81723ed2-d35d-4c85-b3a8-d2ccc2011b75", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        // Testing a behavior, creating new instance of sp
        const spInstance = spfi(this.pnp._sp).using(CachingPessimisticRefresh({store: "session"}),CacheKey("CachingPessimisticHeaders"));

        // Add a text field, which augments header, to validate that CachingPessimisticRefresh execute function honors header
        const testFieldNameRand = `CachingPessimisticRefreshField_${getRandomString(10)}`;
        const f = await spInstance.web.fields.addText(testFieldNameRand);
        await spInstance.web.fields.getById(f.Id).delete();

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
        return expect(test1 && test2).to.be.true;
    }));

    it("Caching", pnpTest("363a1886-496b-4772-ae6f-90ed76cfa562", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        // Testing a behavior, creating new instance of sp
        const spInstance = spfi(this.pnp._sp).using(Caching({ store: "session"}),CacheKey("Caching"));

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
        return expect(test1 && test2).to.be.true;
    }));

    it("Bearer Token", pnpTest("1bae670f-fd47-47a1-984d-bef7cad4859a", async function () {

        const query = new Queryable("https://bing.com");
        query.using(BearerToken("!!token!!"));

        query.on.send.replace(async (url, init) => {

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(init.headers).to.not.be.undefined.and.to.not.be.null;

            expect(init.headers).to.have.property("Authorization", "Bearer !!token!!");

            return new Response({} as BodyInit, {});
        });

        query.on.parse.replace(async function (this: Queryable, url, response, result) {

            this.emit[this.InternalResolve](null);

            return [url, response, result];
        });

        await query();
    }));

    it("Inject Headers", pnpTest("788ec488-db0a-4054-8ef1-a0299ca7d04c", async function () {

        const query = new Queryable("https://bing.com");
        query.using(InjectHeaders({
            "header1": "header1-value",
            "header2": "header2-value",
        }));

        query.on.send.replace(async (url, init) => {

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(init.headers).to.not.be.undefined.and.to.not.be.null;

            expect(init.headers).to.have.property("header1", "header1-value");

            expect(init.headers).to.have.property("header2", "header2-value");

            return new Response({} as BodyInit, {});
        });

        query.on.parse.replace(async function (this: Queryable, url, response, result) {

            this.emit[this.InternalResolve](null);

            return [url, response, result];
        });

        await query();
    }));

    it("Timeout", pnpTest("b75098d2-8794-4432-878f-59c734407cad", async function () {

        const query = new Queryable("https://bing.com");
        query.using(Timeout(50));
        query.using(ResolveOnData(), RejectOnError());

        query.on.send.replace(async (url, init) => <any>nodeFetch(url.toString(), <any>init));

        try {

            await query();

            expect.fail("Timeout should cause error and we end up in catch before this line.");

        } catch (e) {

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(e).to.not.be.null;

            // we expect this to be the error from the abort signal
            expect(e).property("name").to.eq("AbortError");
        }
    }));
});

import { expect } from "chai";
import "@pnp/sp/sites";
import "@pnp/sp/hubsites";
import { spfi } from "@pnp/sp";
import { pnpTest } from  "../pnp-test.js";

describe("Hubsites", function () {

    let hubSiteId: string;

    before(pnpTest("7a9f01aa-5536-44b9-91ea-8592b306abde", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        const rootSite = spfi([this.pnp.sp.site, this.pnp.settings.sp.url]);

        await rootSite.site.registerHubSite();
        const r = await rootSite.site.select("Id")();
        hubSiteId = r.Id;
    }));

    it("getById", pnpTest("4440b64b-43d2-4a5d-bc29-42277fc3abb2", async function () {
        return expect(this.pnp.sp.hubSites.getById(hubSiteId)()).to.eventually.be.fulfilled;
    }));

    it("getSite", pnpTest("b393c869-cc13-4755-a450-e393357c3039", async function () {

        const hs = await this.pnp.sp.hubSites.getById(hubSiteId).getSite();

        return expect(hs.select("Title")()).to.eventually.be.fulfilled;
    }));

    // unregister the test site, so that tests will run successfully next time as well
    after(pnpTest("57e7a075-5af6-48f6-8237-6293276afb3d", async function () {
        if (this.pnp.settings.enableWebTests) {
            return this.pnp.sp.site.unRegisterHubSite();
        }
        return;
    }));
});

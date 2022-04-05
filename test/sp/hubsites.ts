import { expect } from "chai";
import "@pnp/sp/sites";
import "@pnp/sp/hubsites";
import { spfi } from "@pnp/sp";

describe("Hubsites", function () {

    let hubSiteId: string;

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        const rootSite = spfi([this.pnp.sp.site, this.pnp.settings.sp.url]);

        await rootSite.site.registerHubSite();
        const r = await rootSite.site.select("Id")();
        hubSiteId = r.Id;
    });

    it("getById", function () {
        return expect(this.pnp.sp.hubSites.getById(hubSiteId)()).to.eventually.be.fulfilled;
    });

    it("getSite", async function () {

        const hs = await this.pnp.sp.hubSites.getById(hubSiteId).getSite();

        return expect(hs.select("Title")()).to.eventually.be.fulfilled;
    });

    // unregister the test site, so that tests will run successfully next time as well
    after(async function () {
        if (this.pnp.settings.enableWebTests) {
            return this.pnp.sp.site.unRegisterHubSite();
        }
        return;
    });
});

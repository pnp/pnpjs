import { getSP } from "../main.js";
import { expect } from "chai";
import "@pnp/sp/sites";
import "@pnp/sp/hubsites";
import { spfi, SPFI } from "@pnp/sp";

describe("Hubsites", function () {

    let _spfi: SPFI = null;
    let hubSiteId: string;

    before(async function () {

        if (!this.settings.enableWebTests) {
            this.skip();
        }

        // Must use root site
        _spfi = getSP();

        const rootSite = spfi([_spfi.site, this.settings.sp.url]);

        await rootSite.site.registerHubSite();
        const r = await rootSite.site.select("Id")();
        hubSiteId = r.Id;
    });

    it("getById", function () {
        return expect(_spfi.hubSites.getById(hubSiteId)()).to.eventually.be.fulfilled;
    });

    it("getSite", async function () {

        const hs = await _spfi.hubSites.getById(hubSiteId).getSite();

        return expect(hs.select("Title")()).to.eventually.be.fulfilled;
    });

    // unregister the test site, so that tests will run successfully next time as well
    after(async function () {
        if (this.settings.enableWebTests) {
            await _spfi.site.unRegisterHubSite();
        }
    });
});

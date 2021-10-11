import { getSP, testSettings } from "../main.js";
import { expect } from "chai";
import "@pnp/sp/hubsites";
import { SPFI } from "@pnp/sp";

describe("Hubsites", function () {

    if (testSettings.enableWebTests) {
        let _spfi: SPFI = null;
        let hubSiteId: string;

        before(async function () {
            _spfi = getSP();
            await _spfi.site.registerHubSite();
            const r = await _spfi.site.select("Id")();
            hubSiteId = r.Id;
        });

        it(".getById", function () {
            return expect(_spfi.hubSites.getById(hubSiteId)()).to.eventually.be.fulfilled;
        });

        it(".getSite", async function () {

            const hs = await _spfi.hubSites.getById(hubSiteId).getSite();

            return expect(hs.select("Title")()).to.eventually.be.fulfilled;
        });

        // unregister the test site, so that tests will run successfully next time as well
        after(async function () {
            await _spfi.site.unRegisterHubSite();
        });
    }
});

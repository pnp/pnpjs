import { getSP, testSettings } from "../main.js";
import { expect } from "chai";
import "@pnp/sp/hubsites";
import { SPRest } from "@pnp/sp";

describe("Hubsites", function () {

    if (testSettings.enableWebTests) {
        let _spRest: SPRest = null;
        let hubSiteId: string;

        before(async function () {
            _spRest = getSP();
            await _spRest.site.registerHubSite();
            const r = await _spRest.site.select("Id")();
            hubSiteId = r.Id;
        });

        it(".getById", function () {
            return expect(_spRest.hubSites.getById(hubSiteId)()).to.eventually.be.fulfilled;
        });

        it(".getSite", async function () {

            const hs = await _spRest.hubSites.getById(hubSiteId).getSite();

            return expect(hs.select("Title")()).to.eventually.be.fulfilled;
        });

        // unregister the test site, so that tests will run successfully next time as well
        after(async function () {
            await _spRest.site.unRegisterHubSite();
        });
    }
});

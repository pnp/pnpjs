import { sp } from "@pnp/sp";
import { testSettings } from "../main";
import { expect } from "chai";
import "@pnp/sp/hubsites";

describe("Hubsites", function () {

    if (testSettings.enableWebTests) {

        let hubSiteId: string;

        before(async function () {
            await sp.site.registerHubSite();
            const r = await sp.site.select("Id")();
            hubSiteId = r.Id;
        });

        it(".getById", function () {
            return expect(sp.hubSites.getById(hubSiteId)()).to.eventually.be.fulfilled;
        });

        it(".getSite", async function () {

            const hs = await sp.hubSites.getById(hubSiteId).getSite();

            return expect(hs.select("Title")()).to.eventually.be.fulfilled;
        });

        // unregister the test site, so that tests will run successfully next time as well
        after(async function () {
            await sp.site.unRegisterHubSite();
        });
    }
});

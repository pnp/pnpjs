import { sp } from "@pnp/sp";
import { testSettings } from "../main";
import { expect } from "chai";
import "@pnp/sp/src/hubsites";

describe("Hubsites", function () {
    let hubSiteId: string;
    before(async function () {
        await sp.site.registerHubSite();
        const r = await sp.site.select("Id").get();
        hubSiteId = r.Id;

    });

    if (testSettings.enableWebTests) {
        it(".getById", function () {
            return expect(sp.hubSites.getById(hubSiteId)()).to.eventually.be.fulfilled;
        });
    }

    // unregister the test site, so that tests will run successfully next time aswell
    after(function () {
        sp.site.unRegisterHubSite();
    });
});

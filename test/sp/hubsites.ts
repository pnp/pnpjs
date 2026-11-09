import { expect } from "chai";
import "@pnp/sp/sites";
import "@pnp/sp/hubsites";
import { spfi, emptyGuid } from "@pnp/sp";

describe("Hubsites", function () {

    let hubSiteId: string;
    let registeredByTest = false;

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        const rootSite = spfi([this.pnp.sp.site, this.pnp.settings.sp.url]);

        const info = await rootSite.site.select("Id", "IsHubSite", "HubSiteId")();
        hubSiteId = info.Id;

        if (!info.IsHubSite) {

            // a site associated with another hub can't be registered as a hub, and we don't want to change the tenant's hub associations
            if (info.HubSiteId && info.HubSiteId !== emptyGuid) {
                this.skip();
            }

            await rootSite.site.registerHubSite();
            registeredByTest = true;
        }
    });

    it("getById", function () {
        return expect(this.pnp.sp.hubSites.getById(hubSiteId)()).to.eventually.be.fulfilled;
    });

    it("getSite", async function () {

        const hs = await this.pnp.sp.hubSites.getById(hubSiteId).getSite();

        return expect(hs.select("Title")()).to.eventually.be.fulfilled;
    });

    // unregister the test site, so that tests will run successfully next time as well
    // but only if we registered it, we don't want to remove a hub we didn't create
    after(async function () {
        if (this.pnp.settings.enableWebTests && registeredByTest) {
            return this.pnp.sp.site.unRegisterHubSite();
        }
        return;
    });
});

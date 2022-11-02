import { expect } from "chai";
import "@pnp/graph/sites";

describe("Sites", function () {

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    it("sites", async function () {
        const sites = await this.pnp.graph.sites();
        return expect(sites).to.be.an("array") && expect(sites[0]).to.haveOwnProperty("id");
    });

    it("getById()", async function () {
        let passed = true;
        const site = await this.pnp.graph.sites.getById(this.pnp.settings.graph.id)();
        passed = (site.id === this.pnp.settings.graph.id);
        return expect(passed).is.true;
    });

    it("getByUrl()", async function() {
        if (!this.pnp.settings.graph.testSiteUrl) {
            this.skip();
        }
        let passed = true;
        const url = new URL(this.pnp.settings.graph.testSiteUrl);
        const siteByUrl = await this.pnp.graph.sites.getByUrl(url.hostname, url.pathname)();
        passed = (siteByUrl.webUrl.toLowerCase() === this.pnp.settings.graph.testSiteUrl.toLowerCase());
        return expect(passed).is.true;
    });

    // The overhead for creating a group and waiting for the groups related site to be ready it too much for the testing framework.
    it.skip("getSiteForGroup");
});

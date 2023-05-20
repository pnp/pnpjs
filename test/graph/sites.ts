import { expect } from "chai";
import getTestingGraphSPSite from "./utilities/getTestingGraphSPSite.js";
import "@pnp/graph/sites";
import { ISite } from "@pnp/graph/sites";

describe("Sites", function () {
    let site: ISite;

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
        let passed = true;
        site = await getTestingGraphSPSite(this);
        const tetssite = await site();
        const url = new URL(tetssite.webUrl);
        const siteByUrl = await this.pnp.graph.sites.getByUrl(url.hostname, url.pathname)();
        passed = (siteByUrl.webUrl.toLowerCase() === tetssite.webUrl.toLowerCase());
        return expect(passed).is.true;
    });

    // The overhead for creating a group and waiting for the groups related site to be ready it too much for the testing framework.
    it.skip("getSiteForGroup");
});

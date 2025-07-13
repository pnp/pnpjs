import { expect } from "chai";
import getTestingGraphSPSite from "./utilities/getTestingGraphSPSite.js";
import "@pnp/graph/sites";
import { ISite } from "@pnp/graph/sites";
import { pnpTest } from "../pnp-test.js";

describe("Sites", function () {
    let site: ISite;

    before(pnpTest("4dd8ffcf-d527-4723-9e36-dc0213551108", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    }));

    it("sites", pnpTest("6c5f3d45-c3df-4aba-87a5-ad16b186a04b", async function () {
        const sites = await this.pnp.graph.sites();
        return expect(sites).to.be.an("array") && expect(sites[0]).to.haveOwnProperty("id");
    }));

    it("getById()", pnpTest("009d16d7-5bff-480c-822a-2a07e791ca7b", async function () {
        let passed = true;
        const site = await this.pnp.graph.sites.getById(this.pnp.settings.graph.id)();
        passed = (site.id === this.pnp.settings.graph.id);
        return expect(passed).is.true;
    }));

    it("getByUrl()", pnpTest("fde05525-dcec-48c6-8429-b80248d7dfc9", async function() {
        let passed = true;
        site = await getTestingGraphSPSite(this);
        const tetssite = await site();
        const url = new URL(tetssite.webUrl);
        const siteByUrl = await this.pnp.graph.sites.getByUrl(url.hostname, url.pathname);
        const siteInfo = await siteByUrl();
        passed = (siteInfo.webUrl.toLowerCase() === tetssite.webUrl.toLowerCase());
        return expect(passed).is.true;
    }));

    // The overhead for creating a group and waiting for the groups related site to be ready it too much for the testing framework.
    it.skip("getSiteForGroup");
});

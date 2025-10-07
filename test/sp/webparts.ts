import { expect } from "chai";
import "@pnp/sp/webs";
import { combine, getRandomString } from "@pnp/core";
import { ILimitedWebPartManager, WebPartsPersonalizationScope } from "@pnp/sp/presets/all";
import { pnpTest } from  "../pnp-test.js";

describe("WebParts", function () {

    before(pnpTest("bcd499ae-6332-4cc1-9a8e-0e2f7d5c3b81", function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    }));

    it("ensureLimitedWebPartManager-ScopeShared", pnpTest("3e4708e9-948e-41c9-a9bc-8ef5f359064b", async function () {
        const lwm = this.pnp.sp.web.folders.getByUrl("SitePages").files.getByUrl("Home.aspx").getLimitedWebPartManager(WebPartsPersonalizationScope.Shared);
        const scope = await lwm.scope();

        return expect(scope).to.be.equal(1);
    }));

    it("ensureLimitedWebPartManager-ScopeUser", pnpTest("f35eeae7-5674-4d3e-8509-35cfbfc35e18", async function () {
        const lwm = this.pnp.sp.web.folders.getByUrl("SitePages").files.getByUrl("Home.aspx").getLimitedWebPartManager(WebPartsPersonalizationScope.User);
        const scope = await lwm.scope();

        return expect(scope).to.be.equal(0);
    }));

    it("webpartDefinitions", pnpTest("314577b4-f302-4873-8c08-bc09356c653e", async function () {
        const currentWeb = await this.pnp.sp.web.select("ServerRelativeUrl")();
        const { pageName } = await this.props({
            pageName: `Test_Page_${getRandomString(5)}.aspx`,
        });
        const pageAddress = combine("/", currentWeb.ServerRelativeUrl, "/SitePages/", pageName);
        await this.pnp.sp.web.addClientsidePage(pageName);
        const lwm: ILimitedWebPartManager = this.pnp.sp.web.getFileByUrl(pageAddress).getLimitedWebPartManager();
        const webparts = await lwm.webparts();
        return expect(webparts).to.be.an.instanceOf(Array).and.be.empty;
    }));
});

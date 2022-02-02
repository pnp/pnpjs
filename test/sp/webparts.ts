import { expect } from "chai";
import "@pnp/sp/webs";
import { combine, getRandomString } from "@pnp/core";
import { ILimitedWebPartManager, WebPartsPersonalizationScope } from "@pnp/sp/presets/all";

describe("WebParts", function () {

    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    it("ensureLimitedWebPartManager-ScopeShared", async function () {
        const lwm = this.pnp.sp.web.folders.getByUrl("SitePages").files.getByUrl("Home.aspx").getLimitedWebPartManager(WebPartsPersonalizationScope.Shared);
        const scope = await lwm.scope();

        return expect(scope).to.be.equal(1);
    });

    it("ensureLimitedWebPartManager-ScopeUser", async function () {
        const lwm = this.pnp.sp.web.folders.getByUrl("SitePages").files.getByUrl("Home.aspx").getLimitedWebPartManager(WebPartsPersonalizationScope.User);
        const scope = await lwm.scope();

        return expect(scope).to.be.equal(0);
    });

    it("webpartDefinitions", async function () {
        const currentWeb = await this.pnp.sp.web.select("ServerRelativeUrl")();
        const pageName = `Test_Page_${getRandomString(5)}.aspx`;
        const pageAddress = combine("/", currentWeb.ServerRelativeUrl, "/SitePages/", pageName);
        await this.pnp.sp.web.addClientsidePage(pageName);
        const lwm: ILimitedWebPartManager = this.pnp.sp.web.getFileByUrl(pageAddress).getLimitedWebPartManager();
        const webparts = await lwm.webparts();
        return expect(webparts).to.be.an.instanceOf(Array).and.be.empty;
    });
});

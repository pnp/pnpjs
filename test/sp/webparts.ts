import { expect } from "chai";
import "@pnp/sp/webs";
import { combine, getRandomString } from "@pnp/core";
import { getSP } from "../main.js";
import { ILimitedWebPartManager, WebPartsPersonalizationScope } from "@pnp/sp/presets/all";
import { SPFI } from "@pnp/sp";

describe("WebParts", function () {

    let _spfi: SPFI = null;

    before(function () {

        if (!this.settings.enableWebTests) {
            this.skip();
        }

        _spfi = getSP();
    });

    it("ensureLimitedWebPartManager-ScopeShared", async function () {
        const lwm = _spfi.web.folders.getByUrl("SitePages").files.getByUrl("Home.aspx").getLimitedWebPartManager(WebPartsPersonalizationScope.Shared);
        const scope = await lwm.scope();

        return expect(scope).to.be.equal(1);
    });

    it("ensureLimitedWebPartManager-ScopeUser", async function () {
        const lwm = _spfi.web.folders.getByUrl("SitePages").files.getByUrl("Home.aspx").getLimitedWebPartManager(WebPartsPersonalizationScope.User);
        const scope = await lwm.scope();

        return expect(scope).to.be.equal(0);
    });

    it("webpartDefinitions", async function () {
        const currentWeb = await _spfi.web.select("ServerRelativeUrl")();
        const pageName = `Test_Page_${getRandomString(5)}.aspx`;
        const pageAddress = combine("/", currentWeb.ServerRelativeUrl, "/SitePages/", pageName);
        await _spfi.web.addClientsidePage(pageName);
        const lwm: ILimitedWebPartManager = _spfi.web.getFileByUrl(pageAddress).getLimitedWebPartManager();
        const webparts = await lwm.webparts();
        return expect(webparts).to.be.an.instanceOf(Array).and.be.empty;
    });
});

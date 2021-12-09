import { expect } from "chai";
import "@pnp/sp/webs";
import { combine, getRandomString } from "@pnp/core";
import { getSP, testSettings } from "../main.js";
import { ILimitedWebPartManager, WebPartsPersonalizationScope } from "@pnp/sp/presets/all";
import { SPFI } from "@pnp/sp";

describe("WebParts", function () {

    let _spfi: SPFI = null;

    before(function () {

        if (!testSettings.enableWebTests) {
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

    // TODO: Review these tests
    // Reason: The current implementation of the "import" method gives an empty _spfi.webParts.WebPartDefinition and
    // a HTTP 200 in return (JSOM API). The ID of the returned webpart definition is an empty guid.
    it("import");

    // Reason: we cannot automate tests of the "export" method because the "addWebPart" method is not implemented.
    // This means that we cannot write a testcase that creates a new page, inserts a webpart, which we then could manipulate.
    it("export");
});

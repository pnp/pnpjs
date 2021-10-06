import { expect } from "chai";
import "@pnp/sp/webs";
import { getSP, testSettings } from "../main.js";
import { WebPartsPersonalizationScope, ILimitedWebPartManager } from "@pnp/sp/presets/all";
import { getRandomString, combine } from "@pnp/core";
import { SPRest } from "@pnp/sp";

describe("webparts", function () {
    if (testSettings.enableWebTests) {
        let _spRest: SPRest = null;

        before(function () {
            _spRest = getSP();
        });

        it("ensureLimitedWebPartManager-ScopeShared", async function () {
            const lwm = _spRest.web.folders.getByUrl("SitePages").files.getByUrl("Home.aspx").getLimitedWebPartManager(WebPartsPersonalizationScope.Shared);
            const scope = await lwm.scope();

            return expect(scope).to.be.equal(1);
        });

        it("ensureLimitedWebPartManager-ScopeUser", async function () {
            const lwm = _spRest.web.folders.getByUrl("SitePages").files.getByUrl("Home.aspx").getLimitedWebPartManager(WebPartsPersonalizationScope.User);
            const scope = await lwm.scope();

            return expect(scope).to.be.equal(0);
        });

        // TODO: Fix call to create normal page
        // it("webpartDefinitions", async function () {
        //     const currentWeb = await _spRest.web.select("ServerRelativeUrl")();
        //     const wikiPageName = `Test_WikiPage_${getRandomString(5)}.aspx`;
        //     const newWikiPageAddress = combine("/", currentWeb.ServerRelativeUrl, "/SitePages/", wikiPageName);

        //     const newPage = await _spRest.utility.createWikiPage({
        //         ServerRelativeUrl: newWikiPageAddress,
        //         WikiHtmlContent: "This is my <b>page</b> content. It supports rich html.",
        //     });

        //     const lwm: ILimitedWebPartManager = newPage.file.getLimitedWebPartManager();

        //     const webparts = await lwm.webparts();

        //     return expect(webparts).to.be.an.instanceOf(Array).and.be.empty;
        // });

        // Reason: The current implementation of the "import" method gives an empty _spRest.webParts.WebPartDefinition and
        // a HTTP 200 in return (JSOM API). The ID of the returned webpart definition is an empty guid.
        it("import");

        // Reason: we cannot automate tests of the "export" method because the "addWebPart" method is not implemented.
        // This means that we cannot write a testcase that creates a new page, inserts a webpart, which we then could manipulate.
        it("export");
    }
});

import { expect } from "chai";
import "@pnp/sp/src/webs";
import { testSettings } from "../main";
import { Web } from '@pnp/sp/src/webs';
import { sp } from "@pnp/sp";
import { WebPartsPersonalizationScope, ILimitedWebPartManager } from '@pnp/sp/presets/all';
import { getRandomString, combine } from '@pnp/common';

describe("webparts", function () {
    if (testSettings.enableWebTests) {        
        it("ensureLimitedWebPartManager-ScopeShared", async function () {
            let lwm : ILimitedWebPartManager = Web(testSettings.sp.webUrl).folders.getByName("SitePages").files.getByName("Home.aspx").getLimitedWebPartManager(WebPartsPersonalizationScope.Shared);
            let scope = await lwm.scope();

            return expect(scope).to.be.equal(1);
        });

        it("ensureLimitedWebPartManager-ScopeUser", async function () {
            let lwm : ILimitedWebPartManager = Web(testSettings.sp.webUrl).folders.getByName("SitePages").files.getByName("Home.aspx").getLimitedWebPartManager(WebPartsPersonalizationScope.User);
            let scope = await lwm.scope();

            return expect(scope).to.be.equal(0);
        });

        it("webpartDefinitions", async function() {
            let currentWeb = await Web(testSettings.sp.webUrl).select("ServerRelativeUrl").get();
            const wikiPageName = `Test_WikiPage_${getRandomString(5)}.aspx`;
            let newWikiPageAddress = combine("/", currentWeb.ServerRelativeUrl, '/SitePages/', wikiPageName);            
            
            let newPage = await sp.utility.createWikiPage({
                ServerRelativeUrl: newWikiPageAddress,
                WikiHtmlContent: "This is my <b>page</b> content. It supports rich html.",
            });

            let lwm : ILimitedWebPartManager = newPage.file.getLimitedWebPartManager();

            let webparts = await lwm.webparts.get();

            return expect(webparts).to.be.an.instanceOf(Array).and.be.empty;
        });
    }
});

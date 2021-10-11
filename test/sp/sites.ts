import { expect } from "chai";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import { getSP, testSettings } from "../main.js";
import { IDocumentLibraryInformation, IContextInfo, IOpenWebByIdResult } from "@pnp/sp/sites";
import { IWeb } from "@pnp/sp/webs";
import { combine } from "@pnp/core";
import { SPFI } from "@pnp/sp";

describe("Sites", function () {

    if (testSettings.enableWebTests) {
        let _spfi: SPFI = null;

        before(function () {
            _spfi = getSP();
        });

        it(".rootWeb", async function () {
            return expect(_spfi.site.rootWeb()).to.eventually.be.fulfilled;
        });

        it(".getRootWeb", async function () {
            const rootWeb: IWeb = await _spfi.site.getRootWeb();
            return expect(rootWeb).to.haveOwnProperty("url");
        });

        it(".getContextInfo", async function () {
            const oContext: IContextInfo = await _spfi.site.getContextInfo();
            return expect(oContext).to.haveOwnProperty("SiteFullUrl");
        });

        it(".getDocumentLibraries", async function () {
            const docLibs: IDocumentLibraryInformation[] = await _spfi.site.getDocumentLibraries(testSettings.sp.webUrl);
            return docLibs.forEach((docLib) => {
                expect(docLib).to.haveOwnProperty("Title");
            });
        });

        it(".getWebUrlFromPageUrl", async function () {
            const path = combine(testSettings.sp.webUrl, "SitePages", "Home.aspx");
            const webUrl: string = await _spfi.site.getWebUrlFromPageUrl(path);
            return expect(webUrl).to.be.equal(testSettings.sp.webUrl);
        });

        it(".openWebById", async function () {
            const oWeb = await _spfi.site.rootWeb();
            const webIDResult: IOpenWebByIdResult = await _spfi.site.openWebById(oWeb.Id);
            return expect(webIDResult).to.haveOwnProperty("data");
        });

        it(".openWebById - chainable", async function () {
            const oWeb = await _spfi.site.rootWeb();
            const webIDResult: IOpenWebByIdResult = await _spfi.site.openWebById(oWeb.Id);
            return expect(webIDResult.web.lists()).to.eventually.be.fulfilled;
        });

        it(".exists", async function () {
            const oWeb = await _spfi.site();
            const exists: boolean = await _spfi.site.exists(oWeb.Url);
            const notExists: boolean = await _spfi.site.exists(`${oWeb.Url}/RANDOM`);
            const success = exists && !notExists;
            return expect(success).to.be.true;
        });
    }
});

// commented out as we can't have tests that require editing when run.
// need to revisit
// describe("Delete site", function () {
//     if (testSettings.enableWebTests) {
//         it(".delete", async function () {
//             const randomNum = getRandomString(5);
//             const ownersEmailID: string = "contosouser@contoso.onmicrosoft.com"; //Enter site owner"s email id
//             await _spfi.site.createCommunicationSite(
//                 "commSite" + randomNum, 1033,
//                 false,
//                 testSettings._spfi.webUrl + "/sites/commSite" + randomNum,
//                 "TestModernTeamSite01", "HBI",
//                 "00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000",
//                 ownersEmailID);
//             const oSite = Site(testSettings._spfi.webUrl + "/sites/commSite" + randomNum);
//             return expect(oSite.delete()).to.eventually.be.fulfilled;
//         });
//     }
// });

// describe("createModern Team & Comm Sites", function () {
//     if (testSettings.enableWebTests) {
//         it(".createModernTeamSite", function () {
//             const randomNum = getRandomString(5);
//             const ownersEmailID: string = "contosouser@contoso.onmicrosoft.com"; //Enter site owner"s email id
//             expect(_spfi.site.createModernTeamSite(
//                 "TestModernTeamSite01" + randomNum,
//                 "Alias",
//                 false,
//                 1033,
//                 "TestModernTeamSite01" + randomNum + " description", "HBI", [ownersEmailID])).to.eventually.be.fulfilled;
//         });

//         it(".createCommunicationSite", function () {
//             const randomNum = getRandomString(5);
//             const ownersEmailID: string = "contosouser@contoso.onmicrosoft.com"; //Enter site owner"s email id
//             expect(_spfi.site.createCommunicationSite(
//                 "commSite" + randomNum, 1033,
//                 false,
//                 testSettings._spfi.webUrl + "/sites/commSite" + randomNum,
//                 "TestModernTeamSite01", "HBI",
//                 "00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000",
//                 ownersEmailID)).to.eventually.be.fulfilled;
//         });
//     }
// });

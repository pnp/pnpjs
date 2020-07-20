import { expect } from "chai";
import { sp } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import { testSettings } from "../main";
import { IDocumentLibraryInformation, IContextInfo, IOpenWebByIdResult } from "@pnp/sp/sites";
import { IWeb } from "@pnp/sp/webs";
import { combine } from "@pnp/common";

describe("Sites", () => {

  if (testSettings.enableWebTests) {

    it(".rootWeb", async function () {
      return expect(sp.site.rootWeb()).to.eventually.be.fulfilled;
    });

    it(".getRootWeb", async function () {
      const rootWeb: IWeb = await sp.site.getRootWeb();
      return expect(rootWeb.data).to.haveOwnProperty("url");
    });

    it(".getContextInfo", async function () {
      const oContext: IContextInfo = await sp.site.getContextInfo();
      return expect(oContext).to.haveOwnProperty("SiteFullUrl");
    });

    it(".getDocumentLibraries", async function () {
      const docLibs: IDocumentLibraryInformation[] = await sp.site.getDocumentLibraries(testSettings.sp.webUrl);
      return docLibs.forEach((docLib) => { expect(docLib).to.haveOwnProperty("Title"); });
    });

    it(".getWebUrlFromPageUrl", async function () {
      const path = combine(testSettings.sp.webUrl, "SitePages", "Home.aspx");
      const webUrl: string = await sp.site.getWebUrlFromPageUrl(path);
      return expect(webUrl).to.be.equal(testSettings.sp.webUrl);
    });

    it(".openWebById", async function () {
      const oWeb = await sp.site.rootWeb();
      const webIDResult: IOpenWebByIdResult = await sp.site.openWebById(oWeb.Id);
      return expect(webIDResult).to.haveOwnProperty("data");
    });

    it(".openWebById - chainable", async function () {
      const oWeb = await sp.site.rootWeb();
      const webIDResult: IOpenWebByIdResult = await sp.site.openWebById(oWeb.Id);
      return expect(webIDResult.web.lists()).to.eventually.be.fulfilled;
    });

    it(".exists", async function () {
      const oWeb = await sp.site();
      const exists: boolean = await sp.site.exists(oWeb.Url);
      const notExists: boolean = await sp.site.exists(`${oWeb.Url}/RANDOM`);
      const success = exists && !notExists;
      return expect(success).to.be.true;
    });
  }
});

// commented out as we can't have tests that require editing when run.
// need to revisit
// describe("Delete site", () => {
//     if (testSettings.enableWebTests) {
//         it(".delete", async function () {
//             const randomNum = getRandomString(5);
//             const ownersEmailID: string = "contosouser@contoso.onmicrosoft.com"; //Enter site owner"s email id
//             await sp.site.createCommunicationSite(
//                 "commSite" + randomNum, 1033,
//                 false,
//                 testSettings.sp.webUrl + "/sites/commSite" + randomNum,
//                 "TestModernTeamSite01", "HBI",
//                 "00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000",
//                 ownersEmailID);
//             const oSite = Site(testSettings.sp.webUrl + "/sites/commSite" + randomNum);
//             return expect(oSite.delete()).to.eventually.be.fulfilled;
//         });
//     }
// });

// describe("createModern Team & Comm Sites", () => {
//     if (testSettings.enableWebTests) {
//         it(".createModernTeamSite", function () {
//             const randomNum = getRandomString(5);
//             const ownersEmailID: string = "contosouser@contoso.onmicrosoft.com"; //Enter site owner"s email id
//             expect(sp.site.createModernTeamSite(
//                 "TestModernTeamSite01" + randomNum,
//                 "Alias",
//                 false,
//                 1033,
//                 "TestModernTeamSite01" + randomNum + " description", "HBI", [ownersEmailID])).to.eventually.be.fulfilled;
//         });

//         it(".createCommunicationSite", function () {
//             const randomNum = getRandomString(5);
//             const ownersEmailID: string = "contosouser@contoso.onmicrosoft.com"; //Enter site owner"s email id
//             expect(sp.site.createCommunicationSite(
//                 "commSite" + randomNum, 1033,
//                 false,
//                 testSettings.sp.webUrl + "/sites/commSite" + randomNum,
//                 "TestModernTeamSite01", "HBI",
//                 "00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000",
//                 ownersEmailID)).to.eventually.be.fulfilled;
//         });
//     }
// });

import { expect } from "chai";
import { spfi } from "@pnp/sp";
import { SPDefault } from "@pnp/nodejs";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import { getSP, testSettings } from "../main.js";
import { IDocumentLibraryInformation, IContextInfo, IOpenWebByIdResult } from "@pnp/sp/sites";
import { IWeb } from "@pnp/sp/webs";
import { combine, getRandomString } from "@pnp/core";
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

        // TODO: This throws error regarding observers
        it(".getRootWeb", async function () {
            const rootWeb: IWeb = await _spfi.site.getRootWeb();
            return expect(rootWeb).to.haveOwnProperty("url");
        });

        // TODO: This throw timeout error because post never returns
        it(".getContextInfo", async function () {
            const oContext: IContextInfo = await _spfi.site.getContextInfo();
            return expect(oContext).to.haveOwnProperty("SiteFullUrl");
        });

        // TODO: This doesn't work, and maybe is no longer valid since it seems to be meant to run from app
        it(".getDocumentLibraries", async function () {
            const webInfo: { ServerRelativeUrl: string; Url: string } = await _spfi.web.select("ServerRelativeUrl", "Url")();
            const docLibs: IDocumentLibraryInformation[] = await _spfi.site.getDocumentLibraries(webInfo.Url);
            return docLibs.forEach((docLib) => {
                expect(docLib).to.haveOwnProperty("Title");
            });
        });

        // TODO: This doesn't work, and maybe is no longer valid since it seems to be meant to run from app
        it(".getWebUrlFromPageUrl", async function () {
            const webInfo: { ServerRelativeUrl: string; Url: string } = await _spfi.web.select("ServerRelativeUrl", "Url")();
            const path = combine(webInfo.Url, "SitePages", "Home.aspx");
            const webUrl: string = await _spfi.site.getWebUrlFromPageUrl(path);
            return expect(webUrl).to.be.equal(testSettings.sp.testWebUrl);
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

describe("createModern Team & Comm Sites", function () {
    if (testSettings.enableWebTests && testSettings.testUser?.length > 0) {
        let _spfi: SPFI = null;
        let testUserEmail = "";
        let commSiteUrl = "";
        let teamSiteUrl = "";

        before(function () {
            _spfi = getSP();

            const testUserEmailArray = testSettings.testUser.split("|");
            testUserEmail = testUserEmailArray[testUserEmailArray.length - 1];
        });

        after(async function () {
            if (commSiteUrl.length > 0) {
                const spComm = spfi(commSiteUrl).using(SPDefault({
                    msal: {
                        config: testSettings.sp.msal.init,
                        scopes: testSettings.sp.msal.scopes,
                    },
                }));
                await spComm.site.delete();
            }
            if (teamSiteUrl.length > 0) {
                const spTeam = spfi(teamSiteUrl).using(SPDefault({
                    msal: {
                        config: testSettings.sp.msal.init,
                        scopes: testSettings.sp.msal.scopes,
                    },
                }));
                await spTeam.site.delete();
            }
        });

        // TODO: Verify this is still valid, timing out.
        it.skip(".createModernTeamSite", async function () {
            this.timeout(90000);
            const randomNum = getRandomString(5);
            const teamSite = await _spfi.site.createModernTeamSite(
                "TestModernTeamSite01" + randomNum,
                "Alias",
                false,
                1033,
                "TestModernTeamSite01" + randomNum + " description", "HBI", [testUserEmail]);
            teamSiteUrl = teamSite.SiteUrl;
            return expect(teamSite.SiteUrl).length.to.be.greaterThan(0);
        });

        // TODO: Verify this is still valid, timing out.
        it.skip(".createCommunicationSite", async function () {
            this.timeout(90000);
            const randomNum = getRandomString(5);
            const commSite = await _spfi.site.createCommunicationSite(
                "TestModernCommSite01" + randomNum, 1033,
                false,
                testSettings.sp.testWebUrl + "/sites/commSite" + randomNum,
                "TestModernCommSite01", "HBI",
                "00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000",
                testUserEmail);
            commSiteUrl = commSite.SiteUrl;
            return expect(commSite.SiteUrl).length.to.be.greaterThan(0);
        });
    }
});

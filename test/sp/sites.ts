import { expect } from "chai";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import { getSP } from "../main.js";
import { IDocumentLibraryInformation, IContextInfo, IOpenWebByIdResult } from "@pnp/sp/sites";
import { IWeb } from "@pnp/sp/webs";
import { combine, getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { SPFI } from "@pnp/sp";

describe("Sites", function () {

    let _spfi: SPFI = null;

    before(function () {

        if (!this.settings.enableWebTests) {
            this.skip();
        }

        _spfi = getSP();
    });

    it("rootWeb", async function () {
        return expect(_spfi.site.rootWeb()).to.eventually.be.fulfilled;
    });

    it("getRootWeb", async function () {
        const rootWeb: IWeb = await _spfi.site.getRootWeb();
        return expect(rootWeb).to.haveOwnProperty("_url");
    });

    it("getContextInfo", async function () {
        const oContext: IContextInfo = await _spfi.site.getContextInfo();
        return expect(oContext).to.haveOwnProperty("SiteFullUrl");
    });

    it("getDocumentLibraries", async function () {
        const webInfo: { ServerRelativeUrl: string; Url: string } = await _spfi.web.select("Url")();
        const docLibs: IDocumentLibraryInformation[] = await _spfi.site.getDocumentLibraries(webInfo.Url);
        return docLibs.forEach((docLib) => {
            expect(docLib).to.haveOwnProperty("Title");
        });
    });

    it("getWebUrlFromPageUrl", async function () {
        const webInfo: { ServerRelativeUrl: string; Url: string } = await _spfi.web.select("ServerRelativeUrl", "Url")();
        const path = combine(webInfo.Url, "SitePages", "Home.aspx");
        const webUrl: string = await _spfi.site.getWebUrlFromPageUrl(path);
        return expect(webUrl).to.be.equal(this.settings.sp.testWebUrl);
    });

    it("openWebById", async function () {
        const oWeb = await _spfi.site.rootWeb();
        const webIDResult: IOpenWebByIdResult = await _spfi.site.openWebById(oWeb.Id);
        return expect(webIDResult).to.haveOwnProperty("data");
    });

    it("openWebById - chainable", async function () {
        const oWeb = await _spfi.site.rootWeb();
        const webIDResult: IOpenWebByIdResult = await _spfi.site.openWebById(oWeb.Id);
        return expect(webIDResult.web.lists()).to.eventually.be.fulfilled;
    });

    it("exists", async function () {
        const oWeb = await _spfi.site();
        const exists: boolean = await _spfi.site.exists(oWeb.Url);
        const notExists: boolean = await _spfi.site.exists(`${oWeb.Url}/RANDOM`);
        const success = exists && !notExists;
        return expect(success).to.be.true;
    });
});

describe("createModern Team & Comm Sites", function () {

    let _spfi: SPFI = null;
    let testUserEmail = "";

    before(function () {

        if (!this.settings.enableWebTests || stringIsNullOrEmpty(this.settings.testUser)) {
            this.skip();
        }

        _spfi = getSP();

        const testUserEmailArray = this.settings.testUser.split("|");
        testUserEmail = testUserEmailArray[testUserEmailArray.length - 1];
    });

    // these work but permissions are wonky
    it.skip(".createModernTeamSite", async function () {
        this.timeout(90000);
        const randomNum = getRandomString(5);
        const promise = _spfi.site.createModernTeamSite(
            "TestModernTeamSite01" + randomNum,
            "Alias",
            false,
            1033,
            "TestModernTeamSite01" + randomNum + " description", "HBI", [testUserEmail]);

        return expect(promise).to.eventually.be.fulfilled;
    });

    // these work but permissions are wonky
    it.skip(".createCommunicationSite", async function () {
        this.timeout(90000);
        const randomNum = getRandomString(5);
        const promise = _spfi.site.createCommunicationSite(
            "TestModernCommSite01" + randomNum, 1033,
            false,
            this.settings.sp.testWebUrl + "/sites/commSite" + randomNum,
            "TestModernCommSite01", "HBI",
            "00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000",
            testUserEmail);

        return expect(promise).to.eventually.be.fulfilled;
    });
});

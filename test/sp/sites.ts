import { expect } from "chai";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import { IDocumentLibraryInformation, IOpenWebByIdResult, ISiteLogoProperties, Site, SiteLogoAspect, SiteLogoType } from "@pnp/sp/sites";
import { IWeb } from "@pnp/sp/webs";
import { combine, getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { IContextInfo } from "@pnp/sp/context-info";
import "@pnp/sp/context-info";


import "@pnp/sp/files";
import { IFiles } from "@pnp/sp/files";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import findupSync from "findup-sync";

// get a single reference to the projectRoot
const projectRoot = resolve(dirname(findupSync("package.json")));

describe("Sites", function () {

    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    it("rootWeb", async function () {
        return expect(this.pnp.sp.site.rootWeb()).to.eventually.be.fulfilled;
    });

    it("getRootWeb", async function () {
        const rootWeb: IWeb = await this.pnp.sp.site.getRootWeb();
        return expect(rootWeb).to.haveOwnProperty("_url");
    });

    it("getContextInfo", async function () {
        const oContext: IContextInfo = await this.pnp.sp.site.getContextInfo();
        return expect(oContext).to.haveOwnProperty("SiteFullUrl");
    });

    it("getDocumentLibraries", async function () {
        const webInfo: { ServerRelativeUrl: string; Url: string } = await this.pnp.sp.web.select("Url")();
        const docLibs: IDocumentLibraryInformation[] = await this.pnp.sp.site.getDocumentLibraries(webInfo.Url);
        return docLibs.forEach((docLib) => {
            expect(docLib).to.haveOwnProperty("Title");
        });
    });

    it("getWebUrlFromPageUrl", async function () {
        const webInfo: { ServerRelativeUrl: string; Url: string } = await this.pnp.sp.web.select("ServerRelativeUrl", "Url")();
        const path = combine(webInfo.Url, "SitePages", "Home.aspx");
        const webUrl: string = await this.pnp.sp.site.getWebUrlFromPageUrl(path);
        return expect(webUrl).to.be.equal(this.pnp.settings.sp.testWebUrl);
    });

    it("openWebById", async function () {
        const oWeb = await this.pnp.sp.site.rootWeb();
        const webIDResult: IOpenWebByIdResult = await this.pnp.sp.site.openWebById(oWeb.Id);
        return expect(webIDResult).to.haveOwnProperty("data");
    });

    it("openWebById - chainable", async function () {
        const oWeb = await this.pnp.sp.site.rootWeb();
        const webIDResult: IOpenWebByIdResult = await this.pnp.sp.site.openWebById(oWeb.Id);
        return expect(webIDResult.web.lists()).to.eventually.be.fulfilled;
    });

    it("exists", async function () {
        const oWeb = await this.pnp.sp.site();
        const exists: boolean = await this.pnp.sp.site.exists(oWeb.Url);
        const notExists: boolean = await this.pnp.sp.site.exists(`${oWeb.Url}/RANDOM`);
        const success = exists && !notExists;
        return expect(success).to.be.true;
    });

    it("setSiteLogo", async function(){
        const files: IFiles = this.pnp.sp.web.defaultDocumentLibrary.rootFolder.files;
        const name = `Testing Chunked - ${getRandomString(4)}.jpg`;
        const content = readFileSync(resolve(projectRoot, "./test/sp/assets/sample_file.jpg"));
        const far = await files.addChunked(name, <any>content, null, true, 1000000);
        const path = far.data.ServerRelativeUrl;
        const logoProperties: ISiteLogoProperties = {relativeLogoUrl: path, aspect: SiteLogoAspect.Square, type: SiteLogoType.WebLogo};
        await this.pnp.sp.site.setSiteLogo(logoProperties);
    });
});

describe("Site static Tests", function () {

    it("properly parses different contructor args", function () {

        const s1 = Site("https://something.com");
        expect(s1.toUrl()).to.eq("https://something.com/_api/site");

        const s2 = Site("https://something.com/_api/site");
        expect(s2.toUrl()).to.eq("https://something.com/_api/site");

        const s3 = Site("https://something.com/_api/web/_api/site");
        expect(s3.toUrl()).to.eq("https://something.com/_api/site");

        const s4 = Site("https://something.com/_api/site/rootweb/something/random('asdfa')");
        expect(s4.toUrl()).to.eq("https://something.com/_api/site");

        const s5a = Site("https://something.com/");
        const s5b = Site(s5a);
        expect(s5b.toUrl()).to.eq("https://something.com/_api/site");

        const s6a = Site("https://something.com/_api/site/rootweb/something/random('asdfa')");
        const s6b = Site(s6a);
        expect(s6b.toUrl()).to.eq("https://something.com/_api/site");
    });
});

describe("createModern Team & Comm Sites", function () {

    let testUserEmail = "";

    before(function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const testUserEmailArray = this.pnp.settings.testUser.split("|");
        testUserEmail = testUserEmailArray[testUserEmailArray.length - 1];
    });

    // these work but permissions are wonky
    it.skip(".createModernTeamSite", async function () {
        const randomNum = getRandomString(5);
        const promise = this.pnp.sp.site.createModernTeamSite(
            "TestModernTeamSite01" + randomNum,
            "Alias",
            false,
            1033,
            "TestModernTeamSite01" + randomNum + " description", "HBI", [testUserEmail]);

        return expect(promise).to.eventually.be.fulfilled;
    });

    // these work but permissions are wonky
    it.skip(".createCommunicationSite", async function () {
        const randomNum = getRandomString(5);
        const promise = this.pnp.sp.site.createCommunicationSite(
            "TestModernCommSite01" + randomNum, 1033,
            false,
            this.pnp.settings.sp.testWebUrl + "/sites/commSite" + randomNum,
            "TestModernCommSite01", "HBI",
            "00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000",
            testUserEmail);

        return expect(promise).to.eventually.be.fulfilled;
    });
});

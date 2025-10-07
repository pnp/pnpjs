import { expect } from "chai";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import { IDocumentLibraryInformation, IOpenWebByIdResult, ISiteLogoProperties, Site, SiteLogoAspect, SiteLogoType } from "@pnp/sp/sites";
import "@pnp/sp/site-users";
import { IWeb } from "@pnp/sp/webs";
import { combine, getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { IContextInfo } from "@pnp/sp/context-info";
import "@pnp/sp/context-info";
import { ISiteUserInfo } from "@pnp/sp/site-users";
import "@pnp/sp/files";
import { IFiles } from "@pnp/sp/files";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import findupSync from "findup-sync";
import { pnpTest } from  "../pnp-test.js";


// get a single reference to the projectRoot
const projectRoot = resolve(dirname(findupSync("package.json")));

describe("Sites", function () {

    before(pnpTest("781bf285-c704-4b52-a686-86f1e5025480", function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    }));

    it("rootWeb", pnpTest("6520f73d-a59a-43fd-96d8-b7ca78394643", async function () {
        return expect(this.pnp.sp.site.rootWeb()).to.eventually.be.fulfilled;
    }));

    it("getRootWeb", pnpTest("d427fa8e-b7dd-469f-9ebe-f62a870b196f", async function () {
        const rootWeb: IWeb = await this.pnp.sp.site.getRootWeb();
        return expect(rootWeb).to.haveOwnProperty("_url");
    }));

    it("rootWeb - ensureUser", pnpTest("9a1eaea7-9e28-482a-882d-580b0188fa30", async function () {
        const user: ISiteUserInfo = await this.pnp.sp.site.rootWeb.ensureUser(this.pnp.settings.testUser);
        return expect(user).to.haveOwnProperty("Id");
    }));

    it("getContextInfo", pnpTest("76d57c73-4742-44c4-8f86-70800aa19714", async function () {
        const oContext: IContextInfo = await this.pnp.sp.site.getContextInfo();
        return expect(oContext).to.haveOwnProperty("SiteFullUrl");
    }));

    it("getDocumentLibraries", pnpTest("012633b2-324c-4e93-9731-03d17aefeb10", async function () {
        const webInfo: { ServerRelativeUrl: string; Url: string } = await this.pnp.sp.web.select("Url")();
        const docLibs: IDocumentLibraryInformation[] = await this.pnp.sp.site.getDocumentLibraries(webInfo.Url);
        return docLibs.forEach((docLib) => {
            expect(docLib).to.haveOwnProperty("Title");
        });
    }));

    it("getWebUrlFromPageUrl", pnpTest("d016be17-3ded-460f-b54f-4d1df0c47486", async function () {
        const webInfo: { ServerRelativeUrl: string; Url: string } = await this.pnp.sp.web.select("ServerRelativeUrl", "Url")();
        const path = combine(webInfo.Url, "SitePages", "Home.aspx");
        const webUrl: string = await this.pnp.sp.site.getWebUrlFromPageUrl(path);
        return expect(webUrl).to.be.equal(this.pnp.settings.sp.testWebUrl);
    }));

    it("openWebById", pnpTest("6637f342-be90-4262-bcff-8ba5dedfd50a", async function () {
        const oWeb = await this.pnp.sp.site.rootWeb();
        const webIDResult: IOpenWebByIdResult = await this.pnp.sp.site.openWebById(oWeb.Id);
        return expect(webIDResult).to.haveOwnProperty("data");
    }));

    it("openWebById - chainable", pnpTest("e5e94cfb-19c2-42e4-b882-e240c6712f84", async function () {
        const oWeb = await this.pnp.sp.site.rootWeb();
        const webIDResult: IOpenWebByIdResult = await this.pnp.sp.site.openWebById(oWeb.Id);
        return expect(webIDResult.web.lists()).to.eventually.be.fulfilled;
    }));

    it("exists", pnpTest("3289ffab-ad6e-4739-8898-cdedf855a793", async function () {
        const oWeb = await this.pnp.sp.site();
        const exists: boolean = await this.pnp.sp.site.exists(oWeb.Url);
        const notExists: boolean = await this.pnp.sp.site.exists(`${oWeb.Url}/RANDOM`);
        const success = exists && !notExists;
        return expect(success).to.be.true;
    }));

    it("setSiteLogo", pnpTest("79e64e43-90d3-497a-b265-886ddd78abaa", async function(){
        const files: IFiles = this.pnp.sp.web.defaultDocumentLibrary.rootFolder.files;
        const { name } = await this.props({
            name:  `Testing Chunked - ${getRandomString(4)}.jpg`,
        });
        const content = readFileSync(resolve(projectRoot, "./test/sp/assets/sample_file.jpg"));
        const far = await files.addChunked(name, <any>content, null);
        const path = far.ServerRelativeUrl;
        const logoProperties: ISiteLogoProperties = {relativeLogoUrl: path, aspect: SiteLogoAspect.Square, type: SiteLogoType.WebLogo};
        await this.pnp.sp.site.setSiteLogo(logoProperties);
    }));
});

describe("Site static Tests", function () {

    it("properly parses different contructor args", pnpTest("5a8cd091-de68-436e-9f02-10506fe78024", function () {

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
    }));
});

describe("createModern Team & Comm Sites", function () {

    let testUserEmail = "";

    before(pnpTest("785c7861-7cf0-45d6-b712-28e5c4a5e4db", function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const testUserEmailArray = this.pnp.settings.testUser.split("|");
        testUserEmail = testUserEmailArray[testUserEmailArray.length - 1];
    }));

    // these work but permissions are wonky
    it.skip(".createModernTeamSite", pnpTest("620885bd-a76d-45b2-96b8-b2a696bb3bfb", async function () {
        const { randomNum } = await this.props({
            randomNum: getRandomString(5),
        });

        const promise = this.pnp.sp.site.createModernTeamSite(
            "TestModernTeamSite01" + randomNum,
            "Alias",
            false,
            1033,
            "TestModernTeamSite01" + randomNum + " description", "HBI", [testUserEmail]);

        return expect(promise).to.eventually.be.fulfilled;
    }));

    // these work but permissions are wonky
    it.skip(".createCommunicationSite", pnpTest("5bb3b3c9-7824-409a-b44f-6df4bc08a889", async function () {
        const { randomNum } = await this.props({
            randomNum: getRandomString(5),
        });
        const promise = this.pnp.sp.site.createCommunicationSite(
            "TestModernCommSite01" + randomNum, 1033,
            false,
            this.pnp.settings.sp.testWebUrl + "/sites/commSite" + randomNum,
            "TestModernCommSite01", "HBI",
            "00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000",
            testUserEmail);

        return expect(promise).to.eventually.be.fulfilled;
    }));
});

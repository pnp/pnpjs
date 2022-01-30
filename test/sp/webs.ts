import { getSP } from "../main.js";
import { combine, getRandomString } from "@pnp/core";
import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/content-types/web";
import "@pnp/sp/lists/web";
import "@pnp/sp/navigation/web";
import "@pnp/sp/site-users/web";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/folders/web";
import "@pnp/sp/files/web";
import "@pnp/sp/user-custom-actions/web";
import "@pnp/sp/related-items/web";
import "@pnp/sp/fields/web";
import "@pnp/sp/features/web";
import "@pnp/sp/hubsites/web";
import "@pnp/sp/appcatalog";
import "@pnp/sp/regional-settings/web";
import "@pnp/sp/clientside-pages";
import "@pnp/sp/security";
import { SPFI } from "@pnp/sp";
import { INavNodeInfo } from "@pnp/sp/navigation/types.js";
import testSPInvokables from "../test-invokable-props.js";
import { Web } from "@pnp/sp/webs";

describe("Webs", function () {

    let _spfi: SPFI = null;

    before(function () {

        if (!this.settings.enableWebTests) {
            this.skip();
        }

        _spfi = getSP();
    });

    it.skip("add 1", function () {
        const title = `Test_ChildWebAdd1_${getRandomString(8)}`;
        return expect(_spfi.web.webs.add(title, title)).to.eventually.be.fulfilled;
    });

    it.skip("add 2", function () {
        const title = `Test_ChildWebAdd2_${getRandomString(8)}`;
        return expect(_spfi.web.webs.add(title, title, "description", "FunSite#0", 1033, false)).to.eventually.be.fulfilled;
    });
});

describe("Web static Tests", function () {

    it("properly parses different contructor args", function () {

        const w1 = Web("https://something.com");
        expect(w1.toUrl(), "test 1").to.eq("https://something.com/_api/web");

        const w2 = Web("https://something.com/_api/web");
        expect(w2.toUrl(), "test 2").to.eq("https://something.com/_api/web");

        const w3 = Web("https://something.com/_api/web/_api/web");
        expect(w3.toUrl(), "test 3").to.eq("https://something.com/_api/web");

        const w4 = Web("https://something.com/_api/web/lists/getById('2984791847')/items");
        expect(w4.toUrl(), "test 4").to.eq("https://something.com/_api/web");

        const w5a = Web("https://something.com/");
        const w5b = Web(w5a);
        expect(w5b.toUrl(), "test 5").to.eq("https://something.com/_api/web");

        const w6a = Web("https://something.com/_api/web/rootweb/something/random('asdfa')");
        const w6b = Web(w6a);
        expect(w6b.toUrl(), "test 6").to.eq("https://something.com/_api/web");
    });
});

describe("Web", function () {

    let _spfi: SPFI = null;

    before(function () {

        if (!this.settings.enableWebTests) {
            this.skip();
        }

        _spfi = getSP();
    });

    describe("Invokable Properties", testSPInvokables(() => _spfi.web,
        "roleDefinitions",
        "webs",
        "contentTypes",
        "lists",
        "siteUserInfoList",
        "defaultDocumentLibrary",
        "customListTemplates",
        "siteUsers",
        "siteGroups",
        "userCustomActions",
        "allProperties",
        "webinfos",
        "features",
        "fields",
        "availablefields",
        "folders",
        "rootFolder",
        "regionalSettings"));

    it("navigation", async function () {
        const ql: INavNodeInfo[] = await _spfi.web.navigation.quicklaunch();
        const tn: INavNodeInfo[] = await _spfi.web.navigation.topNavigationBar();
        const success = (ql.constructor === Array) && (tn.constructor === Array);
        return expect(success).to.be.true;
    });

    it("getParentWeb", async function () {

        const v = await _spfi.web.getParentWeb();
        const parentWeb = await v.select("Title")();

        return expect(parentWeb).to.haveOwnProperty("Title");
    });

    it("getSubwebsFilteredForCurrentUser", async function () {

        return expect(_spfi.web.getSubwebsFilteredForCurrentUser()()).to.eventually.be.fulfilled;
    });

    it("update", function () {

        const p = _spfi.web.select("Title")<{ Title: string }>().then(function (w) {

            const newTitle = w.Title + " updated";
            _spfi.web.update({ Title: newTitle }).then(function () {

                _spfi.web.select("Title")<{ Title: string }>().then(function (w2) {
                    if (w2.Title !== newTitle) {
                        throw Error("Update web failed");
                    }
                });
            });
        });

        return expect(p).to.eventually.be.fulfilled;
    });

    // skipping this test as the code hasn't changed in years and it takes longer than any other test
    it.skip(".applyTheme", function () {

        // this takes a long time to process
        this.timeout(60000);

        const index = this.settings.sp.testWebUrl.indexOf("/sites/");
        const colorUrl = "/" + combine(this.settings.sp.testWebUrl.substr(index), "/_catalogs/theme/15/palette011.spcolor");
        const fontUrl = "/" + combine(this.settings.sp.testWebUrl.substr(index), "/_catalogs/theme/15/fontscheme007.spfont");

        return expect(_spfi.web.applyTheme(colorUrl, fontUrl, "", false)).to.eventually.be.fulfilled;
    });

    // Cannot test because once a template has been applied a new site must be created to apply a different template
    it("applyWebTemplate");

    it("availableWebTemplates", async function () {

        const webTemplates = await _spfi.web.availableWebTemplates()();
        return expect(webTemplates).to.be.an.instanceOf(Array).and.be.not.empty;
    });

    it("getChanges", function () {

        return expect(_spfi.web.getChanges({
            Add: true,
        })).to.eventually.be.fulfilled;
    });

    it("mapToIcon", function () {

        return expect(_spfi.web.mapToIcon("test.docx")).to.eventually.be.fulfilled;
    });

    it("delete", async function () {
        this.timeout(60000);
        const url = getRandomString(4);
        const result = await _spfi.web.webs.add("Better be deleted!", url);
        return expect(result.web.delete()).to.eventually.be.fulfilled;
    });

    describe("client-side-pages", function () {
        it("getClientSideWebParts", async function () {
            const webparts = await _spfi.web.getClientsideWebParts();
            return expect(webparts).to.be.an.instanceOf(Array).and.be.not.empty;
        });
    });

    describe("files", function () {
        it("getFileByServerRelativePath", async function () {
            const w = await _spfi.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
            const path = combine("/", w.ServerRelativeUrl, "SitePages", "Home.aspx");
            const file = await _spfi.web.getFileByServerRelativePath(path)();
            return expect(file.Name).to.equal("Home.aspx");
        });
    });

    describe("folders", function () {
        it("getFolderByServerRelativePath", async function () {
            const w = await _spfi.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
            const path = combine("/", w.ServerRelativeUrl, "SitePages");
            const folder = await _spfi.web.getFolderByServerRelativePath(path)();
            return expect(folder.Name).to.equal("SitePages");
        });
    });

    describe("hub-sites", function () {

        it("hubSiteData", async function () {

            return expect(_spfi.web.hubSiteData()).to.eventually.be.fulfilled;
        });

        it("hubSiteData force refresh", async function () {

            return expect(_spfi.web.hubSiteData(true)).to.eventually.be.fulfilled;
        });

        it("syncHubSiteTheme", async function () {

            return expect(_spfi.web.syncHubSiteTheme()).to.eventually.be.fulfilled;
        });
    });

    describe("lists", function () {

        it("getList", async function () {
            const w = await _spfi.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
            const url = combine(w.ServerRelativeUrl, "SitePages");
            const list = await _spfi.web.getList(url)();
            return expect(list.Title).to.equal("Site Pages");
        });

        it("getCatalog", function () {
            return expect(_spfi.web.getCatalog(113)).to.eventually.be.fulfilled;
        });
    });

    describe("related-items", function () {

        it("relatedItems", function () {

            return expect(_spfi.web.relatedItems).to.not.be.null;
        });
    });

    describe("site-users", function () {

        it("getUserById", async function () {

            const users = await _spfi.web.siteUsers();
            return expect(_spfi.web.getUserById(users[0].Id)()).to.eventually.be.fulfilled;
        });
    });
});

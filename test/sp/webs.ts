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
import { INavNodeInfo } from "@pnp/sp/navigation/types.js";
import testSPInvokables from "../test-invokable-props.js";
import { Web } from "@pnp/sp/webs";
import { odataUrlFrom } from "@pnp/sp/index.js";
import { pnpTest } from  "../pnp-test.js";

describe("Webs", function () {

    before(pnpTest("57cfa766-4c2d-4fff-bf35-6e5afd9d0a64", function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    }));

    it.skip("add 1", pnpTest("61ddec50-3a26-4f86-8533-db877ea2a9b1", async function () {
        const { title } = await this.props({
            title: `Test_ChildWebAdd1_${getRandomString(8)}`,
        });
        return expect(this.pnp.sp.web.webs.add(title, title)).to.eventually.be.fulfilled;
    }));

    it.skip("add 2", pnpTest("c14299f9-f7cb-4ed9-96c7-23e9dc909b57", async function () {
        const { title } = await this.props({
            title: `Test_ChildWebAdd2_${getRandomString(8)}`,
        });
        return expect(this.pnp.sp.web.webs.add(title, title, "description", "FunSite#0", 1033, false)).to.eventually.be.fulfilled;
    }));
});

describe("Web static Tests", function () {

    it("properly parses different contructor args", pnpTest("7de50478-c993-491c-8396-a3eebdca218b", function () {

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
    }));
});

describe("Web", function () {

    let web;
    before(pnpTest("e30dc931-b878-4705-bd88-15676e579140", function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
        web = this.pnp.sp.web;
    }));

    describe("Invokable Properties", testSPInvokables(() => web,
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

    it("navigation", pnpTest("555db6e1-e6c7-493c-8349-26c41d4d8407", async function () {
        const ql: INavNodeInfo[] = await this.pnp.sp.web.navigation.quicklaunch();
        const tn: INavNodeInfo[] = await this.pnp.sp.web.navigation.topNavigationBar();
        const success = (ql.constructor === Array) && (tn.constructor === Array);
        return expect(success).to.be.true;
    }));

    it("getParentWeb", pnpTest("e2645702-8016-4694-a2b1-af7fb23084e5", async function () {

        const v = await this.pnp.sp.web.getParentWeb();
        const parentWeb = await v.select("Title")();

        return expect(parentWeb).to.haveOwnProperty("Title");
    }));

    it("getSubwebsFilteredForCurrentUser", pnpTest("6c5a040b-ba43-47c4-b7ec-d0d590840bcf", async function () {

        return expect(this.pnp.sp.web.getSubwebsFilteredForCurrentUser()()).to.eventually.be.fulfilled;
    }));

    it("update", pnpTest("1553ecce-e261-4bb2-a62c-49280a680314", function () {

        const p = this.pnp.sp.web.select("Title")<{ Title: string }>().then((w) => {

            const newTitle = w.Title + " updated";
            this.pnp.sp.web.update({ Title: newTitle }).then(() => {

                this.pnp.sp.web.select("Title")<{ Title: string }>().then(function (w2) {
                    if (w2.Title !== newTitle) {
                        throw Error("Update web failed");
                    }
                });
            });
        });

        return expect(p).to.eventually.be.fulfilled;
    }));

    // skipping this test as the code hasn't changed in years and it takes longer than any other test
    it.skip("applyTheme", pnpTest("90f13f59-aa23-4dfd-a1f1-54d9cfe2876e", function () {

        const index = this.pnp.settings.sp.testWebUrl.indexOf("/sites/");
        const colorUrl = "/" + combine(this.pnp.settings.sp.testWebUrl.substr(index), "/_catalogs/theme/15/palette011.spcolor");
        const fontUrl = "/" + combine(this.pnp.settings.sp.testWebUrl.substr(index), "/_catalogs/theme/15/fontscheme007.spfont");

        return expect(this.pnp.sp.web.applyTheme(colorUrl, fontUrl, "", false)).to.eventually.be.fulfilled;
    }));

    // Cannot test because once a template has been applied a new site must be created to apply a different template
    it("applyWebTemplate");

    it("availableWebTemplates", pnpTest("23a10600-c86b-44f5-a02c-ff14c7421041", async function () {

        const webTemplates = await this.pnp.sp.web.availableWebTemplates()();
        return expect(webTemplates).to.be.an.instanceOf(Array).and.be.not.empty;
    }));

    it("getChanges", pnpTest("1d70d66b-b2a1-4201-b7d7-0b77fb406d6b", function () {

        return expect(this.pnp.sp.web.getChanges({
            Add: true,
        })).to.eventually.be.fulfilled;
    }));

    it("mapToIcon", pnpTest("85adfc09-bc55-4c34-a9a7-ddf746c77473", function () {

        return expect(this.pnp.sp.web.mapToIcon("test.docx")).to.eventually.be.fulfilled;
    }));

    it("delete", pnpTest("9da55038-1275-4ab3-a998-b49866164e21", async function () {
        const { url } = await this.props({
            url: getRandomString(4),
        });
        const result = await this.pnp.sp.web.webs.add("Better be deleted!", url);
        const web = Web([this.pnp.sp.web, odataUrlFrom(result).replace(/_api\/web\/?/i, "")]);
        return expect(web.delete()).to.eventually.be.fulfilled;
    }));

    describe("client-side-pages", function () {
        it("getClientSideWebParts", pnpTest("d04fb097-095e-427f-80ef-b511d89121a2", async function () {
            const webparts = await this.pnp.sp.web.getClientsideWebParts();
            return expect(webparts).to.be.an.instanceOf(Array).and.be.not.empty;
        }));
    });

    describe("files", function () {
        it("getFileByServerRelativePath", pnpTest("ac750594-f4fc-48c5-9ec7-45eb6c324e99", async function () {
            const w = await this.pnp.sp.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
            const path = combine("/", w.ServerRelativeUrl, "SitePages", "Home.aspx");
            const file = await this.pnp.sp.web.getFileByServerRelativePath(path)();
            return expect(file.Name).to.equal("Home.aspx");
        }));
    });

    describe("folders", function () {
        it("getFolderByServerRelativePath", pnpTest("2a316726-ffc4-487d-8fa7-42d8318a10e7", async function () {
            const w = await this.pnp.sp.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
            const path = combine("/", w.ServerRelativeUrl, "SitePages");
            const folder = await this.pnp.sp.web.getFolderByServerRelativePath(path)();
            return expect(folder.Name).to.equal("SitePages");
        }));
    });

    describe("hub-sites", function () {

        it("hubSiteData", pnpTest("49c0a055-f10d-4307-9063-638d2a92b4fc", async function () {

            return expect(this.pnp.sp.web.hubSiteData()).to.eventually.be.fulfilled;
        }));

        it("hubSiteData force refresh", pnpTest("5d82d5b7-0edd-498c-9c1b-d03c2f5717cc", async function () {

            return expect(this.pnp.sp.web.hubSiteData(true)).to.eventually.be.fulfilled;
        }));

        it("syncHubSiteTheme", pnpTest("a6dc0f37-5fef-4b3a-8e40-6aca1bad481d", async function () {

            return expect(this.pnp.sp.web.syncHubSiteTheme()).to.eventually.be.fulfilled;
        }));
    });

    describe("lists", function () {

        it("getList", pnpTest("fd10db2b-59b0-4eba-8b6e-40693e2f805f", async function () {
            const w = await this.pnp.sp.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
            const url = combine(w.ServerRelativeUrl, "SitePages");
            const list = await this.pnp.sp.web.getList(url)();
            return expect(list.Title).to.equal("Site Pages");
        }));

        it("getCatalog", pnpTest("cb7a6857-7e1e-4311-b267-fe5a2dcf71c9", function () {
            return expect(this.pnp.sp.web.getCatalog(113)).to.eventually.be.fulfilled;
        }));
    });

    describe("related-items", function () {

        it("relatedItems", pnpTest("d2475474-499c-4d24-b0a5-27d92a0b0756", function () {

            return expect(this.pnp.sp.web.relatedItems).to.not.be.null;
        }));
    });

    describe("site-users", function () {

        it("getUserById", pnpTest("e4e2c8df-faab-480f-ad55-b0f1622e05a2", async function () {

            const users = await this.pnp.sp.web.siteUsers();
            return expect(this.pnp.sp.web.getUserById(users[0].Id)()).to.eventually.be.fulfilled;
        }));
    });
});

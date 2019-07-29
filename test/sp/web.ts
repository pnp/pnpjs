import { combine, getRandomString } from "@pnp/common";
import { expect } from "chai";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/content-types/web";
import "@pnp/sp/src/lists/web";
import "@pnp/sp/src/navigation/web";
import "@pnp/sp/src/site-users/web";
import "@pnp/sp/src/site-groups/web";
import "@pnp/sp/src/folders/web";
import "@pnp/sp/src/files/web";
import "@pnp/sp/src/user-custom-actions/web";
import "@pnp/sp/src/security";
import "@pnp/sp/src/appcatalog";
import "@pnp/sp/src/related-items/web";
import { sp } from "@pnp/sp";
import { testSettings } from "../main";
import { IInvokableTest } from "../types";

describe("Webs", function () {

    if (testSettings.enableWebTests) {

        it(".add 1", function () {

            const title = `Test_ChildWebAdd1_${getRandomString(8)}`;
            return expect(sp.web.webs.add(title, title)).to.eventually.be.fulfilled;
        });

        it(".add 2", function () {

            const title = `Test_ChildWebAdd2_${getRandomString(8)}`;
            return expect(sp.web.webs.add(title, title, "description", "FunSite#0", 1033, false)).to.eventually.be.fulfilled;
        });
    }
});

describe("Web", () => {

    if (testSettings.enableWebTests) {

        describe("Invokable Properties", () => {

            const tests: IInvokableTest[] = [
                { desc: ".webs", test: sp.web.webs },
                { desc: ".contentTypes", test: sp.web.contentTypes },
                { desc: ".lists", test: sp.web.lists },
                { desc: ".siteUserInfoList", test: sp.web.siteUserInfoList },
                { desc: ".defaultDocumentLibrary", test: sp.web.defaultDocumentLibrary },
                { desc: ".customListTemplates", test: sp.web.customListTemplates },
                { desc: ".navigation", test: sp.web.navigation },
                { desc: ".siteUsers", test: sp.web.siteUsers },
                { desc: ".siteGroups", test: sp.web.siteGroups },
                { desc: ".folders", test: sp.web.folders },
                { desc: ".userCustomActions", test: sp.web.userCustomActions },
                { desc: ".roleDefinitions", test: sp.web.roleDefinitions },
                { desc: ".customListTemplate", test: sp.web.customListTemplates },
                { desc: ".currentUser", test: sp.web.currentUser },
                { desc: ".allProperties", test: sp.web.allProperties },
                { desc: ".webinfos", test: sp.web.webinfos },
                { desc: ".features", test: sp.web.features },
                { desc: ".fields", test: sp.web.fields },
                { desc: ".availablefields", test: sp.web.availablefields },
                { desc: ".folders", test: sp.web.folders },
                { desc: ".rootFolder", test: sp.web.rootFolder },
                { desc: ".regionalSettings", test: sp.web.regionalSettings },
                { desc: ".associatedOwnerGroup", test: sp.web.associatedOwnerGroup },
                { desc: ".associatedMemberGroup", test: sp.web.associatedMemberGroup },
                { desc: ".associatedVisitorGroup", test: sp.web.associatedVisitorGroup },
            ];

            tests.forEach((testObj) => {

                const { test, desc } = testObj;
                it(desc, () => expect((<any>test)()).to.eventually.be.fulfilled);
            });
        });

        it(".getParentWeb", async function () {

            const v = await sp.web.getParentWeb();
            return expect(v).to.haveOwnProperty("data");
        });

        it(".getSubwebsFilteredForCurrentUser", async function () {

            return expect(sp.web.getSubwebsFilteredForCurrentUser()()).to.eventually.be.fulfilled;
        });

        it(".update", function () {

            const p = sp.web.select("Title").get<{ Title: string }>().then(function (w) {

                const newTitle = w.Title + " updated";
                sp.web.update({ Title: newTitle }).then(function () {

                    sp.web.select("Title").get<{ Title: string }>().then(function (w2) {
                        if (w2.Title !== newTitle) {
                            throw Error("Update web failed");
                        }
                    });
                });
            });

            return expect(p).to.eventually.be.fulfilled;
        });

        // commenting out this test as the code hasn't changed in years and it takes longer than any other test
        //     it(".applyTheme", function () {

        //         // this takes a long time to process
        //         this.timeout(60000);

        //         const index = testSettings.sp.url.indexOf("/sites/");
        //         const colorUrl = "/" + combine(testSettings.sp.url.substr(index), "/_catalogs/theme/15/palette011.spcolor");
        //         const fontUrl = "/" + combine(testSettings.sp.url.substr(index), "/_catalogs/theme/15/fontscheme007.spfont");

        //         return expect(sp.web.applyTheme(colorUrl, fontUrl, "", false)).to.eventually.be.fulfilled;
        //     });

        it(".applyWebTemplate", async function () {

            this.timeout(60000);

            const { web } = await sp.web.webs.add("ApplyWebTemplateTest", getRandomString(6), "Testing", "STS");
            const templates = (await web.availableWebTemplates().select("Name")<{ Name: string }[]>()).filter(t => /ENTERWIKI#0/i.test(t.Name));

            const template = templates.length > 0 ? templates[0].Name : "STS#0";

            // this will be rejected because a template was already applied and we can't
            // through REST create a site with no template
            return expect(web.applyWebTemplate(template)).to.eventually.be.rejected;
        });

        it(".availableWebTemplates", function () {

            return expect(sp.web.availableWebTemplates()()).to.eventually.be.an.instanceOf(Array).and.be.not.empty;
        });

        it(".getChanges", function () {

            return expect(sp.web.getChanges({
                Add: true,
            })).to.eventually.be.fulfilled;
        });

        it(".mapToIcon", function () {

            return expect(sp.web.mapToIcon("test.docx")).to.eventually.be.fulfilled;
        });

        it(".delete", async function () {

            this.timeout(60000);
            const url = getRandomString(4);
            const result = await sp.web.webs.add("Better be deleted!", url);
            return expect(result.web.delete()).to.eventually.be.fulfilled;
        });

        it("storage entity", async function () {

            const key = `testingkey_${getRandomString(4)}`;
            const value = "Test Value";

            const web = await sp.getTenantAppCatalogWeb();

            after(async () => {
                await web.removeStorageEntity(key);
            });

            await web.setStorageEntity(key, value);
            const v = await web.getStorageEntity(key);
            return expect(v.Value).to.equal(value);
        });

        it("storage entity with '", async function () {

            const key = `testingkey'${getRandomString(4)}`;
            const value = "Test Value";

            const web = await sp.getTenantAppCatalogWeb();

            after(async () => {
                await web.removeStorageEntity(key);
            });

            await web.setStorageEntity(key, value);
            const v = await web.getStorageEntity(key);
            return expect(v.Value).to.equal(value);
        });

        describe("appcatalog", () => {

            it(".getAppCatalog", async function () {

                const appCatWeb = await sp.getTenantAppCatalogWeb();
                const p = appCatWeb.getAppCatalog()();
                return expect(p).to.eventually.be.fulfilled;
            });
        });

        describe("client-side-pages", () => {

            it(".getClientSideWebParts", async function () {

                return expect(sp.web.getClientsideWebParts()).to.eventually.be.fulfilled;
            });

            it(".addClientSidePage");
        });

        describe("files", () => {

            let path = "";

            before(async () => {

                const w = await sp.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
                path = combine("/", w.ServerRelativeUrl, "SitePages", "Home.aspx");
            });

            it(".getFileByServerRelativeUrl", async function () {

                return expect(sp.web.getFileByServerRelativeUrl(path)()).to.eventually.be.fulfilled;
            });

            it(".getFileByServerRelativePath", async function () {

                return expect(sp.web.getFileByServerRelativePath(path)()).to.eventually.be.fulfilled;
            });
        });

        describe("folders", () => {

            let path = "";

            before(async () => {

                const w = await sp.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
                path = combine("/", w.ServerRelativeUrl, "SitePages");
            });

            it(".getFolderByServerRelativeUrl", async function () {

                return expect(sp.web.getFolderByServerRelativeUrl(path)()).to.eventually.be.fulfilled;
            });

            it(".getFolderByServerRelativePath", async function () {

                return expect(sp.web.getFolderByServerRelativePath(path)()).to.eventually.be.fulfilled;
            });
        });

        describe("hub-sites", () => {

            it(".hubSiteData", async function () {

                return expect(sp.web.hubSiteData()).to.eventually.be.fulfilled;
            });

            it(".hubSiteData force refresh", async function () {

                return expect(sp.web.hubSiteData(true)).to.eventually.be.fulfilled;
            });

            it(".syncHubSiteTheme", async function () {

                return expect(sp.web.syncHubSiteTheme()).to.eventually.be.fulfilled;
            });
        });

        describe("lists", () => {

            it(".getList", async function () {

                const w = await sp.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
                const url = combine(w.ServerRelativeUrl, "SitePages");
                return expect(sp.web.getList(url)()).to.eventually.be.fulfilled;
            });

            it(".getCatalog", function () {

                return expect(sp.site.rootWeb.getCatalog(113)).to.eventually.be.fulfilled;
            });
        });

        describe("related-items", () => {

            it(".relatedItems", function () {

                return expect(sp.web.relatedItems).to.not.be.null;
            });
        });

        describe("site-groups", () => {

            // skipping this as the groups are already created so we get back a forbidden error
            it.skip(".createDefaultAssociatedGroups", async function () {

                const users = await sp.web.siteUsers.select("LoginName").top(2)();
                return expect(sp.web.createDefaultAssociatedGroups("Testing", users[0].LoginName)).to.eventually.be.fulfilled;
            });
        });

        describe("site-users", () => {

            it(".ensureUser");

            it(".getUserById", async function () {

                const users = await sp.web.siteUsers();
                return expect(sp.web.getUserById(users[0].Id)()).to.eventually.be.fulfilled;
            });
        });
    }
});

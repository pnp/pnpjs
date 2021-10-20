import { getSP, testSettings } from "../main.js";
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
import { SPFI } from "@pnp/sp";
import { INavNodeInfo } from "@pnp/sp/navigation/types.js";

describe("Webs", function () {

    if (testSettings.enableWebTests) {
        let _spfi: SPFI = null;

        before(function () {
            _spfi = getSP();
        });

        it(".add 1", function () {
            const title = `Test_ChildWebAdd1_${getRandomString(8)}`;
            return expect(_spfi.web.webs.add(title, title)).to.eventually.be.fulfilled;
        });

        it(".add 2", function () {
            const title = `Test_ChildWebAdd2_${getRandomString(8)}`;
            return expect(_spfi.web.webs.add(title, title, "description", "FunSite#0", 1033, false)).to.eventually.be.fulfilled;
        });
    }
});

describe("Web", function () {

    if (testSettings.enableWebTests) {
        let _spfi: SPFI = null;

        before(function () {
            _spfi = getSP();
        });

        describe("Invokable Properties", function () {
            const tests: any = {};
            tests[".roleDefinitions"] = null;
            tests[".webs"] = null;
            tests[".contentTypes"] = null;
            tests[".lists"] = null;
            tests[".siteUserInfoList"] = null;
            tests[".defaultDocumentLibrary"] = null;
            tests[".customListTemplates"] = null;
            tests[".siteUsers"] = null;
            tests[".siteGroups"] = null;
            tests[".userCustomActions"] = null;
            tests[".allProperties"] = null;
            tests[".webinfos"] = null;
            tests[".features"] = null;
            tests[".fields"] = null;
            tests[".availablefields"] = null;
            tests[".folders"] = null;
            tests[".rootFolder"] = null;
            tests[".regionalSettings"] = null;

            before(function () {
                Object.getOwnPropertyNames(tests).forEach((key) => {
                    switch (key) {
                        case ".roleDefinitions":
                            tests[key] = _spfi.web.roleDefinitions;
                            break;
                        case ".webs":
                            tests[key] = _spfi.web.webs;
                            break;
                        case ".contentTypes":
                            tests[key] = _spfi.web.contentTypes;
                            break;
                        case ".lists":
                            tests[key] = _spfi.web.lists;
                            break;
                        case ".siteUserInfoList":
                            tests[key] = _spfi.web.siteUserInfoList;
                            break;
                        case ".defaultDocumentLibrary":
                            tests[key] = _spfi.web.defaultDocumentLibrary;
                            break;
                        case ".customListTemplates":
                            tests[key] = _spfi.web.customListTemplates;
                            break;
                        case ".siteUsers":
                            tests[key] = _spfi.web.siteUsers;
                            break;
                        case ".siteGroups":
                            tests[key] = _spfi.web.siteGroups;
                            break;
                        case ".userCustomActions":
                            tests[key] = _spfi.web.userCustomActions;
                            break;
                        case ".allProperties":
                            tests[key] = _spfi.web.allProperties;
                            break;
                        case ".webinfos":
                            tests[key] = _spfi.web.webinfos;
                            break;
                        case ".features":
                            tests[key] = _spfi.web.features;
                            break;
                        case ".fields":
                            tests[key] = _spfi.web.fields;
                            break;
                        case ".availablefields":
                            tests[key] = _spfi.web.availablefields;
                            break;
                        case ".folders":
                            tests[key] = _spfi.web.folders;
                            break;
                        case ".rootFolder":
                            tests[key] = _spfi.web.rootFolder;
                            break;
                        case ".regionalSettings":
                            tests[key] = _spfi.web.regionalSettings;
                            break;
                    }
                });
            });

            Object.getOwnPropertyNames(tests).forEach((key) => {
                it(key, function () {
                    const test = tests[key];
                    return expect((<any>test)()).to.eventually.be.fulfilled;
                });
            });
        });

        it(".navigation", async function () {
            const ql: INavNodeInfo[] = await _spfi.web.navigation.quicklaunch();
            const tn: INavNodeInfo[] = await _spfi.web.navigation.topNavigationBar();
            const success = (ql.constructor === Array) && (tn.constructor === Array);
            return expect(success).to.be.true;
        });

        it(".getParentWeb", async function () {

            const v = await _spfi.web.getParentWeb();
            const parentWeb = await v.select("Title")();

            return expect(parentWeb).to.haveOwnProperty("Title");
        });

        it(".getSubwebsFilteredForCurrentUser", async function () {

            return expect(_spfi.web.getSubwebsFilteredForCurrentUser()()).to.eventually.be.fulfilled;
        });

        it(".update", function () {

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
        // it.skip(".applyTheme", function () {

        //     // this takes a long time to process
        //     this.timeout(60000);

        //     const index = testSettings.sp.webUrl.indexOf("/sites/");
        //     const colorUrl = "/" + combine(testSettings.sp.webUrl.substr(index), "/_catalogs/theme/15/palette011.spcolor");
        //     const fontUrl = "/" + combine(testSettings.sp.webUrl.substr(index), "/_catalogs/theme/15/fontscheme007.spfont");

        //     return expect(spRest.web.applyTheme(colorUrl, fontUrl, "", false)).to.eventually.be.fulfilled;
        // });

        // Cannot test because once a template has been applied a new site must be created to apply a different template
        it(".applyWebTemplate");

        it(".availableWebTemplates", async function () {

            const webTemplates = await _spfi.web.availableWebTemplates()();
            return expect(webTemplates).to.be.an.instanceOf(Array).and.be.not.empty;
        });

        it(".getChanges", function () {

            return expect(_spfi.web.getChanges({
                Add: true,
            })).to.eventually.be.fulfilled;
        });

        it(".mapToIcon", function () {

            return expect(_spfi.web.mapToIcon("test.docx")).to.eventually.be.fulfilled;
        });

        it(".delete", async function () {
            this.timeout(60000);
            const url = getRandomString(4);
            const result = await _spfi.web.webs.add("Better be deleted!", url);
            return expect(result.web.delete()).to.eventually.be.fulfilled;
        });

        // TODO: Solve for storage entities
        // skip due to permissions in various testing environments
        // it.skip("storage entity", async function () {

        //     const key = `testingkey_${getRandomString(4)}`;
        //     const value = "Test Value";

        //     const web = await _spfi.web.getAppCatalog();

        //     after(async function () {
        //         await web.removeStorageEntity(key);
        //     });

        //     await web.setStorageEntity(key, value);
        //     const v = await web.getStorageEntity(key);
        //     return expect(v.Value).to.equal(value);
        // });

        // skip due to permissions in various testing environments
        // it.skip("storage entity with '", async function () {

        //     const key = `testingkey'${getRandomString(4)}`;
        //     const value = "Test Value";

        //     const web = await sp.getTenantAppCatalogWeb();

        //     after(async function () {
        //         await web.removeStorageEntity(key);
        //     });

        //     await web.setStorageEntity(key, value);
        //     const v = await web.getStorageEntity(key);
        //     return expect(v.Value).to.equal(value);
        // });

        // skipping due to permissions issues across testing tenants
        // describe.skip("appcatalog", function () {

        //     it(".getAppCatalog", async function () {

        //         const appCatWeb = await sp.getTenantAppCatalogWeb();
        //         const p = appCatWeb.getAppCatalog()();
        //         return expect(p).to.eventually.be.fulfilled;
        //     });
        // });

        describe("client-side-pages", function () {
            it(".getClientSideWebParts", async function () {
                const webparts = await _spfi.web.getClientsideWebParts();
                return expect(webparts).to.be.an.instanceOf(Array).and.be.not.empty;
            });
        });

        describe("files", function () {
            it(".getFileByServerRelativePath", async function () {
                const w = await _spfi.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
                const path = combine("/", w.ServerRelativeUrl, "SitePages", "Home.aspx");
                const file = await _spfi.web.getFileByServerRelativePath(path)();
                return expect(file.Name).to.equal("Home.aspx");
            });
        });

        describe("folders", function () {
            it(".getFolderByServerRelativePath", async function () {
                const w = await _spfi.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
                const path = combine("/", w.ServerRelativeUrl, "SitePages");
                const folder = await _spfi.web.getFolderByServerRelativePath(path)();
                return expect(folder.Name).to.equal("SitePages");
            });
        });

        describe("hub-sites", function () {

            it(".hubSiteData", async function () {

                return expect(_spfi.web.hubSiteData()).to.eventually.be.fulfilled;
            });

            it(".hubSiteData force refresh", async function () {

                return expect(_spfi.web.hubSiteData(true)).to.eventually.be.fulfilled;
            });

            it(".syncHubSiteTheme", async function () {

                return expect(_spfi.web.syncHubSiteTheme()).to.eventually.be.fulfilled;
            });
        });

        describe("lists", function () {

            it(".getList", async function () {
                const w = await _spfi.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
                const url = combine(w.ServerRelativeUrl, "SitePages");
                const list = await _spfi.web.getList(url)();
                return expect(list.Title).to.equal("Site Pages");
            });

            it(".getCatalog", function () {
                return expect(_spfi.web.getCatalog(113)).to.eventually.be.fulfilled;
            });
        });

        describe("related-items", function () {

            it(".relatedItems", function () {

                return expect(_spfi.web.relatedItems).to.not.be.null;
            });
        });

        describe("site-groups", function () {
            //.createDefaultAssociatedGroups groups are already created so we get back a forbidden error
        });

        describe("site-users", function () {

            it(".getUserById", async function () {

                const users = await _spfi.web.siteUsers();
                return expect(_spfi.web.getUserById(users[0].Id)()).to.eventually.be.fulfilled;
            });
        });
    }
});

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

        // TODO: Figure out how to call this after the before event has run
        // describe("Invokable Properties", function () {

        //     const tests: IInvokableTest[] = [
        //         { desc: ".roleDefinitions", test: _spfi.web.roleDefinitions },
        //         { desc: ".webs", test: _spfi.web.webs },
        //         { desc: ".contentTypes", test: _spfi.web.contentTypes },
        //         { desc: ".lists", test: _spfi.web.lists },
        //         { desc: ".siteUserInfoList", test: _spfi.web.siteUserInfoList },
        //         { desc: ".defaultDocumentLibrary", test: _spfi.web.defaultDocumentLibrary },
        //         { desc: ".customListTemplates", test: _spfi.web.customListTemplates },
        //         { desc: ".siteUsers", test: _spfi.web.siteUsers },
        //         { desc: ".siteGroups", test: _spfi.web.siteGroups },
        //         { desc: ".folders", test: _spfi.web.folders },
        //         { desc: ".userCustomActions", test: _spfi.web.userCustomActions },
        //         { desc: ".customListTemplate", test: _spfi.web.customListTemplates },
        //         { desc: ".currentUser", test: _spfi.web.currentUser },
        //         { desc: ".allProperties", test: _spfi.web.allProperties },
        //         { desc: ".webinfos", test: _spfi.web.webinfos },
        //         { desc: ".features", test: _spfi.web.features },
        //         { desc: ".fields", test: _spfi.web.fields },
        //         { desc: ".availablefields", test: _spfi.web.availablefields },
        //         { desc: ".folders", test: _spfi.web.folders },
        //         { desc: ".rootFolder", test: _spfi.web.rootFolder },
        //         { desc: ".regionalSettings", test: _spfi.web.regionalSettings },
        //         // { desc: ".associatedOwnerGroup", test: _spfi.web.associatedOwnerGroup },
        //         // { desc: ".associatedMemberGroup", test: _spfi.web.associatedMemberGroup },
        //         // { desc: ".associatedVisitorGroup", test: _spfi.web.associatedVisitorGroup },
        //     ];

        //     tests.forEach((testObj) => {

        //         const { test, desc } = testObj;
        //         it(desc, function () expect((<any>test)()).to.eventually.be.fulfilled);
        //     });
        // });

        it(".navigation", async function () {

            await _spfi.web.navigation.quicklaunch();
            await _spfi.web.navigation.topNavigationBar();
            return expect(true).to.be.false;
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

        it(".applyWebTemplate", async function () {

            this.timeout(60000);

            const { web } = await _spfi.web.webs.add("ApplyWebTemplateTest", getRandomString(6), "Testing", "STS");
            const templates = (await web.availableWebTemplates().select("Name")<{ Name: string }[]>()).filter(t => /ENTERWIKI#0/i.test(t.Name));

            const template = templates.length > 0 ? templates[0].Name : "STS#0";
            return expect(web.applyWebTemplate(template)).to.eventually.be.fulfilled;
        });

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

        // BUG: Removed hubSiteData from web.
        // describe("hub-sites", function () {

        //     it(".hubSiteData", async function () {

        //         return expect(_spfi.web.hubSiteData()).to.eventually.be.fulfilled;
        //     });

        //     it(".hubSiteData force refresh", async function () {

        //         return expect(_spfi.web.hubSiteData(true)).to.eventually.be.fulfilled;
        //     });

        //     it(".syncHubSiteTheme", async function () {

        //         return expect(_spfi.web.syncHubSiteTheme()).to.eventually.be.fulfilled;
        //     });
        // });

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

        // describe("site-groups", function () {

        //     // skipping this as the groups are already created so we get back a forbidden error
        //     it.skip(".createDefaultAssociatedGroups", async function () {

        //         const users = await _spfi.web.siteUsers.select("LoginName").top(2)();
        //         return expect(_spfi.web.createDefaultAssociatedGroups("Testing", users[0].LoginName)).to.eventually.be.fulfilled;
        //     });
        // });

        describe("site-users", function () {

            it(".getUserById", async function () {

                const users = await _spfi.web.siteUsers();
                return expect(_spfi.web.getUserById(users[0].Id)()).to.eventually.be.fulfilled;
            });
        });
    }
});

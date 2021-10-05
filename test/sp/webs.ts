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
import { SPRest } from "@pnp/sp/rest.js";


describe("Webs", function () {

    if (testSettings.enableWebTests) {
        let _spRest: SPRest = null;

        before(function () {
            _spRest = getSP();
        });

        it(".add 1", function () {
            const title = `Test_ChildWebAdd1_${getRandomString(8)}`;
            return expect(_spRest.web.webs.add(title, title)).to.eventually.be.fulfilled;
        });

        it(".add 2", function () {
            const title = `Test_ChildWebAdd2_${getRandomString(8)}`;
            return expect(_spRest.web.webs.add(title, title, "description", "FunSite#0", 1033, false)).to.eventually.be.fulfilled;
        });
    }
});

describe("Web", function () {

    if (testSettings.enableWebTests) {
        let _spRest: SPRest = null;

        before(function () {
            _spRest = getSP();
        });

        // TODO: Figure out how to call this after the before event has run
        // describe("Invokable Properties", function () {

        //     const tests: IInvokableTest[] = [
        //         { desc: ".roleDefinitions", test: _spRest.web.roleDefinitions },
        //         { desc: ".webs", test: _spRest.web.webs },
        //         { desc: ".contentTypes", test: _spRest.web.contentTypes },
        //         { desc: ".lists", test: _spRest.web.lists },
        //         { desc: ".siteUserInfoList", test: _spRest.web.siteUserInfoList },
        //         { desc: ".defaultDocumentLibrary", test: _spRest.web.defaultDocumentLibrary },
        //         { desc: ".customListTemplates", test: _spRest.web.customListTemplates },
        //         { desc: ".siteUsers", test: _spRest.web.siteUsers },
        //         { desc: ".siteGroups", test: _spRest.web.siteGroups },
        //         { desc: ".folders", test: _spRest.web.folders },
        //         { desc: ".userCustomActions", test: _spRest.web.userCustomActions },
        //         { desc: ".customListTemplate", test: _spRest.web.customListTemplates },
        //         { desc: ".currentUser", test: _spRest.web.currentUser },
        //         { desc: ".allProperties", test: _spRest.web.allProperties },
        //         { desc: ".webinfos", test: _spRest.web.webinfos },
        //         { desc: ".features", test: _spRest.web.features },
        //         { desc: ".fields", test: _spRest.web.fields },
        //         { desc: ".availablefields", test: _spRest.web.availablefields },
        //         { desc: ".folders", test: _spRest.web.folders },
        //         { desc: ".rootFolder", test: _spRest.web.rootFolder },
        //         { desc: ".regionalSettings", test: _spRest.web.regionalSettings },
        //         // { desc: ".associatedOwnerGroup", test: _spRest.web.associatedOwnerGroup },
        //         // { desc: ".associatedMemberGroup", test: _spRest.web.associatedMemberGroup },
        //         // { desc: ".associatedVisitorGroup", test: _spRest.web.associatedVisitorGroup },
        //     ];

        //     tests.forEach((testObj) => {

        //         const { test, desc } = testObj;
        //         it(desc, function () expect((<any>test)()).to.eventually.be.fulfilled);
        //     });
        // });

        it(".navigation", async function () {

            await _spRest.web.navigation.quicklaunch();
            await _spRest.web.navigation.topNavigationBar();
            return expect(true).to.be.false;
        });

        it(".getParentWeb", async function () {

            const v = await _spRest.web.getParentWeb();
            const parentWeb = await v.select("Title")();

            return expect(parentWeb).to.haveOwnProperty("Title");
        });

        it(".getSubwebsFilteredForCurrentUser", async function () {

            return expect(_spRest.web.getSubwebsFilteredForCurrentUser()()).to.eventually.be.fulfilled;
        });

        it(".update", function () {

            const p = _spRest.web.select("Title")<{ Title: string }>().then(function (w) {

                const newTitle = w.Title + " updated";
                _spRest.web.update({ Title: newTitle }).then(function () {

                    _spRest.web.select("Title")<{ Title: string }>().then(function (w2) {
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

            const { web } = await _spRest.web.webs.add("ApplyWebTemplateTest", getRandomString(6), "Testing", "STS");
            const templates = (await web.availableWebTemplates().select("Name")<{ Name: string }[]>()).filter(t => /ENTERWIKI#0/i.test(t.Name));

            const template = templates.length > 0 ? templates[0].Name : "STS#0";
            return expect(web.applyWebTemplate(template)).to.eventually.be.fulfilled;
        });

        it(".availableWebTemplates", async function () {

            const webTemplates = await _spRest.web.availableWebTemplates()();
            return expect(webTemplates).to.be.an.instanceOf(Array).and.be.not.empty;
        });

        it(".getChanges", function () {

            return expect(_spRest.web.getChanges({
                Add: true,
            })).to.eventually.be.fulfilled;
        });

        it(".mapToIcon", function () {

            return expect(_spRest.web.mapToIcon("test.docx")).to.eventually.be.fulfilled;
        });

        it(".delete", async function () {
            this.timeout(60000);
            const url = getRandomString(4);
            const result = await _spRest.web.webs.add("Better be deleted!", url);
            return expect(result.web.delete()).to.eventually.be.fulfilled;
        });

        // TODO: Solve for storage entities
        // skip due to permissions in various testing environments
        // it.skip("storage entity", async function () {

        //     const key = `testingkey_${getRandomString(4)}`;
        //     const value = "Test Value";

        //     const web = await _spRest.web.getAppCatalog();

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
                const webparts = await _spRest.web.getClientsideWebParts();
                return expect(webparts).to.be.an.instanceOf(Array).and.be.not.empty;
            });
        });

        describe("files", function () {
            it(".getFileByServerRelativePath", async function () {
                const w = await _spRest.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
                const path = combine("/", w.ServerRelativeUrl, "SitePages", "Home.aspx");
                const file = await _spRest.web.getFileByServerRelativePath(path)();
                return expect(file.Name).to.equal("Home.aspx");
            });
        });

        describe("folders", function () {
            it(".getFolderByServerRelativePath", async function () {
                const w = await _spRest.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
                const path = combine("/", w.ServerRelativeUrl, "SitePages");
                const folder = await _spRest.web.getFolderByServerRelativePath(path)();
                return expect(folder.Name).to.equal("SitePages");
            });
        });

        // BUG: Removed hubSiteData from web.
        // describe("hub-sites", function () {

        //     it(".hubSiteData", async function () {

        //         return expect(_spRest.web.hubSiteData()).to.eventually.be.fulfilled;
        //     });

        //     it(".hubSiteData force refresh", async function () {

        //         return expect(_spRest.web.hubSiteData(true)).to.eventually.be.fulfilled;
        //     });

        //     it(".syncHubSiteTheme", async function () {

        //         return expect(_spRest.web.syncHubSiteTheme()).to.eventually.be.fulfilled;
        //     });
        // });

        describe("lists", function () {

            it(".getList", async function () {
                const w = await _spRest.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
                const url = combine(w.ServerRelativeUrl, "SitePages");
                const list = await _spRest.web.getList(url)();
                return expect(list.Title).to.equal("Site Pages");
            });

            it(".getCatalog", function () {
                return expect(_spRest.web.getCatalog(113)).to.eventually.be.fulfilled;
            });
        });

        describe("related-items", function () {

            it(".relatedItems", function () {

                return expect(_spRest.web.relatedItems).to.not.be.null;
            });
        });

        // describe("site-groups", function () {

        //     // skipping this as the groups are already created so we get back a forbidden error
        //     it.skip(".createDefaultAssociatedGroups", async function () {

        //         const users = await _spRest.web.siteUsers.select("LoginName").top(2)();
        //         return expect(_spRest.web.createDefaultAssociatedGroups("Testing", users[0].LoginName)).to.eventually.be.fulfilled;
        //     });
        // });

        describe("site-users", function () {

            it(".getUserById", async function () {

                const users = await _spRest.web.siteUsers();
                return expect(_spRest.web.getUserById(users[0].Id)()).to.eventually.be.fulfilled;
            });
        });
    }
});

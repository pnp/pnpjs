import { testSettings } from "../../../test/main";
import { expect } from "chai";
import { sp, Web } from "../";
import { Util } from "@pnp/common";
import { toMatchEndRegex } from "./utils";

describe("Webs", () => {

    if (testSettings.enableWebTests) {

        describe("add", () => {
            it("should add a new child web", function () {
                // allow 30 seconds for the web to be created
                return expect(sp.web.webs.add("web.webs.add test", "websaddtest")).to.eventually.be.fulfilled;
            });
        });
    }
});

describe("Web", () => {

    let web: Web;

    beforeEach(() => {
        web = new Web("_api", "web");
    });

    it("Should be an object", () => {
        expect(web).to.be.a("object");
    });

    describe("url", () => {
        it("Should return _api/web", () => {
            expect(web.toUrl()).to.match(toMatchEndRegex("_api/web"));
        });
    });

    describe("webs", () => {
        it("should return _api/web/webs", () => {
            expect(web.webs.toUrl()).to.match(toMatchEndRegex("_api/web/webs"));
        });
    });

    describe("contentTypes", () => {
        it("should return _api/web/contenttypes", () => {
            expect(web.contentTypes.toUrl()).to.match(toMatchEndRegex("_api/web/contenttypes"));
        });
    });

    describe("lists", () => {
        it("should return _api/web/lists", () => {
            expect(web.lists.toUrl()).to.match(toMatchEndRegex("_api/web/lists"));
        });
    });

    describe("navigation", () => {
        it("should return _api/web/navigation", () => {
            expect(web.navigation.toUrl()).to.match(toMatchEndRegex("_api/web/navigation"));
        });
    });

    describe("siteUsers", () => {
        it("should return _api/web/siteUsers", () => {
            expect(web.siteUsers.toUrl()).to.match(toMatchEndRegex("_api/web/siteusers"));
        });
    });

    describe("folders", () => {
        it("should return _api/web/folders", () => {
            expect(web.folders.toUrl()).to.match(toMatchEndRegex("_api/web/folders"));
        });
    });

    describe("getFolderByServerRelativeUrl", () => {
        it("should return _api/web/getFolderByServerRelativeUrl('/sites/dev/shared documents/folder')", () => {
            expect(web.getFolderByServerRelativeUrl("/sites/dev/shared documents/folder").toUrl())
                .to.match(toMatchEndRegex("_api/web/getFolderByServerRelativeUrl('/sites/dev/shared documents/folder')"));
        });
    });

    describe("getFileByServerRelativeUrl", () => {
        it("should return _api/web/getFileByServerRelativeUrl('/sites/dev/shared documents/folder/doc.docx')", () => {
            expect(web.getFileByServerRelativeUrl("/sites/dev/shared documents/folder/doc.docx").toUrl())
                .to.match(toMatchEndRegex("_api/web/getFileByServerRelativeUrl('/sites/dev/shared documents/folder/doc.docx')"));
        });
    });

    describe("getList", () => {
        it("should return _api/web/getList('/sites/dev/lists/customlist')", () => {
            expect(web.getList("/sites/dev/lists/customlist").toUrl())
                .to.match(toMatchEndRegex("_api/web/getList('/sites/dev/lists/customlist')"));
        });
    });

    describe("availableWebTemplates", () => {
        it("should return _api/web/getavailablewebtemplates(lcid=1033, doincludecrosslanguage=true)", () => {
            expect(web.availableWebTemplates(1033, true).toUrl())
                .to.match(toMatchEndRegex("_api/web/getavailablewebtemplates(lcid=1033, doincludecrosslanguage=true)"));
        });
    });

    describe("customListTemplate", () => {
        it("should return _api/web/getcustomlisttemplates", () => {
            expect(web.customListTemplate.toUrl()).to.match(toMatchEndRegex("_api/web/getcustomlisttemplates"));
        });
    });

    describe("getUserById", () => {
        it("should return _api/web/getUserById(4)", () => {
            expect(web.getUserById(4).toUrl()).to.match(toMatchEndRegex("_api/web/getUserById(4)"));
        });
    });

    describe("currentUser", () => {
        it("should return _api/web/currentuser", () => {
            expect(web.currentUser.toUrl()).to.match(toMatchEndRegex("_api/web/currentuser"));
        });
    });

    if (testSettings.enableWebTests) {

        describe("webs", () => {
            it("should get the collection of all child webs", function () {
                return expect(sp.web.webs.get()).to.eventually.be.fulfilled;
            });
        });

        describe("contentTypes", () => {
            it("should get the collection of all content types in this web", () => {
                return expect(sp.web.contentTypes.get()).to.eventually.be.fulfilled;
            });
        });

        describe("lists", () => {
            it("should get the collection of all lists in this web", () => {
                return expect(sp.web.lists.get()).to.eventually.be.fulfilled;
            });
        });

        describe("navigation", () => {
            it("should get the navigation for this web", () => {
                return expect(sp.web.navigation.get()).to.eventually.be.fulfilled;
            });
        });

        describe("siteUsers", () => {
            it("should get the site users for this web", () => {
                return expect(sp.web.siteUsers.get()).to.eventually.be.fulfilled;
            });
        });

        describe("siteGroups", () => {
            it("should get the site groups for this web", () => {
                return expect(sp.web.siteGroups.get()).to.eventually.be.fulfilled;
            });
        });

        describe("folders", () => {
            it("should get the folders for this web", () => {
                return expect(sp.web.folders.get()).to.eventually.be.fulfilled;
            });
        });

        describe("userCustomActions", () => {
            it("should get the user custom actions for this web", function () {
                return expect(sp.web.userCustomActions.get()).to.eventually.be.fulfilled;
            });
        });

        describe("roleDefinitions", () => {
            it("should get the role definitions for this web", () => {
                return expect(sp.web.roleDefinitions.get()).to.eventually.be.fulfilled;
            });
        });

        describe("getFolderByServerRelativeUrl", () => {
            it("should get a folder by the server relative url", function () {
                return expect(sp.web.select("ServerRelativeUrl").get<{ ServerRelativeUrl: string }>().then(w => {
                    const url = Util.combinePaths(w.ServerRelativeUrl, "SitePages");
                    return sp.web.getFolderByServerRelativeUrl(url);
                })).to.eventually.be.fulfilled;
            });
        });

        describe("getFileByServerRelativeUrl", () => {
            it("should get a file by the server relative url", function () {
                return expect(sp.web.select("ServerRelativeUrl").get<{ ServerRelativeUrl: string }>().then(w => {
                    const url = Util.combinePaths(w.ServerRelativeUrl, "SitePages", "Home.aspx");
                    return sp.web.getFileByServerRelativeUrl(url);
                })).to.eventually.be.fulfilled;
            });
        });

        describe("update", () => {
            it("should update the title of the web", function () {
                return expect(sp.web.select("Title").get<{ Title: string }>().then(w => {

                    const newTitle = w.Title + " updated";
                    sp.web.update({ Title: newTitle }).then(() => {

                        sp.web.select("Title").get<{ Title: string }>().then(w2 => {
                            if (w2.Title !== newTitle) {
                                throw new Error("Update web failed");
                            }
                        });
                    });
                })).to.eventually.be.fulfilled;
            });
        });

        describe("delete", () => {
            it("should create and then delete a new sub-web", function () {
                this.timeout(40000);
                return expect(sp.web.webs.add("Better be deleted!", "web-delete-test").then(result => {
                    return result.web.delete();
                })).to.eventually.be.fulfilled;
            });
        });

        describe("applyTheme", () => {
            it("should apply a theme to our web", function () {
                // this takes a long time to process
                this.timeout(60000);

                const index = testSettings.siteUrl.indexOf("/sites/");
                const colorUrl = "/" + Util.combinePaths(testSettings.siteUrl.substr(index), "/_catalogs/theme/15/palette011.spcolor");
                const fontUrl = "/" + Util.combinePaths(testSettings.siteUrl.substr(index), "/_catalogs/theme/15/fontscheme007.spfont");

                return expect(sp.web.applyTheme(colorUrl, fontUrl, "", false)).to.eventually.be.fulfilled;
            });
        });

        describe("applyWebTemplate", () => {
            it("should apply a web template to a web");
        });

        describe("ensureUser", () => {
            it("should ensure that a given user exists in the web");
        });

        describe("availableWebTemplates", () => {
            it("should check for all the available web templates", function () {
                return expect(sp.web.availableWebTemplates().get<any[]>()).to.eventually.be.not.empty;
            });
        });

        describe("getCatalog", () => {
            it("should get the specified catalog", function () {
                return expect(sp.site.rootWeb.getCatalog(113)).to.eventually.be.fulfilled;
            });
        });

        describe("getChanges", () => {
            it("should get the changes specified by the query", function () {
                return expect(sp.web.getChanges({
                    Add: true,
                })).to.eventually.be.fulfilled;
            });
        });

        describe("customListTemplate", () => {
            it("should get all the custom list template for the site", function () {
                return expect(sp.web.customListTemplate.get()).to.eventually.be.fulfilled;
            });
        });

        describe("getUserById", () => {
            it("should get a user by id");
        });

        describe("mapToIcon", () => {
            it("should map an icon url by filename", function () {
                return expect(sp.web.mapToIcon("test.docx")).to.eventually.be.fulfilled;
            });
        });

        describe("currentUser", () => {
            it("should return _api/web/currentuser", () => {
                return expect(sp.web.currentUser.get()).to.eventually.be.fulfilled;
            });
        });
    }
});

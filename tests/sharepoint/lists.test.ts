import { expect } from "chai";
import { Lists, List } from "../../src/sharepoint/lists";
import { ControlMode, PageType } from "../../src/sharepoint/types";
import { testSettings } from "../test-config.test";
import pnp from "../../src/pnp";
import { toMatchEndRegex } from "../testutils";

describe("Lists", () => {

    let lists: Lists;

    beforeEach(() => {
        lists = new Lists("_api/web");
    });

    it("Should be an object", () => {
        expect(lists).to.be.a("object");
    });

    describe("url", () => {
        it("Should return _api/web/lists", () => {
            expect(lists.toUrl()).to.match(toMatchEndRegex("_api/web/lists"));
        });
    });

    describe("getByTitle", () => {
        it("Should return _api/web/lists/getByTitle('Tasks')", () => {
            let list = lists.getByTitle("Tasks");
            expect(list.toUrl()).to.match(toMatchEndRegex("_api/web/lists/getByTitle('Tasks')"));
        });
    });

    describe("getById", () => {
        it("Should return _api/web/lists('4FC65058-FDDE-4FAD-AB21-2E881E1CF527')", () => {
            let list = lists.getById("4FC65058-FDDE-4FAD-AB21-2E881E1CF527");
            expect(list.toUrl()).to.match(toMatchEndRegex("_api/web/lists('4FC65058-FDDE-4FAD-AB21-2E881E1CF527')"));
        });
    });

    describe("getById with {}", () => {
        it("Should return _api/web/lists('{4FC65058-FDDE-4FAD-AB21-2E881E1CF527}')", () => {
            let list = lists.getById("{4FC65058-FDDE-4FAD-AB21-2E881E1CF527}");
            expect(list.toUrl()).to.match(toMatchEndRegex("_api/web/lists('{4FC65058-FDDE-4FAD-AB21-2E881E1CF527}')"));
        });
    });

    if (testSettings.enableWebTests) {

        describe("getByTitle", () => {
            it("Should get a list by title with the expected title", () => {

                // we are expecting that the OOTB list exists 
                return expect(pnp.sp.web.lists.getByTitle("Documents").get()).to.eventually.have.property("Title", "Documents");
            });
        });

        describe("getById", () => {
            it("Should get a list by id with the expected title", () => {
                return expect(pnp.sp.web.lists.getByTitle("Documents").select("ID").getAs<{ Id: string }>().then((list) => {
                    return pnp.sp.web.lists.getById(list.Id).select("Title").get();
                })).to.eventually.have.property("Title", "Documents");
            });
        });

        describe("add", () => {
            it("Should add a list with the expected title", () => {
                return expect(pnp.sp.web.lists.add("pnp testing add").then(() => {
                    return pnp.sp.web.lists.getByTitle("pnp testing add").select("Title").get();
                })).to.eventually.have.property("Title", "pnp testing add");
            });
        });

        describe("ensure", () => {
            it("Should ensure a list with the expected title", () => {
                return expect(pnp.sp.web.lists.ensure("pnp testing ensure").then(() => {
                    return pnp.sp.web.lists.getByTitle("pnp testing ensure").select("Title").get();
                })).to.eventually.have.property("Title", "pnp testing ensure");
            });
        });

        describe("ensureSiteAssetsLibrary", () => {
            it("Should ensure that the site assets library exists", () => {
                return expect(pnp.sp.web.lists.ensureSiteAssetsLibrary()).to.eventually.be.fulfilled;
            });
        });

        describe("ensureSitePagesLibrary", () => {
            it("Should ensure that the site pages library exists", () => {
                return expect(pnp.sp.web.lists.ensureSitePagesLibrary()).to.eventually.be.fulfilled;
            });
        });
    }
});

describe("List", () => {

    let list: List;

    beforeEach(() => {
        list = new List("_api/web/lists", "getByTitle('Tasks')");
    });

    it("Should be an object", () => {
        expect(list).to.be.a("object");
    });

    describe("contentTypes", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/contenttypes", () => {
            expect(list.contentTypes.toUrl()).to.match(toMatchEndRegex("_api/web/lists/getByTitle('Tasks')/contenttypes"));
        });
    });

    describe("items", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/items", () => {
            expect(list.items.toUrl()).to.match(toMatchEndRegex("_api/web/lists/getByTitle('Tasks')/items"));
        });
    });

    describe("views", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/views", () => {
            expect(list.views.toUrl()).to.match(toMatchEndRegex("_api/web/lists/getByTitle('Tasks')/views"));
        });
    });

    describe("fields", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/fields", () => {
            expect(list.fields.toUrl()).to.match(toMatchEndRegex("_api/web/lists/getByTitle('Tasks')/fields"));
        });
    });

    describe("defaultView", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/DefaultView", () => {
            expect(list.defaultView.toUrl()).to.match(toMatchEndRegex("_api/web/lists/getByTitle('Tasks')/DefaultView"));
        });
    });

    describe("effectiveBasePermissions", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/EffectiveBasePermissions", () => {
            expect(list.effectiveBasePermissions.toUrl())
                .to.match(toMatchEndRegex("_api/web/lists/getByTitle('Tasks')/EffectiveBasePermissions"));
        });
    });

    describe("eventReceivers", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/EventReceivers", () => {
            expect(list.eventReceivers.toUrl()).to.match(toMatchEndRegex("_api/web/lists/getByTitle('Tasks')/EventReceivers"));
        });
    });

    describe("relatedFields", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/getRelatedFields", () => {
            expect(list.relatedFields.toUrl()).to.match(toMatchEndRegex("_api/web/lists/getByTitle('Tasks')/getRelatedFields"));
        });
    });

    describe("informationRightsManagementSettings", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/InformationRightsManagementSettings", () => {
            expect(list.informationRightsManagementSettings.toUrl())
                .to.match(toMatchEndRegex("_api/web/lists/getByTitle('Tasks')/InformationRightsManagementSettings"));
        });
    });

    describe("userCustomActions", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/usercustomactions", () => {
            expect(list.userCustomActions.toUrl())
                .to.match(toMatchEndRegex("_api/web/lists/getByTitle('Tasks')/usercustomactions"));
        });
    });

    describe("getView", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/getView('b81b1b32-ed0a-4b80-bd16-67c99a4f3c1c')", () => {
            expect(list.getView("b81b1b32-ed0a-4b80-bd16-67c99a4f3c1c").toUrl())
                .to.match(toMatchEndRegex("_api/web/lists/getByTitle('Tasks')/getView('b81b1b32-ed0a-4b80-bd16-67c99a4f3c1c')"));
        });
    });

    if (testSettings.enableWebTests) {

        describe("contentTypes", () => {
            it("should return a list of content types on the list", () => {
                return expect(pnp.sp.web.lists.getByTitle("Documents").contentTypes.get()).to.eventually.be.fulfilled;
            });
        });

        describe("items", () => {
            it("should return items from the list", () => {
                return expect(pnp.sp.web.lists.getByTitle("Documents").items.get()).to.eventually.be.fulfilled;
            });
        });

        describe("views", () => {
            it("should return views from the list", () => {
                return expect(pnp.sp.web.lists.getByTitle("Documents").views.get()).to.eventually.be.fulfilled;
            });
        });

        describe("fields", () => {
            it("should return fields from the list", () => {
                return expect(pnp.sp.web.lists.getByTitle("Documents").fields.get()).to.eventually.be.fulfilled;
            });
        });

        describe("defaultView", () => {
            it("should return the default view from the list", () => {
                return expect(pnp.sp.web.lists.getByTitle("Documents").defaultView.get()).to.eventually.be.fulfilled;
            });
        });

        describe("userCustomActions", () => {
            it("should return the user custom actions from the list", () => {
                return expect(pnp.sp.web.lists.getByTitle("Documents").userCustomActions.get()).to.eventually.be.fulfilled;
            });
        });

        describe("effectiveBasePermissions", () => {
            it("should return the effective base permissions from the list", () => {
                return expect(pnp.sp.web.lists.getByTitle("Documents").effectiveBasePermissions.get()).to.eventually.be.fulfilled;
            });
        });

        describe("eventReceivers", () => {
            it("should return the event receivers from the list", () => {
                return expect(pnp.sp.web.lists.getByTitle("Documents").eventReceivers.get()).to.eventually.be.fulfilled;
            });
        });

        describe("relatedFields", () => {
            it("should return the related fields from the list", () => {
                return expect(pnp.sp.web.lists.getByTitle("Documents").relatedFields.get()).to.eventually.be.fulfilled;
            });
        });

        describe("informationRightsManagementSettings", () => {
            it("should return the information rights management settings from the list", () => {
                return expect(pnp.sp.web.lists.getByTitle("Documents").informationRightsManagementSettings.get())
                    .to.eventually.be.fulfilled;
            });
        });

        describe("getView", () => {
            it("should return the default view by id from the list", () => {
                return expect(pnp.sp.web.lists.getByTitle("Documents").defaultView.select("Id").get().then(v => {
                    return pnp.sp.web.lists.getByTitle("Documents").getView(v.Id).get();
                })).to.eventually.be.fulfilled;
            });
        });

        describe("update", () => {
            it("should create a new list, update the title, and then ensure it is set as expected", () => {
                let newTitle = "I have a new title";
                return expect(pnp.sp.web.lists.ensure("pnp testing list update").then(result => {
                    return result.list.update({
                        Title: newTitle,
                    }).then(result2 => {
                        return result2.list.select("Title").get();
                    });
                })).to.eventually.have.property("Title", newTitle);
            });
        });

        describe("delete", () => {
            it("should create a new list, delete it, and then ensure it is gone", () => {
                return expect(pnp.sp.web.lists.ensure("pnp testing list delete").then(result => {
                    return result.list.delete().then(() => {
                        return result.list.select("Title").get();
                    });
                })).to.eventually.be.rejected;
            });
        });

        describe("getChanges", () => {
            it("should get a list of changes", () => {
                return expect(pnp.sp.web.lists.getByTitle("Documents").getChanges({
                    Add: true,
                    DeleteObject: true,
                    Restore: true,
                })).to.eventually.be.fulfilled;
            });
        });

        /* tslint:disable */
        describe("getItemsByCAMLQuery", () => {
            it("should get items based on the supplied CAML query", () => {
                let caml = {
                    ViewXml: "<View><ViewFields><FieldRef Name='Title' /><FieldRef Name='RoleAssignments' /></ViewFields><RowLimit>5</RowLimit></View>"
                };
                return expect(pnp.sp.web.lists.getByTitle("Documents").getItemsByCAMLQuery(caml, "RoleAssignments")).to.eventually.be.fulfilled;
            });
        });
        /* tslint:enable */

        describe("getListItemChangesSinceToken", () => {
            it("should get items based on the supplied change query");
        });

        describe("recycle", () => {
            it("should create a new list, recycle it, and then ensure it is gone", () => {
                return expect(pnp.sp.web.lists.ensure("pnp testing list recycle").then(result => {
                    return result.list.recycle().then(recycleResponse => {
                        if (typeof recycleResponse !== "string") {
                            throw new Error("Expected a string returned from recycle.");
                        }
                        return result.list.select("Title").get();
                    });
                })).to.eventually.be.rejected;
            });
        });

        describe("renderListData", () => {
            it("should return a set of data which can be used to render an html view of the list", () => {
                // create a list, add some items, render a view
                return expect(pnp.sp.web.lists.ensure("pnp testing renderListData").then(result => {
                    return Promise.all([
                        result.list.items.add({ Title: "Item 1" }),
                        result.list.items.add({ Title: "Item 2" }),
                        result.list.items.add({ Title: "Item 3" }),
                    ]).then(() => {
                        return result.list;
                    });
                }).then(l => {
                    let viewXml = "<View><RowLimit>5</RowLimit></View>";
                    return l.renderListData(viewXml);
                })).to.eventually.have.property("Row").that.is.not.empty;
            });
        });

        describe("renderListFormData", () => {
            it("should return a set of data which can be used to render an html view of the list", () => {
                // create a list, add an item, get the form, render that form
                return expect(pnp.sp.web.lists.ensure("pnp testing renderListFormData").then(result => {
                    return result.list.items.add({ Title: "Item 1" }).then(() => {
                        return result.list;
                    });
                }).then(l => {
                    return l.forms.select("Id").filter(`FormType eq ${PageType.DisplayForm}`).get().then(f => {
                        return l.renderListFormData(1, f[0].Id, ControlMode.Display);
                    });
                })).to.eventually.have.property("Title").that.is.not.null;
            });
        });

        describe("reserveListItemId", () => {
            it("should return a number", () => {
                // create a list, reserve an item id
                return expect(pnp.sp.web.lists.ensure("pnp testing reserveListItemId").then(result => {
                    return result.list.reserveListItemId();
                })).to.eventually.be.a("number");
            });
        });
    }
});

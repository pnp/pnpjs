import { expect } from "chai";
import { testSettings } from "../test-config.test";
import { Util } from "../../src/utils/util";
import { Folder } from "../../src/sharepoint/folders";
import { File } from "../../src/sharepoint/files";
import { Item } from "../../src/sharepoint/items";
import { SharingLinkKind, SharingRole } from "../../src/sharepoint/types";
import { Web } from "../../src/sharepoint/webs";

describe("Sharing", () => {

    let webAbsUrl = "";
    let webRelativeUrl = "";
    let web: Web;

    before((done) => {

        // we need to take some steps to ensure we are operating on the correct web here
        // due to the url manipulation in the library for sharing
        web = new Web(testSettings.webUrl);

        web.select("ServerRelativeUrl", "Url").get().then(u => {

            // make sure we have the correct server relative url
            webRelativeUrl = u.ServerRelativeUrl;
            webAbsUrl = u.Url;

            // we need a doc lib with a file and folder in it
            web.lists.ensure("SharingTestLib", "Used to test sharing", 101).then(ler => {

                // add a file and folder
                Promise.all([
                    ler.list.rootFolder.folders.add("MyTestFolder"),
                    ler.list.rootFolder.files.add("text.txt", "Some file content!"),
                ]).then(_ => {
                    done();
                }).catch(_ => {
                    done();
                });
            }).catch(_ => {
                done();
            });
        });
    });

    if (testSettings.enableWebTests) {

        describe("can operate on folders", () => {

            let folder: Folder = null;

            before(() => {

                folder = web.getFolderByServerRelativeUrl("/" + Util.combinePaths(webRelativeUrl, "SharingTestLib/MyTestFolder"));
            });

            // // these tests cover share link
            it("Should get a sharing link with default settings.", () => {

                return expect(folder.getShareLink())
                    .to.eventually.be.fulfilled
                    .and.have.property("sharingLinkInfo")
                    .and.have.deep.property("Url").that.is.not.null;
            });

            // it("Should get a sharing link with a specified kind.", () => {
            //     return expect(folder.getShareLink(SharingLinkKind.AnonymousView))
            //         .to.eventually.be.fulfilled
            //         .and.have.property("sharingLinkInfo")
            //         .and.have.deep.property("Url").that.is.not.null;
            // });

            // it("Should get a sharing link with a specified kind and expiration.", () => {
            //     return expect(folder.getShareLink(SharingLinkKind.AnonymousView, Util.dateAdd(new Date(), "day", 5)))
            //         .to.eventually.be.fulfilled
            //         .and.have.property("sharingLinkInfo")
            //         .and.have.deep.property("Url").that.is.not.null;
            // });

            it("Should allow sharing to a person with default settings.", () => {

                return expect(folder.shareWith("c:0(.s|true"))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });

            it("Should allow sharing to a person with the edit role.", () => {

                return expect(folder.shareWith("c:0(.s|true", SharingRole.Edit))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });

            it("Should allow sharing to a person with the edit role and share all content.", () => {

                return expect(folder.shareWith("c:0(.s|true", SharingRole.Edit, true))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });

            it("Should allow for checking of sharing permissions.", () => {

                return expect(folder.checkSharingPermissions([{ alias: "c:0(.s|true" }]))
                    .to.eventually.be.fulfilled;
            });

            it("Should allow getting Sharing Information.", () => {

                return expect(folder.getSharingInformation())
                    .to.eventually.be.fulfilled;
            });

            it("Should allow getting Object Sharing Settings.", () => {

                return expect(folder.getObjectSharingSettings(true))
                    .to.eventually.be.fulfilled;
            });

            it("Should allow unsharing.", () => {

                return expect(folder.unshare())
                    .to.eventually.be.fulfilled;
            });

            // it("Should allow deleting a link by kind.", () => {

            //     return expect(folder.getShareLink(SharingLinkKind.AnonymousView).then(_ => {

            //         return folder.deleteSharingLinkByKind(SharingLinkKind.AnonymousView);
            //     })).to.eventually.be.fulfilled;
            // });

            // it("Should allow unsharing a link by kind.", () => {

            //     return expect(folder.getShareLink(SharingLinkKind.AnonymousView).then(response => {

            //         return folder.unshareLink(SharingLinkKind.AnonymousView, response.sharingLinkInfo.ShareId);
            //     })).to.eventually.be.fulfilled;
            // });
        });

        describe("can operate on files", () => {

            let file: File = null;

            before(() => {

                file = web.getFileByServerRelativeUrl("/" + Util.combinePaths(webRelativeUrl, "SharingTestLib/text.txt"));
            });

            it("Should get a sharing link with default settings.", () => {

                return expect(file.getShareLink())
                    .to.eventually.be.fulfilled
                    .and.have.property("sharingLinkInfo")
                    .and.have.deep.property("Url").that.is.not.null;
            });

            // it("Should get a sharing link with a specified kind.", () => {
            //     return expect(file.getShareLink(SharingLinkKind.AnonymousView))
            //         .to.eventually.be.fulfilled
            //         .and.have.property("sharingLinkInfo")
            //         .and.have.deep.property("Url").that.is.not.null;
            // });

            // it("Should get a sharing link with a specified kind and expiration.", () => {
            //     return expect(file.getShareLink(SharingLinkKind.AnonymousView, Util.dateAdd(new Date(), "day", 5)))
            //         .to.eventually.be.fulfilled
            //         .and.have.property("sharingLinkInfo")
            //         .and.have.deep.property("Url").that.is.not.null;
            // });

            it("Should allow sharing to a person with default settings.", () => {

                return expect(file.shareWith("c:0(.s|true"))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });

            it("Should allow sharing to a person with the edit role.", () => {

                return expect(file.shareWith("c:0(.s|true", SharingRole.Edit))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });

            it("Should allow sharing to a person with the edit role and require sign-in.", () => {

                return expect(file.shareWith("c:0(.s|true", SharingRole.View, true))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });

            it("Should allow for checking of sharing permissions.", () => {

                return expect(file.checkSharingPermissions([{ alias: "c:0(.s|true" }]))
                    .to.eventually.be.fulfilled;
            });

            it("Should allow getting Sharing Information.", () => {

                return expect(file.getSharingInformation())
                    .to.eventually.be.fulfilled;
            });

            it("Should allow getting Object Sharing Settings.", () => {

                return expect(file.getObjectSharingSettings(true))
                    .to.eventually.be.fulfilled;
            });

            it("Should allow unsharing.", () => {

                return expect(file.unshare())
                    .to.eventually.be.fulfilled;
            });

            // it("Should allow deleting a link by kind.", () => {

            //     return expect(file.getShareLink(SharingLinkKind.AnonymousView).then(_ => {

            //         return file.deleteSharingLinkByKind(SharingLinkKind.AnonymousView);
            //     })).to.eventually.be.fulfilled;
            // });

            // it("Should allow unsharing a link by kind.", () => {

            //     return expect(file.getShareLink(SharingLinkKind.AnonymousView).then(response => {

            //         return file.unshareLink(SharingLinkKind.AnonymousView, response.sharingLinkInfo.ShareId);
            //     })).to.eventually.be.fulfilled;
            // });
        });

        describe("can operate on items", () => {

            let item: Item = null;

            before(() => {

                item = web.lists.getByTitle("SharingTestLib").items.getById(1);
            });

            it("Should get a sharing link with default settings.", () => {

                return expect(item.getShareLink())
                    .to.eventually.be.fulfilled
                    .and.have.property("sharingLinkInfo")
                    .and.have.deep.property("Url").that.is.not.null;
            });

            // it("Should get a sharing link with a specified kind.", () => {
            //     return expect(item.getShareLink(SharingLinkKind.AnonymousView))
            //         .to.eventually.be.fulfilled
            //         .and.have.property("sharingLinkInfo")
            //         .and.have.deep.property("Url").that.is.not.null;
            // });

            // it("Should get a sharing link with a specified kind and expiration.", () => {
            //     return expect(item.getShareLink(SharingLinkKind.AnonymousView, Util.dateAdd(new Date(), "day", 5)))
            //         .to.eventually.be.fulfilled
            //         .and.have.property("sharingLinkInfo")
            //         .and.have.deep.property("Url").that.is.not.null;
            // });

            it("Should allow sharing to a person with default settings.", () => {

                return expect(item.shareWith("c:0(.s|true"))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });

            it("Should allow sharing to a person with the edit role.", () => {

                return expect(item.shareWith("c:0(.s|true", SharingRole.Edit))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });

            it("Should allow sharing to a person with the edit role and require sign-in.", () => {

                return expect(item.shareWith("c:0(.s|true", SharingRole.View, true))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });

            it("Should allow sharing to a person with the edit role and require sign-in.", () => {

                return expect(item.shareWith("c:0(.s|true", SharingRole.View, true))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });

            it("Should allow for checking of sharing permissions.", () => {

                return expect(item.checkSharingPermissions([{ alias: "c:0(.s|true" }]))
                    .to.eventually.be.fulfilled;
            });

            it("Should allow getting Sharing Information.", () => {

                return expect(item.getSharingInformation())
                    .to.eventually.be.fulfilled;
            });

            it("Should allow getting Object Sharing Settings.", () => {

                return expect(item.getObjectSharingSettings(true))
                    .to.eventually.be.fulfilled;
            });

            it("Should allow unsharing.", () => {

                return expect(item.unshare())
                    .to.eventually.be.fulfilled;
            });

            // it("Should allow deleting a link by kind.", () => {

            //     return expect(item.getShareLink(SharingLinkKind.AnonymousView).then(_ => {

            //         return item.deleteSharingLinkByKind(SharingLinkKind.AnonymousView);
            //     })).to.eventually.be.fulfilled;
            // });

            // it("Should allow unsharing a link by kind.", () => {

            //     return expect(item.getShareLink(SharingLinkKind.AnonymousView).then(response => {

            //         return item.unshareLink(SharingLinkKind.AnonymousView, response.sharingLinkInfo.ShareId);
            //     })).to.eventually.be.fulfilled;
            // });
        });

        describe("can operate on webs", () => {

            it("Should allow you to share a web with a person using default settings", () => {

                return expect(web.shareWith("c:0(.s|true"))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });

            it("Should allow you to share an object by url", () => {

                return expect(web.shareObject(Util.combinePaths(webAbsUrl, "SharingTestLib/test.txt"), "c:0(.s|true", SharingRole.View))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });
        });
    }
});

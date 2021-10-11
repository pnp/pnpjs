import { expect } from "chai";
import { getSP, testSettings } from "../main.js";
import { combine, dateAdd } from "@pnp/core";
import { IFolder } from "@pnp/sp/folders";
import { IFile } from "@pnp/sp/files";
import { IItem } from "@pnp/sp/items";
import "@pnp/sp/lists/web";
import "@pnp/sp/folders";
import "@pnp/sp/files";
import "@pnp/sp/sharing";
import "@pnp/sp/site-users";
import { SharingRole, SharingLinkKind } from "@pnp/sp/sharing";
import { SPFI } from "@pnp/sp";

describe("Sharing", function () {

    let webAbsUrl = "";
    let webRelativeUrl = "";
    let _spfi: SPFI;

    before(async function () {
        _spfi = getSP();

        const urls = await _spfi.web.select("ServerRelativeUrl", "Url")();

        // make sure we have the correct server relative url
        webRelativeUrl = urls.ServerRelativeUrl;
        webAbsUrl = urls.Url;

        // we need a doc lib with a file and folder in it
        const ler = await _spfi.web.lists.ensure("SharingTestLib", "Used to test sharing", 101);

        // we need a user to share to
        if (testSettings.testUser?.length > 0) {
            await _spfi.web.ensureUser(testSettings.testUser);
        }

        // add a file and folder
        await Promise.all([
            ler.list.rootFolder.folders.addUsingPath("MyTestFolder"),
            ler.list.rootFolder.files.addUsingPath("test.txt", "Some file content!"),
        ]);
    });

    if (testSettings.enableWebTests) {

        describe("can operate on folders", function () {

            let folder: IFolder = null;

            before(function () {

                folder = _spfi.web.getFolderByServerRelativePath("/" + combine(webRelativeUrl, "SharingTestLib/MyTestFolder"));
            });

            // // these tests cover share link
            it("Should get a sharing link with default settings.", function () {

                return expect(folder.getShareLink(SharingLinkKind.OrganizationView))
                    .to.eventually.be.fulfilled
                    .and.have.property("sharingLinkInfo")
                    .and.have.deep.property("Url").that.is.not.null;
            });

            it("Should get a sharing link with a specified kind.", function () {
                return expect(folder.getShareLink(SharingLinkKind.AnonymousView))
                    .to.eventually.be.fulfilled
                    .and.have.property("sharingLinkInfo")
                    .and.have.deep.property("Url").that.is.not.null;
            });

            it("Should get a sharing link with a specified kind and expiration.", function () {
                return expect(folder.getShareLink(SharingLinkKind.AnonymousView, dateAdd(new Date(), "day", 5)))
                    .to.eventually.be.fulfilled
                    .and.have.property("sharingLinkInfo")
                    .and.have.deep.property("Url").that.is.not.null;
            });

            if (testSettings.testUser?.length > 0) {
                it("Should allow sharing to a person with the edit role.", function () {

                    return expect(folder.shareWith(testSettings.testUser, SharingRole.Edit))
                        .to.eventually.be.fulfilled
                        .and.have.property("ErrorMessage").that.is.null;
                });

                it("Should allow sharing to a person with the edit role and share all content.", function () {

                    return expect(folder.shareWith(testSettings.testUser, SharingRole.Edit, true))
                        .to.eventually.be.fulfilled
                        .and.have.property("ErrorMessage").that.is.null;
                });

                it("Should allow for checking of sharing permissions.", function () {

                    return expect(folder.checkSharingPermissions([{ alias: testSettings.testUser }]))
                        .to.eventually.be.fulfilled;
                });
            }

            it("Should allow getting Sharing Information.", function () {

                return expect(folder.getSharingInformation())
                    .to.eventually.be.fulfilled;
            });

            it("Should allow getting Object Sharing Settings.", function () {

                return expect(folder.getObjectSharingSettings(true))
                    .to.eventually.be.fulfilled;
            });

            it("Should allow unsharing.", function () {

                return expect(folder.unshare())
                    .to.eventually.be.fulfilled;
            });

            // it("Should allow deleting a link by kind.", function () {

            //     return expect(folder.getShareLink(SharingLinkKind.AnonymousView).then(_ => {

            //         return folder.deleteSharingLinkByKind(SharingLinkKind.AnonymousView);
            //     })).to.eventually.be.fulfilled;
            // });

            // it("Should allow unsharing a link by kind.", function () {

            //     return expect(folder.getShareLink(SharingLinkKind.AnonymousView).then(response => {

            //         return folder.unshareLink(SharingLinkKind.AnonymousView, response.sharingLinkInfo.ShareId);
            //     })).to.eventually.be.fulfilled;
            // });
        });

        // files sharing is not testable
        describe.skip("can operate on files", function () {

            let file: IFile = null;

            before(function () {

                file = _spfi.web.getFileByServerRelativePath("/" + combine(webRelativeUrl, "SharingTestLib/text.txt"));
            });

            it("Should get a sharing link with default settings.", function () {

                return expect(file.getShareLink(SharingLinkKind.OrganizationView))
                    .to.eventually.be.fulfilled
                    .and.have.property("sharingLinkInfo")
                    .and.have.deep.property("Url").that.is.not.null;
            });

            it("Should get a sharing link with a specified kind.", function () {
                return expect(file.getShareLink(SharingLinkKind.AnonymousView))
                    .to.eventually.be.fulfilled
                    .and.have.property("sharingLinkInfo")
                    .and.have.deep.property("Url").that.is.not.null;
            });

            it("Should get a sharing link with a specified kind and expiration.", function () {
                return expect(file.getShareLink(SharingLinkKind.AnonymousView, dateAdd(new Date(), "day", 5)))
                    .to.eventually.be.fulfilled
                    .and.have.property("sharingLinkInfo")
                    .and.have.deep.property("Url").that.is.not.null;
            });

            if (testSettings.testUser?.length > 0) {
                it("Should allow sharing to a person with the edit role.", function () {

                    return expect(file.shareWith(testSettings.testUser, SharingRole.Edit))
                        .to.eventually.be.fulfilled
                        .and.have.property("ErrorMessage").that.is.null;
                });

                it("Should allow sharing to a person with the edit role and require sign-in.", function () {

                    return expect(file.shareWith(testSettings.testUser, SharingRole.View, true))
                        .to.eventually.be.fulfilled
                        .and.have.property("ErrorMessage").that.is.null;
                });

                it("Should allow for checking of sharing permissions.", function () {

                    return expect(file.checkSharingPermissions([{ alias: testSettings.testUser }]))
                        .to.eventually.be.fulfilled;
                });
            }

            it("Should allow getting Sharing Information.", function () {

                return expect(file.getSharingInformation())
                    .to.eventually.be.fulfilled;
            });

            it("Should allow getting Object Sharing Settings.", function () {

                return expect(file.getObjectSharingSettings(true))
                    .to.eventually.be.fulfilled;
            });

            it("Should allow unsharing.", function () {

                return expect(file.unshare())
                    .to.eventually.be.fulfilled;
            });

            it("Should allow deleting a link by kind.", function () {

                return expect(file.getShareLink(SharingLinkKind.AnonymousView).then(function () {

                    return file.deleteSharingLinkByKind(SharingLinkKind.AnonymousView);
                })).to.eventually.be.fulfilled;
            });

            it("Should allow unsharing a link by kind.", function () {

                return expect(file.getShareLink(SharingLinkKind.AnonymousView).then(response => {

                    return file.unshareLink(SharingLinkKind.AnonymousView, response.sharingLinkInfo.ShareId);
                })).to.eventually.be.fulfilled;
            });
        });

        describe("can operate on items", function () {

            let item: IItem = null;

            before(function () {

                item = _spfi.web.lists.getByTitle("SharingTestLib").items.getById(1);
            });

            it("Should get a sharing link with default settings.", function () {

                return expect(item.getShareLink(SharingLinkKind.OrganizationView))
                    .to.eventually.be.fulfilled
                    .and.have.property("sharingLinkInfo")
                    .and.have.deep.property("Url").that.is.not.null;
            });

            it("Should get a sharing link with a specified kind.", function () {
                return expect(item.getShareLink(SharingLinkKind.AnonymousView))
                    .to.eventually.be.fulfilled
                    .and.have.property("sharingLinkInfo")
                    .and.have.deep.property("Url").that.is.not.null;
            });

            it("Should get a sharing link with a specified kind and expiration.", function () {
                return expect(item.getShareLink(SharingLinkKind.AnonymousView, dateAdd(new Date(), "day", 5)))
                    .to.eventually.be.fulfilled
                    .and.have.property("sharingLinkInfo")
                    .and.have.deep.property("Url").that.is.not.null;
            });

            if (testSettings.testUser?.length > 0) {
                it("Should allow sharing to a person with the edit role.", function () {

                    return expect(item.shareWith(testSettings.testUser, SharingRole.Edit))
                        .to.eventually.be.fulfilled
                        .and.have.property("ErrorMessage").that.is.null;
                });

                it("Should allow sharing to a person with the edit role and require sign-in.", function () {

                    return expect(item.shareWith(testSettings.testUser, SharingRole.View, true))
                        .to.eventually.be.fulfilled
                        .and.have.property("ErrorMessage").that.is.null;
                });

                it("Should allow sharing to a person with the edit role and require sign-in.", function () {

                    return expect(item.shareWith(testSettings.testUser, SharingRole.View, true))
                        .to.eventually.be.fulfilled
                        .and.have.property("ErrorMessage").that.is.null;
                });

                it("Should allow for checking of sharing permissions.", function () {

                    return expect(item.checkSharingPermissions([{ alias: testSettings.testUser }]))
                        .to.eventually.be.fulfilled;
                });
            }

            it("Should allow getting Sharing Information.", function () {

                return expect(item.getSharingInformation())
                    .to.eventually.be.fulfilled;
            });

            it("Should allow getting Object Sharing Settings.", function () {

                return expect(item.getObjectSharingSettings(true))
                    .to.eventually.be.fulfilled;
            });

            it("Should allow unsharing.", function () {

                return expect(item.unshare())
                    .to.eventually.be.fulfilled;
            });

            // it("Should allow deleting a link by kind.", function () {

            //     return expect(item.getShareLink(SharingLinkKind.AnonymousView).then(_ => {

            //         return item.deleteSharingLinkByKind(SharingLinkKind.AnonymousView);
            //     })).to.eventually.be.fulfilled;
            // });

            // it("Should allow unsharing a link by kind.", function () {

            //     return expect(item.getShareLink(SharingLinkKind.AnonymousView).then(response => {

            //         return item.unshareLink(SharingLinkKind.AnonymousView, response.sharingLinkInfo.ShareId);
            //     })).to.eventually.be.fulfilled;
            // });
        });

        describe("can operate on webs", function () {

            if (testSettings.testUser?.length > 0) {
                it("Should allow you to share an object by url", function () {

                    return expect(_spfi.web.shareObject(combine(webAbsUrl, "SharingTestLib/test.txt"), testSettings.testUser, SharingRole.View))
                        .to.eventually.be.fulfilled
                        .and.have.property("ErrorMessage").that.is.null;
                });
            }
        });
    }
});

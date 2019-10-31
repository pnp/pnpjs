import { expect } from "chai";
import { testSettings } from "../main";
import { combine, dateAdd } from "@pnp/common";
import { Web, IWeb } from "@pnp/sp/webs";
import { IFolder } from "@pnp/sp/folders";
import { IFile } from "@pnp/sp/files";
import { IItem } from "@pnp/sp/items";
import "@pnp/sp/lists/web";
import "@pnp/sp/folders";
import "@pnp/sp/files";
import "@pnp/sp/sharing";
import "@pnp/sp/site-users";
import { SharingRole, SharingLinkKind } from "@pnp/sp/sharing";

describe("Sharing", () => {

    let webAbsUrl = "";
    let webRelativeUrl = "";
    let web: IWeb;
    let userName = "";

    before(async function () {

        // we need to take some steps to ensure we are operating on the correct web here
        // due to the url manipulation in the library for sharing
        web = Web(testSettings.sp.webUrl);

        const urls = await web.select("ServerRelativeUrl", "Url")();

        // make sure we have the correct server relative url
        webRelativeUrl = urls.ServerRelativeUrl;
        webAbsUrl = urls.Url;

        // we need a doc lib with a file and folder in it
        const ler = await web.lists.ensure("SharingTestLib", "Used to test sharing", 101);

        const users = await web.siteUsers.select("LoginName").top(1)();

        // we need a user to share to
        await web.ensureUser(users[0].LoginName);
        userName = users[0].LoginName;

        // add a file and folder
        await Promise.all([
            ler.list.rootFolder.folders.add("MyTestFolder"),
            ler.list.rootFolder.files.add("test.txt", "Some file content!"),
        ]);
    });

    if (testSettings.enableWebTests) {

        describe("can operate on folders", () => {

            let folder: IFolder = null;

            before(() => {

                folder = web.getFolderByServerRelativeUrl("/" + combine(webRelativeUrl, "SharingTestLib/MyTestFolder"));
            });

            // // these tests cover share link
            it("Should get a sharing link with default settings.", () => {

                return expect(folder.getShareLink(SharingLinkKind.OrganizationView))
                    .to.eventually.be.fulfilled
                    .and.have.property("sharingLinkInfo")
                    .and.have.deep.property("Url").that.is.not.null;
            });

            it("Should get a sharing link with a specified kind.", () => {
                return expect(folder.getShareLink(SharingLinkKind.AnonymousView))
                    .to.eventually.be.fulfilled
                    .and.have.property("sharingLinkInfo")
                    .and.have.deep.property("Url").that.is.not.null;
            });

            it("Should get a sharing link with a specified kind and expiration.", () => {
                return expect(folder.getShareLink(SharingLinkKind.AnonymousView, dateAdd(new Date(), "day", 5)))
                    .to.eventually.be.fulfilled
                    .and.have.property("sharingLinkInfo")
                    .and.have.deep.property("Url").that.is.not.null;
            });

            it("Should allow sharing to a person with the edit role.", () => {

                return expect(folder.shareWith(userName, SharingRole.Edit))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });

            it("Should allow sharing to a person with the edit role and share all content.", () => {

                return expect(folder.shareWith(userName, SharingRole.Edit, true))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });

            it("Should allow for checking of sharing permissions.", () => {

                return expect(folder.checkSharingPermissions([{ alias: userName }]))
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

        // files sharing is not testable
        describe.skip("can operate on files", () => {

            let file: IFile = null;

            before(() => {

                file = web.getFileByServerRelativeUrl("/" + combine(webRelativeUrl, "SharingTestLib/text.txt"));
            });

            it("Should get a sharing link with default settings.", () => {

                return expect(file.getShareLink(SharingLinkKind.OrganizationView))
                    .to.eventually.be.fulfilled
                    .and.have.property("sharingLinkInfo")
                    .and.have.deep.property("Url").that.is.not.null;
            });

            it("Should get a sharing link with a specified kind.", () => {
                return expect(file.getShareLink(SharingLinkKind.AnonymousView))
                    .to.eventually.be.fulfilled
                    .and.have.property("sharingLinkInfo")
                    .and.have.deep.property("Url").that.is.not.null;
            });

            it("Should get a sharing link with a specified kind and expiration.", () => {
                return expect(file.getShareLink(SharingLinkKind.AnonymousView, dateAdd(new Date(), "day", 5)))
                    .to.eventually.be.fulfilled
                    .and.have.property("sharingLinkInfo")
                    .and.have.deep.property("Url").that.is.not.null;
            });

            it("Should allow sharing to a person with the edit role.", () => {

                return expect(file.shareWith(userName, SharingRole.Edit))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });

            it("Should allow sharing to a person with the edit role and require sign-in.", () => {

                return expect(file.shareWith(userName, SharingRole.View, true))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });

            it("Should allow for checking of sharing permissions.", () => {

                return expect(file.checkSharingPermissions([{ alias: userName }]))
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

            it("Should allow deleting a link by kind.", () => {

                return expect(file.getShareLink(SharingLinkKind.AnonymousView).then(_ => {

                    return file.deleteSharingLinkByKind(SharingLinkKind.AnonymousView);
                })).to.eventually.be.fulfilled;
            });

            it("Should allow unsharing a link by kind.", () => {

                return expect(file.getShareLink(SharingLinkKind.AnonymousView).then(response => {

                    return file.unshareLink(SharingLinkKind.AnonymousView, response.sharingLinkInfo.ShareId);
                })).to.eventually.be.fulfilled;
            });
        });

        describe("can operate on items", () => {

            let item: IItem = null;

            before(() => {

                item = web.lists.getByTitle("SharingTestLib").items.getById(1);
            });

            it("Should get a sharing link with default settings.", () => {

                return expect(item.getShareLink(SharingLinkKind.OrganizationView))
                    .to.eventually.be.fulfilled
                    .and.have.property("sharingLinkInfo")
                    .and.have.deep.property("Url").that.is.not.null;
            });

            it("Should get a sharing link with a specified kind.", () => {
                return expect(item.getShareLink(SharingLinkKind.AnonymousView))
                    .to.eventually.be.fulfilled
                    .and.have.property("sharingLinkInfo")
                    .and.have.deep.property("Url").that.is.not.null;
            });

            it("Should get a sharing link with a specified kind and expiration.", () => {
                return expect(item.getShareLink(SharingLinkKind.AnonymousView, dateAdd(new Date(), "day", 5)))
                    .to.eventually.be.fulfilled
                    .and.have.property("sharingLinkInfo")
                    .and.have.deep.property("Url").that.is.not.null;
            });

            it("Should allow sharing to a person with the edit role.", () => {

                return expect(item.shareWith(userName, SharingRole.Edit))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });

            it("Should allow sharing to a person with the edit role and require sign-in.", () => {

                return expect(item.shareWith(userName, SharingRole.View, true))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });

            it("Should allow sharing to a person with the edit role and require sign-in.", () => {

                return expect(item.shareWith(userName, SharingRole.View, true))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });

            it("Should allow for checking of sharing permissions.", () => {

                return expect(item.checkSharingPermissions([{ alias: userName }]))
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

            it("Should allow you to share an object by url", () => {

                return expect(web.shareObject(combine(webAbsUrl, "SharingTestLib/test.txt"), userName, SharingRole.View))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });
        });
    }
});

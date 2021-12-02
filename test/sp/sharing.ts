import { expect } from "chai";
import { getSP, testSettings } from "../main.js";
import { combine, dateAdd, stringIsNullOrEmpty } from "@pnp/core";
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

    this.timeout(120000);
    const testSharingLib = "SharingTestLib";
    const testSharingFolder = "MyTestFolder";
    const testSharingFile = "test.txt";
    let webAbsUrl = "";
    let webRelativeUrl = "";
    let _spfi: SPFI;

    before(async function () {

        if (!testSettings.enableWebTests || stringIsNullOrEmpty(testSettings.testUser)) {
            this.skip();
            return;
        }

        _spfi = getSP();

        const urls = await _spfi.web.select("ServerRelativeUrl", "Url")();

        // make sure we have the correct server relative url
        webRelativeUrl = urls.ServerRelativeUrl;
        webAbsUrl = urls.Url;

        // we need a doc lib with a file and folder in it
        const ler = await _spfi.web.lists.ensure(testSharingLib, "Used to test sharing", 101);

        // we need a user to share to
        if (testSettings.testUser?.length > 0) {
            await _spfi.web.ensureUser(testSettings.testUser);
        }

        // add a file and folder
        await ler.list.rootFolder.folders.addUsingPath(testSharingFolder);
        await ler.list.rootFolder.files.addUsingPath(testSharingFile, "Some file content!");
    });

    after(async function () {
        if (testSettings.enableWebTests) {
            await _spfi.web.lists.getByTitle(testSharingLib).delete();
        }
    });

    describe("Folder", function () {

        let folder: IFolder = null;

        before(function () {

            folder = _spfi.web.getFolderByServerRelativePath("/" + combine(webRelativeUrl, `${testSharingLib}/${testSharingFolder}`));
        });

        // // these tests cover share link
        it(".getShareLink (OrganizationView)", function () {

            return expect(folder.getShareLink(SharingLinkKind.OrganizationView))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        });

        it(".getShareLink (AnonymousView)", function () {
            return expect(folder.getShareLink(SharingLinkKind.AnonymousView))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        });

        it(".getShareLink (ExpirationDate)", function () {
            return expect(folder.getShareLink(SharingLinkKind.AnonymousView, dateAdd(new Date(), "day", 5)))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        });

        if (testSettings.testUser?.length > 0) {
            // TODO: shareWith eventually calls line 252 in /packages/sp/sharing/funcs.ts which is not able to retrieve a role definition for Edit
            it.skip(".shareWith (Edit)", function () {

                return expect(folder.shareWith(testSettings.testUser, SharingRole.Edit))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });
            // TODO: shareWith eventually calls line 252 in /packages/sp/sharing/funcs.ts which is not able to retrieve a role definition for Edit
            it.skip(".shareWith (Edit-All)", function () {

                return expect(folder.shareWith(testSettings.testUser, SharingRole.Edit, true))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });

            it(".checkSharingPermissions", function () {

                return expect(folder.checkSharingPermissions([{ alias: testSettings.testUser }]))
                    .to.eventually.be.fulfilled;
            });
        }

        it(".getSharingInformation", function () {

            return expect(folder.getSharingInformation())
                .to.eventually.be.fulfilled;
        });

        it(".getObjectSharingSettings", function () {

            return expect(folder.getObjectSharingSettings(true))
                .to.eventually.be.fulfilled;
        });

        it(".unshare", function () {

            return expect(folder.unshare())
                .to.eventually.be.fulfilled;
        });
    });

    // files sharing is not testable
    describe.skip("File", function () {

        let file: IFile = null;

        before(function () {

            file = _spfi.web.getFileByServerRelativePath("/" + combine(webRelativeUrl, `${testSharingLib}/${testSharingFile}`));
        });

        it(".getShareLink (OrganizationView)", function () {

            return expect(file.getShareLink(SharingLinkKind.OrganizationView))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        });

        it(".getShareLink (AnonymousView)", function () {
            return expect(file.getShareLink(SharingLinkKind.AnonymousView))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        });

        it(".getShareLink (ExpirationDate)", function () {
            return expect(file.getShareLink(SharingLinkKind.AnonymousView, dateAdd(new Date(), "day", 5)))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        });

        if (testSettings.testUser?.length > 0) {
            it(".shareWith (Edit)", function () {

                return expect(file.shareWith(testSettings.testUser, SharingRole.Edit))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });

            it(".shareWith (Edit-All)", function () {

                return expect(file.shareWith(testSettings.testUser, SharingRole.Edit, true))
                    .to.eventually.be.fulfilled
                    .and.have.property("ErrorMessage").that.is.null;
            });

            it(".checkSharingPermissions", function () {

                return expect(file.checkSharingPermissions([{ alias: testSettings.testUser }]))
                    .to.eventually.be.fulfilled;
            });
        }

        it(".getSharingInformation", function () {

            return expect(file.getSharingInformation())
                .to.eventually.be.fulfilled;
        });

        it(".getObjectSharingSettings", function () {

            return expect(file.getObjectSharingSettings(true))
                .to.eventually.be.fulfilled;
        });

        it(".unshare", function () {

            return expect(file.unshare())
                .to.eventually.be.fulfilled;
        });
    });

    describe("Item", function () {

        let item: IItem = null;

        before(function () {

            item = _spfi.web.lists.getByTitle(testSharingLib).items.getById(1);
        });

        it(".getShareLink (OrganizationView)", function () {

            return expect(item.getShareLink(SharingLinkKind.OrganizationView))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        });

        it(".getShareLink (AnonymousView)", function () {
            return expect(item.getShareLink(SharingLinkKind.AnonymousView))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        });

        it(".getShareLink (ExpirationDate)", function () {
            return expect(item.getShareLink(SharingLinkKind.AnonymousView, dateAdd(new Date(), "day", 5)))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        });

        if (testSettings.testUser?.length > 0) {
            // TODO: shareWith eventually calls line 252 in /packages/sp/sharing/funcs.ts which is not able to retrieve a role definition for Edit
            it.skip(".shareWith (Edit)", async function () {
                const itemShare = await item.shareWith(testSettings.testUser, SharingRole.Edit);
                return expect(itemShare).has.property("ErrorMessage").that.is.null;
            });

            // TODO: shareWith eventually calls line 252 in /packages/sp/sharing/funcs.ts which is not able to retrieve a role definition for Edit
            it.skip(".shareWith (Edit-All)", async function () {
                const itemShare = await item.shareWith(testSettings.testUser, SharingRole.Edit, true);
                return expect(itemShare).has.property("ErrorMessage").that.is.null;
            });

            it(".checkSharingPermissions", function () {

                return expect(item.checkSharingPermissions([{ alias: testSettings.testUser }]))
                    .to.eventually.be.fulfilled;
            });
        }

        it(".getSharingInformation", function () {

            return expect(item.getSharingInformation())
                .to.eventually.be.fulfilled;
        });

        it(".getObjectSharingSettings", function () {

            return expect(item.getObjectSharingSettings(true))
                .to.eventually.be.fulfilled;
        });

        it(".unshare", function () {

            return expect(item.unshare())
                .to.eventually.be.fulfilled;
        });
    });

    describe("Web", function () {

        if (testSettings.testUser?.length > 0) {
            it(".shareObject", async function () {
                const shareObj = combine(webAbsUrl, `${testSharingLib}/${testSharingFile}`);
                const shareWeb = await _spfi.web.shareObject(shareObj, testSettings.testUser, SharingRole.View);
                return expect(shareWeb).has.property("ErrorMessage").that.is.null;
            });
        }
    });
});

import { expect } from "chai";
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


describe("Sharing", function () {

    const testSharingLib = "SharingTestLib";
    const testSharingFolder = "MyTestFolder";
    const testSharingFile = "test.txt";
    let webAbsUrl = "";
    let webRelativeUrl = "";

    before(async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const urls = await this.pnp.sp.web.select("ServerRelativeUrl", "Url")();

        // make sure we have the correct server relative url
        webRelativeUrl = urls.ServerRelativeUrl;
        webAbsUrl = urls.Url;

        // we need a doc lib with a file and folder in it
        const ler = await this.pnp.sp.web.lists.ensure(testSharingLib, "Used to test sharing", 101);

        // we need a user to share to
        if (this.pnp.settings.testUser?.length > 0) {
            await this.pnp.sp.web.ensureUser(this.pnp.settings.testUser);
        }

        // add a file and folder
        await ler.list.rootFolder.folders.addUsingPath(testSharingFolder);
        await ler.list.rootFolder.files.addUsingPath(testSharingFile, "Some file content!");
    });

    after(async function () {
        if (this.pnp.settings.enableWebTests && !stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            return this.pnp.sp.web.lists.getByTitle(testSharingLib).delete();
        }
        return;
    });

    describe("Folder", function () {

        let folder: IFolder = null;

        before(function () {

            folder = this.pnp.sp.web.getFolderByServerRelativePath("/" + combine(webRelativeUrl, `${testSharingLib}/${testSharingFolder}`));
        });

        // // these tests cover share link
        it("getShareLink (OrganizationView)", function () {

            return expect(folder.getShareLink(SharingLinkKind.OrganizationView))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        });

        it("getShareLink (AnonymousView)", function () {
            return expect(folder.getShareLink(SharingLinkKind.AnonymousView))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        });

        it("getShareLink (ExpirationDate)", function () {
            return expect(folder.getShareLink(SharingLinkKind.AnonymousView, dateAdd(new Date(), "day", 5)))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        });

        it(".shareWith (Edit)", function () {

            if (this.pnp.settings.testUser?.length < 1) {
                this.skip();
            }

            return expect(folder.shareWith(this.pnp.settings.testUser, SharingRole.Edit))
                .to.eventually.be.fulfilled
                .and.have.property("ErrorMessage").that.is.null;
        });

        it.skip(".shareWith (Edit-All)", function () {

            if (this.pnp.settings.testUser?.length < 1) {
                this.skip();
            }

            return expect(folder.shareWith(this.pnp.settings.testUser, SharingRole.Edit, true))
                .to.eventually.be.fulfilled
                .and.have.property("ErrorMessage").that.is.null;
        });

        it("checkSharingPermissions", function () {

            if (this.pnp.settings.testUser?.length < 1) {
                this.skip();
            }

            return expect(folder.checkSharingPermissions([{ alias: this.pnp.settings.testUser }]))
                .to.eventually.be.fulfilled;
        });

        it("getSharingInformation", function () {

            return expect(folder.getSharingInformation())
                .to.eventually.be.fulfilled;
        });

        it("getObjectSharingSettings", function () {

            return expect(folder.getObjectSharingSettings(true))
                .to.eventually.be.fulfilled;
        });

        it("unshare", function () {

            return expect(folder.unshare())
                .to.eventually.be.fulfilled;
        });
    });

    // TODO:: is this true: files sharing is not testable
    describe.skip("File", function () {

        let file: IFile = null;

        before(function () {

            file = this.pnp.sp.web.getFileByServerRelativePath("/" + combine(webRelativeUrl, `${testSharingLib}/${testSharingFile}`));
        });

        it("getShareLink (OrganizationView)", function () {

            return expect(file.getShareLink(SharingLinkKind.OrganizationView))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        });

        it("getShareLink (AnonymousView)", function () {
            return expect(file.getShareLink(SharingLinkKind.AnonymousView))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        });

        it("getShareLink (ExpirationDate)", function () {
            return expect(file.getShareLink(SharingLinkKind.AnonymousView, dateAdd(new Date(), "day", 5)))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        });

        it("shareWith (Edit)", function () {

            if (this.pnp.settings.testUser?.length < 1) {
                this.skip();
            }

            return expect(file.shareWith(this.pnp.settings.testUser, SharingRole.Edit))
                .to.eventually.be.fulfilled
                .and.have.property("ErrorMessage").that.is.null;
        });

        it.skip("shareWith (Edit-All)", function () {

            if (this.pnp.settings.testUser?.length < 1) {
                this.skip();
            }

            return expect(file.shareWith(this.pnp.settings.testUser, SharingRole.Edit, true))
                .to.eventually.be.fulfilled
                .and.have.property("ErrorMessage").that.is.null;
        });

        it("checkSharingPermissions", function () {

            if (this.pnp.settings.testUser?.length < 1) {
                this.skip();
            }

            return expect(file.checkSharingPermissions([{ alias: this.pnp.settings.testUser }]))
                .to.eventually.be.fulfilled;
        });

        it("getSharingInformation", function () {

            return expect(file.getSharingInformation())
                .to.eventually.be.fulfilled;
        });

        it("getObjectSharingSettings", function () {

            return expect(file.getObjectSharingSettings(true))
                .to.eventually.be.fulfilled;
        });

        it("unshare", function () {

            return expect(file.unshare())
                .to.eventually.be.fulfilled;
        });
    });

    describe("Item", function () {

        let item: IItem = null;

        before(function () {

            item = this.pnp.sp.web.lists.getByTitle(testSharingLib).items.getById(1);
        });

        it("getShareLink (OrganizationView)", function () {

            return expect(item.getShareLink(SharingLinkKind.OrganizationView))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        });

        it("getShareLink (AnonymousView)", function () {
            return expect(item.getShareLink(SharingLinkKind.AnonymousView))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        });

        it("getShareLink (ExpirationDate)", function () {
            return expect(item.getShareLink(SharingLinkKind.AnonymousView, dateAdd(new Date(), "day", 5)))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        });

        it(".shareWith (Edit)", async function () {

            if (this.pnp.settings.testUser?.length < 1) {
                this.skip();
            }

            const itemShare = await item.shareWith(this.pnp.settings.testUser, SharingRole.Edit);
            return expect(itemShare).has.property("ErrorMessage").that.is.null;
        });

        it.skip(".shareWith (Edit-All)", async function () {

            if (this.pnp.settings.testUser?.length < 1) {
                this.skip();
            }

            const itemShare = await item.shareWith(this.pnp.settings.testUser, SharingRole.Edit, true);
            return expect(itemShare).has.property("ErrorMessage").that.is.null;
        });

        it("checkSharingPermissions", function () {

            if (this.pnp.settings.testUser?.length < 1) {
                this.skip();
            }

            return expect(item.checkSharingPermissions([{ alias: this.pnp.settings.testUser }]))
                .to.eventually.be.fulfilled;
        });

        it("getSharingInformation", function () {

            return expect(item.getSharingInformation())
                .to.eventually.be.fulfilled;
        });

        it("getObjectSharingSettings", function () {

            return expect(item.getObjectSharingSettings(true))
                .to.eventually.be.fulfilled;
        });

        it("unshare", function () {

            return expect(item.unshare())
                .to.eventually.be.fulfilled;
        });
    });

    describe("Web", function () {

        it.skip("shareObject", async function () {

            if (this.pnp.settings.testUser?.length < 1) {
                this.skip();
            }

            const shareObj = combine(webAbsUrl, `${testSharingLib}/${testSharingFile}`);
            const shareWeb = await this.pnp.sp.web.shareObject(shareObj, this.pnp.settings.testUser, SharingRole.View);
            return expect(shareWeb).has.property("ErrorMessage").that.is.null;
        });
    });
});

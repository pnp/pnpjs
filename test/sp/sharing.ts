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
import { pnpTest } from  "../pnp-test.js";


describe("Sharing", function () {

    const testSharingLib = "SharingTestLib";
    const testSharingFolder = "MyTestFolder";
    const testSharingFile = "test.txt";
    let webAbsUrl = "";
    let webRelativeUrl = "";

    before(pnpTest("b56f2a3a-5144-4020-83f4-9ad0ab3c4072", async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const urls = await this.pnp.sp.web.select("ServerRelativeUrl", "Url")();

        // make sure we have the correct server relative url
        webRelativeUrl = urls.ServerRelativeUrl;
        webAbsUrl = urls.Url;

        // we need a doc lib with a file and folder in it
        const ler = await this.pnp.sp.web.lists.ensure(testSharingLib, "Used to test sharing", 101);
        const list = ler.list;

        // we need a user to share to
        if (this.pnp.settings.testUser?.length > 0) {
            await this.pnp.sp.web.ensureUser(this.pnp.settings.testUser);
        }

        // add a file and folder
        await list.rootFolder.folders.addUsingPath(testSharingFolder);
        await list.rootFolder.files.addUsingPath(testSharingFile, "Some file content!");
    }));

    after(pnpTest("a24bd094-60ec-49c3-b0be-a9462102146b", async function () {
        if (this.pnp.settings.enableWebTests && !stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            return this.pnp.sp.web.lists.getByTitle(testSharingLib).delete();
        }
        return;
    }));

    describe("Folder", function () {

        let folder: IFolder = null;

        before(pnpTest("c9fd6bc3-d349-4166-8d13-804b55d61066", function () {

            folder = this.pnp.sp.web.getFolderByServerRelativePath("/" + combine(webRelativeUrl, `${testSharingLib}/${testSharingFolder}`));
        }));

        // // these tests cover share link
        it("getShareLink (OrganizationView)", pnpTest("4208e755-e4eb-4af8-aad8-8db06526bec3", function () {

            return expect(folder.getShareLink(SharingLinkKind.OrganizationView))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        }));

        it("getShareLink (AnonymousView)", pnpTest("9ea68a3f-8d22-4ca7-a14f-ee6b956a5799", async function () {
            const sharing = await folder.getShareLink(SharingLinkKind.AnonymousView);
            return expect(sharing).to.have.property("sharingLinkInfo").and.have.deep.property("Url").that.is.not.null;
        }));

        it("getShareLink (ExpirationDate)", pnpTest("985b27c9-8da3-4699-9466-4a4dd2c641c0", async function () {
            const sharing = await folder.getShareLink(SharingLinkKind.AnonymousView, dateAdd(new Date(), "day", 5));
            return expect(sharing).to.have.property("sharingLinkInfo").and.have.deep.property("Url").that.is.not.null;
        }));

        it(".shareWith (Edit)", pnpTest("c2205887-fef4-4b21-a81e-b46999978a0c", function () {

            if (this.pnp.settings.testUser?.length < 1) {
                this.skip();
            }

            return expect(folder.shareWith(this.pnp.settings.testUser, SharingRole.Edit))
                .to.eventually.be.fulfilled
                .and.have.property("ErrorMessage").that.is.null;
        }));

        it.skip(".shareWith (Edit-All)", pnpTest("cdc30d1b-195c-4c73-aae4-7ddff631cff8", function () {

            if (this.pnp.settings.testUser?.length < 1) {
                this.skip();
            }

            return expect(folder.shareWith(this.pnp.settings.testUser, SharingRole.Edit, true))
                .to.eventually.be.fulfilled
                .and.have.property("ErrorMessage").that.is.null;
        }));

        it("checkSharingPermissions", pnpTest("cd6d6939-09e4-431d-b570-99680c0524dc", function () {

            if (this.pnp.settings.testUser?.length < 1) {
                this.skip();
            }

            return expect(folder.checkSharingPermissions([{ alias: this.pnp.settings.testUser }]))
                .to.eventually.be.fulfilled;
        }));

        it("getSharingInformation", pnpTest("8e08f550-fc34-4845-82bf-cb76dce6ba7a", function () {

            return expect(folder.getSharingInformation())
                .to.eventually.be.fulfilled;
        }));

        it("getObjectSharingSettings", pnpTest("c10f49e4-335f-48c0-a5c3-b1361af45a55", function () {

            return expect(folder.getObjectSharingSettings(true))
                .to.eventually.be.fulfilled;
        }));

        it("unshare", pnpTest("7451a5d8-f757-400b-85a4-c932ce390920", function () {

            return expect(folder.unshare())
                .to.eventually.be.fulfilled;
        }));
    });

    // TODO:: is this true: files sharing is not testable
    describe.skip("File", function () {

        let file: IFile = null;

        before(pnpTest("43f80e9f-0a9c-4553-93ee-004a54252d09",function () {

            file = this.pnp.sp.web.getFileByServerRelativePath("/" + combine(webRelativeUrl, `${testSharingLib}/${testSharingFile}`));
        }));

        it("getShareLink (OrganizationView)", pnpTest("d660a138-571d-4c9a-8ca6-3f6ec4d670cb", function () {

            return expect(file.getShareLink(SharingLinkKind.OrganizationView))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        }));

        it("getShareLink (AnonymousView)", pnpTest("15ee7231-df4b-4e00-b211-74198f7bf55d", function () {
            return expect(file.getShareLink(SharingLinkKind.AnonymousView))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        }));

        it("getShareLink (ExpirationDate)", pnpTest("eb32f3e2-acd6-4137-b75f-a267e1519518", function () {
            return expect(file.getShareLink(SharingLinkKind.AnonymousView, dateAdd(new Date(), "day", 5)))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        }));

        it("shareWith (Edit)", pnpTest("44287a62-0d86-47be-8b45-d86eb495d0e9", function () {

            if (this.pnp.settings.testUser?.length < 1) {
                this.skip();
            }

            return expect(file.shareWith(this.pnp.settings.testUser, SharingRole.Edit))
                .to.eventually.be.fulfilled
                .and.have.property("ErrorMessage").that.is.null;
        }));

        it.skip("shareWith (Edit-All)", pnpTest("3efebb31-968f-433c-a55d-72dcb8e46110", function () {

            if (this.pnp.settings.testUser?.length < 1) {
                this.skip();
            }

            return expect(file.shareWith(this.pnp.settings.testUser, SharingRole.Edit, true))
                .to.eventually.be.fulfilled
                .and.have.property("ErrorMessage").that.is.null;
        }));

        it("checkSharingPermissions", pnpTest("c8146f1b-c3da-49a8-8970-c95ab8bf950d", function () {

            if (this.pnp.settings.testUser?.length < 1) {
                this.skip();
            }

            return expect(file.checkSharingPermissions([{ alias: this.pnp.settings.testUser }]))
                .to.eventually.be.fulfilled;
        }));

        it("getSharingInformation", pnpTest("8f8c0883-f7e4-4d6e-a70b-224c5ff698e7", function () {

            return expect(file.getSharingInformation())
                .to.eventually.be.fulfilled;
        }));

        it("getObjectSharingSettings", pnpTest("8a29d6b3-be74-4f29-bdcd-ec470695b61f", function () {

            return expect(file.getObjectSharingSettings(true))
                .to.eventually.be.fulfilled;
        }));

        it("unshare", pnpTest("6433d449-edb2-47bf-9d74-3d3f55c75ed9", function () {

            return expect(file.unshare())
                .to.eventually.be.fulfilled;
        }));
    });

    describe("Item", function () {

        let item: IItem = null;

        before(pnpTest("85a259a9-b8ab-4bc0-b8e9-9bb03db60432",function () {

            item = this.pnp.sp.web.lists.getByTitle(testSharingLib).items.getById(1);
        }));

        it("getShareLink (OrganizationView)", pnpTest("87a752ff-84a1-4460-a221-95aeb5079fd0", function () {

            return expect(item.getShareLink(SharingLinkKind.OrganizationView))
                .to.eventually.be.fulfilled
                .and.have.property("sharingLinkInfo")
                .and.have.deep.property("Url").that.is.not.null;
        }));

        it("getShareLink (AnonymousView)", pnpTest("521ade4d-c8e9-47d6-83bb-11ccb2404ab1", async function () {
            const sharing = await item.getShareLink(SharingLinkKind.AnonymousView);
            return expect(sharing).to.have.property("sharingLinkInfo").and.have.deep.property("Url").that.is.not.null;
        }));

        it("getShareLink (ExpirationDate)", pnpTest("2f9590af-ff72-44d3-8099-da74ee888999", async function () {
            const sharing = await item.getShareLink(SharingLinkKind.AnonymousView, dateAdd(new Date(), "day", 5));
            return expect(sharing).to.have.property("sharingLinkInfo").and.have.deep.property("Url").that.is.not.null;
        }));

        it(".shareWith (Edit)", pnpTest("d503e9ca-cfcb-4a51-9edf-208e9990a8d9", async function () {

            if (this.pnp.settings.testUser?.length < 1) {
                this.skip();
            }

            const itemShare = await item.shareWith(this.pnp.settings.testUser, SharingRole.Edit);
            return expect(itemShare).has.property("ErrorMessage").that.is.null;
        }));

        it.skip(".shareWith (Edit-All)", pnpTest("029ddfe1-2d7c-4501-8e77-be228b92f049", async function () {

            if (this.pnp.settings.testUser?.length < 1) {
                this.skip();
            }

            const itemShare = await item.shareWith(this.pnp.settings.testUser, SharingRole.Edit, true);
            return expect(itemShare).has.property("ErrorMessage").that.is.null;
        }));

        it("checkSharingPermissions", pnpTest("e67f930d-8c1b-481e-83fc-178c75672ad3", function () {

            if (this.pnp.settings.testUser?.length < 1) {
                this.skip();
            }

            return expect(item.checkSharingPermissions([{ alias: this.pnp.settings.testUser }]))
                .to.eventually.be.fulfilled;
        }));

        it("getSharingInformation", pnpTest("5fdcec6d-5b2e-463f-b038-8b952094729e", function () {

            return expect(item.getSharingInformation())
                .to.eventually.be.fulfilled;
        }));

        it("getObjectSharingSettings", pnpTest("044caa9a-0596-4772-bc4c-a1b8b740b43b", function () {

            return expect(item.getObjectSharingSettings(true))
                .to.eventually.be.fulfilled;
        }));

        it("unshare", pnpTest("205f0fae-a5a1-4bf8-812b-e3457179ba9e", function () {

            return expect(item.unshare())
                .to.eventually.be.fulfilled;
        }));
    });

    describe("Web", function () {

        it.skip("shareObject", pnpTest("0ff42c78-e463-46de-8097-44506e0f9295", async function () {

            if (this.pnp.settings.testUser?.length < 1) {
                this.skip();
            }

            const shareObj = combine(webAbsUrl, `${testSharingLib}/${testSharingFile}`);
            const shareWeb = await this.pnp.sp.web.shareObject(shareObj, this.pnp.settings.testUser, SharingRole.View);
            return expect(shareWeb).has.property("ErrorMessage").that.is.null;
        }));
    });
});

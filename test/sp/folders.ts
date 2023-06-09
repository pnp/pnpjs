import { expect } from "chai";
import "@pnp/sp/folders";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/sharing";
import "@pnp/sp/site-users/web";
import "@pnp/sp/files";
import { getRandomString } from "@pnp/core";
import { SharingLinkKind } from "@pnp/sp/sharing";

import testSPInvokables from "../test-invokable-props.js";

describe("Folders", function () {

    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    it("addUsingPath", function () {
        const name = `test_${getRandomString(4)}`;
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(name)).to.eventually.be.fulfilled;
    });

    it("getByUrl", function () {
        return expect(this.pnp.sp.web.folders.getByUrl("SitePages")()).to.eventually.be.fulfilled;
    });
});

describe("Folder", function () {

    let web;
    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        web = this.pnp.sp.web;
    });

    describe("Invokable Properties", testSPInvokables<any, any>(() => web,
        "rootFolder",
        "folders",
        ["lists().rootFolder", () => web.lists.getByTitle("Site Pages").rootFolder],
        ["lists().rootFolder.folders", () => web.lists.getByTitle("Site Pages").rootFolder.folders],
        ["list.items().folder", () => web.lists.getByTitle("Site Pages").items.getById(1).folder],
    ));

    it("getItem", async function () {
        const far = await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(`test${getRandomString(4)}`);
        const x = await far.folder.getItem();
        return expect(x).to.haveOwnProperty("Id");
    });

    it("getItem - call list", async function () {
        const far = await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(`test${getRandomString(4)}`);
        const x = await far.folder.getItem();
        const y = await x.list();
        return expect(y).to.haveOwnProperty("odata.metadata").contains("$metadata#SP.ApiData.Lists");
    });

    it("storageMetrics", async function () {
        const metrics = await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").storageMetrics();
        return expect(metrics).to.haveOwnProperty("TotalSize");
    });

    it("moveByPath", async function () {
        const folderName = `test_${getRandomString(5)}`;
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        const { ServerRelativeUrl: srcUrl } = await this.pnp.sp.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
        const moveToUrl = `${srcUrl}/SiteAssets/moved_${getRandomString(5)}`;
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).moveByPath(moveToUrl)).to.eventually.be.fulfilled;
    });

    it("moveByPath - options", async function () {
        const folderName = `test_${getRandomString(5)}`;
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        const { ServerRelativeUrl: srcUrl } = await this.pnp.sp.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
        const moveToUrl = `${srcUrl}/SiteAssets/moved_${getRandomString(5)}`;
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).moveByPath(moveToUrl, {
            ShouldBypassSharedLocks: true,
            RetainEditorAndModifiedOnMove: true,
            KeepBoth: false,
        })).to.eventually.be.fulfilled;
    });

    it("copyByPath", async function () {
        const folderName = `test_${getRandomString(5)}`;
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        const { ServerRelativeUrl: srcUrl } = await this.pnp.sp.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
        const copyToUrl = `${srcUrl}/SiteAssets/copied_${getRandomString(5)}`;
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).copyByPath(copyToUrl)).to.eventually.be.fulfilled;
    });

    it("copyByPath - options", async function () {
        const folderName = `test_${getRandomString(5)}`;
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        const { ServerRelativeUrl: srcUrl } = await this.pnp.sp.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
        const copyToUrl = `${srcUrl}/SiteAssets/copied_${getRandomString(5)}`;
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).copyByPath(copyToUrl, {
            KeepBoth: true,
            ResetAuthorAndCreatedOnCopy: false,
            ShouldBypassSharedLocks: true,
        })).to.eventually.be.fulfilled;
    });

    it("recycle", async function () {
        const name = `test_${getRandomString(7)}`;
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(name);
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(name).recycle()).to.eventually.be.fulfilled;
    });

    it("deleteWithParams", async function () {
        const name = `test_${getRandomString(7)}`;
        const folders = this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders;
        await folders.addUsingPath(name);

        await folders.getByUrl(name).deleteWithParams({
            BypassSharedLock: true,
            DeleteIfEmpty: true,
        });

        const r = await folders.filter(`Name eq '${name}'`)();
        expect(r.length).to.eq(0);
    });

    it("select('ServerRelativeUrl')", function () {
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").select("ServerRelativeUrl")()).to.eventually.be.fulfilled;
    });

    it("update", function () {
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").update({
            "Name": "SiteAssets",
        })).to.eventually.be.fulfilled;
    });

    it("select('contentTypeOrder')", function () {
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").select("contentTypeOrder")()).to.eventually.be.fulfilled;
    });

    it("folders", function () {
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders()).to.eventually.be.fulfilled;
    });

    it("files", function () {
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").files()).to.eventually.be.fulfilled;
    });

    it("listItemAllFields", async function () {
        const folderName = `folder_${getRandomString(4)}`;
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).listItemAllFields()).to.eventually.be.fulfilled;
    });

    it("parentFolder", async function () {
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").parentFolder()).to.eventually.be.fulfilled;
    });

    it("properties", async function () {
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").properties()).to.eventually.be.fulfilled;
    });

    it("uniqueContentTypeOrder", async function () {
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").select("uniqueContentTypeOrder")()).to.eventually.be.fulfilled;
    });

    it("getSharingInformation", async function () {
        const folderName = `folder_${getRandomString(4)}`;
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).getSharingInformation()).to.eventually.be.fulfilled;
    });

    it("getObjectSharingSettings", async function () {
        const folderName = `folder_${getRandomString(4)}`;
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).getObjectSharingSettings()).to.eventually.be.fulfilled;
    });

    it("unshare", async function () {
        const folderName = `folder_${getRandomString(4)}`;
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).unshare()).to.eventually.be.fulfilled;
    });

    // commented out due to site settings potentially preventing this causing failed test
    // it("should share link", async function () {
    //     await web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test8");
    //     return expect(web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl("test8").getShareLink(SharingLinkKind.OrganizationView)).to.eventually.be.fulfilled;
    // });

    it("checkSharingPermissions", async function () {
        const folderName = `folder_${getRandomString(4)}`;
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).checkSharingPermissions([{
            alias: "everyone except external users",
        }])).to.eventually.be.fulfilled;
    });

    it("deleteSharingLinkByKind", async function () {
        const folderName = `folder_${getRandomString(4)}`;
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName)
            .deleteSharingLinkByKind(SharingLinkKind.OrganizationView)).to.eventually.be.fulfilled;
    });

    it("unshareLink", async function () {
        const folderName = `folder_${getRandomString(4)}`;
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders
            .getByUrl(folderName).unshareLink(SharingLinkKind.OrganizationView)).to.eventually.be.fulfilled;
    });

    it("shareWith", async function () {
        const user = await this.pnp.sp.web.ensureUser("everyone except external users");
        const login = user.data.LoginName;
        const folderName = `folder_${getRandomString(4)}`; const folders = this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders;
        const far = await folders.addUsingPath(folderName);
        return expect(far.folder.shareWith(login)).to.eventually.be.fulfilled;
    });

    it("getFolderById", async function () {
        const folderInfo = await this.pnp.sp.web.rootFolder.select("UniqueId")();
        const folderByIdInfo = await this.pnp.sp.web.getFolderById(folderInfo.UniqueId).select("UniqueId")();
        return expect(folderInfo.UniqueId).to.eq(folderByIdInfo.UniqueId);
    });

    it("addSubFolderUsingPath", async function () {

        const folderName = `test_${getRandomString(5)}`;

        const result1 = await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);

        const folderName2 = `test_${getRandomString(5)}`;

        const folder = await result1.folder.addSubFolderUsingPath(folderName2);

        return expect(folder()).to.eventually.be.fulfilled;
    });
});

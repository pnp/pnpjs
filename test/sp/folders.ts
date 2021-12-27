import { expect } from "chai";
import { getSP } from "../main.js";
import "@pnp/sp/folders";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/sharing";
import "@pnp/sp/site-users/web";
import "@pnp/sp/files";
import { getRandomString } from "@pnp/core";
import { SharingLinkKind } from "@pnp/sp/sharing";
import { SPFI } from "@pnp/sp";
import testSPInvokables from "../test-invokable-props.js";

describe("Folders", function () {

    let _spfi: SPFI = null;

    before(function () {

        if (!this.settings.enableWebTests) {
            this.skip();
        }

        _spfi = getSP();
    });

    it("addUsingPath", function () {
        const name = `test_${getRandomString(4)}`;
        return expect(_spfi.web.folders.addUsingPath(name)).to.eventually.be.fulfilled;
    });

    it("getByUrl", function () {
        return expect(_spfi.web.folders.getByUrl("SitePages")()).to.eventually.be.fulfilled;
    });
});

describe("Folder", function () {

    let _spfi: SPFI = null;

    before(function () {

        if (!this.settings.enableWebTests) {
            this.skip();
        }

        _spfi = getSP();
    });

    describe("Invokable Properties", testSPInvokables<any, any>(() => _spfi.web,
        "rootFolder",
        "folders",
        ["lists().rootFolder", () => _spfi.web.lists.getByTitle("Site Pages").rootFolder],
        ["lists().rootFolder.folders", () => _spfi.web.lists.getByTitle("Site Pages").rootFolder.folders],
        ["list.items().folder", () => _spfi.web.lists.getByTitle("Site Pages").items.getById(1).folder],
    ));

    it("getItem", async function () {
        const far = await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(`test${getRandomString(4)}`);
        const x = await far.folder.getItem();
        return expect(x).to.haveOwnProperty("Id");
    });

    it("moveByPath", async function () {
        const folderName = `test2_${getRandomString(5)}`;
        await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        const { ServerRelativeUrl: srcUrl } = await _spfi.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
        const moveToUrl = `${srcUrl}/SiteAssets/moved_${getRandomString(5)}`;
        return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).moveByPath(moveToUrl)).to.eventually.be.fulfilled;
    });

    it("copyByPath", async function () {
        const folderName = `test2_${getRandomString(5)}`;
        await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        const { ServerRelativeUrl: srcUrl } = await _spfi.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
        const copyToUrl = `${srcUrl}/SiteAssets/copied_${getRandomString(5)}`;
        return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).copyByPath(copyToUrl)).to.eventually.be.fulfilled;
    });

    it("recycle", async function () {
        const name = `test_${getRandomString(7)}`;
        await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(name);
        return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(name).recycle()).to.eventually.be.fulfilled;
    });

    it("deleteWithParams", async function () {
        const name = `test_${getRandomString(7)}`;
        const folders = _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders;
        await folders.addUsingPath(name);

        await folders.getByUrl(name).deleteWithParams({
            BypassSharedLock: true,
            DeleteIfEmpty: true,
        });

        const r = await folders.filter(`Name eq '${name}'`)();
        expect(r.length).to.eq(0);
    });

    it("select('ServerRelativeUrl')", function () {
        return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").select("ServerRelativeUrl")()).to.eventually.be.fulfilled;
    });

    it("update", function () {
        return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").update({
            "Name": "SiteAssets",
        })).to.eventually.be.fulfilled;
    });

    it("select('contentTypeOrder')", function () {
        return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").select("contentTypeOrder")()).to.eventually.be.fulfilled;
    });

    it("folders", function () {
        return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders()).to.eventually.be.fulfilled;
    });

    it("files", function () {
        return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").files()).to.eventually.be.fulfilled;
    });

    it("listItemAllFields", async function () {
        const folderName = `folder_${getRandomString(4)}`;
        await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).listItemAllFields()).to.eventually.be.fulfilled;
    });

    it("parentFolder", async function () {
        return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").parentFolder()).to.eventually.be.fulfilled;
    });

    it("properties", async function () {
        return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").properties()).to.eventually.be.fulfilled;
    });

    it("uniqueContentTypeOrder", async function () {
        return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").select("uniqueContentTypeOrder")()).to.eventually.be.fulfilled;
    });

    it("getSharingInformation", async function () {
        const folderName = `folder_${getRandomString(4)}`;
        await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).getSharingInformation()).to.eventually.be.fulfilled;
    });

    it("getObjectSharingSettings", async function () {
        const folderName = `folder_${getRandomString(4)}`;
        await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).getObjectSharingSettings()).to.eventually.be.fulfilled;
    });

    it("unshare", async function () {
        const folderName = `folder_${getRandomString(4)}`;
        await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).unshare()).to.eventually.be.fulfilled;
    });

    // commented out due to site settings potentially preventing this causing failed test
    // it("should share link", async function () {
    //     await web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test8");
    //     return expect(web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl("test8").getShareLink(SharingLinkKind.OrganizationView)).to.eventually.be.fulfilled;
    // });

    it("checkSharingPermissions", async function () {
        const folderName = `folder_${getRandomString(4)}`;
        await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).checkSharingPermissions([{
            alias: "everyone except external users",
        }])).to.eventually.be.fulfilled;
    });

    it("deleteSharingLinkByKind", async function () {
        const folderName = `folder_${getRandomString(4)}`;
        await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName)
            .deleteSharingLinkByKind(SharingLinkKind.OrganizationView)).to.eventually.be.fulfilled;
    });

    it("unshareLink", async function () {
        const folderName = `folder_${getRandomString(4)}`;
        await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders
            .getByUrl(folderName).unshareLink(SharingLinkKind.OrganizationView)).to.eventually.be.fulfilled;
    });

    it("shareWith", async function () {
        const user = await _spfi.web.ensureUser("everyone except external users");
        const login = user.data.LoginName;
        const folderName = `folder_${getRandomString(4)}`; const folders = _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders;
        const far = await folders.addUsingPath(folderName);
        return expect(far.folder.shareWith(login)).to.eventually.be.fulfilled;
    });

    it("getFolderById", async function () {
        const folderInfo = await _spfi.web.rootFolder.select("UniqueId")();
        const folderByIdInfo = await _spfi.web.getFolderById(folderInfo.UniqueId).select("UniqueId")();
        return expect(folderInfo.UniqueId).to.eq(folderByIdInfo.UniqueId);
    });

    it("addSubFolderUsingPath", async function () {

        const folderName = `test_${getRandomString(5)}`;

        const result1 = await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);

        const folderName2 = `test_${getRandomString(5)}`;

        const folder = await result1.folder.addSubFolderUsingPath(folderName2);

        return expect(folder()).to.eventually.be.fulfilled;
    });
});

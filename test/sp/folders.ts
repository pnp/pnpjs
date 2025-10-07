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
import { pnpTest } from "../pnp-test.js";

describe("Folders", function () {

    before(pnpTest("377385bc-45fa-4f44-b213-8247a1a899f4", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    }));

    it("addUsingPath", pnpTest("7746d596-95ef-4907-bd4c-a36bbf3a3c6a", async function () {
        const { name } = await this.props({
            name: `test_${getRandomString(4)}`,
        });
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(name)).to.eventually.be.fulfilled;
    }));

    it("getByUrl", pnpTest("3158cedc-699a-4f46-8ae7-3c1b5ad7a802", async  function () {
        return expect(this.pnp.sp.web.folders.getByUrl("SitePages")()).to.eventually.be.fulfilled;
    }));
});

describe("Folder", function () {

    let web;
    before(pnpTest("226ae606-1d93-4392-9be0-0fab657f96f1", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        web = this.pnp.sp.web;
    }));

    describe("Invokable Properties", testSPInvokables<any, any>(() => web,
        "rootFolder",
        "folders",
        ["lists().rootFolder", () => web.lists.getByTitle("Site Pages").rootFolder],
        ["lists().rootFolder.folders", () => web.lists.getByTitle("Site Pages").rootFolder.folders],
        ["list.items().folder", () => web.lists.getByTitle("Site Pages").items.getById(1).folder],
    ));

    it("getItem", pnpTest("d9da0e45-c4a7-4b21-88a9-e895480d50de", async function () {
        const { folderName } = await this.props({
            folderName: `test${getRandomString(4)}`,
        });
        const far = await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        const x = await  this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(far.Name).getItem();
        return expect(x).to.haveOwnProperty("Id");
    }));

    it("getItem - call list", pnpTest("076e31fc-9508-43d3-be73-c7d254a9b2ac", async function () {
        const { folderName } = await this.props({
            folderName: `test${getRandomString(4)}`,
        });
        const far = await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        const x = await  this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(far.Name).getItem();
        const y = await x.list();
        return expect(y).to.haveOwnProperty("odata.metadata").contains("$metadata#SP.ApiData.Lists");
    }));

    it("storageMetrics", pnpTest("a7b8c9d0-e1f2-3456-abcd-7890123456ab", async function () {
        const metrics = await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").storageMetrics();
        return expect(metrics).to.haveOwnProperty("TotalSize");
    }));

    it("moveByPath", pnpTest("80145b2a-e99f-4e66-9073-dc80d41fa0ba", async function () {
        const { folderName, rand } = await this.props({
            folderName: `test_${getRandomString(5)}`,
            rand: getRandomString(5),
        });
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        const { ServerRelativeUrl: srcUrl } = await this.pnp.sp.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
        const moveToUrl = `${srcUrl}/SiteAssets/moved_${rand}}`;
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).moveByPath(moveToUrl)).to.eventually.be.fulfilled;
    }));

    it("moveByPath - options", pnpTest("fbf7014e-76dd-4bc7-b3c6-108cbe06e621", async function () {
        const { folderName, rand } = await this.props({
            folderName: `test_${getRandomString(5)}`,
            rand: getRandomString(5),
        });
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        const { ServerRelativeUrl: srcUrl } = await this.pnp.sp.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
        const moveToUrl = `${srcUrl}/SiteAssets/moved_${rand}}`;
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).moveByPath(moveToUrl, {
            ShouldBypassSharedLocks: true,
            RetainEditorAndModifiedOnMove: true,
            KeepBoth: false,
        })).to.eventually.be.fulfilled;
    }));

    it("copyByPath", pnpTest("e09b10b9-dce9-4a86-be7f-e9e8229d748f", async function () {
        const { folderName, rand } = await this.props({
            folderName: `test_${getRandomString(5)}`,
            rand: getRandomString(5),
        });
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        const { ServerRelativeUrl: srcUrl } = await this.pnp.sp.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
        const copyToUrl = `${srcUrl}/SiteAssets/copied_${rand}`;
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).copyByPath(copyToUrl)).to.eventually.be.fulfilled;
    }));

    it("copyByPath - options", pnpTest("e1f2a7b8-c9d0-3456-abcd-1234567890ef", async function () {
        const { folderName, rand } = await this.props({
            folderName: `test_${getRandomString(5)}`,
            rand: getRandomString(5),
        });
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        const { ServerRelativeUrl: srcUrl } = await this.pnp.sp.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
        const copyToUrl = `${srcUrl}/SiteAssets/copied_${rand}`;
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).copyByPath(copyToUrl, {
            KeepBoth: true,
            ResetAuthorAndCreatedOnCopy: false,
            ShouldBypassSharedLocks: true,
        })).to.eventually.be.fulfilled;
    }));

    it("recycle", pnpTest("35d37665-fa24-4e6e-ab08-fb7a96ab0ae4", async function () {
        const { name } = await this.props({
            name: `test_${getRandomString(7)}`,
        });
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(name);
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(name).recycle()).to.eventually.be.fulfilled;
    }));

    it("deleteWithParams", pnpTest("26ada9c3-027b-4a88-8f56-da69e6efe230", async function () {
        const { name } = await this.props({
            name: `test_${getRandomString(7)}`,
        });
        const folders = this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders;
        await folders.addUsingPath(name);

        await folders.getByUrl(name).deleteWithParams({
            BypassSharedLock: true,
            DeleteIfEmpty: true,
        });

        const r = await folders.filter(`Name eq '${name}'`)();
        expect(r.length).to.eq(0);
    }));

    it("select('ServerRelativeUrl')", pnpTest("785e1f75-1d3e-4b52-ae77-10188506ec6f", async function () {
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").select("ServerRelativeUrl")()).to.eventually.be.fulfilled;
    }));

    it("update", pnpTest("e4231df5-41c4-47fb-9dd8-00ce68a3e3fb", async function () {
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").update({
            "Name": "SiteAssets",
        })).to.eventually.be.fulfilled;
    }));

    it("select('contentTypeOrder')", pnpTest("7a5dbd1c-0c5f-48ff-86f7-38fb8683e663", async function () {
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").select("contentTypeOrder")()).to.eventually.be.fulfilled;
    }));

    it("folders", pnpTest("3ad497fd-05c3-4935-819f-153e68205587", async function () {
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders()).to.eventually.be.fulfilled;
    }));

    it("files", pnpTest("4b425025-061b-47d3-96e0-e0f706e43cbd", async function () {
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").files()).to.eventually.be.fulfilled;
    }));

    it("listItemAllFields", pnpTest("4d6c01b9-61e3-4de5-8a44-751ec7b680f8", async function () {
        const { folderName } = await this.props({
            folderName: `folder_${getRandomString(4)}`,
        });
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).listItemAllFields()).to.eventually.be.fulfilled;
    }));

    it("parentFolder", pnpTest("3a3912fa-685f-47c3-badb-8a7ec88e934f", async function () {
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").parentFolder()).to.eventually.be.fulfilled;
    }));

    it("properties", pnpTest("a0247fa8-1434-47e5-9a44-758baa3018bc", async function () {
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").properties()).to.eventually.be.fulfilled;
    }));

    it("uniqueContentTypeOrder", pnpTest("0e8f2089-b26c-4426-845f-6fb5e1939347", async function () {
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").select("uniqueContentTypeOrder")()).to.eventually.be.fulfilled;
    }));

    it("getSharingInformation", pnpTest("c6197299-a733-408b-9439-ef5982cf5c11", async function () {
        const { folderName } = await this.props({
            folderName: `folder_${getRandomString(4)}`,
        });
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).getSharingInformation()).to.eventually.be.fulfilled;
    }));

    it("getObjectSharingSettings", pnpTest("4bb734ea-5a3f-4a60-aab3-b7097c4f0eb0", async function () {
        const { folderName } = await this.props({
            folderName: `folder_${getRandomString(4)}`,
        });
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).getObjectSharingSettings()).to.eventually.be.fulfilled;
    }));

    it("unshare", pnpTest("b5b7884d-1a83-4fe9-8f09-723423e31850", async function () {
        const { folderName } = await this.props({
            folderName: `folder_${getRandomString(4)}`,
        });
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).unshare()).to.eventually.be.fulfilled;
    }));

    // commented out due to site settings potentially preventing this causing failed test
    // it("should share link", async function () {
    //     await web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test8");
    //     return expect(web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl("test8").getShareLink(SharingLinkKind.OrganizationView)).to.eventually.be.fulfilled;
    // });

    it("checkSharingPermissions", pnpTest("d76c6b5b-8f36-4979-ba16-3af8bb33469b", async function () {
        const { folderName } = await this.props({
            folderName: `folder_${getRandomString(4)}`,
        });
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).checkSharingPermissions([{
            alias: "everyone except external users",
        }])).to.eventually.be.fulfilled;
    }));

    it("deleteSharingLinkByKind", pnpTest("86704262-9a1d-41ea-8a9d-3ceede834c8a", async function () {
        const { folderName } = await this.props({
            folderName: `folder_${getRandomString(4)}`,
        });
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName)
            .deleteSharingLinkByKind(SharingLinkKind.OrganizationView)).to.eventually.be.fulfilled;
    }));

    it("unshareLink", pnpTest("3dac3668-a548-4983-89a6-7799a4f4624e", async function () {
        const { folderName } = await this.props({
            folderName: `folder_${getRandomString(4)}`,
        });
        await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
        return expect(this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders
            .getByUrl(folderName).unshareLink(SharingLinkKind.OrganizationView)).to.eventually.be.fulfilled;
    }));

    it("shareWith", pnpTest("8038570c-f0e5-4fb8-9029-4dcaa0717022", async function () {
        const { folderName } = await this.props({
            folderName: `folder_${getRandomString(4)}`,
        });
        const user = await this.pnp.sp.web.ensureUser("everyone except external users");
        const login = user.LoginName;
        const folders = this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders;
        const far = await folders.addUsingPath(folderName);
        return expect(folders.getByUrl(far.Name).shareWith(login)).to.eventually.be.fulfilled;
    }));

    it("getFolderById", pnpTest("fc5e520a-10c6-4eea-ab2c-075773967e7f", async function () {
        const folderInfo = await this.pnp.sp.web.rootFolder.select("UniqueId")();
        const folderByIdInfo = await this.pnp.sp.web.getFolderById(folderInfo.UniqueId).select("UniqueId")();
        return expect(folderInfo.UniqueId).to.eq(folderByIdInfo.UniqueId);
    }));

    it("addSubFolderUsingPath", pnpTest("9a1d68f0-db0f-4316-b49a-5ec20cd7e7ab", async function () {
        const { folderName, folderName2 } = await this.props({
            folderName: `folder_${getRandomString(4)}`,
            folderName2: `test_${getRandomString(5)}`,
        });

        const result1 = await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);

        const folder = await this.pnp.sp.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(result1.Name).addSubFolderUsingPath(folderName2);

        return expect(folder()).to.eventually.be.fulfilled;
    }));
});

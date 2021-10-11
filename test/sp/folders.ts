import { expect } from "chai";
import { getSP, testSettings } from "../main.js";
import "@pnp/sp/folders";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/sharing";
import "@pnp/sp/site-users/web";
import "@pnp/sp/files";
import { getRandomString } from "@pnp/core";
import { SharingLinkKind } from "@pnp/sp/sharing";
import { SPFI } from "@pnp/sp";

describe.skip("Folders", function () {

    if (testSettings.enableWebTests) {
        let _spfi: SPFI = null;

        before(function () {
            _spfi = getSP();
        });

        it("adds new folder", function () {
            const name = `test_${getRandomString(4)}`;
            return expect(_spfi.web.folders.addUsingPath(name)).to.eventually.be.fulfilled;
        });

        it("gets folder by url", function () {
            return expect(_spfi.web.folders.getByUrl("SitePages")()).to.eventually.be.fulfilled;
        });
    }

});

describe.skip("Folder", function () {

    if (testSettings.enableWebTests) {
        let _spfi: SPFI = null;

        before(function () {
            _spfi = getSP();
        });

        // describe("Invokable Properties", function () {

        //     const tests: IInvokableTest[] = [
        //         { desc: ".rootFolder:web", test: _spfi.web.rootFolder },
        //         { desc: ".folders:web", test: _spfi.web.folders },
        //         { desc: ".rootFolder:list", test: _spfi.web.lists.getByTitle("Site Pages").rootFolder },
        //         { desc: ".folders:list", test: _spfi.web.lists.getByTitle("Site Pages").rootFolder.folders },
        //         { desc: ".folder:item", test: _spfi.web.lists.getByTitle("Site Pages").items.getById(1).folder },
        //     ];

        //     tests.forEach((testObj) => {
        //         const { test, desc } = testObj;
        //         it(desc, function () expect((<any>test)()).to.eventually.be.fulfilled);
        //     });
        // });

        it("gets folder item", async function () {
            const far = await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test");
            return expect(far.folder.getItem()).to.eventually.be.fulfilled;
        });

        it("moves folder to a new destination", async function () {
            const folderName = `test2_${getRandomString(5)}`;
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
            const { ServerRelativeUrl: srcUrl } = await _spfi.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
            const moveToUrl = `${srcUrl}/SiteAssets/moved_${getRandomString(5)}`;
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).moveByPath(moveToUrl)).to.eventually.be.fulfilled;
        });

        it("copies folder to a new destination", async function () {
            const folderName = `test2_${getRandomString(5)}`;
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
            const { ServerRelativeUrl: srcUrl } = await _spfi.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
            const copyToUrl = `${srcUrl}/SiteAssets/copied_${getRandomString(5)}`;
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).copyByPath(copyToUrl)).to.eventually.be.fulfilled;
        });

        it("moves folder to a new destination by path", async function () {
            const folderName = `test2_${getRandomString(5)}`;
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
            const { ServerRelativeUrl: srcUrl } = await _spfi.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
            const moveToUrl = `${srcUrl}/SiteAssets/moved_${getRandomString(5)}`;
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).moveByPath(moveToUrl, true)).to.eventually.be.fulfilled;
        });

        it("copies folder to a new destination by path", async function () {
            const folderName = `test2_${getRandomString(5)}`;
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
            const { ServerRelativeUrl: srcUrl } = await _spfi.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
            const copyToUrl = `${srcUrl}/SiteAssets/copied_${getRandomString(5)}`;
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).copyByPath(copyToUrl, true)).to.eventually.be.fulfilled;
        });

        it("recycles folder", async function () {
            const name = `test_${getRandomString(7)}`;
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(name);
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(name).recycle()).to.eventually.be.fulfilled;
        });

        it("delete folder with params", async function () {
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

        it("should get server relative url", function () {
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").select("ServerRelativeUrl")()).to.eventually.be.fulfilled;
        });

        it("should update folder's properties", function () {
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").update({
                "Name": "SiteAssets",
            })).to.eventually.be.fulfilled;
        });

        it("should get content type order", function () {
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").select("contentTypeOrder")()).to.eventually.be.fulfilled;
        });

        it("should get folders", function () {
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders()).to.eventually.be.fulfilled;
        });

        it("should get files", function () {
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").files()).to.eventually.be.fulfilled;
        });

        it("should get listItemAllFields", async function () {
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test4");
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl("test4").listItemAllFields()).to.eventually.be.fulfilled;
        });

        it("should get parentFolder", async function () {
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").parentFolder()).to.eventually.be.fulfilled;
        });

        it("should get properties", async function () {
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").properties()).to.eventually.be.fulfilled;
        });

        it("should get uniqueContentTypeOrder", async function () {
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").select("uniqueContentTypeOrder")()).to.eventually.be.fulfilled;
        });

        it("should get sharing information", async function () {
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test5");
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl("test5").getSharingInformation()).to.eventually.be.fulfilled;
        });

        it("should get object sharing settings", async function () {
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test6");
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl("test6").getObjectSharingSettings()).to.eventually.be.fulfilled;
        });

        it("should unshare folder", async function () {
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test7");
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl("test7").unshare()).to.eventually.be.fulfilled;
        });

        // commented out due to site settings potentially preventing this causing failed test
        // it("should share link", async function () {
        //     await web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test8");
        //     return expect(web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl("test8").getShareLink(SharingLinkKind.OrganizationView)).to.eventually.be.fulfilled;
        // });

        it("should check sharing permissions", async function () {
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test9");
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl("test9").checkSharingPermissions([{
                alias: "everyone except external users",
            }])).to.eventually.be.fulfilled;
        });

        it("should delete sharing link", async function () {
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test10");
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl("test10")
                .deleteSharingLinkByKind(SharingLinkKind.OrganizationView)).to.eventually.be.fulfilled;
        });

        it("should unshare link", async function () {
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test11");
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders
                .getByUrl("test11").unshareLink(SharingLinkKind.OrganizationView)).to.eventually.be.fulfilled;
        });

        it("should share with login name", async function () {
            const user = await _spfi.web.ensureUser("everyone except external users");
            const login = user.data.LoginName;
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test12");
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl("test12").shareWith(login)).to.eventually.be.fulfilled;
        });

        it("getFolderById", async function () {
            const folderInfo = await _spfi.web.rootFolder.select("UniqueId")();
            const folderByIdInfo = await _spfi.web.getFolderById(folderInfo.UniqueId).select("UniqueId")();
            return expect(folderInfo.UniqueId).to.eq(folderByIdInfo.UniqueId);
        });

        it("add folder by path", async function () {

            const folderName = `test_${getRandomString(5)}`;

            const result1 = await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);

            const folderName2 = `test_${getRandomString(5)}`;

            const folder = await result1.folder.addSubFolderUsingPath(folderName2);

            return expect(folder()).to.eventually.be.fulfilled;
        });
    }
});

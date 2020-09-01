import { expect } from "chai";
import { testSettings } from "../main";
import "@pnp/sp/folders";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/sharing";
import "@pnp/sp/site-users/web";
import "@pnp/sp/files";
import { IInvokableTest } from "../types";
import { Web, IWeb } from "@pnp/sp/webs";
import { getRandomString } from "@pnp/common";
import { SharingLinkKind } from "@pnp/sp/sharing";
import { sp } from "@pnp/sp";

describe("Folders", () => {

    if (testSettings.enableWebTests) {

        let web: IWeb = null;
        before(function () {
            web = Web(testSettings.sp.webUrl);
        });

        it("adds new folder", function () {
            const name = `test_${getRandomString(4)}`;
            return expect(web.folders.add(name)).to.eventually.be.fulfilled;
        });

        it("gets folder by name", function () {
            return expect(web.folders.getByName("SitePages")()).to.eventually.be.fulfilled;
        });
    }

});

describe("Folder", () => {

    if (testSettings.enableWebTests) {

        let web: IWeb = null;
        before(function () {
            web = Web(testSettings.sp.webUrl);
        });

        describe("Invokable Properties", () => {

            const tests: IInvokableTest[] = [
                { desc: ".rootFolder:web", test: sp.web.rootFolder },
                { desc: ".folders:web", test: sp.web.folders },
                { desc: ".rootFolder:list", test: sp.web.lists.getByTitle("Site Pages").rootFolder },
                { desc: ".folders:list", test: sp.web.lists.getByTitle("Site Pages").rootFolder.folders },
                { desc: ".folder:item", test: sp.web.lists.getByTitle("Site Pages").items.getById(1).folder },
            ];

            tests.forEach((testObj) => {
                const { test, desc } = testObj;
                it(desc, () => expect((<any>test)()).to.eventually.be.fulfilled);
            });
        });

        it("gets folder item", async function () {
            const far = await web.rootFolder.folders.getByName("SiteAssets").folders.add("test");
            return expect(far.folder.getItem()).to.eventually.be.fulfilled;
        });

        it("moves folder to a new destination", async function () {
            const folderName = `test2_${getRandomString(5)}`;
            await web.rootFolder.folders.getByName("SiteAssets").folders.add(folderName);
            const { ServerRelativeUrl: srcUrl } = await web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
            const moveToUrl = `${srcUrl}/SiteAssets/moved_${getRandomString(5)}`;
            return expect(web.rootFolder.folders.getByName("SiteAssets").folders.getByName(folderName).moveTo(moveToUrl)).to.eventually.be.fulfilled;
        });

        it("copies folder to a new destination", async function () {
            const folderName = `test2_${getRandomString(5)}`;
            await web.rootFolder.folders.getByName("SiteAssets").folders.add(folderName);
            const { ServerRelativeUrl: srcUrl } = await web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
            const copyToUrl = `${srcUrl}/SiteAssets/copied_${getRandomString(5)}`;
            return expect(web.rootFolder.folders.getByName("SiteAssets").folders.getByName(folderName).copyTo(copyToUrl)).to.eventually.be.fulfilled;
        });

        it("moves folder to a new destination by path", async function () {
            const folderName = `test2_${getRandomString(5)}`;
            await web.rootFolder.folders.getByName("SiteAssets").folders.add(folderName);
            const { ServerRelativeUrl: srcUrl } = await web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
            const moveToUrl = `${srcUrl}/SiteAssets/moved_${getRandomString(5)}`;
            return expect(web.rootFolder.folders.getByName("SiteAssets").folders.getByName(folderName).moveByPath(moveToUrl, true)).to.eventually.be.fulfilled;
        });

        it("copies folder to a new destination by path", async function () {
            const folderName = `test2_${getRandomString(5)}`;
            await web.rootFolder.folders.getByName("SiteAssets").folders.add(folderName);
            const { ServerRelativeUrl: srcUrl } = await web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
            const copyToUrl = `${srcUrl}/SiteAssets/copied_${getRandomString(5)}`;
            return expect(web.rootFolder.folders.getByName("SiteAssets").folders.getByName(folderName).copyByPath(copyToUrl, true)).to.eventually.be.fulfilled;
        });

        it("recycles folder", async function () {
            const name = `test_${getRandomString(7)}`;
            await web.rootFolder.folders.getByName("SiteAssets").folders.add(name);
            return expect(web.rootFolder.folders.getByName("SiteAssets").folders.getByName(name).recycle()).to.eventually.be.fulfilled;
        });

        it("delete folder with params", async function () {
            const name = `test_${getRandomString(7)}`;
            const folders = web.rootFolder.folders.getByName("SiteAssets").folders;
            await folders.add(name);

            await folders.getByName(name).deleteWithParams({
                BypassSharedLock: true,
                DeleteIfEmpty: true,
            });

            const r = await folders.filter(`Name eq '${name}'`)();
            expect(r.length).to.eq(0);
        });

        it("should get server relative url", function () {
            return expect(web.rootFolder.folders.getByName("SiteAssets").serverRelativeUrl()).to.eventually.be.fulfilled;
        });

        it("should update folder's properties", function () {
            return expect(web.rootFolder.folders.getByName("SiteAssets").update({
                "Name": "SiteAssets",
            })).to.eventually.be.fulfilled;
        });

        it("should get content type order", function () {
            return expect(web.rootFolder.folders.getByName("SiteAssets").contentTypeOrder()).to.eventually.be.fulfilled;
        });

        it("should get folders", function () {
            return expect(web.rootFolder.folders.getByName("SiteAssets").folders()).to.eventually.be.fulfilled;
        });

        it("should get files", function () {
            return expect(web.rootFolder.folders.getByName("SiteAssets").files()).to.eventually.be.fulfilled;
        });

        it("should get listItemAllFields", async function () {
            await web.rootFolder.folders.getByName("SiteAssets").folders.add("test4");
            return expect(web.rootFolder.folders.getByName("SiteAssets").folders.getByName("test4").listItemAllFields()).to.eventually.be.fulfilled;
        });

        it("should get parentFolder", async function () {
            return expect(web.rootFolder.folders.getByName("SiteAssets").parentFolder()).to.eventually.be.fulfilled;
        });

        it("should get properties", async function () {
            return expect(web.rootFolder.folders.getByName("SiteAssets").properties.get()).to.eventually.be.fulfilled;
        });

        it("should get uniqueContentTypeOrder", async function () {
            return expect(web.rootFolder.folders.getByName("SiteAssets").uniqueContentTypeOrder()).to.eventually.be.fulfilled;
        });

        it("should get sharing information", async function () {
            await web.rootFolder.folders.getByName("SiteAssets").folders.add("test5");
            return expect(web.rootFolder.folders.getByName("SiteAssets").folders.getByName("test5").getSharingInformation()).to.eventually.be.fulfilled;
        });

        it("should get object sharing settings", async function () {
            await web.rootFolder.folders.getByName("SiteAssets").folders.add("test6");
            return expect(web.rootFolder.folders.getByName("SiteAssets").folders.getByName("test6").getObjectSharingSettings()).to.eventually.be.fulfilled;
        });

        it("should unshare folder", async function () {
            await web.rootFolder.folders.getByName("SiteAssets").folders.add("test7");
            return expect(web.rootFolder.folders.getByName("SiteAssets").folders.getByName("test7").unshare()).to.eventually.be.fulfilled;
        });

        // commented out due to site settings potentially preventing this causing failed test
        // it("should share link", async function () {
        //     await web.rootFolder.folders.getByName("SiteAssets").folders.add("test8");
        //     return expect(web.rootFolder.folders.getByName("SiteAssets").folders.getByName("test8").getShareLink(SharingLinkKind.OrganizationView)).to.eventually.be.fulfilled;
        // });

        it("should check sharing permissions", async function () {
            await web.rootFolder.folders.getByName("SiteAssets").folders.add("test9");
            return expect(web.rootFolder.folders.getByName("SiteAssets").folders.getByName("test9").checkSharingPermissions([{
                alias: "everyone except external users",
            }])).to.eventually.be.fulfilled;
        });

        it("should delete sharing link", async function () {
            await web.rootFolder.folders.getByName("SiteAssets").folders.add("test10");
            return expect(web.rootFolder.folders.getByName("SiteAssets").folders.getByName("test10")
                .deleteSharingLinkByKind(SharingLinkKind.OrganizationView)).to.eventually.be.fulfilled;
        });

        it("should unshare link", async function () {
            await web.rootFolder.folders.getByName("SiteAssets").folders.add("test11");
            return expect(web.rootFolder.folders.getByName("SiteAssets").folders.getByName("test11").unshareLink(SharingLinkKind.OrganizationView)).to.eventually.be.fulfilled;
        });

        it("should share with login name", async function () {
            const user = await web.ensureUser("everyone except external users");
            const login = user.data.LoginName;
            await web.rootFolder.folders.getByName("SiteAssets").folders.add("test12");
            return expect(web.rootFolder.folders.getByName("SiteAssets").folders.getByName("test12").shareWith(login)).to.eventually.be.fulfilled;
        });

        it("getFolderById", async function () {
            const folderInfo = await web.rootFolder.select("UniqueId")();
            const folderByIdInfo = await web.getFolderById(folderInfo.UniqueId).select("UniqueId")();
            return expect(folderInfo.UniqueId).to.eq(folderByIdInfo.UniqueId);
        });

        it("add folder by path", async function () {

            const folderName = `test_${getRandomString(5)}`;

            const result1 = await web.rootFolder.folders.getByName("SiteAssets").folders.add(folderName);

            const folderName2 = `test_${getRandomString(5)}`;

            const folder = await result1.folder.addSubFolderUsingPath(folderName2);

            return expect(folder()).to.eventually.be.fulfilled;
        });
    }
});

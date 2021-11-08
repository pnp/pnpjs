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

describe("Folders", function () {

    if (testSettings.enableWebTests) {
        let _spfi: SPFI = null;

        before(function () {
            _spfi = getSP();
        });

        it(".addUsingPath", function () {
            const name = `test_${getRandomString(4)}`;
            return expect(_spfi.web.folders.addUsingPath(name)).to.eventually.be.fulfilled;
        });

        it(".getByUrl", function () {
            return expect(_spfi.web.folders.getByUrl("SitePages")()).to.eventually.be.fulfilled;
        });
    }

});

describe("Folder", function () {

    if (testSettings.enableWebTests) {
        let _spfi: SPFI = null;

        before(function () {
            _spfi = getSP();
        });

        describe("Invokable Properties", function () {
            const tests: any = {};
            tests[".rootFolder:web"] = null;
            tests[".folders:web"] = null;
            tests[".rootFolder:list"] = null;
            tests[".folders:list"] = null;
            tests[".folder:item"] = null;

            before(function () {
                Object.getOwnPropertyNames(tests).forEach((key) => {
                    switch (key) {
                        case ".rootFolder:web":
                            tests[key] = _spfi.web.rootFolder;
                            break;
                        case ".folders:web":
                            tests[key] = _spfi.web.folders;
                            break;
                        case ".rootFolder:list":
                            tests[key] = _spfi.web.lists.getByTitle("Site Pages").rootFolder;
                            break;
                        case ".folders:list":
                            tests[key] = _spfi.web.lists.getByTitle("Site Pages").rootFolder.folders;
                            break;
                        case ".folder:item":
                            tests[key] = _spfi.web.lists.getByTitle("Site Pages").items.getById(1).folder;
                            break;
                    }
                });
            });

            Object.getOwnPropertyNames(tests).forEach((key) => {
                it(key, function () {
                    const test = tests[key];
                    return expect((<any>test)()).to.eventually.be.fulfilled;
                });
            });
        });

        it(".getItem", async function () {
            const far = await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(`test${getRandomString(4)}`);
            const x = await far.folder.getItem();
            return expect(x).to.haveOwnProperty("Id");
        });

        it(".moveByPath", async function () {
            const folderName = `test2_${getRandomString(5)}`;
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
            const { ServerRelativeUrl: srcUrl } = await _spfi.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
            const moveToUrl = `${srcUrl}/SiteAssets/moved_${getRandomString(5)}`;
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).moveByPath(moveToUrl)).to.eventually.be.fulfilled;
        });

        it(".copyByPath", async function () {
            const folderName = `test2_${getRandomString(5)}`;
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);
            const { ServerRelativeUrl: srcUrl } = await _spfi.web.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();
            const copyToUrl = `${srcUrl}/SiteAssets/copied_${getRandomString(5)}`;
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(folderName).copyByPath(copyToUrl)).to.eventually.be.fulfilled;
        });

        it(".recycle", async function () {
            const name = `test_${getRandomString(7)}`;
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(name);
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl(name).recycle()).to.eventually.be.fulfilled;
        });

        it(".deleteWithParams", async function () {
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

        it(".select('ServerRelativeUrl')", function () {
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").select("ServerRelativeUrl")()).to.eventually.be.fulfilled;
        });

        it(".update", function () {
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").update({
                "Name": "SiteAssets",
            })).to.eventually.be.fulfilled;
        });

        it(".select('contentTypeOrder')", function () {
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").select("contentTypeOrder")()).to.eventually.be.fulfilled;
        });

        it(".folders", function () {
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders()).to.eventually.be.fulfilled;
        });

        it(".files", function () {
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").files()).to.eventually.be.fulfilled;
        });

        it(".listItemAllFields", async function () {
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test4");
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl("test4").listItemAllFields()).to.eventually.be.fulfilled;
        });

        it(".parentFolder", async function () {
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").parentFolder()).to.eventually.be.fulfilled;
        });

        it(".properties", async function () {
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").properties()).to.eventually.be.fulfilled;
        });

        it(".uniqueContentTypeOrder", async function () {
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").select("uniqueContentTypeOrder")()).to.eventually.be.fulfilled;
        });

        it(".getSharingInformation", async function () {
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test5");
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl("test5").getSharingInformation()).to.eventually.be.fulfilled;
        });

        it(".getObjectSharingSettings", async function () {
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test6");
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl("test6").getObjectSharingSettings()).to.eventually.be.fulfilled;
        });

        it(".unshare", async function () {
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test7");
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl("test7").unshare()).to.eventually.be.fulfilled;
        });

        // commented out due to site settings potentially preventing this causing failed test
        // it("should share link", async function () {
        //     await web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test8");
        //     return expect(web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl("test8").getShareLink(SharingLinkKind.OrganizationView)).to.eventually.be.fulfilled;
        // });

        it(".checkSharingPermissions", async function () {
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test9");
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl("test9").checkSharingPermissions([{
                alias: "everyone except external users",
            }])).to.eventually.be.fulfilled;
        });

        it(".deleteSharingLinkByKind", async function () {
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test10");
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl("test10")
                .deleteSharingLinkByKind(SharingLinkKind.OrganizationView)).to.eventually.be.fulfilled;
        });

        it(".unshareLink", async function () {
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test11");
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders
                .getByUrl("test11").unshareLink(SharingLinkKind.OrganizationView)).to.eventually.be.fulfilled;
        });

        // TODO: Will be fixed when sharing is fixed.
        it(".shareWith", async function () {
            const user = await _spfi.web.ensureUser("everyone except external users");
            const login = user.data.LoginName;
            await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath("test12");
            return expect(_spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.getByUrl("test12").shareWith(login)).to.eventually.be.fulfilled;
        });

        it(".getFolderById", async function () {
            const folderInfo = await _spfi.web.rootFolder.select("UniqueId")();
            const folderByIdInfo = await _spfi.web.getFolderById(folderInfo.UniqueId).select("UniqueId")();
            return expect(folderInfo.UniqueId).to.eq(folderByIdInfo.UniqueId);
        });

        it(".addSubFolderUsingPath", async function () {

            const folderName = `test_${getRandomString(5)}`;

            const result1 = await _spfi.web.rootFolder.folders.getByUrl("SiteAssets").folders.addUsingPath(folderName);

            const folderName2 = `test_${getRandomString(5)}`;

            const folder = await result1.folder.addSubFolderUsingPath(folderName2);

            return expect(folder()).to.eventually.be.fulfilled;
        });
    }
});

import { expect } from "chai";
import * as path from "path";
import * as fs from "fs";
import findupSync from "findup-sync";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { IAnalyticsOptions, IItemOptions } from "@pnp/graph/onedrive/types";

// give ourselves a single reference to the projectRoot
const projectRoot = path.resolve(path.dirname(findupSync("package.json")));

describe("OneDrive", function () {
    let testUserName = "";
    let driveId = null;
    const fileOptions = {
        content: "This is some test content",
        filePathName: "pnpTest.txt",
        contentType: "text/plain;charset=utf-8",
    };
    const testConvert = path.join(projectRoot, "test/graph/assets", "testconvert.docx");

    // Ensure we have the data to test against
    before(async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        // Get a sample user
        try {
            testUserName = this.pnp.settings.testUser.substring(this.pnp.settings.testUser.lastIndexOf("|") + 1);
            const drives = await this.pnp.graph.users.getById(testUserName).drives();
            if (drives.length > 0) {
                driveId = drives[0].id;
            }
        } catch (err) {
            console.log("Could not retrieve user's drives");
        }
    });

    it("Get Default Drive", async function () {
        const drives = await this.pnp.graph.users.getById(testUserName).drives();
        return expect(drives.length).is.greaterThan(0);
    });

    it("Get Drive by ID", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const drive = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId)();
        return expect(drive).is.not.null;
    });

    it("Get Drive List", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const list = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).list();
        return expect(list).is.not.null;
    });


    it("Get Recent Drive Items", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const recent = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).recent();
        return expect(recent).is.not.null;
    });

    it("Get Drive Root Folder", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const root = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root();
        return expect(root.id).length.greaterThan(0);
    });

    it("Get Drive Root Folder Children", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.children();
        return expect(children).is.not.null;
    });

    it("Add Drive Root Folder Item (Upload)", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const testFileName = `TestFile_${getRandomString(4)}.json`;
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        if (children != null) {
            // Clean up test file
            await children.driveItem.delete();
        }
        return expect(children.data.id).length.greaterThan(0);
    });

    it("Add Drive Root Folder Item (Add)", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const testFileName = `TestFile_${getRandomString(4)}.json`;
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.children.add(testFileName, fileOptions.content, fileOptions.contentType);
        if (children != null) {
            // Clean up test file
            await children.driveItem.delete();
        }
        return expect(children.data.id).length.greaterThan(0);
    });

    it("Add New Drive Folder", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const testFolderName = `TestFolder_${getRandomString(4)}`;
        const folder = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.children.addFolder(testFolderName);
        if (folder != null) {
            // Clean up test file
            await folder.driveItem.delete();
        }
        return expect(folder.data.id).length.greaterThan(0);
    });

    it("Search Drive Item", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const searchString = `TestFile_${getRandomString(4)}`;
        const testFileName = `${searchString}.txt`;
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        let searchResults;
        if (children != null) {
            searchResults = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.search(searchString)();
            // Clean up test file
            await children.driveItem.delete();
        }
        return expect(searchResults).to.not.be.null;
    });

    it("Get Drive Item By ID", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const testFileName = `${getRandomString(4)}.txt`;
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        let driveItemId;
        if (children != null) {
            driveItemId = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.data.id)();
            // Clean up test file
            await children.driveItem.delete();
        }
        return expect(driveItemId.id).to.be.eq(children.data.id);
    });

    it("Get Drive Item By Path", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const testFileName = `${getRandomString(4)}.txt`;
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        let driveItemId;
        if (children != null) {
            driveItemId = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemByPath(testFileName)();
            // Clean up test file
            await children.driveItem.delete();
        }
        return expect(driveItemId.id).to.be.eq(children.data.id);
    });

    it("Get Drive Items By Path", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        let driveItems;
        const testFolderName = `TestFolder_${getRandomString(4)}`;
        const folder = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.children.addFolder(testFolderName);
        if (folder != null) {
            const testFileName = `${getRandomString(4)}.txt`;
            const children = await folder.driveItem.upload({ filePathName: testFileName, content: "My File Content String" });
            if (children != null) {
                driveItems = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemsByPath(testFolderName)();
                // Clean up test file
                await children.driveItem.delete();
            }
            // Clean up test folder
            await folder.driveItem.delete();
        }
        return expect(driveItems.length).to.be.gt(0);
    });

    it("Get Drive Delta", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const delta = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.delta()();

        return expect(delta).haveOwnProperty("values");
    });

    it("Get Drive Thumbnails", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const thumbnails = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.thumbnails();
        return expect(thumbnails).is.not.null;
    });

    it("Delete Drive Item", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const testFileName = `${getRandomString(4)}.txt`;
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        let driveItemId = null;
        if (children != null) {
            // Clean up test file
            await children.driveItem.delete();
            try {
                driveItemId = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.data.id)();
            } catch (err) {
                // Do nothing as this is the expected outcome
            }
        }
        return expect(driveItemId).to.be.null;
    });

    it("Update Drive Item", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const testFileName = `${getRandomString(4)}.txt`;
        const testFileName2 = `${getRandomString(4)}.txt`;
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        let driveItemUpdate;
        if (children != null) {
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.data.id).update({ name: testFileName2 });
            driveItemUpdate = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.data.id)();
            // Clean up test file
            await children.driveItem.delete();
        }
        return expect(driveItemUpdate.name).to.eq(testFileName2);
    });

    it("Copy Drive Item", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const testFileName = `${getRandomString(4)}.txt`;
        const testFileName2 = `${getRandomString(4)}.txt`;
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        let fileCopy: string = null;
        if (children != null) {
            const r = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root();
            const copyOptions: IItemOptions = {
                parentReference: { driveId: r.parentReference.driveId, id: r.id },
                name: testFileName2,
            };
            fileCopy = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.data.id).copyItem(copyOptions);
            // Clean up test file
            await children.driveItem.delete();
            if (fileCopy.length > 0) {
                await await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemByPath(testFileName2).delete();
            }
        }
        return expect(fileCopy).length.to.be.gt(0);
    });

    it("Move Drive Item", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const testFileName = `${getRandomString(4)}.txt`;
        const testFileName2 = `${getRandomString(4)}.txt`;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.children.add(testFileName, "My File Content String");
        let driveItemUpdate;
        if (children != null) {
            const testFolderName = `TestFolder_${getRandomString(4)}`;
            const folder = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.children.addFolder(testFolderName);
            if (folder != null) {
                const moveOptions: IItemOptions = {
                    parentReference: { driveId: folder.data.parentReference.driveId, id: folder.data.id },
                    name: testFileName2,
                };
                driveItemUpdate = await children.driveItem.moveItem(moveOptions);
                // Clean up test file
                await children.driveItem.delete();
                // Clean up test folder
                await folder.driveItem.delete();
            } else {
                // Clean up test file
                await children.driveItem.delete();
            }
        }
        return expect(driveItemUpdate.name).to.eq(testFileName2);
    });

    it("Convert Drive Item", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const testFileName = `TestFile_${getRandomString(4)}.docx`;
        const testConvertFile: Uint8Array = new Uint8Array(fs.readFileSync(testConvert));
        const fo = {
            content: testConvertFile,
            filePathName: testFileName,
            contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        };
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        let convertDriveItem = null;
        if (children != null) {
            convertDriveItem = await children.driveItem.convertContent("pdf");
            // Clean up test file
            await children.driveItem.delete();
        }
        return expect(convertDriveItem).is.not.null;
    });

    it("Get Drive Item Preview", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const testFileName = `TestFile_${getRandomString(4)}.txt`;
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        let previewDriveItem = null;
        if (children != null) {
            previewDriveItem = await children.driveItem.preview();
            // Clean up test file
            await children.driveItem.delete();
        }
        return expect(previewDriveItem).to.haveOwnProperty("getUrl");
    });

    it("Get Drive Item Analytics - Last Seven Days", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const testFileName = `TestFile_${getRandomString(4)}.txt`;
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        const analytics = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.data.id).analytics()();
        return expect(analytics).to.haveOwnProperty("@odata.context");
    });
});

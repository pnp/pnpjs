import { expect } from "chai";
import * as path from "path";
import * as fs from "fs";
import findupSync from "findup-sync";
import "@pnp/graph/users";
import "@pnp/graph/files";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { IDriveItemAdd, IDriveItemAddFolder, IFileUploadOptions, IItemOptions } from "@pnp/graph/files";
import { pnpTest } from "../pnp-test.js";

// give ourselves a single reference to the projectRoot
const projectRoot = path.resolve(path.dirname(findupSync("package.json")));

describe("Drive", function () {
    let testUserName = "";
    let driveId = null;
    const fileOptions: IFileUploadOptions = {
        content: "This is some test content",
        filePathName: "pnpTest.txt",
        contentType: "text/plain;charset=utf-8",
    };

    const testConvert = path.join(projectRoot, "test/graph/assets", "testconvert.docx");

    // Ensure we have the data to test against
    before(pnpTest("925c2290-4d84-4b27-a60b-a251f1ad4cc6", async function () {

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
    }));

    it("Get Default Drive", pnpTest("10d456fe-5641-478f-9977-d2d722b9b7f1", async function () {
        const drives = await this.pnp.graph.users.getById(testUserName).drives();
        return expect(drives.length).is.greaterThan(0);
    }));

    it("Get Drive by ID", pnpTest("7f0cad4c-a2a9-496c-9765-8cdccdbf6213", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const drive = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId)();
        return expect(drive).is.not.null;
    }));

    it("Get Drive List", pnpTest("4fb008b0-d370-4690-a65a-c4682275462b", async function () {
        if (stringIsNullOrEmpty(this.pnp.settings.graph.id)) {
            this.skip();
        }
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const list = await this.pnp.graph.sites.getById(this.pnp.settings.graph.id).drive.list();
        return expect(list).is.not.null;
    }));

    it("Get Recent Drive Items", pnpTest("f242501e-0474-42e4-ad12-360c20f24885", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const recent = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).recent();
        return expect(recent).is.not.null;
    }));

    it("Get Drive Root Folder", pnpTest("f9349b01-63ab-4a01-8554-09a1ebd087f6", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const root = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root();
        return expect(root.id).length.greaterThan(0);
    }));

    it("Get Drive Root Folder Children", pnpTest("43ebc242-ffc5-44d5-9914-39cf2245ee3b", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.children();
        return expect(children).is.not.null;
    }));

    it("Add Drive Root Folder Item (Upload)", pnpTest("1755fa37-cfb1-4ca2-9de2-c274e36696ca", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const { testFileName } = await this.props({
            testFileName: `TestFile_${getRandomString(4)}.json`,
        });
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        if (children != null) {
            // Clean up test file
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).delete();
        }
        return expect(children.id).length.greaterThan(0);
    }));

    it("Add Drive Root Folder Item (Add)", pnpTest("449b945a-636b-40c9-ac06-17820c352c92", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const { testFileName } = await this.props({
            testFileName: `TestFile_${getRandomString(4)}.json`,
        });
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const driveItemAdd: IDriveItemAdd = {
            filename: testFileName,
            content: fileOptions.content,
            contentType: fileOptions.contentType,
        };
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.children.add(driveItemAdd);
        if (children != null) {
            // Clean up test file
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).delete();
        }
        return expect(children.id).length.greaterThan(0);
    }));

    it("Add New Drive Folder", pnpTest("f732405d-4e76-4418-a59f-7659ab3cb9c7", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const { testFolderName } = await this.props({
            testFolderName: `TestFolder_${getRandomString(4)}`,
        });
        const driveItemAdd: IDriveItemAddFolder = {
            name: testFolderName,
        };
        const folder = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.children.addFolder(driveItemAdd);
        if (folder != null) {
            // Clean up test file
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(folder.id).delete();
        }
        return expect(folder.id).length.greaterThan(0);
    }));

    it("Search Drive Item", pnpTest("83cf41e9-1a77-444a-947e-19e978f786a0", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const { searchString } = await this.props({
            searchString: `TestFile_${getRandomString(4)}`,
        });
        const testFileName = `${searchString}.txt`;
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        let searchResults;
        if (children != null) {
            searchResults = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.search(searchString)();
            // Clean up test file
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).delete();
        }
        return expect(searchResults).to.not.be.null;
    }));

    it("Get Drive Item By ID", pnpTest("537caccd-99b8-4714-ad1b-16e5883988ff", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const { testFileName } = await this.props({
            testFileName: `${getRandomString(4)}.txt`,
        });
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        let driveItemId;
        if (children != null) {
            driveItemId = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id)();
            // Clean up test file
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).delete();
        }
        return expect(driveItemId.id).to.be.eq(children.id);
    }));

    it("Get Drive Item By Path", pnpTest("82774989-9eb2-4d9c-9e20-c5a2249c9e69", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const { testFileName } = await this.props({
            testFileName: `${getRandomString(4)}.txt`,
        });
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        let driveItemId;
        if (children != null) {
            driveItemId = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemByPath(testFileName)();
            // Clean up test file
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).delete();
        }
        return expect(driveItemId.id).to.be.eq(children.id);
    }));

    // This tests takes too long for folder to be created to test getItemsByPath
    it.skip("Get Drive Items By Path", pnpTest("86eb60fb-a91a-4b47-adc6-0fd33f3abe4f", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        let driveItems;
        const { testFileName, testFolderName } = await this.props({
            testFileName: `${getRandomString(4)}.txt`,
            testFolderName: `TestFolder_${getRandomString(4)}`,
        });
        const folder = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.children.addFolder({ name: testFolderName });
        if (folder != null) {
            const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(folder.id)
                .upload({ filePathName: testFileName, content: "My File Content String" });
            if (children != null) {
                driveItems = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemsByPath(testFolderName)();
                // Clean up test file
                await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).delete();
            }
            // Clean up test folder
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).delete();
        }
        return expect(driveItems.length).to.be.gt(0);
    }));

    it("Get Drive Delta", pnpTest("cd6498c9-3c10-4d7c-b319-82906976c6f2", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const delta = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.delta()();

        return expect(delta).haveOwnProperty("values");
    }));

    it("Get Drive Thumbnails", pnpTest("33d07566-18cf-4e2c-a220-7485e081cd6b", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const thumbnails = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.thumbnails();
        return expect(thumbnails).is.not.null;
    }));

    // This logs to the console when it passes, ignore those messages
    it("Delete Drive Item", pnpTest("82d5b525-2491-4918-85bb-dc76459e7f40", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const { testFileName } = await this.props({
            testFileName: `${getRandomString(4)}.txt`,
        });
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        let driveItemId = null;
        if (children != null) {
            // Clean up test file
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).delete();
            try {
                driveItemId = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id)();
            } catch (err) {
                // Do nothing as this is the expected outcome
            }
        }
        return expect(driveItemId).to.be.null;
    }));

    // This logs to the console when it passes, ignore those messages
    it("Permanently Delete Drive Item", pnpTest("5bb35e9f-8b4f-4315-9b32-3e07bca23806", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const { testFileName } = await this.props({
            testFileName: `${getRandomString(4)}.txt`,
        });
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        let driveItemId = null;
        if (children != null) {
            // Clean up test file
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).permanentDelete();
            try {
                driveItemId = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id)();
            } catch (err) {
                // Do nothing as this is the expected outcome
            }
        }
        return expect(driveItemId).to.be.null;
    }));

    it("Update Drive Item", pnpTest("f4f1a8b4-eed2-4225-9377-e31711617225", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const { testFileName, testFileName2 } = await this.props({
            testFileName: `${getRandomString(4)}.txt`,
            testFileName2: `${getRandomString(4)}.txt`,
        });
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        let driveItemUpdate;
        if (children != null) {
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).update({ name: testFileName2 });
            driveItemUpdate = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id)();
            // Clean up test file
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).delete();
        }
        return expect(driveItemUpdate.name).to.eq(testFileName2);
    }));

    it("Copy Drive Item", pnpTest("0e14e99e-93fa-456c-84d2-94860ce448b2", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const { testFileName, testFileName2 } = await this.props({
            testFileName: `${getRandomString(4)}.txt`,
            testFileName2: `${getRandomString(4)}.txt`,
        });
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
            fileCopy = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).copyItem(copyOptions);
            // Clean up test file
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).delete();
            if (fileCopy.length > 0) {
                await await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemByPath(testFileName2).delete();
            }
        }
        return expect(fileCopy).length.to.be.gt(0);
    }));

    it("Move Drive Item", pnpTest("c454f785-7645-4c0b-824b-10a9ce1cf24e", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const { testFileName, testFileName2, testFolderName } = await this.props({
            testFileName: `${getRandomString(4)}.txt`,
            testFileName2: `${getRandomString(4)}.txt`,
            testFolderName: `TestFolder_${getRandomString(4)}`,
        });
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.children.add({ filename: testFileName, content: "My File Content String" });
        let driveItemUpdate;
        if (children != null) {
            const folder = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.children.addFolder({ name: testFolderName });
            if (folder != null) {
                const moveOptions: IItemOptions = {
                    parentReference: { driveId: folder.parentReference.driveId, id: folder.id },
                    name: testFileName2,
                };
                driveItemUpdate = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).moveItem(moveOptions);
                // Clean up test file
                await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).delete();
                // Clean up test folder
                await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(folder.id).delete();
            } else {
                // Clean up test file
                await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).delete();
            }
        }
        return expect(driveItemUpdate.name).to.eq(testFileName2);
    }));

    it("Convert Drive Item", pnpTest("716b9aa9-29f1-4ce9-bd89-6cbb09d15732", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const { testFileName } = await this.props({
            testFileName: `TestFile_${getRandomString(4)}.docx`,
        });
        const testConvertFile: Uint8Array = new Uint8Array(fs.readFileSync(testConvert));
        const fo = {
            content: testConvertFile,
            filePathName: testFileName,
            contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        };
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        let convertDriveItem = null;
        if (children != null) {
            convertDriveItem = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).convertContent("pdf");
            // Clean up test file
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).delete();
        }
        return expect(convertDriveItem).is.not.null;
    }));

    it("Get Drive Item Preview", pnpTest("22aeeec6-eb6d-4c62-9fa2-983e14dea1c3", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const { testFileName } = await this.props({
            testFileName: `TestFile_${getRandomString(4)}.txt`,
        });
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        let previewDriveItem = null;
        if (children != null) {
            previewDriveItem = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).preview();
            // Clean up test file
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).delete();
        }
        return expect(previewDriveItem).to.haveOwnProperty("getUrl");
    }));

    // Seems graph is throwing 500 internal server errors, skipping for now
    it.skip("Follow Drive Item", pnpTest("3b9e4a66-352f-4c05-b84c-225528005d8e", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const { testFileName } = await this.props({
            testFileName: `TestFile_${getRandomString(4)}.txt`,
        });
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        let followDriveItem = null;
        if (children != null) {
            // Clean up test file
            followDriveItem = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).follow();
            // Clean up test file
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).delete();
        }
        return expect(followDriveItem).to.be.null;
    }));

    // Seems graph is throwing 500 internal server errors, skipping for now
    it.skip("UnFollow Drive Item", pnpTest("c69c3787-a0f7-4cd4-8e9d-32f33b9fd6c8", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const { testFileName } = await this.props({
            testFileName: `TestFile_${getRandomString(4)}.txt`,
        });
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fo);
        let unfollowDriveItem = null;
        if (children != null) {
            // Set up test file
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).follow();
            try {
                await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).unfollow();
                unfollowDriveItem = true;
            } catch (err) {
                unfollowDriveItem = false;
            }
            // Clean up test file
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).delete();
        }
        return expect(unfollowDriveItem).to.be.true;
    }));

    // it("Create Sharing Link", async function () {
    //     if (stringIsNullOrEmpty(driveId)) {
    //         this.skip();
    //     }
    //     const testFileName = `TestFile_${getRandomString(4)}.json`;
    //     const fo = JSON.parse(JSON.stringify(fileOptions));
    //     fo.filePathName = testFileName;
    //     const driveItemAdd: IDriveItemAdd = {
    //         filename: testFileName,
    //         content: fileOptions.content,
    //         contentType: fileOptions.contentType,
    //     };
    //     const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.children.add(driveItemAdd);
    //     let sharingLink = null;
    //     if (children != null) {
    //         // Create Sharing Link
    //         const sharingLinkInfo: ISharingLinkInfo = {
    //             type: "view",
    //             scope: "anonymous",
    //         };
    //         sharingLink = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).createSharingLink(sharingLinkInfo);
    //         // Clean up test file
    //         await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.id).delete();
    //     }
    //     return expect(sharingLink).to.haveOwnProperty("id");
    // });

    /* Testing for Bundles is not possible as it is only supported in Personal OneDrive */
    // describe.skip("Bundles", function () {});
});


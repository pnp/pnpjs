import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";

describe("OneDrive", function () {
    let testUserName = "";
    let driveId = null;

    // Ensure we have the data to test against
    before(async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        // Get a sample user
        try {
            testUserName = this.pnp.settings.testUser.substr(this.pnp.settings.testUser.lastIndexOf("|") + 1);
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
        return expect(root).is.not.null;
    });

    it("Get Drive Root Folder Children", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.children();
        return expect(children).is.not.null;
    });

    it("Add Drive Root Folder Item", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const testFileName = `TestFile_${getRandomString(4)}.txt`;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.children.add(testFileName, "My File Content String");
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

    // TODO: Search function is broken
    // it("Search Drive Item", async function () {
    //     if (stringIsNullOrEmpty(driveId)) {
    //         this.skip();
    //     }
    //     const searchString = `TestFile_${getRandomString(4)}`;
    //     const testFileName = `${searchString}.txt`;
    //     const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.children.add(testFileName, "My File Content String");
    //     let searchResults;
    //     if (children != null) {
    //         searchResults = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.search(searchString)();
    //         // Clean up test file
    //         await children.driveItem.delete();
    //     }
    //     return expect(searchResults).to.not.be.null;
    // });

    it("Get Drive Item By ID", async function () {
        if (stringIsNullOrEmpty(driveId)) {
            this.skip();
        }
        const testFileName = `${getRandomString(4)}.txt`;
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.children.add(testFileName, "My File Content String");
        let driveItemId;
        if (children != null) {
            driveItemId = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.data.id)();
            // Clean up test file
            await children.driveItem.delete();
        }
        return expect(driveItemId.id).to.be.eq(children.data.id);
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
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.children.add(testFileName, "My File Content String");
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
        const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.children.add(testFileName, "My File Content String");
        let driveItemUpdate;
        if (children != null) {
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.data.id).update({ name: testFileName2 });
            driveItemUpdate = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.data.id)();
            // Clean up test file
            await children.driveItem.delete();
        }
        return expect(driveItemUpdate.name).to.eq(testFileName2);
    });

    // TODO: This doesn't resolve property, need to review
    // it("Move Drive Item", async function () {
    //     if (stringIsNullOrEmpty(driveId)) {
    //         this.skip();
    //     }
    //     const testFileName = `${getRandomString(4)}.txt`;
    //     const testFileName2 = `${getRandomString(4)}.txt`;
    //     const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.children.add(testFileName, "My File Content String");
    //     let driveItemUpdate;
    //     if (children != null) {
    //         const testFolderName = `TestFolder_${getRandomString(4)}`;
    //         const folder = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.children.addFolder(testFolderName);
    //         if (folder != null) {
    //             const folderId: string = folder.data.id;
    //             const move = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.data.id).move({ parentReference: { id: folderId }, name: testFileName2 });
    //             driveItemUpdate = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(children.data.id)();
    //             // Clean up test file
    //             await children.driveItem.delete();
    //             // Clean up test folder
    //             await folder.driveItem.delete();
    //         } else {
    //             // Clean up test file
    //             await children.driveItem.delete();
    //         }
    //     }
    //     return expect(driveItemUpdate.name).to.eq(testFileName2);
    // });

});

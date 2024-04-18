import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/mail";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import getValidUser from "./utilities/getValidUser.js";
import { MailFolder as IMailFolder, MailSearchFolder as IMailSearchFolder } from "@microsoft/microsoft-graph-types";

describe("Mail: Folders", function () {
    const testFolderName = "PnP Test Folder";
    let testUserName = "";
    let inboxFolder = null;

    const draftFolder: IMailFolder = {
        displayName: testFolderName,
        isHidden: false,
    };

    const draftSearchFolder: IMailSearchFolder = {
        displayName: `${testFolderName} Search`,
        sourceFolderIds: [],
    };

    // Ensure we have the data to test against
    before(async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const userInfo = await getValidUser.call(this);
        testUserName = userInfo.userPrincipalName;
        inboxFolder = await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox")();
        draftSearchFolder.sourceFolderIds.push(inboxFolder.id);
    });

    // Clean up testing folders
    after(async function () {
        if (!stringIsNullOrEmpty(testUserName)) {
            const folders: IMailFolder[] = await this.pnp.graph.users.getById(testUserName).mailFolders();
            for(let i=0; i < folders.length; i++){
                if(folders[i].displayName.startsWith(testFolderName)){
                    await this.pnp.graph.users.getById(testUserName).mailFolders.getById(folders[i].id).delete();
                }
            }
        }
        return;
    });

    it("Mail: Folder List", async function () {
        const folders = await this.pnp.graph.users.getById(testUserName).mailFolders();
        return expect(folders).is.not.null;
    });

    it("Mail: Folder List - Include Hidden", async function () {
        const folders = await this.pnp.graph.users.getById(testUserName).mailFolders.includeHidden();
        return expect(folders).is.not.null;
    });

    it("Mail: Folder List - Delta", async function () {
        const folders = await this.pnp.graph.users.getById(testUserName).mailFolders.delta()();
        return expect(folders).haveOwnProperty("values");
    });

    it("Mail: Get Folder by Id (Add/Delete)", async function () {
        const f: IMailFolder = JSON.parse(JSON.stringify(draftFolder));
        f.displayName = `${testFolderName} ${getRandomString(8)}`;
        const folder = await this.pnp.graph.users.getById(testUserName).mailFolders.add(f);
        let success = false;
        if (folder !== null) {
            const getFolder = await this.pnp.graph.users.getById(testUserName).mailFolders.getById(folder.id)();
            if(getFolder !== null) {
                success = (getFolder.displayName === f.displayName);
                await this.pnp.graph.users.getById(testUserName).mailFolders.getById(folder.id).delete();
            }
        }
        return expect(success).to.be.true;
    });

    it("Mail: Folder Add", async function () {
        const f: IMailFolder = JSON.parse(JSON.stringify(draftFolder));
        f.displayName = `${testFolderName} ${getRandomString(8)}`;
        const folder = await this.pnp.graph.users.getById(testUserName).mailFolders.add(f);
        const success = (folder !== null);
        if (success) {
            await this.pnp.graph.users.getById(testUserName).mailFolders.getById(folder.id).delete();
        }
        return expect(success).to.be.true;
    });

    it("Mail: Search Folder Add", async function () {
        const f: IMailSearchFolder = JSON.parse(JSON.stringify(draftSearchFolder));
        const folder = await this.pnp.graph.users.getById(testUserName).mailFolders.getById(inboxFolder.id).childFolders.add(f);
        const success = (folder !== null);
        if (success) {
            await this.pnp.graph.users.getById(testUserName).mailFolders.getById(folder.id).delete();
        }
        return expect(success).to.be.true;
    });

    it("Mail: Folder Update", async function () {
        const f: IMailFolder = JSON.parse(JSON.stringify(draftFolder));
        const newDisplayName = `${testFolderName} ${getRandomString(8)}`;
        f.displayName = `${testFolderName} ${getRandomString(8)}`;
        const folder = await this.pnp.graph.users.getById(testUserName).mailFolders.add(f);
        let success = false;
        if (folder !== null) {
            const update = await this.pnp.graph.users.getById(testUserName).mailFolders.getById(folder.id).update({ displayName: newDisplayName });
            if (update !== null) {
                success = (update.displayName === newDisplayName);
                await this.pnp.graph.users.getById(testUserName).mailFolders.getById(update.id).delete();
            }
        }
        return expect(success).to.be.true;
    });

    // This logs to the console when it passes, ignore those messages
    it("Mail: Folder Delete", async function () {
        const f: IMailFolder = JSON.parse(JSON.stringify(draftFolder));
        f.displayName = `${testFolderName} ${getRandomString(8)}`;
        const folder = await this.pnp.graph.users.getById(testUserName).mailFolders.add(f);
        let success = false;
        if (folder !== null) {
            await this.pnp.graph.users.getById(testUserName).mailFolders.getById(folder.id).delete();
            try {
                const found = await this.pnp.graph.users.getById(testUserName).mailFolders.getById(folder.id)();
                if (found?.id === null) {
                    success = true;
                }
            } catch (e) {
                success = true;
            }
        }
        return expect(success).to.be.true;
    });

    it("Mail: Folder Copy", async function () {
        const f: IMailFolder = JSON.parse(JSON.stringify(draftFolder));
        f.displayName = `${testFolderName} ${getRandomString(8)}`;
        const folder = await this.pnp.graph.users.getById(testUserName).mailFolders.add(f);
        let success = false;
        if (folder !== null) {
            const folderCopy = await this.pnp.graph.users.getById(testUserName).mailFolders.getById(folder.id).copy(inboxFolder.id);
            if (folderCopy !== null) {
                success = true;
                await this.pnp.graph.users.getById(testUserName).mailFolders.getById(folderCopy.id).delete();
            }
        }
        return expect(success).to.be.true;
    });

    it("Mail: Folder Move", async function () {
        const f: IMailFolder = JSON.parse(JSON.stringify(draftFolder));
        f.displayName = `${testFolderName} ${getRandomString(8)}`;
        const folder: IMailFolder = await this.pnp.graph.users.getById(testUserName).mailFolders.add(f);
        let success = false;
        if (folder !== null) {
            const folderMove = await this.pnp.graph.users.getById(testUserName).mailFolders.getById(folder.id).move("drafts");
            if (folderMove !== null) {
                success = (folderMove.displayName === folder.displayName);
                await this.pnp.graph.users.getById(testUserName).mailFolders.getById(folderMove.id).delete();
            }
        }
        return expect(success).to.be.true;
    });

    it("Mail: Child Folder List", async function () {
        const folders = await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox").childFolders();
        return expect(folders).is.not.null;
    });

    it("Mail: Child Folder Add", async function () {
        const f: IMailFolder = JSON.parse(JSON.stringify(draftFolder));
        f.displayName = `${testFolderName} ${getRandomString(8)}`;
        const folder = await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox").childFolders.add(f);
        const success = (folder !== null);
        if (success) {
            await this.pnp.graph.users.getById(testUserName).mailFolders.getById(folder.id).delete();
        }
        return expect(success).to.be.true;
    });

    it("Mail: Child Folder Messages List", async function () {
        const f: IMailFolder = JSON.parse(JSON.stringify(draftFolder));
        f.displayName = `${testFolderName} ${getRandomString(8)}`;
        const folder = await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox").childFolders.add(f);
        let success = false;
        if (folder !== null) {
            const messages = await this.pnp.graph.users.getById(testUserName).mailFolders.getById(folder.id).messages();
            success = (messages !== null);
            await this.pnp.graph.users.getById(testUserName).mailFolders.getById(folder.id).delete();
        }
        return expect(success).to.be.true;
    });
});


import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/mail";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import getValidUser from "./utilities/getValidUser.js";
import { MailFolder as IMailFolder, MailSearchFolder as IMailSearchFolder } from "@microsoft/microsoft-graph-types";
import { pnpTest } from "../pnp-test.js";

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
    before(pnpTest("d3526b6c-b445-4759-b123-21450898959c", async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const userInfo = await getValidUser.call(this);
        testUserName = userInfo.userPrincipalName;
        inboxFolder = await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox")();
        draftSearchFolder.sourceFolderIds.push(inboxFolder.id);
    }));

    // Clean up testing folders
    after(pnpTest("e60f849a-5495-46ad-948d-16513cb7fdbe", async function () {
        if (!stringIsNullOrEmpty(testUserName)) {
            const folders: IMailFolder[] = await this.pnp.graph.users.getById(testUserName).mailFolders();
            for(let i=0; i < folders.length; i++){
                if(folders[i].displayName.startsWith(testFolderName)){
                    await this.pnp.graph.users.getById(testUserName).mailFolders.getById(folders[i].id).delete();
                }
            }
        }
        return;
    }));

    it("Mail: Folder List", pnpTest("1bd864b0-c611-4016-87de-de70f2618a51", async function () {
        const folders = await this.pnp.graph.users.getById(testUserName).mailFolders();
        return expect(folders).is.not.null;
    }));

    it("Mail: Folder List - Include Hidden", pnpTest("9dad4cd7-07ab-411e-98db-798d5717ac68", async function () {
        const folders = await this.pnp.graph.users.getById(testUserName).mailFolders.includeHidden();
        return expect(folders).is.not.null;
    }));

    it("Mail: Folder List - Delta", pnpTest("690c748d-ca43-4676-9d80-f74a9c9199f2", async function () {
        const folders = await this.pnp.graph.users.getById(testUserName).mailFolders.delta()();
        return expect(folders).haveOwnProperty("values");
    }));

    it("Mail: Get Folder by Id (Add/Delete)", pnpTest("61224dbc-e2b9-4606-968b-3ef85d31097f", async function () {
        const { displayName } = await this.props({
            displayName: `${testFolderName} ${getRandomString(8)}`,
        });
        const f: IMailFolder = JSON.parse(JSON.stringify(draftFolder));
        f.displayName = displayName;
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
    }));

    it("Mail: Folder Add", pnpTest("0e628dbd-cfb6-4c31-a447-5c52a9c5408d", async function () {
        const { displayName } = await this.props({
            displayName: `${testFolderName} ${getRandomString(8)}`,
        });
        const f: IMailFolder = JSON.parse(JSON.stringify(draftFolder));
        f.displayName = displayName;
        const folder = await this.pnp.graph.users.getById(testUserName).mailFolders.add(f);
        const success = (folder !== null);
        if (success) {
            await this.pnp.graph.users.getById(testUserName).mailFolders.getById(folder.id).delete();
        }
        return expect(success).to.be.true;
    }));

    it("Mail: Search Folder Add", pnpTest("abf66ed7-c320-4e06-ad13-a763fa1b59c6", async function () {
        const f: IMailSearchFolder = JSON.parse(JSON.stringify(draftSearchFolder));
        const folder = await this.pnp.graph.users.getById(testUserName).mailFolders.getById(inboxFolder.id).childFolders.add(f);
        const success = (folder !== null);
        if (success) {
            await this.pnp.graph.users.getById(testUserName).mailFolders.getById(folder.id).delete();
        }
        return expect(success).to.be.true;
    }));

    it("Mail: Folder Update", pnpTest("31039b6e-2db0-43c2-9ed0-3ead446de12a", async function () {
        const { displayName, newDisplayName } = await this.props({
            displayName: `${testFolderName} ${getRandomString(8)}`,
            newDisplayName: `${testFolderName} ${getRandomString(8)}`,
        });
        const f: IMailFolder = JSON.parse(JSON.stringify(draftFolder));
        f.displayName = displayName;
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
    }));

    // This logs to the console when it passes, ignore those messages
    it("Mail: Folder Delete", pnpTest("78f1d81e-58d2-46b6-93a5-e70bc08e6b5d", async function () {
        const { displayName } = await this.props({
            displayName: `${testFolderName} ${getRandomString(8)}`,
        });
        const f: IMailFolder = JSON.parse(JSON.stringify(draftFolder));
        f.displayName = displayName;
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
    }));

    it("Mail: Folder Copy", pnpTest("40309146-89e6-47af-a276-990f34c0e6d8", async function () {
        const { displayName } = await this.props({
            displayName: `${testFolderName} ${getRandomString(8)}`,
        });
        const f: IMailFolder = JSON.parse(JSON.stringify(draftFolder));
        f.displayName = displayName;
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
    }));

    it("Mail: Folder Move", pnpTest("5dce2fb9-ed7f-4689-8074-dcb06be48b52", async function () {
        const { displayName } = await this.props({
            displayName: `${testFolderName} ${getRandomString(8)}`,
        });
        const f: IMailFolder = JSON.parse(JSON.stringify(draftFolder));
        f.displayName = displayName;
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
    }));

    it("Mail: Child Folder List", pnpTest("a88b4dc9-c325-4193-82ef-79105a45fd98", async function () {
        const folders = await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox").childFolders();
        return expect(folders).is.not.null;
    }));

    it("Mail: Child Folder Add", pnpTest("f7dba057-b2aa-43b1-b57c-0c3b454d3028", async function () {
        const { displayName } = await this.props({
            displayName: `${testFolderName} ${getRandomString(8)}`,
        });
        const f: IMailFolder = JSON.parse(JSON.stringify(draftFolder));
        f.displayName = displayName;
        const folder = await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox").childFolders.add(f);
        const success = (folder !== null);
        if (success) {
            await this.pnp.graph.users.getById(testUserName).mailFolders.getById(folder.id).delete();
        }
        return expect(success).to.be.true;
    }));

    it("Mail: Child Folder Messages List", pnpTest("0167a1d3-5cd8-400e-9cd6-9d1c5d6ff6a1", async function () {
        const { displayName } = await this.props({
            displayName: `${testFolderName} ${getRandomString(8)}`,
        });
        const f: IMailFolder = JSON.parse(JSON.stringify(draftFolder));
        f.displayName = displayName;
        const folder = await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox").childFolders.add(f);
        let success = false;
        if (folder !== null) {
            const messages = await this.pnp.graph.users.getById(testUserName).mailFolders.getById(folder.id).messages();
            success = (messages !== null);
            await this.pnp.graph.users.getById(testUserName).mailFolders.getById(folder.id).delete();
        }
        return expect(success).to.be.true;
    }));
});


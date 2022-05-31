import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/contacts";
import { HttpRequestError } from "@pnp/queryable";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";

describe("Contacts", function () {

    let testUserName = "";
    let testContactID = "";
    let testContact2ID = "";
    let rootFolderID = "";
    let testFolderID = "";
    let subFolderID = "";

    // Ensure we have the data to test against
    before(async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        // Get a sample user
        testUserName = this.pnp.settings.testUser.substr(this.pnp.settings.testUser.lastIndexOf("|") + 1);
        const testFolderName = `TestFolder_${getRandomString(4)}`;
        const testSubFolderName = `TestSubFolder_${getRandomString(4)}`;
        // Create a test contact
        const testContactName = `TestUser_${getRandomString(4)}`;
        const contact = await this.pnp.graph.users.getById(testUserName).contacts.add("Pavel", testContactName, [{
            address: "pavelb@contoso.onmicrosoft.com",
            name: `Pavel ${testContactName}}`,
        }], ["+1 732 555 1111"]);

        testContactID = contact.data.id;
        rootFolderID = contact.data.parentFolderId;

        // Create a test folder
        const folder = await this.pnp.graph.users.getById(testUserName).contactFolders.add(testFolderName, rootFolderID);
        testFolderID = folder.data.id;
        const subFolder = await this.pnp.graph.users.getById(testUserName).contactFolders.getById(testFolderID).childFolders.add(testSubFolderName, testFolderID);
        subFolderID = subFolder.data.id;
        // Add a test user in the new folder
        const contact2 = await this.pnp.graph.users.getById(testUserName).contactFolders.getById(testFolderID).contacts.add("Jane", testContactName, [{
            address: "janeb@contoso.onmicrosoft.com",
            name: `Pavel ${testContactName}}`,
        }], ["+1 732 555 1111"]);
        testContact2ID = contact2.data.id;
    });

    it("Get Contacts", async function () {
        const contacts = await this.pnp.graph.users.getById(testUserName).contacts();
        return expect(contacts.length).is.greaterThan(0);
    });

    it("Get Contact by ID", async function () {
        const contact = await this.pnp.graph.users.getById(testUserName).contacts.getById(testContactID)();
        return expect(contact).is.not.null;
    });

    it("Add Contact", async function () {
        let contactId = null;
        let contactAfterAdd = null;
        try {
            const testContactName = `TestUser_${getRandomString(4)}`;
            const contact = await this.pnp.graph.users.getById(testUserName).contacts.add("Test", testContactName, [{
                address: "tmctester@contoso.onmicrosoft.com",
                name: `Test ${testContactName}`,
            }], ["+1 732 555 0102"]);
            contactId = contact.data.id;
            contactAfterAdd = await this.pnp.graph.users.getById(testUserName).contacts.getById(contactId)();
        } catch (err) {
            console.log(err.message);
        } finally {
            // Clean up the added contact
            if (contactId != null) {
                await this.pnp.graph.users.getById(testUserName).contacts.getById(contactId).delete();
            }
        }
        return expect(contactAfterAdd).is.not.null;
    });

    it("Update Contact", async function () {
        const testContactName = `TestUser_${getRandomString(4)}`;
        const contact = await this.pnp.graph.users.getById(testUserName).contacts.add("Test", testContactName, [{
            address: "tmctester@contoso.onmicrosoft.com",
            name: `Test ${testContactName}`,
        }], ["+1 732 555 0102"]);
        await this.pnp.graph.users.getById(testUserName).contacts.getById(contact.data.id).update({ birthday: "1986-05-30" });
        const contact2 = await this.pnp.graph.users.getById(testUserName).contacts.getById(contact.data.id)();
        // Clean up the added contact
        await this.pnp.graph.users.getById(testUserName).contacts.getById(contact.data.id).delete();
        return expect(contact2.birthday).equals("1986-05-30T11:59:00Z");
    });

    it("Delete Contact", async function () {
        // Add a contact that we can then delete
        const testContactName = `TestUser_${getRandomString(4)}`;
        const contact = await this.pnp.graph.users.getById(testUserName).contacts.add("Test", testContactName, [{
            address: "tmctester@contoso.onmicrosoft.com",
            name: `Test ${testContactName}`,
        }], ["+1 732 555 0102"]);
        await this.pnp.graph.users.getById(testUserName).contacts.getById(contact.data.id).delete();
        let deletedUserFound = false;

        try {

            // If we try to find a user that doesn"t exist this returns a 404
            await this.pnp.graph.users.getById(testUserName).contacts.getById(contact.data.id)();
            deletedUserFound = true;

        } catch (e) {
            if (e?.isHttpRequestError) {
                if ((<HttpRequestError>e).status === 404) {
                    console.error((<HttpRequestError>e).statusText);
                }
            } else {
                console.log(e.message);
            }
        }

        return expect(deletedUserFound).is.false;
    });


    it("Get Contact Folders", async function () {
        const contactFolders = await this.pnp.graph.users.getById(testUserName).contactFolders();
        return expect(contactFolders.length).is.greaterThan(0);
    });

    it("Get Contact Folder By ID", async function () {
        const contactFolders = await this.pnp.graph.users.getById(testUserName).contactFolders.getById(testFolderID);
        return expect(contactFolders).is.not.null;
    });

    it("Add Contact Folder", async function () {
        let folderId = null;
        let folderAfterAdd = null;
        try {
            const testFolderName = `TestFolder_${getRandomString(4)}`;
            const folder = await this.pnp.graph.users.getById(testUserName).contactFolders.add(testFolderName, rootFolderID);
            folderId = folder.data.id;
            folderAfterAdd = await this.pnp.graph.users.getById(testUserName).contactFolders.getById(folderId)();
        } catch (err) {
            console.log(err.message);
        } finally {
            // Clean up the added contact
            if (folderId != null) {
                await this.pnp.graph.users.getById(testUserName).contactFolders.getById(folderId).delete();
            }
        }
        return expect(folderAfterAdd).is.not.null;
    });

    it("Update Contact Folder", async function () {
        const folderDisplayName = "Folder_Updated";
        let folderId = null;
        let folderAfterUpdate = null;
        try {
            const testFolderName = `TestFolder_${getRandomString(4)}`;
            const folder = await this.pnp.graph.users.getById(testUserName).contactFolders.add(testFolderName, rootFolderID);
            folderId = folder.data.id;
            await this.pnp.graph.users.getById(testUserName).contactFolders.getById(folderId).update({ displayName: folderDisplayName });
            folderAfterUpdate = await this.pnp.graph.users.getById(testUserName).contactFolders.getById(folderId)();
        } catch (err) {
            console.log(err.message);
        } finally {
            // Clean up the added contact
            if (folderId != null) {
                await this.pnp.graph.users.getById(testUserName).contactFolders.getById(folderId).delete();
            }
        }
        return expect(folderAfterUpdate?.displayName).equals(folderDisplayName);
    });

    it("Delete Contact Folder", async function () {
        // Add a folder that we can then delete
        const testFolderName = `TestFolder_${getRandomString(4)}`;
        const folder = await this.pnp.graph.users.getById(testUserName).contactFolders.add(testFolderName, rootFolderID);
        await this.pnp.graph.users.getById(testUserName).contactFolders.getById(folder.data.id).delete();
        let deletedFolderFound = false;

        try {

            // If we try to find a folder that doesn"t exist this returns a 404
            await this.pnp.graph.users.getById(testUserName).contactFolders.getById(folder.data.id)();
            deletedFolderFound = true;

        } catch (e) {
            if (e?.isHttpRequestError) {
                if ((<HttpRequestError>e).status === 404) {
                    console.error((<HttpRequestError>e).statusText);
                }
            } else {
                console.log(e.message);
            }
        }

        return expect(deletedFolderFound).is.false;
    });

    it("Get Contacts In Folder", async function () {
        const contacts = await this.pnp.graph.users.getById(testUserName).contactFolders.getById(testFolderID).contacts();
        return expect(contacts.length).is.greaterThan(0);
    });

    it("Get Child Folders from Folder", async function () {
        const folders = await this.pnp.graph.users.getById(testUserName).contactFolders.getById(testFolderID).childFolders();
        return expect(folders.length).is.greaterThan(0);
    });

    it("Get Child Folders by ID", async function () {
        const childFolder = await this.pnp.graph.users.getById(testUserName).contactFolders.getById(testFolderID).childFolders.getById(subFolderID)();
        return expect(childFolder).is.not.null;
    });

    it("Add Contact to Child Folder", async function () {
        const testContactName = `TestUser_${getRandomString(4)}`;
        const contact = await this.pnp.graph.users.getById(testUserName).contactFolders.getById(testFolderID).childFolders.getById(subFolderID)
            .contacts.add("Test", testContactName, [{ address: "tmctester@contoso.onmicrosoft.com", name: `Test ${testContactName}` }], ["+1 732 555 0102"]);
        const contactAfterAdd = await this.pnp.graph.users.getById(testUserName).contactFolders.getById(testFolderID).childFolders.getById(subFolderID)
            .contacts.getById(contact.data.id)();
        // Clean up the added contact
        await this.pnp.graph.users.getById(testUserName).contactFolders.getById(testFolderID).childFolders.getById(subFolderID).contacts.getById(contact.data.id).delete();
        return expect(contactAfterAdd).is.not.null;
    });

    // Remove the test contact we created
    after(async function () {

        if (!stringIsNullOrEmpty(testUserName) && !stringIsNullOrEmpty(testContactID)) {
            try {
                await this.pnp.graph.users.getById(testUserName).contacts.getById(testContactID).delete();
            } catch (err) {
                console.error(`Cannot clean up test contact: ${testContactID}`);
            }
        }
        if (!stringIsNullOrEmpty(testUserName) && !stringIsNullOrEmpty(testContact2ID)) {
            try {
                await this.pnp.graph.users.getById(testUserName).contacts.getById(testContact2ID).delete();
            } catch (err) {
                console.error(`Cannot clean up test contact: ${testContact2ID}`);
            }
        }
        if (!stringIsNullOrEmpty(testUserName) && !stringIsNullOrEmpty(testFolderID)) {
            try {
                await this.pnp.graph.users.getById(testUserName).contactFolders.getById(testFolderID).delete();
            } catch (err) {
                console.error(`Cannot clean up test contact folder: ${testFolderID}`);
            }
        }

        return;
    });
});

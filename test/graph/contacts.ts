import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/contacts";
import { HttpRequestError } from "@pnp/queryable";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { pnpTest } from "../pnp-test.js";

// TODO:: make work with test recording

describe("Contacts", function () {

    let testUserName = "";
    let testContactID = "";
    let testContact2ID = "";
    let rootFolderID = "";
    let testFolderID = "";
    let subFolderID = "";

    // Ensure we have the data to test against
    before(pnpTest("b36edf34-3e60-4f0d-987e-5bf18397bd5f", async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        // Get a sample user
        testUserName = this.pnp.settings.testUser.substr(this.pnp.settings.testUser.lastIndexOf("|") + 1);
        const { testFolderName, testSubFolderName, testContactName } = await this.props({
            testFolderName: `TestFolder_${getRandomString(4)}`,
            testSubFolderName: `TestSubFolder_${getRandomString(4)}`,
            testContactName: `TestUser_${getRandomString(4)}`,
        });
        // Create a test contact
        const contact = await this.pnp.graph.users.getById(testUserName).contacts.add("Pavel", testContactName, [{
            address: "pavelb@contoso.onmicrosoft.com",
            name: `Pavel ${testContactName}}`,
        }], ["+1 732 555 1111"]);

        testContactID = contact.id;
        rootFolderID = contact.parentFolderId;

        // Create a test folder
        const folder = await this.pnp.graph.users.getById(testUserName).contactFolders.add(testFolderName, rootFolderID);
        testFolderID = folder.id;
        const subFolder = await this.pnp.graph.users.getById(testUserName).contactFolders.getById(testFolderID).childFolders.add(testSubFolderName, testFolderID);
        subFolderID = subFolder.id;
        // Add a test user in the new folder
        const contact2 = await this.pnp.graph.users.getById(testUserName).contactFolders.getById(testFolderID).contacts.add("Jane", testContactName, [{
            address: "janeb@contoso.onmicrosoft.com",
            name: `Pavel ${testContactName}}`,
        }], ["+1 732 555 1111"]);
        testContact2ID = contact2.id;
    }));

    it("Get Contacts", pnpTest("d03148f2-2a70-46fd-b3fb-12b9abaa6096", async function () {
        const contacts = await this.pnp.graph.users.getById(testUserName).contacts();
        return expect(contacts.length).is.greaterThan(0);
    }));

    it("Get Contact by ID", pnpTest("52606edc-3d60-48ef-bf9b-02c91f5c1a67", async function () {
        const contact = await this.pnp.graph.users.getById(testUserName).contacts.getById(testContactID)();
        return expect(contact).is.not.null;
    }));

    it("Add Contact", pnpTest("90bf6a6c-7b36-4c56-8498-b1c5f7b883f1", async function () {
        let contactId = null;
        let contactAfterAdd = null;
        try {
            const { testContactName } = await this.props({
                testContactName: `TestUser_${getRandomString(4)}`,
            });
            const contact = await this.pnp.graph.users.getById(testUserName).contacts.add("Test", testContactName, [{
                address: "tmctester@contoso.onmicrosoft.com",
                name: `Test ${testContactName}`,
            }], ["+1 732 555 0102"]);
            contactId = contact.id;
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
    }));

    it("Update Contact", pnpTest("bec08650-712b-4f84-88e0-9e63846d0520", async function () {
        const { testContactName } = await this.props({
            testContactName: `TestUser_${getRandomString(4)}`,
        });
        const contact = await this.pnp.graph.users.getById(testUserName).contacts.add("Test", testContactName, [{
            address: "tmctester@contoso.onmicrosoft.com",
            name: `Test ${testContactName}`,
        }], ["+1 732 555 0102"]);
        await this.pnp.graph.users.getById(testUserName).contacts.getById(contact.id).update({ birthday: "1986-05-30" });
        const contact2 = await this.pnp.graph.users.getById(testUserName).contacts.getById(contact.id)();
        // Clean up the added contact
        try {
            await this.pnp.graph.users.getById(testUserName).contacts.getById(contact.id).delete();
        } catch (err) {
            console.log(err.message);
        }
        return expect(contact2.birthday).equals("1986-05-30T11:59:00Z");
    }));

    // This logs to the console when it passes, ignore those messages
    it("Delete Contact", pnpTest("26ec5b40-a3ed-46e0-8740-379497647d3d", async function () {
        // Add a contact that we can then delete
        const { testContactName } = await this.props({
            testContactName: `TestUser_${getRandomString(4)}`,
        });
        const contact = await this.pnp.graph.users.getById(testUserName).contacts.add("Test", testContactName, [{
            address: "tmctester@contoso.onmicrosoft.com",
            name: `Test ${testContactName}`,
        }], ["+1 732 555 0102"]);
        await this.pnp.graph.users.getById(testUserName).contacts.getById(contact.id).delete();
        let deletedUserFound = false;

        try {
            // This passes the first time through, expecting it to fail on second pass.
            // If we try to find a user that doesn't exist this returns a 404
            await this.pnp.graph.users.getById(testUserName).contacts.getById(contact.id)();
            deletedUserFound = true;

        } catch (e) {
            if (e?.isHttpRequestError) {
                if ((<HttpRequestError>e).status === 404) {
                    // do nothing
                }
            } else {
                console.log(e.message);
            }
        }

        return expect(deletedUserFound).is.false;
    }));


    it("Get Contact Folders", pnpTest("2269c0d2-9e89-4046-85b0-106f38aa255d", async function () {
        const contactFolders = await this.pnp.graph.users.getById(testUserName).contactFolders();
        return expect(contactFolders.length).is.greaterThan(0);
    }));

    it("Get Contact Folder By ID", pnpTest("cac287f9-f57f-4aa1-8d5a-a2d27220c566", async function () {
        const contactFolders = await this.pnp.graph.users.getById(testUserName).contactFolders.getById(testFolderID);
        return expect(contactFolders).is.not.null;
    }));

    it("Add Contact Folder", pnpTest("25fc42b0-62e6-4593-8353-808999c54e2e", async function () {
        let folderId = null;
        let folderAfterAdd = null;
        try {
            const { testFolderName } = await this.props({
                testFolderName: `TestFolder_${getRandomString(4)}`,
            });
            const folder = await this.pnp.graph.users.getById(testUserName).contactFolders.add(testFolderName, rootFolderID);
            folderId = folder.id;
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
    }));

    it("Update Contact Folder", pnpTest("a9b69630-cfe3-4dbf-a532-03448f3564a1", async function () {
        const { testFolderName, folderDisplayName } = await this.props({
            testFolderName: `TestFolder_${getRandomString(4)}`,
            folderDisplayName: `Folder_Updated_${getRandomString(4)}`,
        });
        let folderId = null;
        let folderAfterUpdate = null;
        try {
            const folder = await this.pnp.graph.users.getById(testUserName).contactFolders.add(testFolderName, rootFolderID);
            folderId = folder.id;
            await this.pnp.graph.users.getById(testUserName).contactFolders.getById(folderId).update({ displayName: folderDisplayName });
            folderAfterUpdate = await this.pnp.graph.users.getById(testUserName).contactFolders.getById(folderId)();
        } catch (err) {
            console.log(err.message);
        } finally {
            // Clean up the added contact
            if (folderId != null) {
                try {
                    await this.pnp.graph.users.getById(testUserName).contactFolders.getById(folderId).delete();
                } catch (err) {
                    console.log(err.message);
                }
            }
        }
        return expect(folderAfterUpdate?.displayName).equals(folderDisplayName);
    }));

    it("Delete Contact Folder", pnpTest("49cb1457-86b5-4d06-b755-450abebf91e8", async function () {
        // Add a folder that we can then delete
        const { testFolderName } = await this.props({
            testFolderName: `TestFolder_${getRandomString(4)}`,
        });
        const folder = await this.pnp.graph.users.getById(testUserName).contactFolders.add(testFolderName, rootFolderID);

        // await this.pnp.graph.users.getById(testUserName).contactFolders.getById(folder.id).delete()
        // let deletedFolderFound = false;

        // try {
        //     // This passes the first time through, expecting it to fail on second pass.
        //     // If we try to find a folder that doesn't exist this returns a 404
        //     const deletedFolder = await this.pnp.graph.users.getById(testUserName).contactFolders.getById(folder.id)();
        //     deletedFolderFound = (deletedFolder?.id.length> 0);
        // } catch (e) {
        //     if (e?.isHttpRequestError) {
        //         if ((<HttpRequestError>e).status === 404) {
        //             // do nothing
        //         }
        //     } else {
        //         console.log(e.message);
        //     }
        // }

        return expect(this.pnp.graph.users.getById(testUserName).contactFolders.getById(folder.id).delete()).to.eventually.be.fulfilled;
    }));

    it("Get Contacts In Folder", pnpTest("fee4a44c-06d1-4ed7-ad63-160b97e31fcf", async function () {
        const contacts = await this.pnp.graph.users.getById(testUserName).contactFolders.getById(testFolderID).contacts();
        return expect(contacts.length).is.greaterThan(0);
    }));

    it("Get Child Folders from Folder", pnpTest("76658981-a13f-451f-beed-48c0c32ca97a", async function () {
        const folders = await this.pnp.graph.users.getById(testUserName).contactFolders.getById(testFolderID).childFolders();
        return expect(folders.length).is.greaterThan(0);
    }));

    it("Get Child Folders by ID", pnpTest("93bff32f-bbbd-4189-87b5-a8e1b4bad8e8", async function () {
        const childFolder = await this.pnp.graph.users.getById(testUserName).contactFolders.getById(testFolderID).childFolders.getById(subFolderID)();
        return expect(childFolder).is.not.null;
    }));

    it("Add Contact to Child Folder", pnpTest("60f97cd5-b95b-4460-bcab-7430eb5d7ad0", async function () {
        const { testContactName } = await this.props({
            testContactName: `TestUser_${getRandomString(4)}`,
        });
        const contact = await this.pnp.graph.users.getById(testUserName).contactFolders.getById(testFolderID).childFolders.getById(subFolderID)
            .contacts.add("Test", testContactName, [{ address: "tmctester@contoso.onmicrosoft.com", name: `Test ${testContactName}` }], ["+1 732 555 0102"]);
        const contactAfterAdd = await this.pnp.graph.users.getById(testUserName).contactFolders.getById(testFolderID).childFolders.getById(subFolderID)
            .contacts.getById(contact.id)();
        // Clean up the added contact
        await this.pnp.graph.users.getById(testUserName).contactFolders.getById(testFolderID).childFolders.getById(subFolderID).contacts.getById(contact.id).delete();
        return expect(contactAfterAdd).is.not.null;
    }));

    // Remove the test contact we created
    after(pnpTest("7c730515-e14b-4481-84d1-49fd16c5b0f4",async function () {

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
    }));
});

import { expect } from "chai";
import { testSettings } from "../main";
import { graph } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/contacts";
import { HttpRequestError } from "@pnp/odata";

describe("Contacts", function () {


    // We can't test for graph.me.contacts calls in an application context
    if (testSettings.enableWebTests) {
        let testUserName = "";
        let testContactID = "";
        let rootFolderID = "";
        let testFolderID = "";
        let subFolderID = "";

        // Ensure we have the data to test against
        this.beforeAll(async function () {
            // Get a sample user
            const allUsers = await graph.users();
            testUserName = allUsers[1].mail;

            // Create a test contact
            const contact = await graph.users.getById(testUserName).contacts.add("Pavel", "Bansky", [{ address: "pavelb@contoso.onmicrosoft.com", name: "Pavel Bansky" }], ["+1 732 555 0102"]);
            testContactID = contact.data.id;
            rootFolderID = contact.data.parentFolderId;

            // Create a test folder
            const folder = await graph.users.getById(testUserName).contactFolders.add("Test Folder", rootFolderID);
            const subFolder = await graph.users.getById(testUserName).contactFolders.getById(folder.data.id).childFolders.add("Test Sub Folder", folder.data.id);
            // Add a test user in the new folder
            await graph.users.getById(testUserName).contactFolders.getById(folder.data.id).contacts.add("Jane", "Bansky", [{ address: "janeb@contoso.onmicrosoft.com", name: "Jane Bansky" }], ["+1 732 555 0102"]);
            testFolderID = folder.data.id;
            subFolderID = subFolder.data.id;

        });

        it("Get Contacts", async function () {
            const contacts = await graph.users.getById(testUserName).contacts();
            return expect(contacts.length).is.greaterThan(0);
        });

        it("Get Contact by ID", async function () {
            const contact = await graph.users.getById(testUserName).contacts.getById(testContactID)();
            return expect(contact).is.not.null;
        });

        it("Add Contact", async function () {
            const contact = await graph.users.getById(testUserName).contacts.add("Test", "McTester", [{ address: "tmctester@contoso.onmicrosoft.com", name: "Test McTester" }], ["+1 732 555 0102"]);
            const contactAfterAdd = await graph.users.getById(testUserName).contacts.getById(contact.data.id)();
            // Clean up the added contact
            await graph.users.getById(testUserName).contacts.getById(contact.data.id).delete();
            return expect(contactAfterAdd).is.not.null;
        });

        it("Update Contact", async function () {
            const contact = await graph.users.getById(testUserName).contacts.add("Test", "McTester", [{ address: "tmctester@contoso.onmicrosoft.com", name: "Test McTester" }], ["+1 732 555 0102"]);
            await graph.users.getById(testUserName).contacts.getById(contact.data.id).update({ birthday: "1986-05-30" });
            const contact2 = await graph.users.getById(testUserName).contacts.getById(contact.data.id)();
            // Clean up the added contact
            await graph.users.getById(testUserName).contacts.getById(contact.data.id).delete();
            return expect(contact2.birthday).equals("1986-05-30T11:59:00Z");
        });

        it("Delete Contact", async function () {
            // Add a contact that we can then delete
            const contact = await graph.users.getById(testUserName).contacts.add("Test", "McTester", [{ address: "tmctester@contoso.onmicrosoft.com", name: "Test McTester" }], ["+1 732 555 0102"]);
            await graph.users.getById(testUserName).contacts.getById(contact.data.id).delete();
            let deletedUserFound = false;

            try {

                // If we try to find a user that doesn"t exist this returns a 404
                await graph.users.getById(testUserName).contacts.getById(contact.data.id)();
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
            const contactFolders = await graph.users.getById(testUserName).contactFolders();
            return expect(contactFolders.length).is.greaterThan(0);
        });

        it("Get Contact Folder By ID", async function () {
            const contactFolders = await graph.users.getById(testUserName).contactFolders.getById(testFolderID);
            return expect(contactFolders).is.not.null;
        });

        it("Add Contact Folder", async function () {
            const folder = await graph.users.getById(testUserName).contactFolders.add("Test Add Folder", rootFolderID);
            const folderAfterAdd = await graph.users.getById(testUserName).contactFolders.getById(folder.data.id)();
            // Clean up the added folder
            await graph.users.getById(testUserName).contactFolders.getById(folder.data.id).delete();
            return expect(folderAfterAdd).is.not.null;
        });

        it("Update Contact Folder", async function () {
            const folder = await graph.users.getById(testUserName).contactFolders.add("Test Add Folder", rootFolderID);
            await graph.users.getById(testUserName).contactFolders.getById(folder.data.id).update({ displayName: "Test Add Folder Updated" });
            const folderAfterUpdate = await graph.users.getById(testUserName).contactFolders.getById(folder.data.id)();
            // Clean up the added folder
            await graph.users.getById(testUserName).contactFolders.getById(folder.data.id).delete();
            return expect(folderAfterUpdate.displayName).equals("Test Add Folder Updated");
        });

        it("Delete Contact Folder", async function () {
            // Add a folder that we can then delete
            const folder = await graph.users.getById(testUserName).contactFolders.add("Test Add Folder", rootFolderID);
            await graph.users.getById(testUserName).contactFolders.getById(folder.data.id).delete();
            let deletedFolderFound = false;

            try {

                // If we try to find a folder that doesn"t exist this returns a 404
                await graph.users.getById(testUserName).contactFolders.getById(folder.data.id)();
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
            const contacts = await graph.users.getById(testUserName).contactFolders.getById(testFolderID).contacts();
            return expect(contacts.length).is.greaterThan(0);
        });

        it("Get Child Folders from Folder", async function () {
            const folders = await graph.users.getById(testUserName).contactFolders.getById(testFolderID).childFolders();
            return expect(folders.length).is.greaterThan(0);
        });

        it("Get Child Folders by ID", async function () {
            const childFolder = await graph.users.getById(testUserName).contactFolders.getById(testFolderID).childFolders.getById(subFolderID)();
            return expect(childFolder).is.not.null;
        });

        it("Add Contact to Child Folder", async function () {
            const contact = await graph.users.getById(testUserName).contactFolders.getById(testFolderID).childFolders.getById(subFolderID)
                .contacts.add("Test", "McTester", [{ address: "tmctester@contoso.onmicrosoft.com", name: "Test McTester" }], ["+1 732 555 0102"]);
            const contactAfterAdd = await graph.users.getById(testUserName).contactFolders.getById(testFolderID).childFolders.getById(subFolderID)
                .contacts.getById(contact.data.id)();
            // Clean up the added contact
            await graph.users.getById(testUserName).contactFolders.getById(testFolderID).childFolders.getById(subFolderID).contacts.getById(contact.data.id).delete();
            return expect(contactAfterAdd).is.not.null;
        });

        // Remove the test contact we created
        this.afterAll(async function () {
            await graph.users.getById(testUserName).contacts.getById(testContactID).delete();
            await graph.users.getById(testUserName).contactFolders.getById(testFolderID).delete();
        });
    }
});

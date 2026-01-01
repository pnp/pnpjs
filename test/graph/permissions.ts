import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/files";
import "@pnp/graph/permissions/drive-item";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { IFileUploadOptions } from "@pnp/graph/files";
import { IPermissionsInviteInfo } from "@pnp/graph/permissions/drive-item";
import { pnpTest } from "../pnp-test.js";

describe("Permissions", function () {
    let testUserName = "";
    let driveId = null;
    let fileId = null;
    let fileId2 = null;
    let permissionsId = null;

    const newPermissions: IPermissionsInviteInfo = {
        recipients: [{email: testUserName}],
        requireSignIn: true,
        sendInvitation: true,
        roles: ["read"],
    };

    // Ensure we have the data to test against
    before(pnpTest("46d7b0c9-fff9-43a1-a2e8-630086f6a087", async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        // Get a sample user
        try {
            const { filePathName } = await this.props({
                filePathName: `TestFile_${getRandomString(4)}.json`,
            });
            testUserName = this.pnp.settings.testUser.substring(this.pnp.settings.testUser.lastIndexOf("|") + 1);
            newPermissions.recipients[0].email = testUserName;
            const drives = await this.pnp.graph.users.getById(testUserName).drives();
            if (drives.length > 0) {
                driveId = drives[0].id;

                // upload a file
                const fileOptions: IFileUploadOptions = {
                    content: "This is some test content",
                    filePathName: filePathName,
                    contentType: "text/plain;charset=utf-8",
                };
                const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fileOptions);
                if (children != null) {
                    fileId = children.id;
                    const perms = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(fileId).permissions();
                    if(perms != null && perms.length > 0){
                        permissionsId = perms[0].id;
                    }
                }
            }
        } catch (err) {
            console.log("Could not retrieve user's drives");
        }
    }));

    after(pnpTest("f58d73c8-6d1d-497d-b561-6787a597dcb0",async function () {
        if (fileId) {
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(fileId).delete();
        }
        if(fileId2){
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(fileId2).delete();
        }
    }));

    describe("DriveItem", function () {
        it("List Permissions", pnpTest("fd495a8c-07e3-48ad-81d8-db06713b9813", async function () {
            if (stringIsNullOrEmpty(fileId)) {
                this.skip();
            }

            const permissions = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(fileId).permissions();
            expect(permissions).to.be.instanceOf(Array);
        }));

        it("Add Permissions", pnpTest("b12129fd-386d-4ca0-8f3c-64f6662adaa4", async function () {
            if (stringIsNullOrEmpty(fileId)) {
                this.skip();
            }

            const permissions = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(fileId).addPermissions(newPermissions);
            expect(permissions).to.be.instanceOf(Array);
        }));

        it("Get Permissions", pnpTest("e2344b84-e4ab-4b11-b8d5-9c5d8bd41f30", async function () {
            if (stringIsNullOrEmpty(fileId)) {
                this.skip();
            }

            const permissions = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(fileId).permissions.getById(permissionsId)();
            expect(permissions).to.haveOwnProperty("id");
        }));

        it("Update Permissions", pnpTest("559cb82b-5a7a-49cb-9562-b63e7cba6d3e", async function () {
            if (stringIsNullOrEmpty(fileId)) {
                this.skip();
            }

            const permissionUpdate = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(fileId)
                .permissions.getById(permissionsId).update({roles: ["write"]});
            expect(permissionUpdate).to.haveOwnProperty("id");
        }));

        it("Delete Permissions", pnpTest("be5e4fc2-24bc-4fa5-8ee9-8f8a4d5b1980", async function () {
            if (stringIsNullOrEmpty(fileId)) {
                this.skip();
            }
            const { filePathName } = await this.props({
                filePathName: `TestFile_${getRandomString(4)}.json`,
            });
            const fileOptions: IFileUploadOptions = {
                content: "This is some test content",
                filePathName: filePathName,
                contentType: "text/plain;charset=utf-8",
            };
            const newFile = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fileOptions);
            let success = false;
            if(newFile != null){
                fileId2 = newFile.id;
                const permissions = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(fileId).addPermissions(newPermissions);
                if(permissions != null){
                    try{
                        await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(fileId).permissions.getById(permissions[0].id).delete();
                        success = true;
                    }catch(err){
                        // ignore
                    }
                }
            }
            expect(success).to.equal(true);
        }));
    });
});

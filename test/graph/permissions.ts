import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/files";
import "@pnp/graph/permissions/drive-item";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { IFileUploadOptions } from "@pnp/graph/files";
import { IPermissionsInviteInfo } from "@pnp/graph/permissions/drive-item";

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
    before(async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        // Get a sample user
        try {
            testUserName = this.pnp.settings.testUser.substring(this.pnp.settings.testUser.lastIndexOf("|") + 1);
            newPermissions.recipients[0].email = testUserName;
            const drives = await this.pnp.graph.users.getById(testUserName).drives();
            if (drives.length > 0) {
                driveId = drives[0].id;

                // upload a file
                const fileOptions: IFileUploadOptions = {
                    content: "This is some test content",
                    filePathName: `TestFile_${getRandomString(4)}.json`,
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
    });

    after(async function () {
        if (fileId) {
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(fileId).delete();
        }
        if(fileId2){
            await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(fileId2).delete();
        }
    });

    describe("DriveItem", function () {
        it("List Permissions", async function () {
            if (stringIsNullOrEmpty(fileId)) {
                this.skip();
            }

            const permissions = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(fileId).permissions();
            expect(permissions).to.be.instanceOf(Array);
        });

        it("Add Permissions", async function () {
            if (stringIsNullOrEmpty(fileId)) {
                this.skip();
            }

            const permissions = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(fileId).addPermissions(newPermissions);
            expect(permissions).to.be.instanceOf(Array);
        });

        it("Get Permissions", async function () {
            if (stringIsNullOrEmpty(fileId)) {
                this.skip();
            }

            const permissions = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(fileId).permissions.getById(permissionsId)();
            expect(permissions).to.haveOwnProperty("id");
        });

        it("Update Permissions", async function () {
            if (stringIsNullOrEmpty(fileId)) {
                this.skip();
            }

            const permissionUpdate = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(fileId)
                .permissions.getById(permissionsId).update({roles: ["write"]});
            expect(permissionUpdate).to.haveOwnProperty("id");
        });

        it("Delete Permissions", async function () {
            if (stringIsNullOrEmpty(fileId)) {
                this.skip();
            }
            const fileOptions: IFileUploadOptions = {
                content: "This is some test content",
                filePathName: `TestFile_${getRandomString(4)}.json`,
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
        });
    });
});

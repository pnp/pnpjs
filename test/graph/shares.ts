import { expect } from "chai";
import "@pnp/graph/shares";
import "@pnp/graph/users";
import "@pnp/graph/files";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { IFileUploadOptions } from "@pnp/graph/files";
import { ICreateShareLinkInfo, IShareLinkAccessInfo } from "@pnp/graph/shares";
import { DriveItem } from "@microsoft/microsoft-graph-types";

describe("Shares", function () {

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    it("encodeSharingLink", async function () {

        const link = this.pnp.graph.shares.encodeSharingLink("https://something.sharepoint.com/sites/site/shared documents/something.docx");

        return expect(link).to.eq("u!aHR0cHM6Ly9zb21ldGhpbmcuc2hhcmVwb2ludC5jb20vc2l0ZXMvc2l0ZS9zaGFyZWQgZG9jdW1lbnRzL3NvbWV0aGluZy5kb2N4");
    });

    it("encodeSharingLink %20", async function () {

        const link = this.pnp.graph.shares.encodeSharingLink("https://something.sharepoint.com/sites/site/shared%20documents/something.docx");

        return expect(link).to.eq("u!aHR0cHM6Ly9zb21ldGhpbmcuc2hhcmVwb2ludC5jb20vc2l0ZXMvc2l0ZS9zaGFyZWQlMjBkb2N1bWVudHMvc29tZXRoaW5nLmRvY3g");
    });

    describe("Drive Item", function () {
        let testUserName = "";
        let driveId = null;
        let fileId = null;

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

                    // upload a file
                    const fileOptions: IFileUploadOptions = {
                        content: "This is some test content",
                        filePathName: `TestFile_${getRandomString(4)}.json`,
                        contentType: "text/plain;charset=utf-8",
                    };
                    const children = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).root.upload(fileOptions);
                    if (children != null) {
                        fileId = children.id;
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
        });

        it("Create Sharing Link", async function () {
            if (stringIsNullOrEmpty(fileId)) {
                this.skip();
            }

            const sharingLinkInfo: ICreateShareLinkInfo = {
                type: "view",
                scope: "anonymous",
            };
            const sharingLink = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(fileId).createSharingLink(sharingLinkInfo);
            expect(sharingLink).to.haveOwnProperty("id");
        });

        it("Grant Sharing Link Access", async function () {
            if (stringIsNullOrEmpty(fileId)) {
                this.skip();
            }

            const driveItem: DriveItem = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(fileId)();
            const shareLink: string = this.pnp.graph.shares.encodeSharingLink(driveItem.webUrl);
            const sharingLinkAccess: IShareLinkAccessInfo = {
                encodedSharingUrl: shareLink,
                recipients: [{email: testUserName}],
                roles: ["read"],
            };
            const permissions = await this.pnp.graph.shares.grantSharingLinkAccess(sharingLinkAccess);
            expect(permissions).to.be.instanceOf(Array);
        });

        it("Use Sharing Link", async function () {
            if (stringIsNullOrEmpty(fileId)) {
                this.skip();
            }

            const driveItem: DriveItem = await this.pnp.graph.users.getById(testUserName).drives.getById(driveId).getItemById(fileId)();
            const shareLink: string = this.pnp.graph.shares.encodeSharingLink(driveItem.webUrl);
            const shareLinkInfo = {
                encodedSharingUrl: shareLink,
                redeemSharingLink: false,
            };
            const sharedDriveItem = await this.pnp.graph.shares.useSharingLink(shareLinkInfo);
            expect(sharedDriveItem).to.haveOwnProperty("id");
        });
    });
});

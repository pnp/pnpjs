import { expect } from "chai";
import getValidUser from "./utilities/getValidUser.js";
import "@pnp/graph/users";
import "@pnp/graph/teams";
import "@pnp/graph/conversations";
import "@pnp/graph/attachments";
import { getRandomString } from "@pnp/core";
import { Message } from "@microsoft/microsoft-graph-types";
import { pnpTest } from "../pnp-test.js";

describe.skip("Attachments", function () {
    let testUserName = "";
    let groupId = "";
    let inboxFolder = null;

    const draftMessage: Message = {
        subject: "PnPjs Test Message",
        importance: "low",
        body: {
            contentType: "html",
            content: "This is a test message!",
        },
        toRecipients: [
            {
                emailAddress: {
                    address: "AdeleV@contoso.onmicrosoft.com",
                },
            },
        ],
    };

    before(pnpTest("12ead5c5-c74c-4534-b740-3deedddc61e5", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
        const userInfo = await getValidUser.call(this);
        testUserName = userInfo.userPrincipalName;
        inboxFolder = this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox");
        const groups = await this.pnp.graph.users.getById(testUserName).joinedTeams();
        if (groups.length > 0) {
            groupId = groups[0].id;
        } else {
            this.skip();
        }
    }));

    describe.skip("Post", function () {
        it("post getById", pnpTest("0289c94c-e905-4716-9320-aaddc3f57312", async function () {
            const conversations = await this.pnp.graph.groups.getById(groupId).conversations();
            const convThreads = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads();
            const threadPost = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads.getById(convThreads[0].id).posts();
            const post = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id)
                .threads.getById(convThreads[0].id).posts.getById(threadPost[0].id)();
            return expect(post).to.have.property("id");
        }));

        // Remaining endpoints not supported by app permissions
    });

    describe.skip("Message", function () {
        it("list", pnpTest("50651f03-704a-4389-b587-14e7ea049da0", async function () {
            const draft = await inboxFolder.messages.add(draftMessage);
            const { fileName } = await this.props({
                fileName: getRandomString(8) + ".txt",
            });
            await inboxFolder.messages.getById(draft.id).attachments.addFile(fileName, "VGhpcyBpcyBhIGZpbGUgdG8gYmUgYXR0YWNoZWQu");
            const attachments = await inboxFolder.messages.getById(draft.id).attachments();
            return expect(attachments).to.have.length.greaterThan(0);
        }));

        it("getById", pnpTest("e2abb5ae-5981-4388-bc8e-69b9f0a70cb9", async function () {
            const draft = await inboxFolder.messages.add(draftMessage);
            const { fileName } = await this.props({
                fileName: getRandomString(8) + ".txt",
            });
            const attachment = await inboxFolder.messages.getById(draft.id).attachments.addFile(fileName, "This is a test attachment");
            return expect(attachment).to.have.property("id");
        }));

        // Remaining endpoints not supported by app permissions
    });
});

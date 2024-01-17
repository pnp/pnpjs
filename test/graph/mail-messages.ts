import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/mail";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import getValidUser from "./utilities/getValidUser.js";
import { Message, MailFolder as IMailFolderType } from "@microsoft/microsoft-graph-types";

describe("Mail: Messages", function () {
    let testUserName = "";
    let inboxFolder = null;
    let draftFolder = null;

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

    // Ensure we have the data to test against
    before(async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const userInfo = await getValidUser.call(this);
        testUserName = userInfo.userPrincipalName;
        draftMessage.toRecipients[0].emailAddress.address = testUserName;
        const mailFolders: IMailFolderType[] = await this.pnp.graph.users.getById(testUserName).mailFolders();
        if (mailFolders.length >= 0) {
            const inbox = mailFolders.find((f) => f.displayName === "Inbox");
            inboxFolder = inbox?.id || mailFolders[0].id;
            const draft = mailFolders.find((f) => f.displayName === "Draft");
            draftFolder = draft?.id || mailFolders[0].id;
        }

        if (inboxFolder === null || draftFolder === null) {
            this.skip();
        }
    });

    // Clean up testing categories
    after(async function () {
        if (!stringIsNullOrEmpty(testUserName)) {
            // TBD
        }
        return;
    });

    it("Mail: Message List", async function () {
        const messages = await this.pnp.graph.users.getById(testUserName).messages();
        return expect(messages).is.not.null;
    });

    it("Mail: Message List (Delta)", async function () {
        const messagesDelta = await this.pnp.graph.users.getById(testUserName).mailFolders.getById(inboxFolder).messages.delta()();
        return expect(messagesDelta).haveOwnProperty("values");
    });

    it("Mail: Create Draft Message", async function () {
        const m = JSON.parse(JSON.stringify(draftMessage));
        m.subject = `PnPjs Test Message ${getRandomString(8)}`;
        const draft = await this.pnp.graph.users.getById(testUserName).messages.add(m);
        const success = (draft !== null);
        if (success) {
            await this.pnp.graph.users.getById(testUserName).messages.getById(draft.id).delete();
        }
        return expect(success).to.be.true;
    });

    it("Mail: Update Message", async function () {
        const m = JSON.parse(JSON.stringify(draftMessage));
        const newSubject = `PnPjs Test Message ${getRandomString(8)}`;
        m.subject = `PnPjs Test Message ${getRandomString(8)}`;
        const draft = await this.pnp.graph.users.getById(testUserName).messages.add(m);
        let success = false;
        if (draft !== null) {
            const update = await this.pnp.graph.users.getById(testUserName).messages.getById(draft.id).update({ subject: newSubject });
            if (update !== null) {
                success = (update.subject === newSubject);
                await this.pnp.graph.users.getById(testUserName).messages.getById(update.id).delete();
            }
        }
        return expect(success).to.be.true;
    });

    it("Mail: Delete Message", async function () {
        const m = JSON.parse(JSON.stringify(draftMessage));
        const draft = await this.pnp.graph.users.getById(testUserName).messages.add(m);
        let success = false;
        if (draft !== null) {
            await this.pnp.graph.users.getById(testUserName).messages.getById(draft.id).delete();
            try {
                const found = await this.pnp.graph.users.getById(testUserName).messages.getById(draft.id)();
                if (found?.id === null) {
                    success = true;
                }
            } catch (e) {
                success = true;
            }
        }
        return expect(success).to.be.true;
    });

    it("Mail: Copy Message", async function () {
        const m = JSON.parse(JSON.stringify(draftMessage));
        m.subject = `PnPjs Test Message ${getRandomString(8)}`;
        const draft = await this.pnp.graph.users.getById(testUserName).messages.add(m);
        let success = false;
        if (draft !== null) {
            const messageCopy = await this.pnp.graph.users.getById(testUserName).messages.getById(draft.id).copy(inboxFolder);
            if (messageCopy !== null) {
                success = true;
                await this.pnp.graph.users.getById(testUserName).messages.getById(messageCopy.id).delete();
            }
        }
        return expect(success).to.be.true;
    });

    it("Mail: Move Message", async function () {
        const m = JSON.parse(JSON.stringify(draftMessage));
        m.subject = `PnPjs Test Message ${getRandomString(8)}`;
        const draft: Message = await this.pnp.graph.users.getById(testUserName).messages.add(m);
        let success = false;
        if (draft !== null) {
            const messageMove = await this.pnp.graph.users.getById(testUserName).messages.getById(draft.id).move(inboxFolder);
            if (messageMove !== null) {
                success = (messageMove.subject === draft.subject);
                await this.pnp.graph.users.getById(testUserName).messages.getById(messageMove.id).delete();
            }
        }
        return expect(success).to.be.true;
    });

    it("Mail: Send Draft Message", async function () {
        const m = JSON.parse(JSON.stringify(draftMessage));
        m.subject = `PnPjs Test Message ${getRandomString(8)}`;
        const draft = await this.pnp.graph.users.getById(testUserName).messages.add(m);
        if (draft !== null) {
            await this.pnp.graph.users.getById(testUserName).messages.getById(draft.id).send();
            return true;
        } else {
            return false;
        }
    });

    it.only("Mail: Send Message", async function () {
        const m = JSON.parse(JSON.stringify(draftMessage));
        m.subject = `PnPjs Test Message ${getRandomString(8)}`;
        let success = false;
        try{
            await this.pnp.graph.users.getById(testUserName).sendMail(m);
            success = true;
        }catch(err){
            // do nothing
        }
        return success;
    });

    it.only("Mail: Create Draft Reply Message", async function () {
        const inboxMessage = await this.pnp.graph.users.getById(testUserName).mailFolders.getById(inboxFolder).messages.top(1)();
        if (inboxMessage.length === 1) {
            const m = JSON.parse(JSON.stringify(draftMessage));
            m.subject = `PnPjs Test Message ${getRandomString(8)}`;
            let success = false;
            const draft = await this.pnp.graph.users.getById(testUserName).messages.getById(inboxMessage[0].id).createReply(m);
            if (draft !== null) {
                success = true;
                await this.pnp.graph.users.getById(testUserName).messages.getById(draft.id).delete();
            }
            return success;
        } else {
            this.skip();
        }
    });

    it.skip("Mail: Send Reply Message", async function () {
        // Skipping because it would possibly send an email to someone who didn't expect it
    });

    it("Mail: Create Draft Reply-All Message", async function () {
        const inboxMessage = await this.pnp.graph.users.getById(testUserName).mailFolders.getById(inboxFolder).messages.top(1)();
        if (inboxMessage.length === 1) {
            const m = JSON.parse(JSON.stringify(draftMessage));
            m.subject = `PnPjs Test Message ${getRandomString(8)}`;
            let success = false;
            const draft = await this.pnp.graph.users.getById(testUserName).messages.getById(inboxMessage[0].id).createReplyAll(m);
            if (draft !== null) {
                success = true;
                await this.pnp.graph.users.getById(testUserName).messages.getById(draft.id).delete();
            }
            return success;
        } else {
            this.skip();
        }
    });

    it.skip("Mail: Send Reply-All Message", async function () {
        // Skipping because it would possibly send an email to someone who didn't expect it
    });

    it("Mail: Create Draft Forward Message", async function () {
        const inboxMessage = await this.pnp.graph.users.getById(testUserName).mailFolders.getById(inboxFolder).messages.top(1)();
        if (inboxMessage.length === 1) {
            const m = JSON.parse(JSON.stringify(draftMessage));
            m.subject = `PnPjs Test Message ${getRandomString(8)}`;
            let success = false;
            const draft = await this.pnp.graph.users.getById(testUserName).messages.getById(inboxMessage[0].id).createForward(m);
            if (draft !== null) {
                success = true;
                await this.pnp.graph.users.getById(testUserName).messages.getById(draft.id).delete();
            }
            return success;
        } else {
            this.skip();
        }
    });

    it.skip("Mail: Forward Message", async function () {
        // Skipping because it would possibly send an email to someone who didn't expect it
    });
});

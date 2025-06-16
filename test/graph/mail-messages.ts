import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/mail";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import getValidUser from "./utilities/getValidUser.js";
import { Message, MailFolder as IMailFolderType } from "@microsoft/microsoft-graph-types";
import { IUser } from "@pnp/graph/users";
import { pnpTest } from "../pnp-test.js";

describe("Mail: Messages", function () {
    let user: IUser;
    let testUserName: string;
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
    before(pnpTest("47ded367-b05b-4954-9193-6df3c3bdeacc", async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const userInfo = await getValidUser.call(this);
        user = this.pnp.graph.users.getById(userInfo.userPrincipalName);
        testUserName = userInfo.userPrincipalName;
        draftMessage.toRecipients[0].emailAddress.address = testUserName;
        const mailFolders: IMailFolderType[] = await user.mailFolders();
        if (mailFolders.length >= 0) {
            const inbox = mailFolders.find((f) => f.displayName === "Inbox");
            inboxFolder = inbox?.id || mailFolders[0].id;
            const draft = mailFolders.find((f) => f.displayName === "Draft");
            draftFolder = draft?.id || mailFolders[0].id;
        }

        if (inboxFolder === null || draftFolder === null) {
            this.skip();
        }
    }));

    // Clean up testing categories
    after(pnpTest("704918c9-f477-461d-a2c9-85d291af98f4",async function () {
        if (!stringIsNullOrEmpty(testUserName)) {
            // TBD
        }
        return;
    }));

    it("Mail: Message List", pnpTest("f54f0b65-bab0-45eb-9c84-97f74c304277", async function () {
        const messages = await user.messages();
        return expect(messages).is.not.null;
    }));

    it("Mail: Message List (Delta)", pnpTest("b4e6dd84-904e-4d04-9f93-63f526a6f26c", async function () {
        const messagesDelta = await user.mailFolders.getById(inboxFolder).messages.delta()();
        return expect(messagesDelta).haveOwnProperty("values");
    }));

    it("Mail: Create Draft Message", pnpTest("eebab11f-dc18-47b6-a89e-444e7ba8810c", async function () {
        const { subject } = await this.props({
            subject: `PnPjs Test Message ${getRandomString(8)}`,
        });
        const m = JSON.parse(JSON.stringify(draftMessage));
        m.subject = subject;
        const draft = await user.messages.add(m);
        const success = (draft !== null);
        if (success) {
            await user.messages.getById(draft.id).delete();
        }
        return expect(success).to.be.true;
    }));

    it("Mail: Update Message", pnpTest("6fdb0048-ce5d-47be-b8ea-676df1e05627", async function () {
        const { subject, newSubjectValue } = await this.props({
            subject: `PnPjs Test Message ${getRandomString(8)}`,
            newSubjectValue: `PnPjs Test Message ${getRandomString(8)}`,
        });
        const m = JSON.parse(JSON.stringify(draftMessage));
        const newSubject = newSubjectValue;
        m.subject = subject;
        const draft = await user.messages.add(m);
        let success = false;
        if (draft !== null) {
            const update = await user.messages.getById(draft.id).update({ subject: newSubject });
            if (update !== null) {
                success = (update.subject === newSubject);
                await user.messages.getById(update.id).delete();
            }
        }
        return expect(success).to.be.true;
    }));

    // This logs to the console when it passes, ignore those messages
    it("Mail: Delete Message", pnpTest("22fbad00-ad2c-4836-a647-cffc6afefc3d", async function () {
        const m = JSON.parse(JSON.stringify(draftMessage));
        const draft = await user.messages.add(m);
        let success = false;
        if (draft !== null) {
            await user.messages.getById(draft.id).delete();
            try {
                const found = await user.messages.getById(draft.id)();
                if (found?.id === null) {
                    success = true;
                }
            } catch (e) {
                success = true;
            }
        }
        return expect(success).to.be.true;
    }));

    it("Mail: Copy Message", pnpTest("b38f9559-55ba-4cb9-8e3d-fa9cd6a14a69", async function () {
        const { subject } = await this.props({
            subject: `PnPjs Test Message ${getRandomString(8)}`,
        });
        const m = JSON.parse(JSON.stringify(draftMessage));
        m.subject = subject;
        const draft = await user.messages.add(m);
        let success = false;
        if (draft !== null) {
            const messageCopy = await user.messages.getById(draft.id).copy(inboxFolder);
            if (messageCopy !== null) {
                success = true;
                await user.messages.getById(messageCopy.id).delete();
            }
        }
        return expect(success).to.be.true;
    }));

    it("Mail: Move Message", pnpTest("b3a7a5bf-f229-4b28-a89c-f4de9d8d7387", async function () {
        const { subject } = await this.props({
            subject: `PnPjs Test Message ${getRandomString(8)}`,
        });
        const m = JSON.parse(JSON.stringify(draftMessage));
        m.subject = subject;
        const draft: Message = await user.messages.add(m);
        let success = false;
        if (draft !== null) {
            const messageMove = await user.messages.getById(draft.id).move(inboxFolder);
            if (messageMove !== null) {
                success = (messageMove.subject === draft.subject);
                await user.messages.getById(messageMove.id).delete();
            }
        }
        return expect(success).to.be.true;
    }));

    // Do not test sending draft message

    it.skip("Mail: Send Draft Message", pnpTest("7d656e0e-0d21-447f-ab3d-5e7af3da8d10", async function () {
        const { subject } = await this.props({
            subject: `PnPjs Test Message ${getRandomString(8)}`,
        });
        const m = JSON.parse(JSON.stringify(draftMessage));
        m.subject = subject;
        const draft = await user.messages.add(m);
        if (draft !== null) {
            await user.messages.getById(draft.id).send();
            return true;
        } else {
            return false;
        }
    }));

    it("Mail: Send Message", pnpTest("ec3603e2-ef75-482a-9e78-d30589524f17", async function () {
        const { subject } = await this.props({
            subject: `PnPjs Test Message ${getRandomString(8)}`,
        });
        const m = JSON.parse(JSON.stringify(draftMessage));
        m.subject = subject;
        let success = false;
        try{
            await user.sendMail(m, false);
            success = true;
        }catch(err){
            // do nothing
        }
        return success;
    }));

    // Cannot guarantee that there is email message in the inbox suitable to reply to
    it.skip("Mail: Create Draft Reply Message", pnpTest("5462c883-afb2-4496-b757-c276f6fcce74", async function () {
        const inboxMessage = await user.mailFolders.getById(inboxFolder).messages.top(1)();
        if (inboxMessage.length === 1) {
            let success = false;
            const draft = await user.messages.getById(inboxMessage[0].id).createReply();
            if (draft !== null) {
                success = true;
                await user.messages.getById(draft.id).delete();
            }
            return success;
        } else {
            this.skip();
        }
    }));

    it.skip("Mail: Send Reply Message", pnpTest("56d1aedc-c678-4c68-a79f-b700799e091f", async function () {
        // Skipping because it would possibly send an email to someone who didn't expect it
    }));

    // Cannot guarantee that there is email message in the inbox suitable to reply to
    it.skip("Mail: Create Draft Reply-All Message", pnpTest("2a342b68-eba8-4b1e-ae48-6ce7ac9da8f9", async function () {
        const inboxMessage = await user.mailFolders.getById(inboxFolder).messages.top(1)();
        if (inboxMessage.length === 1) {
            let success = false;
            const draft = await user.messages.getById(inboxMessage[0].id).createReplyAll();
            if (draft !== null) {
                success = true;
                await user.messages.getById(draft.id).delete();
            }
            return success;
        } else {
            this.skip();
        }
    }));

    it.skip("Mail: Send Reply-All Message", pnpTest("03d5043a-803b-42c1-9dfa-d835f8f79b9c", async function () {
        // Skipping because it would possibly send an email to someone who didn't expect it
    }));

    it("Mail: Create Draft Forward Message", pnpTest("72c377be-8554-4ebd-99b6-31f36967730c", async function () {
        const { subject } = await this.props({
            subject: `PnPjs Test Message ${getRandomString(8)}`,
        });
        const inboxMessage = await user.mailFolders.getById(inboxFolder).messages.top(1)();
        if (inboxMessage.length === 1) {
            const m = JSON.parse(JSON.stringify(draftMessage));
            m.subject = subject;
            let success = false;
            const draft = await user.messages.getById(inboxMessage[0].id).createForward(m);
            if (draft !== null) {
                success = true;
                await user.messages.getById(draft.id).delete();
            }
            return success;
        } else {
            this.skip();
        }
    }));

    it.skip("Mail: Forward Message", pnpTest("a87d1b71-4fc3-43c0-b020-fb50c0966bed", async function () {
        // Skipping because it would possibly send an email to someone who didn't expect it
    }));
});

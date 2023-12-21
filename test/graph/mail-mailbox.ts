import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/mail";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import getValidUser from "./utilities/getValidUser.js";
import { InferenceClassificationOverride } from "@microsoft/microsoft-graph-types";

describe("Mail: Mailbox", function () {
    const testName = "PnP Test Override";
    const testEmail = "!@contoso.onmicrosoft.com";
    let testUserName = "";

    const override: InferenceClassificationOverride = {
        classifyAs: "focused",
        senderEmailAddress: {
            name: testName,
            address: testEmail,
        },
    };

    // Ensure we have the data to test against
    before(async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const userInfo = await getValidUser.call(this);
        testUserName = userInfo.userPrincipalName;
    });

    // Clean up testing folders
    after(async function () {
        if (!stringIsNullOrEmpty(testUserName)) {
            // TBD
        }
        return;
    });

    it("Mailbox: Settings", async function () {
        const settings = await this.pnp.graph.users.getById(testUserName).mailboxSettings();
        return expect(settings).is.not.null;
    });

    it("Mailbox: AutomaticRepliesSetting", async function () {
        const settings = await this.pnp.graph.users.getById(testUserName).mailboxSettings.automaticRepliesSetting();
        return expect(settings).is.not.null;
    });

    it("Mailbox: dateFormat setting", async function () {
        const settings = await this.pnp.graph.users.getById(testUserName).mailboxSettings.dateFormat();
        return expect(settings).is.not.null;
    });

    // DOCUMENTED BUT NOT IMPLEMENTED
    it.skip("Mailbox: delegateMeetingMessageDeliveryOptions setting", async function () {
        // const settings = await this.pnp.graph.users.getById(testUserName).mailboxSettings.delegateMeetingMessageDeliveryOptions();
        // return expect(settings).is.not.null;
    });

    it("Mailbox: language setting", async function () {
        const settings = await this.pnp.graph.users.getById(testUserName).mailboxSettings.language();
        return expect(settings).is.not.null;
    });

    it("Mailbox: timeFormat setting", async function () {
        const settings = await this.pnp.graph.users.getById(testUserName).mailboxSettings.timeFormat();
        return expect(settings).is.not.null;
    });

    it("Mailbox: timeZone setting", async function () {
        const settings = await this.pnp.graph.users.getById(testUserName).mailboxSettings.timeZone();
        return expect(settings).is.not.null;
    });

    it("Mailbox: workingHours setting", async function () {
        const settings = await this.pnp.graph.users.getById(testUserName).mailboxSettings.workingHours();
        return expect(settings).is.not.null;
    });

    it("Mailbox: userPurpose setting", async function () {
        const settings = await this.pnp.graph.users.getById(testUserName).mailboxSettings.userPurpose();
        return expect(settings).is.not.null;
    });

    it("Mailbox: Focused Inbox Overrides", async function () {
        const fio = await this.pnp.graph.users.getById(testUserName).focusedInboxOverrides();
        return expect(fio).is.not.null;
    });

    it("Mailbox: Get Focused Inbox Override", async function () {
        const f: InferenceClassificationOverride = JSON.parse(JSON.stringify(override));
        f.senderEmailAddress.name = `${testName} ${getRandomString(8)}`;
        f.senderEmailAddress.address = testEmail.replace("!",getRandomString(8));
        const fio = await this.pnp.graph.users.getById(testUserName).focusedInboxOverrides.add(f);
        let success = false;
        if (fio !== null) {
            const getFIO = await this.pnp.graph.users.getById(testUserName).focusedInboxOverrides.getById(fio.id)();
            if(getFIO !== null) {
                success = (getFIO.senderEmailAddress.name === f.senderEmailAddress.name);
                await this.pnp.graph.users.getById(testUserName).focusedInboxOverrides.getById(fio.id).delete();
            }
        }
        return expect(success).to.be.true;
    });

    it("Mailbox: Add Focused Inbox Override", async function () {
        const f: InferenceClassificationOverride = JSON.parse(JSON.stringify(override));
        f.senderEmailAddress.name = `${testName} ${getRandomString(8)}`;
        f.senderEmailAddress.address = testEmail.replace("!",getRandomString(8));
        const fio = await this.pnp.graph.users.getById(testUserName).focusedInboxOverrides.add(f);
        const success = (fio !== null);
        if (success) {
            await this.pnp.graph.users.getById(testUserName).focusedInboxOverrides.getById(fio.id).delete();
        }
        return expect(success).to.be.true;
    });

    it("Mailbox: Update Focused Inbox Override", async function () {
        const f: InferenceClassificationOverride = JSON.parse(JSON.stringify(override));
        f.senderEmailAddress.name = `${testName} ${getRandomString(8)}`;
        f.senderEmailAddress.address = testEmail.replace("!",getRandomString(8));
        const fio = await this.pnp.graph.users.getById(testUserName).focusedInboxOverrides.add(f);
        const newName = `${testName} ${getRandomString(8)}`;
        let success = false;
        if (fio !== null) {
            const update = await this.pnp.graph.users.getById(testUserName).focusedInboxOverrides.getById(fio.id)
                .update({ senderEmailAddress: { name: newName }});
            if (update !== null) {
                success = (update.senderEmailAddress.name === newName);
                await this.pnp.graph.users.getById(testUserName).focusedInboxOverrides.getById(update.id).delete();
            }
        }
        return expect(success).to.be.true;
    });

    it("Mailbox: Delete Focused Inbox Override", async function () {
        const f: InferenceClassificationOverride = JSON.parse(JSON.stringify(override));
        f.senderEmailAddress.name = `${testName} ${getRandomString(8)}`;
        f.senderEmailAddress.address = testEmail.replace("!",getRandomString(8));
        const fio = await this.pnp.graph.users.getById(testUserName).focusedInboxOverrides.add(f);
        let success = false;
        if (fio !== null) {
            await this.pnp.graph.users.getById(testUserName).focusedInboxOverrides.getById(fio.id).delete();
            try {
                const found = await this.pnp.graph.users.getById(testUserName).focusedInboxOverrides.getById(fio.id)();
                if (found?.id === null) {
                    success = true;
                }
            } catch (e) {
                success = true;
            }
        }
        return expect(success).to.be.true;
    });
});


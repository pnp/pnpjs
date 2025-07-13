import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/mail";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import getValidUser from "./utilities/getValidUser.js";
import { InferenceClassificationOverride } from "@microsoft/microsoft-graph-types";
import { pnpTest } from "../pnp-test.js";

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
    before(pnpTest("a96035f6-b728-441c-9fb0-b2e0c91ca165", async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const userInfo = await getValidUser.call(this);
        testUserName = userInfo.userPrincipalName;
    }));

    // Clean up testing folders
    after(pnpTest("5b7f8890-1776-41fe-8590-8958d3b01722", async function () {
        if (!stringIsNullOrEmpty(testUserName)) {
            // TBD
        }
        return;
    }));

    it("Mailbox: Settings", pnpTest("459ba8c1-f23e-422d-93dc-f45e9c602d69", async function () {
        const settings = await this.pnp.graph.users.getById(testUserName).mailboxSettings();
        return expect(settings).is.not.null;
    }));

    it("Mailbox: AutomaticRepliesSetting", pnpTest("6a5f0ed9-2b9d-4d3e-a152-f039a918ba5c", async function () {
        const settings = await this.pnp.graph.users.getById(testUserName).mailboxSettings.automaticRepliesSetting();
        return expect(settings).is.not.null;
    }));

    it("Mailbox: dateFormat setting", pnpTest("aa3fb833-1730-4f35-856c-d26520d61985", async function () {
        const settings = await this.pnp.graph.users.getById(testUserName).mailboxSettings.dateFormat();
        return expect(settings).is.not.null;
    }));

    // DOCUMENTED BUT NOT IMPLEMENTED
    it.skip("Mailbox: delegateMeetingMessageDeliveryOptions setting", pnpTest("74a07ef6-5909-4cee-bb06-561c2f0737c3", async function () {
        // const settings = await this.pnp.graph.users.getById(testUserName).mailboxSettings.delegateMeetingMessageDeliveryOptions();
        // return expect(settings).is.not.null;
    }));

    it("Mailbox: language setting", pnpTest("c287d31c-7281-41b5-814c-c624bb052f44", async function () {
        const settings = await this.pnp.graph.users.getById(testUserName).mailboxSettings.language();
        return expect(settings).is.not.null;
    }));

    it("Mailbox: timeFormat setting", pnpTest("80dd6a18-95a2-42bf-bdfc-f8f9d85fe31a", async function () {
        const settings = await this.pnp.graph.users.getById(testUserName).mailboxSettings.timeFormat();
        return expect(settings).is.not.null;
    }));

    it("Mailbox: timeZone setting", pnpTest("0df590f7-f2bc-4737-b89b-90c3e36a5861", async function () {
        const settings = await this.pnp.graph.users.getById(testUserName).mailboxSettings.timeZone();
        return expect(settings).is.not.null;
    }));

    it("Mailbox: workingHours setting", pnpTest("31015d16-8108-4d40-abcf-7dc364224c98", async function () {
        const settings = await this.pnp.graph.users.getById(testUserName).mailboxSettings.workingHours();
        return expect(settings).is.not.null;
    }));

    it("Mailbox: userPurpose setting", pnpTest("2144e02b-74a7-4dc0-b5f3-a99c368e2a96", async function () {
        const settings = await this.pnp.graph.users.getById(testUserName).mailboxSettings.userPurpose();
        return expect(settings).is.not.null;
    }));

    it("Mailbox: Focused Inbox Overrides", pnpTest("6010db16-ab96-4dbe-93ff-182f9cf7d9d5", async function () {
        const fio = await this.pnp.graph.users.getById(testUserName).focusedInboxOverrides();
        return expect(fio).is.not.null;
    }));

    it("Mailbox: Get Focused Inbox Override", pnpTest("415d9b0f-576e-4ec2-8551-bbc8a97303a0", async function () {
        const { name, address } = await this.props({
            name: `${testName} ${getRandomString(8)}`,
            address: testEmail.replace("!", getRandomString(8)),
        });
        const f: InferenceClassificationOverride = JSON.parse(JSON.stringify(override));
        f.senderEmailAddress.name = name;
        f.senderEmailAddress.address = address;
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
    }));

    it("Mailbox: Add Focused Inbox Override", pnpTest("cd9ddf41-2d77-4bfd-b845-67b367506fad", async function () {
        const { name, address } = await this.props({
            name: `${testName} ${getRandomString(8)}`,
            address: testEmail.replace("!", getRandomString(8)),
        });
        const f: InferenceClassificationOverride = JSON.parse(JSON.stringify(override));
        f.senderEmailAddress.name = name;
        f.senderEmailAddress.address = address;
        const fio = await this.pnp.graph.users.getById(testUserName).focusedInboxOverrides.add(f);
        const success = (fio !== null);
        if (success) {
            await this.pnp.graph.users.getById(testUserName).focusedInboxOverrides.getById(fio.id).delete();
        }
        return expect(success).to.be.true;
    }));

    it("Mailbox: Update Focused Inbox Override", pnpTest("3a237483-a539-430a-8624-730bb76210d3", async function () {
        const { name, address, newNameValue } = await this.props({
            name: `${testName} ${getRandomString(8)}`,
            address: testEmail.replace("!", getRandomString(8)),
            newNameValue: `${testName} ${getRandomString(8)}`,
        });
        const f: InferenceClassificationOverride = JSON.parse(JSON.stringify(override));
        f.senderEmailAddress.name = name;
        f.senderEmailAddress.address = address;
        const fio = await this.pnp.graph.users.getById(testUserName).focusedInboxOverrides.add(f);
        const newName = newNameValue;
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
    }));

    // This logs to the console when it passes, ignore those messages
    it("Mailbox: Delete Focused Inbox Override", pnpTest("220f68a1-37e8-4dfc-b4c6-0b31563c7ced", async function () {
        const { name, address } = await this.props({
            name: `${testName} ${getRandomString(8)}`,
            address: testEmail.replace("!", getRandomString(8)),
        });
        const f: InferenceClassificationOverride = JSON.parse(JSON.stringify(override));
        f.senderEmailAddress.name = name;
        f.senderEmailAddress.address = address;
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
    }));
});


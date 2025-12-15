import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/cloud-communications";
import { stringIsNullOrEmpty } from "@pnp/core";
import { pnpTest } from "../pnp-test.js";

describe("Cloud-Communications", function () {
    let testUserId = "";
    let sessionId = "";
    // Ensure we have the data to test against
    before(pnpTest("329be70e-cc70-472b-9f6f-53618f2300f1", async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }
        testUserId = (await this.pnp.graph.users.getById(this.pnp.settings.testUser.substring(this.pnp.settings.testUser.lastIndexOf("|") + 1))()).id;
        sessionId = this.pnp.settings.graph.msal.init.auth.clientId;
    }));

    it("Get User Presence", pnpTest("8a60995c-8c82-4a09-aebf-e04bb481448d", async function () {
        const presence = await this.pnp.graph.users.getById(testUserId).presence();
        return expect(presence).is.not.null;
    }));

    it("Get Presence for Multiple Users", pnpTest("aa03624e-acf5-4bcd-9929-627e369a7a37", async function () {
        const presence = await this.pnp.graph.communications.getPresencesByUserId([testUserId]);
        return expect(presence.length).is.equals(1);
    }));

    it("Set User Presence", pnpTest("094b8f49-226c-4e8c-ac05-97e1927366ec", async function () {
        let success = true;
        try {
            await this.pnp.graph.users.getById(testUserId).presence.setPresence({
                availability: "Busy",
                activity: "InACall",
                sessionId: sessionId,
                expirationDuration: "PT5M",
            });
        } catch (err) {
            success = false;
        }
        return expect(success).to.be.true;
    }));

    it("Clear User Presence", pnpTest("d812f0ad-8118-4020-814b-6f059ac73694", async function () {
        let success = true;
        try {
            await this.pnp.graph.users.getById(testUserId).presence.clearPresence(sessionId);
        } catch (err) {
            success = false;
        }
        return expect(success).to.be.true;
    }));

    it("Set User Preferred Presence", pnpTest("73c655af-cc10-4bb1-8c02-d63bbb3d3b6c", async function () {
        let success = true;
        try {
            await this.pnp.graph.users.getById(testUserId).presence.setPreferredPresence({
                availability: "Available",
                activity: "Available",
                expirationDuration: "PT5M",
            });
        } catch (err) {
            success = false;
        }
        return expect(success).to.be.true;
    }));

    it("Clear User Preferred Presence", pnpTest("9c60fdf5-d2eb-42d6-a21a-2c37ab0ac3b7", async function () {
        let success = true;
        try {
            await this.pnp.graph.users.getById(testUserId).presence.clearPreferredPresence();
        } catch (err) {
            success = false;
        }
        return expect(success).to.be.true;
    }));

    it("Set User Status Message", pnpTest("20ba764c-0393-4f86-aeca-f6b8ef36e0f6", async function () {
        let success = true;
        try {
            const date: Date = new Date();
            date.setDate(date.getDate() + 1);
            await this.pnp.graph.users.getById(testUserId).presence.setStatusMessage({
                message: {
                    content: "Test Sample Message",
                    contentType: "text",
                },
                expiryDateTime: {
                    dateTime: date.toISOString(),
                    timeZone: "Pacific Standard Time",
                },
            });
        } catch (err) {
            success = false;
        }
        return expect(success).to.be.true;
    }));
});

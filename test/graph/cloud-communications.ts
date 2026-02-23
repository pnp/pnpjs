import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/cloud-communications";
import { stringIsNullOrEmpty } from "@pnp/core";

describe("Cloud-Communications", function () {
    let testUserId = "";
    let sessionId = "";
    // Ensure we have the data to test against
    before(async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }
        testUserId = (await this.pnp.graph.users.getById(this.pnp.settings.testUser.substring(this.pnp.settings.testUser.lastIndexOf("|") + 1))()).id;
        sessionId = this.pnp.settings.graph.msal.init.auth.clientId;
    });

    it("Get User Presence", async function () {
        const presence = await this.pnp.graph.users.getById(testUserId).presence();
        return expect(presence).is.not.null;
    });

    it("Get Presence for Multiple Users", async function () {
        const presence = await this.pnp.graph.communications.getPresencesByUserId([testUserId]);
        return expect(presence.length).is.equals(1);
    });

    it("Set User Presence", async function () {
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
    });

    it("Clear User Presence", async function () {
        let success = true;
        try {
            await this.pnp.graph.users.getById(testUserId).presence.clearPresence(sessionId);
        } catch (err) {
            success = false;
        }
        return expect(success).to.be.true;
    });

    it("Set User Preferred Presence", async function () {
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
    });

    it("Clear User Preferred Presence", async function () {
        let success = true;
        try {
            await this.pnp.graph.users.getById(testUserId).presence.clearPreferredPresence();
        } catch (err) {
            success = false;
        }
        return expect(success).to.be.true;
    });

    it("Set User Status Message", async function () {
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
    });
});

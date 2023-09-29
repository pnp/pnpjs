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
        testUserId =  (await this.pnp.graph.users.getById(this.pnp.settings.testUser.substring(this.pnp.settings.testUser.lastIndexOf("|") + 1))()).id;
        sessionId = this.pnp.settings.graph.id;
    });

    it.skip("Get User Presence", async function () {
        const presence = await this.pnp.graph.users.getById(testUserId).presence();
        return expect(presence).is.not.null;
    });

    it.skip("Get Presence for Multiple Users", async function () {
        const presence = await this.pnp.graph.communications.getPresencesByUserId([testUserId,testUserId]);
        return expect(presence.length).is.equals(2);
    });
    
    it("Set User Presence", async function () {
        const presence = await this.pnp.graph.users.getById(testUserId).presence.setPresence({
            availability: "Busy",
            activity:"InACall",
            sessionId: sessionId,
            expirationDuration: "PT5M",
        });
        return expect(presence.availability).equals("Busy");
    });

    it("Clear User Presence", async function () {
        const presence = await this.pnp.graph.users.getById(testUserId).presence.clearPresence(sessionId);
        return true; 
    });

    it("Set User Preferred Presence", async function () {
        const presence = await this.pnp.graph.users.getById(testUserId).presence.setPreferredPresence({
            availability: "Available",
            activity:"Available",
            expirationDuration: "PT5M",
        });
        return expect(presence.availability).equals("Available");
    });

    it("Clear User Preferred Presence", async function () {
        const presence = await this.pnp.graph.users.getById(testUserId).presence.clearPreferredPresence();
        return true;
    });

});

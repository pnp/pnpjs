import { stringIsNullOrEmpty } from "@pnp/core";
import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/chats";
import getValidUser from "./utilities/getValidUser.js";
import { pnpTest } from "../pnp-test.js";

describe("Chats", function () {

    let testUserId = "";

    before(pnpTest("91171c68-4944-430c-beca-7438a499ff8b", async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const userInfo = await getValidUser.call(this);
        testUserId = userInfo.id;
    }));

    it("user.chats", pnpTest("6935ae93-9260-48fc-9d55-84be48580cd3", async function () {
        const chats = await this.pnp.graph.users.getById(testUserId).chats();
        return expect(chats).is.not.null;
    }));

    it("user.chats.getById", pnpTest("ea05f904-8e28-4954-8fd8-28f9ea4d1ee5", async function () {
        const chats = await this.pnp.graph.users.getById(testUserId).chats();
        if (chats.length > 0) {
            const chatId = chats[0].id;
            const chat = await this.pnp.graph.users.getById(testUserId).chats.getById(chatId)();
            return expect(chat.id).to.equal(chatId);
        } else {
            this.skip();
        }
    }));

    it("chats.getById", pnpTest("8b441c09-51cb-46f7-b74f-b97aef2dd46f", async function () {
        const chats = await this.pnp.graph.users.getById(testUserId).chats();
        if (chats.length > 0) {
            const chatId = chats[0].id;
            const chat = await this.pnp.graph.chats.getById(chatId)();
            return expect(chat.id).to.equal(chatId);
        } else {
            this.skip();
        }
    }));

    // lists the signed in user's chats, which needs delegated permissions
    it.skip("chats");

    // an existing 1:1 chat is returned instead of created, and a new chat needs a second test user
    it.skip("chats.add");

    // needs a chat the test created, see chats.add
    it.skip("chat.update");

    // destructive, soft-deletes a real conversation and needs Chat.ManageDeletion.All
    it.skip("chat.delete");

    // not supported with application permissions
    it.skip("chat.removeAllAccessForUser");

    // needs a team with an installed app, see team.installedApps in teams.ts
    it.skip("installedApp.chat");
});

import { stringIsNullOrEmpty } from "@pnp/core";
import { expect } from "chai";
import "@pnp/graph/teams";
import "@pnp/graph/groups";
import "@pnp/graph/users";
import "@pnp/graph/chats";
import "@pnp/graph/messages";
import getValidUser from "./utilities/getValidUser.js";
import { pnpTest } from "../pnp-test.js";

describe("Messages", function () {

    let testUserId = "";
    let teamID = "";

    before(pnpTest("d951fc12-f971-4576-a792-d44d0e3ab346", async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const userInfo = await getValidUser.call(this);
        testUserId = userInfo.id;
        // See if a team exists to test other team endpoints
        const response = await this.pnp.graph.teams();
        if (response.length > 0) {
            teamID = response[0].id;
        }
    }));

    describe("Chat-Messages", function () {

        it("user.chats.getAllMessages", pnpTest("695189e1-1022-4f49-b190-28ad01e7b55d", async function () {
            const getAllMessages = await this.pnp.graph.users.getById(testUserId).chats.getAllMessages(undefined)();
            return expect(getAllMessages).is.not.null;
        }));

        it.skip("user.chats.getAllRetainedMessages");

        it("chat.messages", pnpTest("bc606161-08f1-44bd-8303-f7db5f03e806", async function () {
            const chats = await this.pnp.graph.users.getById(testUserId).chats();
            if (chats.length > 0) {
                const chatId = chats[0].id;
                const messages = await this.pnp.graph.users.getById(testUserId).chats.getById(chatId).messages();
                return expect(messages).is.not.null;
            } else {
                this.skip();
            }
        }));

        it("chat.messages.getById", pnpTest("106cb150-d1ae-4235-86a7-a64b3656b8ca", async function () {
            const chats = await this.pnp.graph.users.getById(testUserId).chats();
            if (chats.length > 0) {
                const chatId = chats[0].id;
                const messages = await this.pnp.graph.users.getById(testUserId).chats.getById(chatId).messages();
                if (messages.length > 0) {
                    const messageId = messages[0].id;
                    const message = await this.pnp.graph.users.getById(testUserId).chats.getById(chatId).messages.getById(messageId)();
                    return expect(message).is.not.null;
                } else {
                    this.skip();
                }
            } else {
                this.skip();
            }
        }));

        // application permissions only support sending chat messages in migration mode
        it.skip("chat.messages.add");
    });

    describe("Teams-Channels", function () {
        let channelId = "";
        before(pnpTest("a6f61a18-1394-4a6a-92c1-95545f25a3f3", async function () {

            // skip if no team exists in the tenant
            if (teamID === "") {
                this.skip();
            }

            const channels = await this.pnp.graph.teams.getById(teamID).channels();
            if (channels.length > 0) {
                channelId = channels[0].id;
            } else {
                this.skip();
            }
        }));

        it("team.channels.getAllMessages", pnpTest("5a819b8f-9be5-4c28-86d9-e5400d4669d3", async function () {
            const getAllMessages = await this.pnp.graph.teams.getById(teamID).channels.getAllMessages(undefined)();
            return expect(getAllMessages).is.not.null;
        }));

        // takes too long to execute
        it.skip("team.channels.getAllRetainedMessages", async function () {
            console.log("TeamId", teamID);
            const getAllRetainedMessages = await this.pnp.graph.teams.getById(teamID).channels.getAllRetainedMessages(undefined)();
            return expect(getAllRetainedMessages).is.not.null;
        });

        it("team.channel.messages", pnpTest("40d61eb1-1a52-4029-b53b-2c11d7355752", async function () {
            const messages = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).messages();
            return expect(messages).is.not.null;
        }));

        it("team.channel.messages.getById", pnpTest("03572e3d-1ba7-41fd-bc76-355bfca6ca05", async function () {
            const messages = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).messages();
            if (messages.length > 0) {
                const messageId = messages[0].id;
                const message = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).messages.getById(messageId)();
                return expect(message).is.not.null;
            } else {
                this.skip();
            }
        }));

        it("team.channel.messages.replies", pnpTest("25bfc505-1644-48b2-b540-aea849620430", async function () {
            const messages = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).messages();
            if (messages.length > 0) {
                const messageId = messages[0].id;
                const messageReply = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).messages.getById(messageId).replies();
                return expect(messageReply).is.not.null;
            } else {
                this.skip();
            }
        }));

        // application permissions only support sending channel messages in migration mode
        it.skip("team.channel.messages.add");
    });
});

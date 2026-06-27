import { stringIsNullOrEmpty } from "@pnp/core";
import { expect } from "chai";
import "@pnp/graph/teams";
import "@pnp/graph/groups";
import "@pnp/graph/users";
import "@pnp/graph/chats";
import "@pnp/graph/messages";
import getValidUser from "./utilities/getValidUser.js";
import { pnpTest } from "../pnp-test.js";

describe("Chats", function () {

    let testUserId = "";
    let teamID = "";

    before(async function () {

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
    });

    describe("Chats", function () {

        it("user.chat.getAllMessages", pnpTest("6057360d-e0e6-41a1-a945-9cf7036a67ce", async function () {
            const getAllMessages = await this.pnp.graph.users.getById(testUserId).chats.getAllMessages(undefined)();
            return expect(getAllMessages).is.not.null;
        }));

        it.skip("user.chat.getAllRetainedMessages");
    });

    describe("Teams-Channels", function () {
        let channelId = "";
        before(async function () {
            const channels = await this.pnp.graph.teams.getById(teamID).channels();
            if (channels.length > 0) {
                channelId = channels[0].id;
            } else {
                this.skip();
            }
        });

        it("team.channels.getAllMessages", pnpTest("017883e4-1f0f-42d7-9f3b-3fdb45aa2aa5", async function () {
            const getAllMessages = await this.pnp.graph.teams.getById(teamID).channels.getAllMessages(undefined)();
            return expect(getAllMessages).is.not.null;
        }));

        // takes too long to execute
        it.skip("team.channels.getAllRetainedMessages", async function () {
            console.log("TeamId", teamID);
            const getAllRetainedMessages = await this.pnp.graph.teams.getById(teamID).channels.getAllRetainedMessages(undefined)();
            return expect(getAllRetainedMessages).is.not.null;
        });

        it("team.channel.messages", pnpTest("59a3c0d5-0cd2-48d2-b8d2-73b143f0dc85", async function () {
            const messages = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).messages();
            return expect(messages).is.not.null;
        }));

        it("team.channel.messages.getById", pnpTest("e35b3129-d325-4cb4-b251-477a012d3dde", async function () {
            const messages = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).messages();
            if (messages.length > 0) {
                const messageId = messages[0].id;
                const message = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).messages.getById(messageId)();
                return expect(message).is.not.null;
            } else {
                this.skip();
            }
        }));

        it("team.channel.message.replies", pnpTest("f2a0bfb4-9e3f-44f0-a715-3e28e5787404", async function () {
            const messages = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).messages();
            if (messages.length > 0) {
                const messageId = messages[0].id;
                const messageReply = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).messages.getById(messageId).replies();
                return expect(messageReply).is.not.null;
            } else {
                this.skip();
            }
        }));

        it.skip("team.channel.messages.add");
    });
});

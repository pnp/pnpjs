import { stringIsNullOrEmpty } from "@pnp/core";
import { expect } from "chai";
import "@pnp/graph/teams";
import "@pnp/graph/groups";
import "@pnp/graph/users";
import "@pnp/graph/chats";
import "@pnp/graph/messages";
import getValidUser from "./utilities/getValidUser.js";

describe("Messages", function () {

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

    describe("Chat-Messages", function () {

        it("user.chat.getAllMessages", async function () {
            const getAllMessages = await this.pnp.graph.users.getById(testUserId).chats.getAllMessages(undefined);
            return expect(getAllMessages).is.not.null;
        });

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


        it("team.channels.getAllMessages", async function () {
            const getAllMessages = await this.pnp.graph.teams.getById(teamID).channels.getAllMessages(undefined);
            return expect(getAllMessages).is.not.null;
        });

        // takes too long to execute
        it.skip("team.channels.getAllRetainedMessages", async function () {
            console.log("TeamId", teamID);
            const getAllRetainedMessages = await this.pnp.graph.teams.getById(teamID).channels.getAllRetainedMessages(undefined);
            return expect(getAllRetainedMessages).is.not.null;
        });

        it("team.channel.messages", async function () {
            const messages = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).messages();
            return expect(messages).is.not.null;
        });

        it("team.channel.messages.getById", async function () {
            const messages = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).messages();
            if (messages.length > 0) {
                const messageId = messages[0].id;
                const message = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).messages.getById(messageId)();
                return expect(message).is.not.null;
            } else {
                this.skip();
            }
        });
        it("team.channel.message.replies", async function () {
            const messages = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).messages();
            if (messages.length > 0) {
                const messageId = messages[0].id;
                const messageReply = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).messages.getById(messageId).replies();
                return expect(messageReply).is.not.null;
            } else {
                this.skip();
            }
        });

        it.skip("team.channel.messages.add");
    });
});

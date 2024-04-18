import { expect } from "chai";
import getValidUser from "./utilities/getValidUser.js";
import "@pnp/graph/users";
import "@pnp/graph/groups";
import "@pnp/graph/teams";
import "@pnp/graph/conversations";
import { IPostForwardInfo } from "@pnp/graph/conversations";
import {
    Post as IPostType,
} from "@microsoft/microsoft-graph-types";
import { getRandomString } from "@pnp/core";

describe("Group Conversations", function () {
    let groupId = "";

    const draftPost: IPostType = {
        body: { content: "This is a post" },
        from: {
            emailAddress: {
                address: "",
                name: "",
            },
        },
    };

    const postForwardInfo: IPostForwardInfo = {
        comment: "",
        toRecipients: [
            {
                emailAddress: {
                    address: "",
                    name: "",
                },
            },
        ],
    };

    before(async function () {

        if (!this.pnp.settings.enableWebTests || !this.pnp.settings.testGroupId) {
            this.skip();
        }
        const userInfo = await getValidUser.call(this);
        draftPost.from.emailAddress.address = userInfo.userPrincipalName;
        draftPost.from.emailAddress.name = userInfo.displayName;
        postForwardInfo.toRecipients[0].emailAddress.address = userInfo.userPrincipalName;
        postForwardInfo.toRecipients[0].emailAddress.name = userInfo.displayName;
        groupId = this.pnp.settings.testGroupId;
    });

    describe("Group Conversations", function () {
        it("list conversations", async function () {
            const conversations = await this.pnp.graph.groups.getById(groupId).conversations();
            return expect(conversations.length).to.be.greaterThan(0);
        });

        it("conversation getById", async function () {
            const conversations = await this.pnp.graph.groups.getById(groupId).conversations();
            const conversation = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id)();
            return expect(conversation).to.have.property("id");
        });

        it("list threads", async function () {
            const conversations = await this.pnp.graph.groups.getById(groupId).conversations();
            const convThreads = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads();
            return expect(convThreads).is.not.null;
        });

        it("thread getById", async function () {
            const conversations = await this.pnp.graph.groups.getById(groupId).conversations();
            const convThreads = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads();
            const thread = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads.getById(convThreads[0].id)();
            return expect(thread).to.have.property("id");
        });

        it("list posts", async function () {
            const conversations = await this.pnp.graph.groups.getById(groupId).conversations();
            const convThreads = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads();
            let threadPost = null;
            if (convThreads.length > 0) {
                threadPost = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads.getById(convThreads[0].id).posts();
            }
            return expect(threadPost).is.not.null;
        });

        it("post getById", async function () {
            const conversations = await this.pnp.graph.groups.getById(groupId).conversations();
            const convThreads = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads();
            const threadPost = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads.getById(convThreads[0].id).posts();
            const post = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id)
                .threads.getById(convThreads[0].id).posts.getById(threadPost[0].id)();
            return expect(post).to.have.property("id");
        });

        // Even though docs say you can do this with app permissions throwing a 403, that said conversations do not support app permissions so it feels like a bug in the docs.
        it.skip("post reply", async function () {
            const conversations = await this.pnp.graph.groups.getById(groupId).conversations();
            const convThreads = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads();
            const threadPost = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads.getById(convThreads[0].id).posts();
            const post = this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id)
                .threads.getById(convThreads[0].id).posts.getById(threadPost[0].id);
            const p = JSON.parse(JSON.stringify(draftPost));
            p.body.content = `Test Reply ${getRandomString(4)}`;
            const reply = await post.reply(p);
            return expect(reply).to.have.property("id");
        });

        // Even though docs say you can do this with app permissions throwing a 403, that said conversations do not support app permissions so it feels like a bug in the docs.
        it.skip("post forward", async function () {
            let success = false;
            const conversations = await this.pnp.graph.groups.getById(groupId).conversations();
            const convThreads = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads();
            const threadPost = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads.getById(convThreads[0].id).posts();
            const post = this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id)
                .threads.getById(convThreads[0].id).posts.getById(threadPost[0].id);
            await post.forward(postForwardInfo);
            success = true;
            return expect(success).to.be.true;
        });

        // Remaining endpoints not supported by app permissions
    });
});

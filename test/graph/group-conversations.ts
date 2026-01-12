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
import { pnpTest } from "../pnp-test.js";

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

    before(pnpTest("42d4f63f-5529-4ca3-8df3-cbde6a847c3f", async function () {

        if (!this.pnp.settings.enableWebTests || !this.pnp.settings.testGroupId) {
            this.skip();
        }
        const userInfo = await getValidUser.call(this);
        draftPost.from.emailAddress.address = userInfo.userPrincipalName;
        draftPost.from.emailAddress.name = userInfo.displayName;
        postForwardInfo.toRecipients[0].emailAddress.address = userInfo.userPrincipalName;
        postForwardInfo.toRecipients[0].emailAddress.name = userInfo.displayName;
        groupId = this.pnp.settings.testGroupId;
    }));

    describe("Group Conversations", function () {
        it("list conversations", pnpTest("54785ebe-ee80-4d04-baf8-3a3bcd364fcf", async function () {
            const conversations = await this.pnp.graph.groups.getById(groupId).conversations();
            return expect(conversations.length).to.be.greaterThan(0);
        }));

        it("conversation getById", pnpTest("8b303d42-e943-4163-a94d-eb1bc4c6ec9c", async function () {
            const conversations = await this.pnp.graph.groups.getById(groupId).conversations();
            const conversation = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id)();
            return expect(conversation).to.have.property("id");
        }));

        it("list threads", pnpTest("c1611502-bb67-4e86-909e-8fc577c87830", async function () {
            const conversations = await this.pnp.graph.groups.getById(groupId).conversations();
            const convThreads = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads();
            return expect(convThreads).is.not.null;
        }));

        it("thread getById", pnpTest("8d00a458-be13-4b29-a20d-211fb2a44c0d", async function () {
            const conversations = await this.pnp.graph.groups.getById(groupId).conversations();
            const convThreads = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads();
            const thread = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads.getById(convThreads[0].id)();
            return expect(thread).to.have.property("id");
        }));

        it("list posts", pnpTest("997dcbc7-79e4-4c81-b282-b69e942e58f2", async function () {
            const conversations = await this.pnp.graph.groups.getById(groupId).conversations();
            const convThreads = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads();
            let threadPost = null;
            if (convThreads.length > 0) {
                threadPost = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads.getById(convThreads[0].id).posts();
            }
            return expect(threadPost).is.not.null;
        }));

        it("post getById", pnpTest("4e19a73a-2fa1-4c5b-9334-c933b295fd19", async function () {
            const conversations = await this.pnp.graph.groups.getById(groupId).conversations();
            const convThreads = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads();
            const threadPost = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads.getById(convThreads[0].id).posts();
            const post = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id)
                .threads.getById(convThreads[0].id).posts.getById(threadPost[0].id)();
            return expect(post).to.have.property("id");
        }));

        // Even though docs say you can do this with app permissions throwing a 403, that said conversations do not support app permissions so it feels like a bug in the docs.
        it.skip("post reply", pnpTest("b47e84e3-9245-4b15-9bbe-b8ef2f20f3a9", async function () {
            const { replyText } = await this.props({
                replyText: `Test Reply ${getRandomString(4)}`,
            });
            const conversations = await this.pnp.graph.groups.getById(groupId).conversations();
            const convThreads = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads();
            const threadPost = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads.getById(convThreads[0].id).posts();
            const post = this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id)
                .threads.getById(convThreads[0].id).posts.getById(threadPost[0].id);
            const p = JSON.parse(JSON.stringify(draftPost));
            p.body.content = replyText;
            const reply = await post.reply(p);
            return expect(reply).to.have.property("id");
        }));

        // Even though docs say you can do this with app permissions throwing a 403, that said conversations do not support app permissions so it feels like a bug in the docs.
        it.skip("post forward", pnpTest("f7800f30-2196-41e2-acf2-73c6e859a151", async function () {
            let success = false;
            const conversations = await this.pnp.graph.groups.getById(groupId).conversations();
            const convThreads = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads();
            const threadPost = await this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id).threads.getById(convThreads[0].id).posts();
            const post = this.pnp.graph.groups.getById(groupId).conversations.getById(conversations[0].id)
                .threads.getById(convThreads[0].id).posts.getById(threadPost[0].id);
            await post.forward(postForwardInfo);
            success = true;
            return expect(success).to.be.true;
        }));

        // Remaining endpoints not supported by app permissions
    });
});

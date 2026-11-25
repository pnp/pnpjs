import { stringIsNullOrEmpty } from "@pnp/core";
import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/chats";
import "@pnp/graph/members";
import getValidUser from "./utilities/getValidUser.js";
import { pnpTest } from "../pnp-test.js";

describe("Members", function () {

    let testUserId = "";

    before(pnpTest("0edfe3bd-9ec3-42bb-9da6-b5d559d31861", async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const userInfo = await getValidUser.call(this);
        testUserId = userInfo.id;
    }));

    it("chat.members", pnpTest("ad5ea6b1-1ae3-40b8-9870-09121ce43686", async function () {
        const chats = await this.pnp.graph.users.getById(testUserId).chats();
        if (chats.length > 0) {
            const members = await this.pnp.graph.chats.getById(chats[0].id).members();
            return expect(members).is.an("array");
        } else {
            this.skip();
        }
    }));

    it("chat.members.getById", pnpTest("55aa7672-f713-4c27-9df8-69c1f9a229aa", async function () {
        const chats = await this.pnp.graph.users.getById(testUserId).chats();
        if (chats.length > 0) {
            const chatId = chats[0].id;
            const members = await this.pnp.graph.chats.getById(chatId).members();
            if (members.length > 0) {
                const memberId = members[0].id;
                const member = await this.pnp.graph.chats.getById(chatId).members.getById(memberId)();
                return expect(member.id).to.equal(memberId);
            } else {
                this.skip();
            }
        } else {
            this.skip();
        }
    }));

    // changes who is in a real conversation, and needs a second test user
    it.skip("chat.members.add");
    it.skip("chat.members.remove");
});

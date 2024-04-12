import { expect } from "chai";
import "@pnp/sp/comments/clientside-page";
import "@pnp/sp/comments/item";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import { CreateClientsidePage } from "@pnp/sp/clientside-pages";
import { getRandomString } from "@pnp/core";
import { ICommentInfo } from "@pnp/sp/comments/types.js";
import { IList } from "@pnp/sp/lists";
import { IItem } from "@pnp/sp/items";
import { pnpTest } from "../pnp-test.js";

// TODO:: make this recordable?

describe("Comments", function () {

    this.beforeAll(pnpTest("1f64b122-b257-4abb-ac2a-5f22174a4abd", async function () {
        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    }));

    describe("ClientSide Pages", function () {
        let testUserLogin = "";
        let testUserEmail = "";
        const testUser = "Test User";
        let page;

        before(pnpTest("f4a26aab-f04b-4ebc-875b-fab23e6b2384", async function () {

            const props = await this.props({
                pageName: `CommentPage_${getRandomString(4)}`,
            });

            page = await CreateClientsidePage(this.pnp.sp.web, props.pageName, props.pageName, "Article");
            await page.save();

            // we need a user to share to
            if (this.pnp.settings.testUser?.length > 0) {
                await this.pnp.sp.web.ensureUser(this.pnp.settings.testUser);
                testUserLogin = this.pnp.settings.testUser;
                const tmp = this.pnp.settings.testUser.split("|");
                testUserEmail = tmp[tmp.length - 1];
            }
        }));

        after(async function () {
            // Cleanup list
            if (page != null) {
                page.delete();
            }
        });

        it("add", pnpTest("831a715e-60e9-4cea-b0ac-265ce2e3a5db", async function () {

            const props = await this.props({
                comment: "A test comment",
            });

            const comment = await page.addComment(props.comment);
            return expect(parseInt(comment.id, 10)).to.be.greaterThan(0);
        }));

        it("add - at mention", pnpTest("11170046-350f-4edf-9cea-afb1328a40e2", async function () {

            if (this.pnp.settings.testUser?.length < 0) {
                this.skip();
            }

            const mentionHtml = `<a data-sp-mention-user-id="${testUserLogin}" href="mailto&#58;${testUserEmail}" tabindex="-1">${testUser}</a>`;
            const commentInfo: Partial<ICommentInfo> = {
                mentions: [{ loginName: testUserLogin, email: testUserEmail, name: testUser }],
                text: `${mentionHtml} This is the test comment with at mentions`,
            };
            const comment = await page.addComment(commentInfo);
            const commentId = parseInt(comment.id, 10);
            const commentMentions = comment.mentions;
            return expect(commentId).to.be.greaterThan(0) && expect(commentMentions.some(m => m.loginName.toLowerCase() === testUserLogin.toLocaleLowerCase())).to.be.true;
        }));

        it("getById", pnpTest("49a96d2f-838b-49b3-98e0-1d7107d83e3d", async function () {

            const comment = await page.addComment("A test comment");
            const commentId = parseInt(comment.id, 10);
            return expect(commentId).to.be.greaterThan(0);
        }));

        it("getById (2)", pnpTest("c5d6cf2a-4fb4-4cac-9346-05ea7720398c", async function () {

            const comment = await page.addComment("A test comment");
            expect(parseInt(comment.id, 10)).to.be.greaterThan(0);
            const comment2 = await page.getCommentById(comment.id);
            return expect(comment2.id).to.eq(comment.id);
        }));

        it("clear", pnpTest("d5d4eda1-8f12-48e0-906e-a6a3c6800e89", async function () {
            const pageName = `CommentPage_${getRandomString(4)}`;
            const newPage = await CreateClientsidePage(this.pnp.sp.web, pageName, pageName, "Article");
            await newPage.save();
            await newPage.addComment("A test comment");
            await newPage.addComment("A test comment");
            await newPage.addComment("A test comment");
            await newPage.addComment("A test comment");

            const comments = await newPage.getComments();

            let success = false;
            if (comments.length === 4) {
                await newPage.clearComments();

                const testCommentsLength = await newPage.getComments();
                success = (testCommentsLength.length === 0);
            }
            newPage.delete();
            return expect(success).to.be.true;
        }));

        it("like", pnpTest("edb783e1-6af0-4588-9d58-dfa879b39e78", async function () {
            const comment = await page.addComment("A test like comment");
            await comment.like();
            const commentNew = await page.getCommentById(comment.id);
            return expect(commentNew.likeCount === 1).to.be.true;
        }));

        it("unlike", pnpTest("95e3a26f-40be-4b70-93f6-062ef21fc1f8", async function () {
            const comment = await page.addComment("A test unlike comment");
            await comment.like();
            await comment.unlike();
            const commentNew = await page.getCommentById(comment.id);
            return expect(commentNew.likeCount === 0).to.be.true;
        }));

        it("replies - add", pnpTest("3b19fbb7-ea0f-438c-94c5-a381e18c455c", async function () {
            const comment = await page.addComment("A test reply comment");
            const reply = await comment.replies.add("Reply");
            return expect(reply.text).to.eq("Reply");
        }));

        it("replies - add 2", pnpTest("38bcde8e-eea2-472c-93f3-ee98c6053920", async function () {
            const comment = await page.addComment("A test reply multiple comment");
            await comment.replies.add("Reply 1");
            await comment.replies.add("Reply 2");
            await comment.replies.add("Reply 3");
            await comment.replies.add("Reply 4");
            const replies = await comment.replies();
            return expect(replies).to.have.length(4);
        }));
    });

    describe("Items", function () {
        const listTitle = "CommentItemTestList";
        let list: IList = null;
        let item: IItem = null;

        before(pnpTest("679261d7-d620-4480-afa1-eb2fa2d9d1cf", async function () {
            const ler = await this.pnp.sp.web.lists.ensure(listTitle, "Used to test item comment operations");
            list = this.pnp.sp.web.lists.getById(ler.Id);

            if (ler.Created){
                const itemData = await list.items.add({ Title: `Item ${getRandomString(4)}` });
                item = itemData.item;
            }
        }));

        after(pnpTest("e0289a5f-ee63-427c-9b2d-97ff4bb55418", async function () {
            // Cleanup list
            if (list != null) {
                list.delete();
            }
        }));

        it("add", pnpTest("2d924f6e-cbc3-4d80-b489-dbb1e8afe986", async function () {
            const commentText = "Test Add Comment";
            const comment = await item.comments.add(commentText);
            expect(comment.text).to.be.eq(commentText);
        }));

        it("getById", pnpTest("7e98022c-85c9-4e4c-83f5-b3ede8f6d408", async function () {
            const commentText = "Test GetById Comment";
            const comment = await item.comments.add(commentText);
            const comment2 = await item.comments.getById(parseInt(comment.id, 10))();
            return expect(comment2.text).to.be.eq(commentText);
        }));

        it("clear", pnpTest("82b74a1d-14cb-4412-8d63-e5cda4c58754", async function () {
            const itemData = await list.items.add({ Title: `Item ${getRandomString(4)}` });
            const newItem = itemData.item;

            await newItem.comments.add("A test comment");
            await newItem.comments.add("A test comment");
            await newItem.comments.add("A test comment");
            await newItem.comments.add("A test comment");

            const comments = await newItem.comments();

            let success = false;
            if (comments.length === 4) {
                await newItem.comments.clear();

                const testCommentsLength = await newItem.comments();
                success = (testCommentsLength.length === 0);
            }
            newItem.delete();

            return expect(success).to.be.true;
        }));

        it("rate", pnpTest("e4047443-2a90-43d0-8bea-3034e760bbf4", async function () {
            const itemRate = await item.rate(2);
            return expect(itemRate).to.be.eq(2);
        }));
    });
});

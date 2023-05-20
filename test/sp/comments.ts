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

describe("Comments", function () {

    this.beforeAll(async function () {
        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    describe("ClientSide Pages", function () {
        let testUserLogin = "";
        let testUserEmail = "";
        const testUser = "Test User";

        const pageName = `CommentPage_${getRandomString(4)}`;
        let page;

        before(async function () {
            page = await CreateClientsidePage(this.pnp.sp.web, pageName, pageName, "Article");
            await page.save();

            // we need a user to share to
            if (this.pnp.settings.testUser?.length > 0) {
                await this.pnp.sp.web.ensureUser(this.pnp.settings.testUser);
                testUserLogin = this.pnp.settings.testUser;
                const tmp = this.pnp.settings.testUser.split("|");
                testUserEmail = tmp[tmp.length - 1];
            }
        });

        after(async function () {
            // Cleanup list
            if (page != null) {
                page.delete();
            }
        });

        it("add", async function () {
            const comment = await page.addComment("A test comment");
            return expect(parseInt(comment.id, 10)).to.be.greaterThan(0);
        });

        it("add - at mention", async function () {

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
            return expect(commentId).to.be.greaterThan(0) && expect(commentMentions.some(m=>m.loginName.toLowerCase() === testUserLogin.toLocaleLowerCase())).to.be.true;
        });

        it("getById", async function () {

            const comment = await page.addComment("A test comment");
            const commentId = parseInt(comment.id, 10);
            return expect(commentId).to.be.greaterThan(0);
        });

        it("getById (2)", async function () {

            const comment = await page.addComment("A test comment");
            expect(parseInt(comment.id, 10)).to.be.greaterThan(0);
            const comment2 = await page.getCommentById(comment.id);
            return expect(comment2.id).to.eq(comment.id);
        });

        it("clear", async function () {
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
        });

        it("like", async function () {
            const comment = await page.addComment("A test like comment");
            await comment.like();
            const commentNew = await page.getCommentById(comment.id);
            return expect(commentNew.likeCount === 1).to.be.true;
        });

        it("unlike", async function () {
            const comment = await page.addComment("A test unlike comment");
            await comment.like();
            await comment.unlike();
            const commentNew = await page.getCommentById(comment.id);
            return expect(commentNew.likeCount === 0).to.be.true;
        });

        it("replies - add", async function () {
            const comment = await page.addComment("A test reply comment");
            const reply = await comment.replies.add("Reply");
            return expect(reply.text).to.eq("Reply");
        });

        it("replies - add 2", async function () {
            const comment = await page.addComment("A test reply multiple comment");
            await comment.replies.add("Reply 1");
            await comment.replies.add("Reply 2");
            await comment.replies.add("Reply 3");
            await comment.replies.add("Reply 4");
            const replies = await comment.replies();
            return expect(replies).to.have.length(4);
        });
    });

    describe("Items", function () {
        const listTitle = "CommentItemTestList";
        let list: IList = null;
        let item: IItem = null;

        before(async function () {
            const ler = await this.pnp.sp.web.lists.ensure(listTitle, "Used to test item comment operations");
            list = ler.list;

            if (ler.created) {
                const itemData = await list.items.add({ Title: `Item ${getRandomString(4)}` });
                item = itemData.item;
            }
        });

        after(async function () {
            // Cleanup list
            if (list != null) {
                list.delete();
            }
        });

        it("add", async function () {
            const commentText = "Test Add Comment";
            const comment = await item.comments.add(commentText);
            expect(comment.text).to.be.eq(commentText);
        });

        it("getById", async function () {
            const commentText = "Test GetById Comment";
            const comment = await item.comments.add(commentText);
            const comment2 = await item.comments.getById(parseInt(comment.id, 10))();
            return expect(comment2.text).to.be.eq(commentText);
        });

        it("clear", async function () {
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
        });

        it("rate", async function () {
            const itemRate = await item.rate(2);
            return expect(itemRate).to.be.eq(2);
        });
    });
});

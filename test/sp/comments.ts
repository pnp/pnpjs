import { sp } from "@pnp/sp";
import { testSettings } from "../main";
import { expect } from "chai";
import "@pnp/sp/comments/clientside-page";
import "@pnp/sp/comments/item";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import { CreateClientsidePage } from "@pnp/sp/clientside-pages";
import { getRandomString } from "@pnp/common";

describe("Comments", function () {

    if (testSettings.enableWebTests) {

        it(".add - clientside page", async function () {

            const pageName = `CommentPage_${getRandomString(4)}`;
            const page = await CreateClientsidePage(sp.web, pageName, pageName, "Article");
            await page.save();
            const comment = await page.addComment("A test comment");
            expect(parseInt(comment.id, 10)).to.be.greaterThan(0);
        });

        it(".add - item", async function () {

            const pageName = `CommentPage_${getRandomString(4)}`;
            const page = await CreateClientsidePage(sp.web, pageName, pageName, "Article");
            await page.save();
            const item = await page.getItem();
            const comment = await item.comments.add("A test comment");

            expect(parseInt(comment.id, 10)).to.be.greaterThan(0);
        });

        it(".getById - clientside page", async function () {

            const pageName = `CommentPage_${getRandomString(4)}`;
            const page = await CreateClientsidePage(sp.web, pageName, pageName, "Article");
            await page.save();
            const comment = await page.addComment("A test comment");
            expect(parseInt(comment.id, 10)).to.be.greaterThan(0);

            return expect(page.getCommentById(parseInt(comment.id, 10))).to.eventually.be.fulfilled;
        });

        it(".getById - clientside page 2", async function () {

            const pageName = `CommentPage_${getRandomString(4)}`;
            const page = await CreateClientsidePage(sp.web, pageName, pageName, "Article");
            await page.save();
            const comment = await page.addComment("A test comment");
            expect(parseInt(comment.id, 10)).to.be.greaterThan(0);

            const comment2 = await page.getCommentById(parseInt(comment.id, 10));

            return expect(comment2.select("likeCount")()).to.eventually.be.fulfilled;
        });

        it(".getById - item", async function () {

            const pageName = `CommentPage_${getRandomString(4)}`;
            const page = await CreateClientsidePage(sp.web, pageName, pageName, "Article");
            await page.save();
            const comment = await page.addComment("A test comment");
            expect(parseInt(comment.id, 10)).to.be.greaterThan(0);
            const item = await page.getItem();

            const comment2 = await item.comments.getById(parseInt(comment.id, 10))();

            return expect(comment2).to.not.be.null;
        });

        it(".clear - clientside page", async function () {

            const pageName = `CommentPage_${getRandomString(4)}`;
            const page = await CreateClientsidePage(sp.web, pageName, pageName, "Article");
            await page.save();
            await page.addComment("A test comment");
            await page.addComment("A test comment");
            await page.addComment("A test comment");
            await page.addComment("A test comment");

            const comments = await page.getComments();

            expect(comments).to.have.length(4);

            await page.clearComments();

            expect(page.getComments()).to.eventually.have.length(0);
        });

        it(".clear - item", async function () {

            const pageName = `CommentPage_${getRandomString(4)}`;
            const page = await CreateClientsidePage(sp.web, pageName, pageName, "Article");
            await page.save();
            const item = await page.getItem();

            await item.comments.add("A test comment");
            await item.comments.add("A test comment");
            await item.comments.add("A test comment");
            await item.comments.add("A test comment");

            const comments = await item.comments();

            expect(comments).to.have.length(4);

            await item.comments.clear();

            expect(item.comments()).to.eventually.have.length(0);
        });

        it(".like & unlike", async function () {

            const pageName = `CommentPage_${getRandomString(4)}`;
            const page = await CreateClientsidePage(sp.web, pageName, pageName, "Article");
            await page.save();
            const comment = await page.addComment("A test comment");

            await comment.like();

            return expect(comment.unlike()).to.eventually.be.fulfilled;
        });

        it(".replies - add", async function () {

            const pageName = `CommentPage_${getRandomString(4)}`;
            const page = await CreateClientsidePage(sp.web, pageName, pageName, "Article");
            await page.save();
            const comment = await page.addComment("A test comment");

            return expect(comment.replies.add("Reply")).to.eventually.be.fulfilled;
        });

        it(".replies - add 2", async function () {

            const pageName = `CommentPage_${getRandomString(4)}`;
            const page = await CreateClientsidePage(sp.web, pageName, pageName, "Article");
            await page.save();
            const comment = await page.addComment("A test comment");
            await comment.replies.add("Reply");
            await comment.replies.add("Reply");
            await comment.replies.add("Reply");
            await comment.replies.add("Reply");

            return expect(comment.replies()).to.eventually.have.length(4);
        });
    }
});

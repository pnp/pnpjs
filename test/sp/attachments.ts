import { getRandomString } from "@pnp/common";
import { expect } from "chai";
import { testSettings } from "../main";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import { IList } from "@pnp/sp/lists";

describe("Attachments", function () {

    if (testSettings.enableWebTests) {

        let list: IList = null;

        before(async function () {

            // we need to add a list and some attachments.
            const listData = await sp.web.lists.ensure(`AttachmentTest_${getRandomString(4)}`);
            list = listData.list;
        });

        it(".attachmentFiles()", async function () {

            // add some attachments to an item
            const r = await list.items.add({
                Title: `Test_1_${getRandomString(4)}`,
            });

            await r.item.attachmentFiles.add(`att_${getRandomString(4)}.txt`, "Some Content");
            await r.item.attachmentFiles.add(`att_${getRandomString(4)}.txt`, "Some Content");

            return expect(r.item.attachmentFiles()).to.eventually.be.fulfilled.and.to.be.an("Array").and.have.length(2);
        });

        it(".getByName()", async function () {

            // add some attachments to an item
            const r = await list.items.add({
                Title: `Test_1_${getRandomString(4)}`,
            });

            const name = `att_${getRandomString(4)}.txt`;
            await r.item.attachmentFiles.add(name, "Some Content");

            const info = await r.item.attachmentFiles.getByName(name)();

            return expect(info.FileName).to.eq(name);
        });

        it(".addMultiple()", async function () {

            // add some attachments to an item
            const r = await list.items.add({
                Title: `Test_1_${getRandomString(4)}`,
            });

            await r.item.attachmentFiles.addMultiple([
                {
                    content: "Some Content",
                    name: `att_${getRandomString(4)}.txt`,
                },
                {
                    content: "Some Content",
                    name: `att_${getRandomString(4)}.txt`,
                },
                {
                    content: "Some Content",
                    name: `att_${getRandomString(4)}.txt`,
                },
            ]);

            return expect(r.item.attachmentFiles()).to.eventually.be.fulfilled.and.to.be.an("Array").and.have.length(3);
        });

        it(".deleteMultiple()", async function () {

            // add some attachments to an item
            const r = await list.items.add({
                Title: `Test_1_${getRandomString(4)}`,
            });

            const names = [
                `att_${getRandomString(4)}.txt`,
                `att_${getRandomString(4)}.txt`,
                `att_${getRandomString(4)}.txt`,
            ];

            await r.item.attachmentFiles.addMultiple([
                {
                    content: "Some Content",
                    name: names[0],
                },
                {
                    content: "Some Content",
                    name: names[1],
                },
                {
                    content: "Some Content",
                    name: names[2],
                },
            ]);

            const attachmentInfo = await r.item.attachmentFiles();

            expect(attachmentInfo).to.be.an("Array").and.have.length(3);

            await r.item.attachmentFiles.deleteMultiple(...names);

            return expect(r.item.attachmentFiles()).to.eventually.be.fulfilled.and.to.be.an("Array").and.have.length(0);
        });

        it(".recycleMultiple()", async function () {

            // add some attachments to an item
            const r = await list.items.add({
                Title: `Test_1_${getRandomString(4)}`,
            });

            const names = [
                `att_${getRandomString(4)}.txt`,
                `att_${getRandomString(4)}.txt`,
                `att_${getRandomString(4)}.txt`,
            ];

            await r.item.attachmentFiles.addMultiple([
                {
                    content: "Some Content",
                    name: names[0],
                },
                {
                    content: "Some Content",
                    name: names[1],
                },
                {
                    content: "Some Content",
                    name: names[2],
                },
            ]);

            const attachmentInfo = await r.item.attachmentFiles();

            expect(attachmentInfo).to.be.an("Array").and.have.length(3);

            await r.item.attachmentFiles.recycleMultiple(...names);

            return expect(r.item.attachmentFiles()).to.eventually.be.fulfilled.and.to.be.an("Array").and.have.length(0);
        });

        it(".getText()", async function () {

            // add some attachments to an item
            const r = await list.items.add({
                Title: `Test_1_${getRandomString(4)}`,
            });

            const content = "Some Content";
            const name = `att_${getRandomString(4)}.txt`;
            await r.item.attachmentFiles.add(name, content);

            const text = await r.item.attachmentFiles.getByName(name).getText();

            expect(text).to.eq(content);
        });

        it(".setContent()", async function () {

            // add some attachments to an item
            const r = await list.items.add({
                Title: `Test_1_${getRandomString(4)}`,
            });

            const content = "Some Content";
            const name = `att_${getRandomString(4)}.txt`;
            await r.item.attachmentFiles.add(name, content);

            const text = await r.item.attachmentFiles.getByName(name).getText();

            expect(text).to.eq(content);

            const content2 = "Different Content";
            await r.item.attachmentFiles.getByName(name).setContent(content2);

            const text2 = await r.item.attachmentFiles.getByName(name).getText();
            expect(text2).to.eq(content2);
        });

        it(".recycle()", async function () {

            // add some attachments to an item
            const r = await list.items.add({
                Title: `Test_1_${getRandomString(4)}`,
            });

            const name = `att_${getRandomString(4)}.txt`;

            await r.item.attachmentFiles.add(name, "Some Content");

            const attachmentInfo = await r.item.attachmentFiles();

            expect(attachmentInfo).to.be.an("Array").and.have.length(1);

            await r.item.attachmentFiles.getByName(name).recycle();

            return expect(r.item.attachmentFiles()).to.eventually.be.fulfilled.and.to.be.an("Array").and.have.length(0);
        });
    }
});

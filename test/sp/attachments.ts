import { getRandomString } from "@pnp/core";
import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import { IList } from "@pnp/sp/lists";
import { pnpTest } from "../pnp-test.js";

describe("Attachments", function () {

    let list: IList = null;

    before(pnpTest("abb79777-df5a-4d62-b5aa-581fdbeb2c76", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        const props = await this.props({
            listTitle: `AttachmentTest_${getRandomString(4)}`,
        });

        // we need to add a list and some attachments.
        const listData = await this.pnp.sp.web.lists.ensure(props.listTitle);
        list = listData.list;
    }));

    it("attachmentFiles", pnpTest("9bc6dba6-6690-4453-8d13-4f42e051a245", async function () {

        const props = await this.props({
            itemTitle: `Test_${getRandomString(4)}`,
            attachmentFile1Name: `att_${getRandomString(4)}.txt`,
            attachmentFile2Name: `att_${getRandomString(4)}.txt`,
        });

        // add some attachments to an item
        const r = await list.items.add({
            Title: props.itemTitle,
        });

        await r.item.attachmentFiles.add(props.attachmentFile1Name, "Some Content");
        await r.item.attachmentFiles.add(props.attachmentFile2Name, "Some Content");

        return expect(r.item.attachmentFiles()).to.eventually.be.fulfilled.and.to.be.an("Array").and.have.length(2);
    }));

    it("getByName", pnpTest("25d87865-8e83-4d97-88ad-afeca7f217e1", async function () {

        const props = await this.props({
            itemTitle: `Test_${getRandomString(4)}`,
            attachmentFileName: `att_${getRandomString(4)}.txt`,
            content: "Some Content",
        });

        // add some attachments to an item
        const r = await list.items.add({
            Title: props.itemTitle,
        });

        await r.item.attachmentFiles.add(props.attachmentFileName, props.content);

        const info = await r.item.attachmentFiles.getByName(props.attachmentFileName)();

        return expect(info.FileName).to.eq(props.attachmentFileName);
    }));

    it("getText", pnpTest("a034f3bc-d9d7-4364-afab-7c3895fe8744", async function () {

        const props = await this.props({
            itemTitle: `Test_${getRandomString(4)}`,
            attachmentFileName: `att_${getRandomString(4)}.txt`,
            content: "Some Content",
        });

        // add some attachments to an item
        const r = await list.items.add({
            Title: props.itemTitle,
        });

        await r.item.attachmentFiles.add(props.attachmentFileName, props.content);
        const text = await r.item.attachmentFiles.getByName(props.attachmentFileName).getText();
        expect(text).to.eq(props.content);
    }));

    it("setContent", pnpTest("b0483c0f-0ef8-4da4-a9c5-c6219aa02e46", async function () {

        const props = await this.props({
            itemTitle: `Test_${getRandomString(4)}`,
            attachmentFileName: `att_${getRandomString(4)}.txt`,
            content: "Some Content",
            content2: "Different Content",
        });

        // add some attachments to an item
        const r = await list.items.add({
            Title: props.itemTitle,
        });

        await r.item.attachmentFiles.add(props.attachmentFileName, props.content);

        const text = await r.item.attachmentFiles.getByName(props.attachmentFileName).getText();

        expect(text).to.eq(props.content);

        await r.item.attachmentFiles.getByName(props.attachmentFileName).setContent(props.content2);
        const text2 = await r.item.attachmentFiles.getByName(props.attachmentFileName).getText();
        expect(text2).to.eq(props.content2);
    }));

    it("recycle", pnpTest("b9d191e5-1925-43df-9930-db0f2f464637", async function () {

        const props = await this.props({
            itemTitle: `Test_${getRandomString(4)}`,
            attachmentFileName: `att_${getRandomString(4)}.txt`,
            content: "Some Content",
        });

        // add some attachments to an item
        const r = await list.items.add({
            Title: props.itemTitle,
        });

        await r.item.attachmentFiles.add(props.attachmentFileName, props.content);

        const attachmentInfo = await r.item.attachmentFiles();

        expect(attachmentInfo).to.be.an("Array").and.have.length(1);

        await r.item.attachmentFiles.getByName(props.attachmentFileName).recycle();

        return expect(r.item.attachmentFiles()).to.eventually.be.fulfilled.and.to.be.an("Array").and.have.length(0);
    }));
});

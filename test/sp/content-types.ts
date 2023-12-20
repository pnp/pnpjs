import { expect } from "chai";
import "@pnp/sp/content-types";
import "@pnp/sp/lists/web";
import { getRandomString } from "@pnp/core";
import { pnpTest } from "../pnp-test.js";

describe("Content Types", function () {

    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    it("addAvailableContentType", pnpTest("e0e0a639-8e6d-4c59-affd-da531b63767b", async function () {

        const { listTitle } = await this.props({
            listTitle: `PnPJSTEST${getRandomString(8)}`,
        });

        await this.pnp.sp.web.lists.add(listTitle, listTitle, 101, true);

        return expect(this.pnp.sp.web.lists.getByTitle(listTitle).contentTypes.addAvailableContentType("0x010102")).to.eventually.be.fulfilled;
    }));

    it("getById", pnpTest("c6d2122c-f884-41b1-9a29-816b64ed25af", function () {
        return expect(this.pnp.sp.web.contentTypes.getById("0x01")()).to.eventually.be.fulfilled;
    }));

    it("add", pnpTest("32549294-e271-40dc-977f-13998409262b", async function () {

        const { name } = await this.props({
            name: `PnPJSTEST${getRandomString(8)}`,
        });

        return expect(this.pnp.sp.web.contentTypes.add("0x01008D19F38845B0884EBEBE239FDF359184", name)).to.eventually.be.fulfilled;
    }));
});

describe("Content Type", function () {

    let contentTypeId: string;

    before(pnpTest("01548dab-f012-4528-806f-652188c12490", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        const { name } = await this.props({
            name: `PnPJSTEST- ${getRandomString(8)}`,
        });

        const contentTypeResponse = await this.pnp.sp.web.contentTypes.add("0x01008D19F38845B0884EBEBE239FDF359184", name);
        contentTypeId = contentTypeResponse.data.Id.StringValue;
    }));

    it("fieldLinks", pnpTest("6e1e6874-acf1-4c8b-9424-4e7f06bf2882", function () {
        return expect(this.pnp.sp.web.contentTypes.getById(contentTypeId).fieldLinks()).to.eventually.be.fulfilled;
    }));

    it("fields", pnpTest("c0337bdc-67a4-4f42-918a-f57197dda8a7", function () {
        return expect(this.pnp.sp.web.contentTypes.getById(contentTypeId).fields()).to.eventually.be.fulfilled;
    }));

    it("parent", pnpTest("1bf05dda-2b47-40bb-b402-d32239833e48", function () {
        return expect(this.pnp.sp.web.contentTypes.getById(contentTypeId).parent()).to.eventually.be.fulfilled;
    }));

    it("workflowAssociations", pnpTest("47de516e-9650-4817-8f46-74e6aafe286a", function () {
        return expect(this.pnp.sp.web.contentTypes.getById(contentTypeId).workflowAssociations()).to.eventually.be.fulfilled;
    }));

    it("update", pnpTest("209ec064-a49c-4df5-a9f5-ce816c9317f5", async function () {
        const ct = await this.pnp.sp.web.contentTypes.getById(contentTypeId)();
        const newName = ct.Name + " updated";
        await this.pnp.sp.web.contentTypes.getById(contentTypeId).update({ Name: newName });
        const ct2 = await this.pnp.sp.web.contentTypes.getById(contentTypeId)();
        return expect(ct2.Name).to.eq(newName);
    }));
});

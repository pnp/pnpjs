import { getSP, testSettings } from "../main.js";
import { expect } from "chai";
import "@pnp/sp/content-types";
import "@pnp/sp/lists/web";
import { getRandomString } from "@pnp/core";
import { SPFI } from "@pnp/sp";

describe("Content Types", function () {

    let _spfi: SPFI = null;
    before(function () {

        if (!testSettings.enableWebTests) {
            this.skip();
        }

        _spfi = getSP();
    });

    it("addAvailableContentType", async function () {
        const listTitle = `PnPJSTEST${getRandomString(8)}`;
        await _spfi.web.lists.add(listTitle, listTitle, 101, true);

        return expect(_spfi.web.lists.getByTitle(listTitle).contentTypes.addAvailableContentType("0x010102")).to.eventually.be.fulfilled;
    });

    it("getById", function () {
        return expect(_spfi.web.contentTypes.getById("0x01")()).to.eventually.be.fulfilled;
    });

    it("add", function () {
        return expect(_spfi.web.contentTypes.add("0x01008D19F38845B0884EBEBE239FDF359184", "PnPJSTEST-" + getRandomString(8))).to.eventually.be.fulfilled;
    });
});

describe("Content Type", function () {

    let contentTypeId: string;
    let _spfi: SPFI = null;

    before(async function () {

        if (!testSettings.enableWebTests) {
            this.skip();
        }

        _spfi = getSP();
        const contentTypeResponse = await _spfi.web.contentTypes.add("0x01008D19F38845B0884EBEBE239FDF359184", "PnPJSTEST-" + getRandomString(8));
        contentTypeId = contentTypeResponse.data.Id.StringValue;
    });

    it("fieldLinks", function () {
        return expect(_spfi.web.contentTypes.getById(contentTypeId).fieldLinks()).to.eventually.be.fulfilled;
    });

    it("fields", function () {
        return expect(_spfi.web.contentTypes.getById(contentTypeId).fields()).to.eventually.be.fulfilled;
    });

    it("parent", function () {
        return expect(_spfi.web.contentTypes.getById(contentTypeId).parent()).to.eventually.be.fulfilled;
    });

    it("workflowAssociations", function () {
        return expect(_spfi.web.contentTypes.getById(contentTypeId).workflowAssociations()).to.eventually.be.fulfilled;
    });
});

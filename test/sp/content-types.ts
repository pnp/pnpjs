import { sp } from "@pnp/sp";
import { testSettings } from "../main";
import { expect } from "chai";
import "@pnp/sp/content-types";
import "@pnp/sp/lists/web";
import { getRandomString } from "@pnp/common";

describe("Content Types", function () {

    if (testSettings.enableWebTests) {

        it(".addAvailableContentType", async function () {
            const listTitle = `PnPJSTEST${getRandomString(8)}`;
            await sp.web.lists.add(listTitle, listTitle, 101, true);

            return expect(sp.web.lists.getByTitle(listTitle).contentTypes.addAvailableContentType("0x010102")).to.eventually.be.fulfilled;
        });

        it(".getById", function () {
            return expect(sp.web.contentTypes.getById("0x01").get()).to.eventually.be.fulfilled;
        });

        it(".add", function () {
            return expect(sp.web.contentTypes.add("0x01008D19F38845B0884EBEBE239FDF359184", "PnPJSTEST-" + getRandomString(8))).to.eventually.be.fulfilled;
        });
    }
});

describe("Content Type", function () {
    let contentTypeId: string;
    before(async function () {
        const contentTypeResponse = await sp.web.contentTypes.add("0x01008D19F38845B0884EBEBE239FDF359184", "PnPJSTEST-" + getRandomString(8));
        contentTypeId = contentTypeResponse.data.Id.StringValue;
    });

    if (testSettings.enableWebTests) {

        it(".fieldLinks", function () {
            return expect(sp.web.contentTypes.getById(contentTypeId).fieldLinks()).to.eventually.be.fulfilled;
        });

        it(".fields", function () {
            return expect(sp.web.contentTypes.getById(contentTypeId).fields()).to.eventually.be.fulfilled;
        });

        it(".parent", function () {
            return expect(sp.web.contentTypes.getById(contentTypeId).parent()).to.eventually.be.fulfilled;
        });

        it(".workflowAssociations", function () {
            return expect(sp.web.contentTypes.getById(contentTypeId).workflowAssociations()).to.eventually.be.fulfilled;
        });
    }
});

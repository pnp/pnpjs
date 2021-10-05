import { getSP, testSettings } from "../main.js";
import { expect } from "chai";
import "@pnp/sp/content-types";
import "@pnp/sp/lists/web";
import { getRandomString } from "@pnp/core";
import { SPRest } from "@pnp/sp";

describe("Content Types", function () {

    if (testSettings.enableWebTests) {
        let _spRest: SPRest = null;
        before(function () {
            _spRest = getSP();
        });

        it(".addAvailableContentType", async function () {
            const listTitle = `PnPJSTEST${getRandomString(8)}`;
            await _spRest.web.lists.add(listTitle, listTitle, 101, true);

            return expect(_spRest.web.lists.getByTitle(listTitle).contentTypes.addAvailableContentType("0x010102")).to.eventually.be.fulfilled;
        });

        it(".getById", function () {
            return expect(_spRest.web.contentTypes.getById("0x01")()).to.eventually.be.fulfilled;
        });

        it(".add", function () {
            return expect(_spRest.web.contentTypes.add("0x01008D19F38845B0884EBEBE239FDF359184", "PnPJSTEST-" + getRandomString(8))).to.eventually.be.fulfilled;
        });
    }
});

describe("Content Type", function () {
    let contentTypeId: string;
    let _spRest: SPRest = null;

    before(async function () {
        _spRest = getSP();
        const contentTypeResponse = await _spRest.web.contentTypes.add("0x01008D19F38845B0884EBEBE239FDF359184", "PnPJSTEST-" + getRandomString(8));
        contentTypeId = contentTypeResponse.data.Id.StringValue;
    });

    if (testSettings.enableWebTests) {

        it(".fieldLinks", function () {
            return expect(_spRest.web.contentTypes.getById(contentTypeId).fieldLinks()).to.eventually.be.fulfilled;
        });

        it(".fields", function () {
            return expect(_spRest.web.contentTypes.getById(contentTypeId).fields()).to.eventually.be.fulfilled;
        });

        it(".parent", function () {
            return expect(_spRest.web.contentTypes.getById(contentTypeId).parent()).to.eventually.be.fulfilled;
        });

        it(".workflowAssociations", function () {
            return expect(_spRest.web.contentTypes.getById(contentTypeId).workflowAssociations()).to.eventually.be.fulfilled;
        });
    }
});

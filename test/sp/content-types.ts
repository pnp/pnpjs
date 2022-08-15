import { expect } from "chai";
import "@pnp/sp/content-types";
import "@pnp/sp/lists/web";
import { getRandomString } from "@pnp/core";

describe("Content Types", function () {

    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    it("addAvailableContentType", async function () {
        const listTitle = `PnPJSTEST${getRandomString(8)}`;
        await this.pnp.sp.web.lists.add(listTitle, listTitle, 101, true);

        return expect(this.pnp.sp.web.lists.getByTitle(listTitle).contentTypes.addAvailableContentType("0x010102")).to.eventually.be.fulfilled;
    });

    it("getById", function () {
        return expect(this.pnp.sp.web.contentTypes.getById("0x01")()).to.eventually.be.fulfilled;
    });

    it("add", function () {
        return expect(this.pnp.sp.web.contentTypes.add("0x01008D19F38845B0884EBEBE239FDF359184", "PnPJSTEST-" + getRandomString(8))).to.eventually.be.fulfilled;
    });
});

describe("Content Type", function () {

    let contentTypeId: string;

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        const contentTypeResponse = await this.pnp.sp.web.contentTypes.add("0x01008D19F38845B0884EBEBE239FDF359184", "PnPJSTEST-" + getRandomString(8));
        contentTypeId = contentTypeResponse.data.Id.StringValue;
    });

    it("fieldLinks", function () {
        return expect(this.pnp.sp.web.contentTypes.getById(contentTypeId).fieldLinks()).to.eventually.be.fulfilled;
    });

    it("fields", function () {
        return expect(this.pnp.sp.web.contentTypes.getById(contentTypeId).fields()).to.eventually.be.fulfilled;
    });

    it("parent", function () {
        return expect(this.pnp.sp.web.contentTypes.getById(contentTypeId).parent()).to.eventually.be.fulfilled;
    });

    it("workflowAssociations", function () {
        return expect(this.pnp.sp.web.contentTypes.getById(contentTypeId).workflowAssociations()).to.eventually.be.fulfilled;
    });

    it("update", function () {

        const p = this.pnp.sp.web.contentTypes.getById(contentTypeId)().then((ct) => {

            const newName = ct.Name + " updated";
            this.pnp.sp.web.contentTypes.getById(contentTypeId).update({ Name: newName }).then(() => {

                this.pnp.sp.web.contentTypes.getById(contentTypeId)().then(function (ct2) {
                    if (ct2.Name !== newName) {
                        throw Error("Update web failed");
                    }
                });
            });
        });

        return expect(p).to.eventually.be.fulfilled;
    });
});

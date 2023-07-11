import { expect } from "chai";
import "@pnp/graph/shares";

describe("Shares", function () {

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    it("encodeSharingLink", async function () {

        const link = this.pnp.graph.shares.encodeSharingLink("https://something.sharepoint.com/sites/site/shared documents/something.docx");

        return expect(link).to.eq("u!aHR0cHM6Ly9zb21ldGhpbmcuc2hhcmVwb2ludC5jb20vc2l0ZXMvc2l0ZS9zaGFyZWQgZG9jdW1lbnRzL3NvbWV0aGluZy5kb2N4");
    });

    it("encodeSharingLink %20", async function () {

        const link = this.pnp.graph.shares.encodeSharingLink("https://something.sharepoint.com/sites/site/shared%20documents/something.docx");

        return expect(link).to.eq("u!aHR0cHM6Ly9zb21ldGhpbmcuc2hhcmVwb2ludC5jb20vc2l0ZXMvc2l0ZS9zaGFyZWQlMjBkb2N1bWVudHMvc29tZXRoaW5nLmRvY3g");
    });
});

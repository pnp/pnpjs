import { expect } from "chai";
import { SPFI } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/lists";
import "@pnp/sp/forms";
import { getSP } from "../main.js";

describe("Forms", function () {
    const listName = "Documents";

    let _spfi: SPFI = null;

    before(function () {

        if (!this.settings.enableWebTests) {
            this.skip();
        }

        _spfi = getSP();
    });

    it("Forms: gets form by id", async function () {
        const forms = await _spfi.web.lists.getByTitle(listName).forms();
        const formId = forms[0].Id;
        const form = await _spfi.web.lists.getByTitle(listName).forms.getById(formId).select("Id")<{ Id: string }>();
        return expect(form.Id).to.eq(formId);
    });
});

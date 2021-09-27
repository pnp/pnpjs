import { expect } from "chai";
import "@pnp/sp/sites";
import "@pnp/sp/lists";
import "@pnp/sp/forms";
import { getSP, testSettings } from "../main-2.js";

describe("Forms", function () {
    let sp = getSP();
    const listName = "Documents";
    if (testSettings.enableWebTests) {

        it("Forms: gets form by id", async function () {
            const forms = await sp.web.lists.getByTitle(listName).forms();
            const formId = forms[0].Id;
            const form = await sp.web.lists.getByTitle(listName).forms.getById(formId)<{ Id: string }>();
            return expect(form.Id).to.eq(formId);
        });
    }
});

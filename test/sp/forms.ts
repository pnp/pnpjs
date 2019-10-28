import { expect } from "chai";
import { sp } from "@pnp/sp";
import "@pnp/sp/src/sites";
import "@pnp/sp/src/lists";
import "@pnp/sp/src/forms";
import { testSettings } from "../main";

describe("Forms", function () {
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

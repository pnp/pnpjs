import { expect } from "chai";
import { sp } from "@pnp/sp";
import "@pnp/sp/src/sites";
import "@pnp/sp/src/lists";
import "@pnp/sp/src/forms";
import { testSettings } from "../main";
import { _Form, _IForm } from "@pnp/sp/src/forms/types";


describe("Forms", function () {
    const listName = "Documents";
    if (testSettings.enableWebTests) {
        // Web Tests
        it("Forms: gets form by id", async function () {
            const list = await sp.web.lists.getByTitle(listName);
            const forms = await list.forms.get();
            const formId = forms[0].Id;
            const form = await sp.web.lists.getByTitle(listName).forms.getById(formId).get<{ id: string }>();
            return expect(form.id).to.eq(formId);
        });
    }
});

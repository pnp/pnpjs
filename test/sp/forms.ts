import { expect } from "chai";
import "@pnp/sp/sites";
import "@pnp/sp/lists";
import "@pnp/sp/forms";
import { testSettings } from "../main.js";

describe("Forms", function () {
    // const listName = "Documents";

    if (testSettings.enableWebTests) {
        // let _spfi: SPFI = null;

        // before(function () {
        //     _spfi = getSP();
        // });

        // TODO: fix typing for typing getByID
        it("Forms: gets form by id", async function () {
            // const forms = await _spfi.web.lists.getByTitle(listName).forms();
            // const formId = forms[0].Id;
            // const form = await _spfi.web.lists.getByTitle(listName).forms.getById(formId)<{ Id: string }>;
            // return expect(form.Id).to.eq(formId);
            return expect(false);
        });
    }
});

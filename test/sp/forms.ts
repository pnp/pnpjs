import { expect } from "chai";
import "@pnp/sp/sites";
import "@pnp/sp/lists";
import "@pnp/sp/forms";
import { testSettings } from "../main.js";

describe("Forms", function () {
    // const listName = "Documents";

    if (testSettings.enableWebTests) {
        // let _spRest: SPRest = null;

        // before(function () {
        //     _spRest = getSP();
        // });

        // TODO: fix typing for typing getByID
        it("Forms: gets form by id", async function () {
            // const forms = await _spRest.web.lists.getByTitle(listName).forms();
            // const formId = forms[0].Id;
            // const form = await _spRest.web.lists.getByTitle(listName).forms.getById(formId)<{ Id: string }>;
            // return expect(form.Id).to.eq(formId);
            return expect(false);
        });
    }
});

import { expect } from "chai";
import "@pnp/sp/sites";
import "@pnp/sp/lists";
import "@pnp/sp/forms";
import { pnpTest } from  "../pnp-test.js";

describe("Forms", function () {
    const listName = "Documents";

    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    it("Forms: gets form by id", pnpTest("81478185-48b5-410f-8cf9-1cf60c978889", async function () {
        const forms = await this.pnp.sp.web.lists.getByTitle(listName).forms();
        const formId = forms[0].Id;
        const form = await this.pnp.sp.web.lists.getByTitle(listName).forms.getById(formId).select("Id")<{ Id: string }>();
        return expect(form.Id).to.eq(formId);
    }));
});

// this file tests that we are actually producing errors where we should be producing errors
import { expect } from "chai";
import { testSettings } from "../main";
import { sp } from "@pnp/sp";

describe("Errors", () => {
    if (testSettings.enableWebTests) {

        before(async function () {
            await sp.web.lists.ensure("ErrorTestingList");
        });

        it("Add should fail and produce a catchable error", () => {

            return expect(sp.web.lists.getByTitle("ErrorTestingList").items.add({
                Titttle: "This is a fake value for a fake field",
            })).to.eventually.be.rejected;
        });

        it("Update should fail and produce a catchable error", () => {

            return expect(sp.web.lists.getByTitle("ErrorTestingList").items.getById(1).update({
                Titttle: "This is a fake value for a fake field",
            })).to.eventually.be.rejected;
        });
    }
});

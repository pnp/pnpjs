// this file tests that we are actually producing errors where we should be producing errors
import { SPRest } from "@pnp/sp";
import { expect } from "chai";
import { getSP, testSettings } from "../main.js";

describe("Errors", function () {
    if (testSettings.enableWebTests) {
        let _spRest: SPRest = null;

        before(async function () {
            _spRest = getSP();
            await _spRest.web.lists.ensure("ErrorTestingList");
        });

        it("Add should fail and produce a catchable error", function () {

            return expect(_spRest.web.lists.getByTitle("ErrorTestingList").items.add({
                Titttle: "This is a fake value for a fake field",
            })).to.eventually.be.rejected;
        });

        it("Update should fail and produce a catchable error", function () {

            return expect(_spRest.web.lists.getByTitle("ErrorTestingList").items.getById(1).update({
                Titttle: "This is a fake value for a fake field",
            })).to.eventually.be.rejected;
        });
    }
});

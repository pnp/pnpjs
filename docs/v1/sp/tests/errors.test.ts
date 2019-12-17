// this file tests that we are actually producing errors where we should be producing errors
import { expect } from "chai";
import { testSettings } from "../../../test/main";
import { sp } from "../";

describe("Errors", () => {

    before(function (done) {

        if (testSettings.enableWebTests) {

            // setup a list with a single item we know we can try and update
            sp.web.lists.ensure("ErrorTestingList").then(result => {

                result.list.items.add({
                    Title: "An Item",
                }).then(_ => {
                    done();
                }).catch(_ => {
                    done();
                });

            }).catch(_ => {
                done();
            });

        } else {

            done();
        }
    });

    if (testSettings.enableWebTests) {

        describe("List", () => {
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
        });
    }
});

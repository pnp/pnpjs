import { expect } from "chai";
import "@pnp/sp/taxonomy";
import { getSP, testSettings } from "../main.js";
import { SPRest } from "@pnp/sp";

/**
 * Skipping for now as the API is not fully deployed or stable yet. These tests passed within my tenant.
 * So it worked on my machine. ;)
 */
describe("Taxonomy", function () {

    if (testSettings.enableWebTests) {
        let _spRest: SPRest = null;

        before(function () {
            _spRest = getSP();
        });

        it("Get Term Store Info", async function () {

            const info = await _spRest.termStore();
            return expect(info).has.property("id");
        });

        it("Get Term Group Info (groups)", async function () {

            const info = await _spRest.termStore.groups();

            if (info.length < 1) {
                return;
            }

            return expect(info[0]).has.property("id");
        });

        it("Get Term Group By Id Info (groups)", async function () {

            const info = await _spRest.termStore.groups();

            if (info.length < 1) {
                return;
            }

            return expect(_spRest.termStore.groups.getById(info[0].id)()).to.eventually.have.property("id");
        });


        /**
         * Term Sets
         */
        it("Get Term Set Info (sets)", async function () {

            const info = await _spRest.termStore.groups.top(1)();

            if (info.length < 1) {
                return;
            }

            const info2 = await _spRest.termStore.groups.getById(info[0].id).sets();

            if (info2.length < 1) {
                return;
            }

            return expect(info2[0]).has.property("id");
        });

        it("Get Term Set By Id Info (sets)", async function () {

            const info = await _spRest.termStore.groups.top(1)();

            if (info.length < 1) {
                return;
            }

            const group = _spRest.termStore.groups.getById(info[0].id);
            const info2 = await group.sets();

            if (info2.length < 1) {
                return;
            }

            return expect(group.sets.getById(info2[0].id)()).to.eventually.have.property("id");
        });


        /**
         * Terms
         */
        it("Get Terms Info (sets)", async function () {

            const info = await _spRest.termStore.groups.top(1)();

            if (info.length < 1) {
                return;
            }

            const group = _spRest.termStore.groups.getById(info[0].id);
            const info2 = await group.sets();

            if (info2.length < 1) {
                return;
            }

            return expect(group.sets.getById(info2[0].id).children()).to.eventually.be.fulfilled;
        });

        it("Get Term Info (sets)", async function () {

            const info = await _spRest.termStore.groups.top(1)();

            if (info.length < 1) {
                return;
            }

            const group = _spRest.termStore.groups.getById(info[0].id);
            const info2 = await group.sets();

            if (info2.length < 1) {
                return;
            }

            const info3 = await group.sets.getById(info2[0].id).children();

            if (info3.length < 1) {
                return;
            }

            return expect(group.sets.getById(info2[0].id).getTermById(info3[0].id)()).to.eventually.have.property("id");
        });
    }
});

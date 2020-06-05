import { expect } from "chai";
import { sp } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { testSettings } from "../main";

/**
 * Skipping for now as the API is not fully deployed or stable yet. These tests passed within my tenant.
 * So it worked on my machine. ;)
 */
describe.skip("Taxonomy", () => {

    if (testSettings.enableWebTests) {

        it("Get Term Store Info", async function () {

            const info = await sp.termStore();
            return expect(info).has.property("id");
        });

        it("Get Term Group Info (termGroups)", async function () {

            const info = await sp.termStore.termGroups();

            if (info.length < 1) {
                return;
            }

            return expect(info[0]).has.property("id");
        });

        it("Get Term Group Info (groups)", async function () {

            const info = await sp.termStore.groups();

            if (info.length < 1) {
                return;
            }

            return expect(info[0]).has.property("id");
        });

        it("Get Term Group By Id Info (termGroups)", async function () {

            const info = await sp.termStore.termGroups();

            if (info.length < 1) {
                return;
            }

            return expect(sp.termStore.termGroups.getById(info[0].id)()).to.eventually.have.property("id");
        });

        it("Get Term Group By Id Info (groups)", async function () {

            const info = await sp.termStore.groups();

            if (info.length < 1) {
                return;
            }

            return expect(sp.termStore.groups.getById(info[0].id)()).to.eventually.have.property("id");
        });


        /**
         * Term Sets
         */
        it("Get Term Set Info (termSets)", async function () {

            const info = await sp.termStore.groups.top(1)();

            if (info.length < 1) {
                return;
            }

            const info2 = await sp.termStore.groups.getById(info[0].id).sets();

            if (info2.length < 1) {
                return;
            }

            return expect(info2[0]).has.property("id");
        });

        it("Get Term Set Info (sets)", async function () {

            const info = await sp.termStore.groups.top(1)();

            if (info.length < 1) {
                return;
            }

            const info2 = await sp.termStore.groups.getById(info[0].id).sets();

            if (info2.length < 1) {
                return;
            }

            return expect(info2[0]).has.property("id");
        });

        it("Get Term Set By Id Info (termSets)", async function () {

            const info = await sp.termStore.groups.top(1)();

            if (info.length < 1) {
                return;
            }

            const group = sp.termStore.groups.getById(info[0].id);
            const info2 = await group.termSets();

            if (info2.length < 1) {
                return;
            }

            return expect(group.termSets.getById(info2[0].id)()).to.eventually.have.property("id");
        });

        it("Get Term Set By Id Info (sets)", async function () {

            const info = await sp.termStore.groups.top(1)();

            if (info.length < 1) {
                return;
            }

            const group = sp.termStore.groups.getById(info[0].id);
            const info2 = await group.sets();

            if (info2.length < 1) {
                return;
            }

            return expect(group.sets.getById(info2[0].id)()).to.eventually.have.property("id");
        });


        /**
         * Terms
         */
        it("Get Terms Info (termSets)", async function () {

            const info = await sp.termStore.termGroups.top(1)();

            if (info.length < 1) {
                return;
            }

            const group = sp.termStore.termGroups.getById(info[0].id);
            const info2 = await group.termSets();

            if (info2.length < 1) {
                return;
            }

            return expect(group.termSets.getById(info2[0].id).terms()).to.eventually.be.fulfilled;
        });

        it("Get Terms Info (sets)", async function () {

            const info = await sp.termStore.groups.top(1)();

            if (info.length < 1) {
                return;
            }

            const group = sp.termStore.groups.getById(info[0].id);
            const info2 = await group.sets();

            if (info2.length < 1) {
                return;
            }

            return expect(group.sets.getById(info2[0].id).terms()).to.eventually.be.fulfilled;
        });

        it("Get Term Info (termSets)", async function () {

            const info = await sp.termStore.termGroups.top(1)();

            if (info.length < 1) {
                return;
            }

            const group = sp.termStore.termGroups.getById(info[0].id);
            const info2 = await group.termSets();

            if (info2.length < 1) {
                return;
            }

            const info3 = await group.termSets.getById(info2[0].id).terms();

            if (info3.length < 1) {
                return;
            }

            return expect(group.termSets.getById(info2[0].id).terms.getById(info3[0].id)()).to.eventually.have.property("id");
        });

        it("Get Term Info (sets)", async function () {

            const info = await sp.termStore.groups.top(1)();

            if (info.length < 1) {
                return;
            }

            const group = sp.termStore.groups.getById(info[0].id);
            const info2 = await group.sets();

            if (info2.length < 1) {
                return;
            }

            const info3 = await group.sets.getById(info2[0].id).terms();

            if (info3.length < 1) {
                return;
            }

            return expect(group.sets.getById(info2[0].id).terms.getById(info3[0].id)()).to.eventually.have.property("id");
        });
    }
});

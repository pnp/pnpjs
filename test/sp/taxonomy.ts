import { expect } from "chai";
import "@pnp/sp/taxonomy";
import { getSP, testSettings } from "../main.js";
import { SPFI } from "@pnp/sp";
import { IRelation, ITermSet } from "@pnp/sp/taxonomy";

/**
 * Skipping for now as the API is not fully deployed or stable yet. These tests passed within my tenant.
 * So it worked on my machine. ;)
 */
describe("Taxonomy", function () {

    let _spfi: SPFI = null;

    before(function () {

        if (!testSettings.enableWebTests) {
            this.skip();
        }

        _spfi = getSP();
    });

    describe("TermStore", function () {
        it("-invoke", async function () {

            const info = await _spfi.termStore();
            return expect(info).has.property("id");
        });

        it("groups", async function () {
            const info = await _spfi.termStore.groups();

            if (info === undefined || info.length < 1) {
                return expect(info).to.be.an("Array");
            }

            return expect(info[0]).has.property("id");
        });

        // TODO: sets gives API not found error on termStore... need to remove/or fix.
        it.skip(".sets", async function () {
            const url = _spfi.termStore.sets.toRequestUrl();
            console.log(`Sets: ${url}`);
            const info = await _spfi.termStore.sets();
            if (info === undefined || info.length < 1) {
                return expect(info).to.be.an("Array");
            }

            return expect(info[0]).has.property("id");
        });

        it("groups.getById", async function () {

            const info = await _spfi.termStore.groups();

            if (info === undefined || info.length < 1) {
                return expect(info).to.be.an("Array");
            }

            const group = await _spfi.termStore.groups.getById(info[0].id)();

            return expect(group).has.property("id");
        });

        // TODO: sets gives API not found error on termStore... need to remove/or fix.
        it.skip(".sets.getById", async function () {

            const info = await _spfi.termStore.sets();

            if (info === undefined || info.length < 1) {
                return expect(info).to.be.an("Array");
            }

            const set = await _spfi.termStore.sets.getById(info[0].id)();
            return expect(set).has.property("id");
        });
    });
    /**
     * Term Sets
     */
    describe("TermSets", function () {
        let termset: ITermSet = null;

        before(async function () {
            const groups = await _spfi.termStore.groups();

            if (groups === undefined || groups?.length < 1) {
                this.skip();
            }
            const groupId = groups[0].id;

            const sets = await _spfi.termStore.groups.getById(groupId).sets();
            if (sets === undefined || sets?.length < 1) {
                this.skip();
            }
            const termsetId = sets[0].id;
            termset = _spfi.termStore.groups.getById(groupId).sets.getById(termsetId);
        });

        it("terms", async function () {
            const terms = await termset.terms();
            return expect(terms).to.be.an("Array");
        });

        // TODO: parentGroup gives API not found error on termset... need to remove/or fix.
        it.skip(".parentGroup", async function () {
            const parentGroup = await termset.parentGroup();
            return expect(parentGroup).has.property("id");
        });

        it("children", async function () {
            const children = await termset.children();
            return expect(children).to.be.an("Array");
        });

        it("relations", async function () {
            const relations = await termset.relations();
            return expect(relations).to.be.an("Array");
        });

        it("getTermById", async function () {
            const terms = await termset.terms();
            if (terms.length < 1) {
                return;
            }
            const termById = await termset.getTermById(terms[0].id)();
            return expect(termById).has.property("id");
        });
    });

    /**
     * Terms
     */
    describe("Terms", function () {
        let term = null;

        before(async function () {
            const groups = await _spfi.termStore.groups();

            if (groups === undefined || groups?.length < 1) {
                this.skip();
            }
            const groupId = groups[0].id;

            const sets = await _spfi.termStore.groups.getById(groupId).sets();

            if (sets === undefined || sets?.length < 1) {
                this.skip();
            }
            const setId = sets[0].id;

            const terms = await _spfi.termStore.groups.getById(groupId).sets.getById(setId).terms();
            if (terms === undefined || terms?.length < 1) {
                this.skip();
            }
            const termId = terms[0].id;
            term = _spfi.termStore.groups.getById(groupId).sets.getById(setId).terms.getById(termId);
        });

        it("getById", async function () {
            const info = await term();
            return expect(info).has.property("id");
        });

        it("term.children", async function () {
            const children = await term.children();
            return expect(children).to.be.an("Array");
        });

        it("term.relations", async function () {
            const relations = await term.relations();
            return expect(relations).to.be.an("Array");
        });

        // TODO: set gives API not found error on termset... need to remove/or fix.
        it.skip("term.set", async function () {
            const set = await term.set();
            return expect(set).has.property("id");
        });
    });

    /**
     * Terms
     */
    describe("Relations", function () {
        let relation: IRelation = null;

        before(async function () {
            const groups = await _spfi.termStore.groups();

            if (groups === undefined || groups?.length < 1) {
                this.skip();
            }
            const groupId = groups[0].id;

            const sets = await _spfi.termStore.groups.getById(groupId).sets();

            if (sets === undefined || sets?.length < 1) {
                this.skip();
            }
            const setId = sets[0].id;

            const relations = await _spfi.termStore.groups.getById(groupId).sets.getById(setId).relations();

            if (relations === undefined || relations?.length < 1) {
                this.skip();
            }

            const relationId = relations[0].id;
            relation = _spfi.termStore.groups.getById(groupId).sets.getById(setId).relations.getById(relationId);
        });

        it("getById", async function () {
            const invoke = await relation();
            return expect(invoke).has.property("id");
        });

        it("relation.fromTerm", async function () {
            const term = await relation.fromTerm();
            return expect(term).has.property("id");
        });

        it("relation.toTerm", async function () {
            const term = await relation.toTerm();
            return expect(term).has.property("id");
        });

        it("relation.set", async function () {
            const set = await relation.set();
            return expect(set).has.property("id");
        });
    });
});

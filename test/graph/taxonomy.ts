import { expect } from "chai";
import "@pnp/graph/sites";
import "@pnp/graph/taxonomy";
import { ITermSet } from "@pnp/graph/taxonomy";
import { pnpTest } from "../pnp-test.js";

describe("Taxonomy", function () {

    before(pnpTest("958e0a91-8a94-4859-b03e-475f75213923", function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    }));

    describe("TermStore", function () {
        it("-invoke", pnpTest("2e18bce7-eb2a-422b-b08f-478d968c8b72", async function () {

            const info = await this.pnp.graph.termStore();
            return expect(info).has.property("id");
        }));

        it("groups", pnpTest("3683c166-007f-4d89-a960-cec103190f6d", async function () {
            const info = await this.pnp.graph.termStore.groups();

            if (info === undefined || info.length < 1) {
                return expect(info).to.be.an("Array");
            }

            return expect(info[0]).has.property("id");
        }));

        // TODO: sets gives API not found error on termStore... need to remove/or fix.
        it.skip(".sets", pnpTest("33b1489a-3e4c-4085-8a96-7bf8121918dc", async function () {
            const url = this.pnp.graph.termStore.sets.toRequestUrl();
            console.log(`Sets: ${url}`);
            const info = await this.pnp.graph.termStore.sets();
            if (info === undefined || info.length < 1) {
                return expect(info).to.be.an("Array");
            }

            return expect(info[0]).has.property("id");
        }));

        it("groups.getById", pnpTest("e5e48db2-da80-4395-bee3-5f297fdcb776", async function () {

            const info = await this.pnp.graph.termStore.groups();

            if (info === undefined || info.length < 1) {
                return expect(info).to.be.an("Array");
            }

            const group = await this.pnp.graph.termStore.groups.getById(info[0].id)();

            return expect(group).has.property("id");
        }));

        // TODO: sets gives API not found error on termStore... need to remove/or fix.
        it.skip(".sets.getById", pnpTest("25c32061-a5f7-40e2-a80a-0911112bcf94", async function () {

            const info = await this.pnp.graph.termStore.sets();

            if (info === undefined || info.length < 1) {
                return expect(info).to.be.an("Array");
            }

            const set = await this.pnp.graph.termStore.sets.getById(info[0].id)();
            return expect(set).has.property("id");
        }));
    });
    /**
     * Term Sets
     */
    describe("TermSets", function () {
        let termset: ITermSet = null;

        before(pnpTest("3dfea647-347b-4e9b-838b-5091e44cd4e8", async function () {
            const groups = await this.pnp.graph.termStore.groups();

            if (groups === undefined || groups?.length < 1) {
                this.skip();
            }
            const groupId = groups[0].id;

            const sets = await this.pnp.graph.termStore.groups.getById(groupId).sets();
            if (sets === undefined || sets?.length < 1) {
                this.skip();
            }
            const termsetId = sets[0].id;
            termset = this.pnp.graph.termStore.groups.getById(groupId).sets.getById(termsetId);
        }));

        it("terms", pnpTest("eaaff08c-4fd8-4088-90df-7e0b727eed6f", async function () {
            const terms = await termset.terms();
            return expect(terms).to.be.an("Array");
        }));

        it("children", pnpTest("c35d6fbc-d9c8-4b8f-ad0b-071d65b65454", async function () {
            const children = await termset.children();
            return expect(children).to.be.an("Array");
        }));

        it("relations", pnpTest("f9a19109-59a1-4126-90a0-84f83f1cf9ff", async function () {
            const relations = await termset.relations();
            return expect(relations).to.be.an("Array");
        }));

        it("getTermById", pnpTest("5b160218-dd46-4449-99bb-ab574e616cb7", async function () {
            const terms = await termset.terms();
            if (terms.length < 1) {
                return;
            }
            const termById = await termset.getTermById(terms[0].id)();
            return expect(termById).has.property("id");
        }));
    });

    /**
     * Terms
     */
    describe("Terms", function () {
        let term = null;

        before(pnpTest("7b6b173b-b720-4971-8dc6-5fad6aaac045", async function () {
            const groups = await this.pnp.graph.termStore.groups();

            if (groups === undefined || groups?.length < 1) {
                this.skip();
            }
            const groupId = groups[0].id;

            const sets = await this.pnp.graph.termStore.groups.getById(groupId).sets();

            if (sets === undefined || sets?.length < 1) {
                this.skip();
            }
            const setId = sets[0].id;

            const terms = await this.pnp.graph.termStore.groups.getById(groupId).sets.getById(setId).terms();
            if (terms === undefined || terms?.length < 1) {
                this.skip();
            }
            const termId = terms[0].id;
            term = this.pnp.graph.termStore.groups.getById(groupId).sets.getById(setId).terms.getById(termId);
        }));

        it("getById", pnpTest("ef7eef9c-fd2f-410d-a576-5f4fdfa9f3cb", async function () {
            const info = await term();
            return expect(info).has.property("id");
        }));

        it("term.children", pnpTest("12e1e1f9-4c8c-43f9-8c41-1cfcf1a95a7d", async function () {
            const children = await term.children();
            return expect(children).to.be.an("Array");
        }));

        it("term.relations", pnpTest("6d2a9d27-9697-4638-9b93-7e739a10f56d", async function () {
            const relations = await term.relations();
            return expect(relations).to.be.an("Array");
        }));
    });
});

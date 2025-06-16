import { expect } from "chai";
import { pnpTest } from "../pnp-test.js";
import "@pnp/graph/groups";
import "@pnp/graph/users";
import { ConsistencyLevel, AdvancedQuery } from "@pnp/graph/index.js";

describe("Graph Query Params", function () {

    before(pnpTest("5491208f-ca7f-4c9d-b52a-b1dc473932d0", async function () {

        if ((!this.pnp.settings.enableWebTests)) {
            this.skip();
        }
    }));

    it("groupTypes/any(c:c eq 'Unified')", pnpTest("158a6aa2-3d0e-4435-88e0-11a146db133e", async function () {

        return expect(this.pnp.graph.groups.filter("groupTypes/any(c:c eq 'Unified')")()).to.eventually.be.fulfilled;
    }));

    it("NOT groupTypes/any(c:c eq 'Unified')", pnpTest("b26626fc-d5ee-4a46-afc1-1ae210d1a739", async function () {

        const query = this.pnp.graph.groups.using(ConsistencyLevel()).filter("NOT groupTypes/any(c:c eq 'Unified')");
        query.query.set("$count", "true");

        return expect(query()).to.eventually.be.fulfilled;
    }));

    it("companyName ne null and NOT(companyName eq 'Microsoft')", pnpTest("bbca7a4d-6fce-4c1b-904f-e295919ea25e", async function () {

        const query = this.pnp.graph.users.using(ConsistencyLevel()).filter("companyName ne null and NOT(companyName eq 'Microsoft')");
        query.query.set("$count", "true");

        return expect(query()).to.eventually.be.fulfilled;
    }));

    it("not(assignedLicenses/$count eq 0)", pnpTest("1b25afc7-771e-43be-a549-a6b2c326072b", async function () {

        const query = this.pnp.graph.users.using(ConsistencyLevel()).filter("not(assignedLicenses/$count eq 0)");
        query.query.set("$count", "true");

        return expect(query()).to.eventually.be.fulfilled;
    }));

    describe("AdvancedQuery", () => {
        it("NOT groupTypes/any(c:c eq 'Unified')", pnpTest("d24d9b36-d5dc-4a6c-81fa-2e9a73911372", async function () {

            const query = this.pnp.graph.groups.using(AdvancedQuery()).filter("NOT groupTypes/any(c:c eq 'Unified')");

            return expect(query()).to.eventually.be.fulfilled;
        }));

        it("companyName ne null and NOT(companyName eq 'Microsoft')", pnpTest("33791988-de36-4a6d-88e1-23f6838236ac", async function () {

            const query = this.pnp.graph.users.using(AdvancedQuery()).filter("companyName ne null and NOT(companyName eq 'Microsoft')");

            return expect(query()).to.eventually.be.fulfilled;
        }));

        it("not(assignedLicenses/$count eq 0)", pnpTest("fe202c37-e10e-4b1c-b410-99cf059a491b", async function () {

            const query = this.pnp.graph.users.using(AdvancedQuery()).filter("not(assignedLicenses/$count eq 0)");

            return expect(query()).to.eventually.be.fulfilled;
        }));
    });
});

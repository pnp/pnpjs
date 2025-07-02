import { expect } from "chai";
import "@pnp/sp/search";
import { SearchQueryBuilder } from "@pnp/sp/search";
import { pnpTest } from  "../pnp-test.js";

// we skip these tests due to app level permissions not being able to use search
describe.skip("Search", function () {

    before(pnpTest("60092dbc-286f-47c2-bff6-d1c78c2aa41f", function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    }));

    it("search (Basic)", pnpTest("1fa6781f-0808-48a7-b2f7-927fc0aa8a3b", function () {
        return expect(this.pnp.sp.search("test")).to.eventually.be.fulfilled;
    }));

    it("search (Advanced)", pnpTest("d531b3c0-a8df-440e-be75-620042585f58", function () {

        return expect(this.pnp.sp.search({
            ProcessBestBets: true,
            Querytext: "test",
            RowLimit: 10,
        })).to.eventually.be.fulfilled;
    }));

    it("search (BestBets)", pnpTest("99112de7-8426-4f21-bdeb-f131eb662d5d", function () {

        const builder = SearchQueryBuilder("test").processBestBets.rowLimit(10);

        return expect(this.pnp.sp.search(builder)).to.eventually.be.fulfilled;
    }));

    it("searchSuggest", pnpTest("41a6f463-d699-45e2-84ea-cbfe5ad78ac1", function () {

        return expect(this.pnp.sp.searchSuggest({ querytext: "test" })).to.eventually.be.fulfilled;
    }));
});

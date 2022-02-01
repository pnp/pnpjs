import { expect } from "chai";
import "@pnp/sp/search";
import { SearchQueryBuilder } from "@pnp/sp/search";

// we skip these tests due to app level permissions not being able to use search
describe.skip("Search", function () {

    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    it("search (Basic)", function () {
        return expect(this.pnp.sp.search("test")).to.eventually.be.fulfilled;
    });

    it("search (Advanced)", function () {

        return expect(this.pnp.sp.search({
            ProcessBestBets: true,
            Querytext: "test",
            RowLimit: 10,
        })).to.eventually.be.fulfilled;
    });

    it("search (BestBets)", function () {

        const builder = SearchQueryBuilder("test").processBestBets.rowLimit(10);

        return expect(this.pnp.sp.search(builder)).to.eventually.be.fulfilled;
    });

    it("searchSuggest", function () {

        return expect(this.pnp.sp.searchSuggest({ querytext: "test" })).to.eventually.be.fulfilled;
    });
});

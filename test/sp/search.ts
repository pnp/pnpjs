import { expect } from "chai";
import { sp } from "@pnp/sp";
import "@pnp/sp/search";
import { SearchQueryBuilder } from "@pnp/sp/search";

// we skip these tests due to permissions difficulties across environments
describe.skip("Search", () => {

    it(".search - 1", function () {

        return expect(sp.search("test")).to.eventually.be.fulfilled;
    });

    it(".search - 2", function () {

        return expect(sp.search({
            ProcessBestBets: true,
            Querytext: "test",
            RowLimit: 10,
        })).to.eventually.be.fulfilled;
    });

    it(".search - 3", function () {

        const builder = SearchQueryBuilder("test").processBestBets.rowLimit(10);

        return expect(sp.search(builder)).to.eventually.be.fulfilled;
    });

    it(".suggest", function () {

        return expect(sp.searchSuggest({ querytext: "test" })).to.eventually.be.fulfilled;
    });
});

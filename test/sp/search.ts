import { expect } from "chai";
import "@pnp/sp/search";
import { SearchQueryBuilder } from "@pnp/sp/search";
import { getSP } from "../main.js";
import { SPFI } from "@pnp/sp";

// we skip these tests due to permissions difficulties across environments
describe.skip("Search", function () {
    let _spfi: SPFI = null;

    before(function () {
        _spfi = getSP();
    });

    it(".search - 1", function () {

        return expect(_spfi.search("test")).to.eventually.be.fulfilled;
    });

    it(".search - 2", function () {

        return expect(_spfi.search({
            ProcessBestBets: true,
            Querytext: "test",
            RowLimit: 10,
        })).to.eventually.be.fulfilled;
    });

    it(".search - 3", function () {

        const builder = SearchQueryBuilder("test").processBestBets.rowLimit(10);

        return expect(_spfi.search(builder)).to.eventually.be.fulfilled;
    });

    it(".suggest", function () {

        return expect(_spfi.searchSuggest({ querytext: "test" })).to.eventually.be.fulfilled;
    });
});

import { expect } from "chai";
import "@pnp/sp/search";
import { SearchQueryBuilder } from "@pnp/sp/search";
import { getSP } from "../main.js";
import { SPRest } from "@pnp/sp";

// we skip these tests due to permissions difficulties across environments
describe.skip("Search", function () {
    let _spRest: SPRest = null;

    before(function () {
        _spRest = getSP();
    });

    it(".search - 1", function () {

        return expect(_spRest.search("test")).to.eventually.be.fulfilled;
    });

    it(".search - 2", function () {

        return expect(_spRest.search({
            ProcessBestBets: true,
            Querytext: "test",
            RowLimit: 10,
        })).to.eventually.be.fulfilled;
    });

    it(".search - 3", function () {

        const builder = SearchQueryBuilder("test").processBestBets.rowLimit(10);

        return expect(_spRest.search(builder)).to.eventually.be.fulfilled;
    });

    it(".suggest", function () {

        return expect(_spRest.searchSuggest({ querytext: "test" })).to.eventually.be.fulfilled;
    });
});

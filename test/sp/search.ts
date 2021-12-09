import { expect } from "chai";
import "@pnp/sp/search";
import { SearchQueryBuilder } from "@pnp/sp/search";
import { getSP, testSettings } from "../main.js";
import { SPFI } from "@pnp/sp";

// we skip these tests due to app level permissions not being able to use search
describe.skip("Search", function () {

    let _spfi: SPFI = null;

    before(function () {

        if (!testSettings.enableWebTests) {
            this.skip();
        }

        _spfi = getSP();
    });

    it("search (Basic)", function () {
        return expect(_spfi.search("test")).to.eventually.be.fulfilled;
    });

    it("search (Advanced)", function () {

        return expect(_spfi.search({
            ProcessBestBets: true,
            Querytext: "test",
            RowLimit: 10,
        })).to.eventually.be.fulfilled;
    });

    it("search (BestBets)", function () {

        const builder = SearchQueryBuilder("test").processBestBets.rowLimit(10);

        return expect(_spfi.search(builder)).to.eventually.be.fulfilled;
    });

    it("searchSuggest", function () {

        return expect(_spfi.searchSuggest({ querytext: "test" })).to.eventually.be.fulfilled;
    });
});

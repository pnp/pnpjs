import { SPRest2 } from "../rest-2.js";
import { SearchQueryInit } from "./types.js";
import { SearchResults, Search } from "./query.js";
import { ISuggestQuery, ISuggestResult, Suggest } from "./suggest.js";

export * from "./types.js";

export {
    ISearch,
    SearchQueryBuilder,
    SearchResults,
    Search,
} from "./query.js";

export {
    ISuggest,
    IPersonalResultSuggestion,
    ISuggestQuery,
    ISuggestResult,
    Suggest,
} from "./suggest.js";

declare module "../rest-2" {
    interface SPRest2 {
        /**
         * Conduct a search
         *
         * @param query Parameters for the search
         */
        search(query: SearchQueryInit): Promise<SearchResults>;
        /**
         * Conduct a suggest search query
         *
         * @param query Parameters for the search
         */
        searchSuggest(query: string | ISuggestQuery): Promise<ISuggestResult>;
    }
}

SPRest2.prototype.search = function (this: SPRest2, query: SearchQueryInit): Promise<SearchResults> {

    return this.create(Search)(query);
};

SPRest2.prototype.searchSuggest = function (this: SPRest2, query: string | ISuggestQuery): Promise<ISuggestResult> {

    return this.create(Suggest)(typeof query === "string" ? { querytext: query } : query);
};

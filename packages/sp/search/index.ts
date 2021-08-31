import { SPRest } from "../rest.js";
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

declare module "../rest" {
    interface SPRest {
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

SPRest.prototype.search = function (this: SPRest, query: SearchQueryInit): Promise<SearchResults> {

    return this.create(Search)(query);
};

SPRest.prototype.searchSuggest = function (this: SPRest, query: string | ISuggestQuery): Promise<ISuggestResult> {

    return this.create(Suggest)(typeof query === "string" ? { querytext: query } : query);
};

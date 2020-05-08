import { SPRest } from "../rest";
import { SearchQueryInit } from "./types";
import { _Search } from "./query";
import { ICachingOptions } from "@pnp/odata";
import { SearchResults, Search } from "./query";
import { ISuggestQuery, ISuggestResult, Suggest } from "./suggest";

export * from "./types";

export {
    ISearch,
    SearchQueryBuilder,
    SearchResults,
    Search,
} from "./query";

export {
    ISuggest,
    IPersonalResultSuggestion,
    ISuggestQuery,
    ISuggestResult,
    Suggest,
} from "./suggest";

declare module "../rest" {
    interface SPRest {
        /**
         * Conduct a search
         * 
         * @param query Parameters for the search
         */
        search(query: SearchQueryInit): Promise<SearchResults>;
        /**
         * Conduct a search with caching enabled
         * 
         * @param query Parameters for the search
         * @param options Optional, caching options
         */
        searchWithCaching(query: SearchQueryInit, options?: ICachingOptions): Promise<SearchResults>;
        /**
         * Conduct a suggest search query
         * 
         * @param query Parameters for the search
         */
        searchSuggest(query: string | ISuggestQuery): Promise<ISuggestResult>;
    }
}

SPRest.prototype.search = function (this: SPRest, query: SearchQueryInit): Promise<SearchResults> {

    return Search(this._baseUrl, this._options)(query);
};

SPRest.prototype.searchWithCaching = function (this: SPRest, query: SearchQueryInit, options?: ICachingOptions): Promise<SearchResults> {

    return (new _Search(this._baseUrl)).configure(this._options).usingCaching(options).execute(query);
};

SPRest.prototype.searchSuggest = function (this: SPRest, query: string | ISuggestQuery): Promise<ISuggestResult> {

    return Suggest(this._baseUrl, this._options)(typeof query === "string" ? { querytext: query } : query);
};

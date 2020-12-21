import { SPRest } from "../rest.js";
import { SearchQueryInit } from "./types.js";
import { _Search } from "./query.js";
import { ICachingOptions } from "@pnp/odata";
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

    return this.childConfigHook(({ options, baseUrl, runtime }) => {
        return Search(baseUrl, options, runtime)(query);
    });
};

SPRest.prototype.searchWithCaching = function (this: SPRest, query: SearchQueryInit, cacheOptions?: ICachingOptions): Promise<SearchResults> {

    return this.childConfigHook(({ options, baseUrl, runtime }) => {
        return (new _Search(baseUrl)).configure(options).setRuntime(runtime).usingCaching(cacheOptions).execute(query);
    });
};

SPRest.prototype.searchSuggest = function (this: SPRest, query: string | ISuggestQuery): Promise<ISuggestResult> {

    return this.childConfigHook(({ options, baseUrl, runtime }) => {
        return Suggest(baseUrl, options, runtime)(typeof query === "string" ? { querytext: query } : query);
    });
};

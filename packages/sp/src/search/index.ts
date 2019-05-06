import { SPRest } from "../rest";
import { SearchQueryInit } from "./types";
import { _Search } from "./query";
import { ICachingOptions } from "@pnp/odata";
import { SearchResults, SearchFactory } from "./query";
import { ISearchSuggestQuery, ISearchSuggestResult, SuggestFactory } from "./suggest";

export * from "./types";

export {
    ISearch,
    Search,
    SearchFactory,
    SearchQueryBuilder,
    SearchResults,
} from "./query";

export {
    ISuggest,
    IPersonalResultSuggestion,
    ISearchSuggestQuery,
    ISearchSuggestResult,
    Suggest,
    SuggestFactory,
} from "./suggest";

/**
 * Extend rest
 */
declare module "../rest" {
    interface SPRest {
        search(query: SearchQueryInit): Promise<SearchResults>;
        searchWithCaching(query: SearchQueryInit, options?: ICachingOptions): Promise<SearchResults>;
        searchSuggest(query: string | ISearchSuggestQuery): Promise<ISearchSuggestResult>;
    }
}

SPRest.prototype.search = function (this: SPRest, query: SearchQueryInit): Promise<SearchResults> {
    return SearchFactory(this._baseUrl, null, this._options)(query);
};

SPRest.prototype.searchWithCaching = function (this: SPRest, query: SearchQueryInit, options?: ICachingOptions): Promise<SearchResults> {
    return (new _Search(this._baseUrl, null)).configure(this._options).usingCaching(options).execute(query);
};

SPRest.prototype.searchSuggest = function (this: SPRest, query: string | ISearchSuggestQuery): Promise<ISearchSuggestResult> {

    let finalQuery: ISearchSuggestQuery;

    if (typeof query === "string") {
        finalQuery = { querytext: query };
    } else {
        finalQuery = query;
    }

    return SuggestFactory(this._baseUrl, null, this._options)(finalQuery);
};

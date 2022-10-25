import { _SPInstance, spInvokableFactory, SPInit } from "../spqueryable.js";
import { getHashCode, hOP, isArray } from "@pnp/core";
import { body, CacheAlways, CacheKey, invokable } from "@pnp/queryable";
import { ISearchQuery, ISearchResponse, ISearchResult, ISearchBuilder, SearchQueryInit } from "./types.js";
import { spPost } from "../operations.js";
import { defaultPath } from "../decorators.js";

const funcs = new Map<string, string>([
    ["text", "Querytext"],
    ["template", "QueryTemplate"],
    ["sourceId", "SourceId"],
    ["trimDuplicatesIncludeId", ""],
    ["startRow", ""],
    ["rowLimit", ""],
    ["rankingModelId", ""],
    ["rowsPerPage", ""],
    ["selectProperties", ""],
    ["culture", ""],
    ["timeZoneId", ""],
    ["refinementFilters", ""],
    ["refiners", ""],
    ["hiddenConstraints", ""],
    ["sortList", ""],
    ["timeout", ""],
    ["hithighlightedProperties", ""],
    ["clientType", ""],
    ["personalizationData", ""],
    ["resultsURL", ""],
    ["queryTag", ""],
    ["properties", ""],
    ["queryTemplatePropertiesUrl", ""],
    ["reorderingRules", ""],
    ["hitHighlightedMultivaluePropertyLimit", ""],
    ["collapseSpecification", ""],
    ["uiLanguage", ""],
    ["desiredSnippetLength", ""],
    ["maxSnippetLength", ""],
    ["summaryLength", ""],
]);

const props = new Map<string, string>([]);

function toPropCase(str: string) {
    return str.replace(/^(.)/, ($1) => $1.toUpperCase());
}

/**
 * Creates a new instance of the SearchQueryBuilder
 *
 * @param queryText Initial query text
 * @param _query Any initial query configuration
 */
export function SearchQueryBuilder(queryText = "", _query = {}): ISearchBuilder {

    return new Proxy(<any>{
        query: Object.assign({
            Querytext: queryText,
        }, _query),
    }, {
        get(self, propertyKey, proxy) {

            const pk = propertyKey.toString();

            if (pk === "toSearchQuery") {
                return () => self.query;
            }

            if (funcs.has(pk)) {
                return (...value: any[]) => {
                    const mappedPk = funcs.get(pk);
                    self.query[mappedPk.length > 0 ? mappedPk : toPropCase(pk)] = value.length > 1 ? value : value[0];
                    return proxy;
                };
            }
            const propKey = props.has(pk) ? props.get(pk) : toPropCase(pk);
            self.query[propKey] = true;
            return proxy;
        },
    });
}

/**
 * Describes the search API
 *
 */
@defaultPath("_api/search/postquery")
@invokable(function (this: _Search, init) {
    return this.run(<SearchQueryInit>init);
})
export class _Search extends _SPInstance {

    /**
     * @returns Promise
     */
    public async run(queryInit: SearchQueryInit): Promise<SearchResults> {

        const query = this.parseQuery(queryInit);

        const postBody: RequestInit = body({
            request: {
                ...query,
                HitHighlightedProperties: this.fixArrProp(query.HitHighlightedProperties),
                Properties: this.fixArrProp(query.Properties),
                RefinementFilters: this.fixArrProp(query.RefinementFilters),
                ReorderingRules: this.fixArrProp(query.ReorderingRules),
                SelectProperties: this.fixArrProp(query.SelectProperties),
                SortList: this.fixArrProp(query.SortList),
            },
        });

        const poster = new _Search([this, this.parentUrl]);
        poster.using(CacheAlways(), CacheKey(getHashCode(JSON.stringify(postBody)).toString()));

        const data = await spPost(poster, postBody);

        // Create search instance copy for SearchResult's getPage request.
        return new SearchResults(data, new _Search([this, this.parentUrl]), query);
    }

    /**
     * Fix array property
     *
     * @param prop property to fix for container struct
     */
    private fixArrProp<T>(prop: T | T[]): T[] {
        return typeof prop === "undefined" ? [] : isArray(prop) ? prop : [prop];
    }

    /**
     * Translates one of the query initializers into a SearchQuery instance
     *
     * @param query
     */
    private parseQuery(query: SearchQueryInit): ISearchQuery {

        let finalQuery: ISearchQuery;

        if (typeof query === "string") {
            finalQuery = { Querytext: query };
        } else if ((query as ISearchBuilder).toSearchQuery) {
            finalQuery = (query as ISearchBuilder).toSearchQuery();
        } else {
            finalQuery = <ISearchQuery>query;
        }

        return finalQuery;
    }
}

export interface ISearch extends Pick<_Search, "run" | "using"> {
    (init: SearchQueryInit): Promise<SearchResults>;
}
export const Search: (base: SPInit, path?: string) => ISearch = <any>spInvokableFactory(_Search);

export class SearchResults {

    constructor(rawResponse: any,
        private _search: _Search,
        private _query: ISearchQuery,
        private _raw: ISearchResponse = null,
        private _primary: ISearchResult[] = null) {

        this._raw = rawResponse.postquery ? rawResponse.postquery : rawResponse;
    }

    public get ElapsedTime(): number {
        return this?.RawSearchResults?.ElapsedTime || 0;
    }

    public get RowCount(): number {
        return this?.RawSearchResults?.PrimaryQueryResult?.RelevantResults?.RowCount || 0;
    }

    public get TotalRows(): number {
        return this?.RawSearchResults?.PrimaryQueryResult?.RelevantResults?.TotalRows || 0;
    }

    public get TotalRowsIncludingDuplicates(): number {
        return this?.RawSearchResults?.PrimaryQueryResult?.RelevantResults?.TotalRowsIncludingDuplicates || 0;
    }

    public get RawSearchResults(): ISearchResponse {
        return this._raw;
    }

    public get PrimarySearchResults(): ISearchResult[] {
        if (this._primary === null) {
            this._primary = this.formatSearchResults(this._raw?.PrimaryQueryResult?.RelevantResults?.Table?.Rows || null);
        }
        return this._primary;
    }

    /**
     * Gets a page of results
     *
     * @param pageNumber Index of the page to return. Used to determine StartRow
     * @param pageSize Optional, items per page (default = 10)
     */
    public getPage(pageNumber: number, pageSize?: number): Promise<SearchResults> {

        // if we got all the available rows we don't have another page
        if (this.TotalRows < this.RowCount) {
            return Promise.resolve(null);
        }

        // if pageSize is supplied, then we use that regardless of any previous values
        // otherwise get the previous RowLimit or default to 10
        const rows = pageSize !== undefined ? pageSize : hOP(this._query, "RowLimit") ? this._query.RowLimit : 10;

        const query: ISearchQuery = {
            ...this._query,
            RowLimit: rows,
            StartRow: rows * (pageNumber - 1),
        };

        // we have reached the end
        if (query.StartRow > this.TotalRows) {
            return Promise.resolve(null);
        }

        return this._search.run(query);
    }

    /**
     * Formats a search results array
     *
     * @param rawResults The array to process
     */
    protected formatSearchResults(rawResults: any): ISearchResult[] {

        const results = new Array<ISearchResult>();

        if (typeof (rawResults) === "undefined" || rawResults == null) {
            return [];
        }

        const tempResults = rawResults.results ? rawResults.results : rawResults;

        for (const tempResult of tempResults) {

            const cells: { Key: string; Value: any }[] = tempResult.Cells.results ? tempResult.Cells.results : tempResult.Cells;

            results.push(cells.reduce((res, cell) => {

                res[cell.Key] = cell.Value;

                return res;

            }, {}));
        }

        return results;
    }
}

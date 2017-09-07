import { SharePointQueryable, SharePointQueryableInstance } from "./sharepointqueryable";
import { Util } from "../utils/util";
import { Dictionary } from "../collections/collections";

/**
 * Allows for the fluent construction of search queries
 */
export class SearchQueryBuilder {

    public static create(queryText = "", queryTemplate: SearchQuery = {}): SearchQueryBuilder {
        return new SearchQueryBuilder(queryText, queryTemplate);
    }

    constructor(queryText = "", private _query = {}) {

        if (typeof queryText === "string" && queryText.length > 0) {

            this.extendQuery({ Querytext: queryText });
        }
    }

    public text(queryText: string): this {
        return this.extendQuery({ Querytext: queryText });
    }

    public template(template: string): this {
        return this.extendQuery({ QueryTemplate: template });
    }

    public sourceId(id: string): this {
        return this.extendQuery({ SourceId: id });
    }

    public get enableInterleaving(): this {
        return this.extendQuery({ EnableInterleaving: true });
    }

    public get enableStemming(): this {
        return this.extendQuery({ EnableStemming: true });
    }

    public get trimDuplicates(): this {
        return this.extendQuery({ TrimDuplicates: true });
    }

    public trimDuplicatesIncludeId(n: number): this {
        return this.extendQuery({ TrimDuplicatesIncludeId: n });
    }

    public get enableNicknames(): this {
        return this.extendQuery({ EnableNicknames: true });
    }

    public get enableFql(): this {
        return this.extendQuery({ EnableFQL: true });
    }

    public get enablePhonetic(): this {
        return this.extendQuery({ EnablePhonetic: true });
    }

    public get bypassResultTypes(): this {
        return this.extendQuery({ BypassResultTypes: true });
    }

    public get processBestBets(): this {
        return this.extendQuery({ ProcessBestBets: true });
    }

    public get enableQueryRules(): this {
        return this.extendQuery({ EnableQueryRules: true });
    }

    public get enableSorting(): this {
        return this.extendQuery({ EnableSorting: true });
    }

    public get generateBlockRankLog(): this {
        return this.extendQuery({ GenerateBlockRankLog: true });
    }

    public rankingModelId(id: string): this {
        return this.extendQuery({ RankingModelId: id });
    }

    public startRow(n: number): this {
        return this.extendQuery({ StartRow: n });
    }

    public rowLimit(n: number): this {
        return this.extendQuery({ RowLimit: n });
    }

    public rowsPerPage(n: number): this {
        return this.extendQuery({ RowsPerPage: n });
    }

    public selectProperties(...properties: string[]): this {
        return this.extendQuery({ SelectProperties: properties });
    }

    public culture(culture: number): this {
        return this.extendQuery({ Culture: culture });
    }

    public timeZoneId(id: number): this {
        return this.extendQuery({ TimeZoneId: id });
    }

    public refinementFilters(...filters: string[]): this {
        return this.extendQuery({ RefinementFilters: filters });
    }

    public refiners(refiners: string): this {
        return this.extendQuery({ Refiners: refiners });
    }

    public hiddenConstraints(constraints: string): this {
        return this.extendQuery({ HiddenConstraints: constraints });
    }

    public sortList(...sorts: Sort[]): this {
        return this.extendQuery({ SortList: sorts });
    }

    public timeout(milliseconds: number): this {
        return this.extendQuery({ Timeout: milliseconds });
    }

    public hithighlightedProperties(...properties: string[]): this {
        return this.extendQuery({ HitHighlightedProperties: properties });
    }

    public clientType(clientType: string): this {
        return this.extendQuery({ ClientType: clientType });
    }

    public personalizationData(data: string): this {
        return this.extendQuery({ PersonalizationData: data });
    }

    public resultsURL(url: string): this {
        return this.extendQuery({ ResultsUrl: url });
    }

    public queryTag(...tags: string[]): this {
        return this.extendQuery({ QueryTag: tags });
    }

    public properties(...properties: SearchProperty[]): this {
        return this.extendQuery({ Properties: properties });
    }

    public get processPersonalFavorites(): this {
        return this.extendQuery({ ProcessPersonalFavorites: true });
    }

    public queryTemplatePropertiesUrl(url: string): this {
        return this.extendQuery({ QueryTemplatePropertiesUrl: url });
    }

    public reorderingRules(...rules: ReorderingRule[]): this {
        return this.extendQuery({ ReorderingRules: rules });
    }

    public hitHighlightedMultivaluePropertyLimit(limit: number): this {
        return this.extendQuery({ HitHighlightedMultivaluePropertyLimit: limit });
    }

    public get enableOrderingHitHighlightedProperty(): this {
        return this.extendQuery({ EnableOrderingHitHighlightedProperty: true });
    }

    public collapseSpecification(spec: string): this {
        return this.extendQuery({ CollapseSpecification: spec });
    }

    public uiLanguage(lang: number): this {
        return this.extendQuery({ UILanguage: lang });
    }

    public desiredSnippetLength(len: number): this {
        return this.extendQuery({ DesiredSnippetLength: len });
    }

    public maxSnippetLength(len: number): this {
        return this.extendQuery({ MaxSnippetLength: len });
    }

    public summaryLength(len: number): this {
        return this.extendQuery({ SummaryLength: len });
    }

    public toSearchQuery(): SearchQuery {
        return <SearchQuery>this._query;
    }

    private extendQuery(part: any): this {

        this._query = Util.extend(this._query, part);
        return this;
    }
}

/**
 * Describes the search API
 *
 */
export class Search extends SharePointQueryableInstance {

    /**
     * Creates a new instance of the Search class
     *
     * @param baseUrl The url for the search context
     * @param query The SearchQuery object to execute
     */
    constructor(baseUrl: string | SharePointQueryable, path = "_api/search/postquery") {
        super(baseUrl, path);
    }

    /**
     * .......
     * @returns Promise
     */
    public execute(query: SearchQuery): Promise<SearchResults> {

        let formattedBody: any;
        formattedBody = query;

        if (formattedBody.SelectProperties) {
            formattedBody.SelectProperties = this.fixupProp(query.SelectProperties);
        }

        if (formattedBody.RefinementFilters) {
            formattedBody.RefinementFilters = this.fixupProp(query.RefinementFilters);
        }

        if (formattedBody.SortList) {
            formattedBody.SortList = this.fixupProp(query.SortList);
        }

        if (formattedBody.HithighlightedProperties) {
            formattedBody.HithighlightedProperties = this.fixupProp(query.HitHighlightedProperties);
        }

        if (formattedBody.ReorderingRules) {
            formattedBody.ReorderingRules = this.fixupProp(query.ReorderingRules);
        }

        if (formattedBody.Properties) {
            formattedBody.Properties = this.fixupProp(query.Properties);
        }

        const postBody = JSON.stringify({
            request: Util.extend({
                "__metadata": { "type": "Microsoft.Office.Server.Search.REST.SearchRequest" },
            }, formattedBody),
        });

        return this.postCore({ body: postBody }).then((data) => new SearchResults(data, this.toUrl(), query));
    }

    /**
     * Fixes up properties that expect to consist of a "results" collection when needed
     *
     * @param prop property to fixup for container struct
     */
    private fixupProp(prop: any): any {

        if (prop.hasOwnProperty("results")) {
            return prop;
        }

        return { results: prop };
    }
}

/**
 * Describes the SearchResults class, which returns the formatted and raw version of the query response
 */
export class SearchResults {

    /**
     * Creates a new instance of the SearchResult class
     *
     */
    constructor(rawResponse: any,
        private _url: string,
        private _query: SearchQuery,
        private _raw: SearchResponse = null,
        private _primary: SearchResult[] = null) {

        this._raw = rawResponse.postquery ? rawResponse.postquery : rawResponse;
    }

    public get ElapsedTime(): number {
        return this.RawSearchResults.ElapsedTime;
    }

    public get RowCount(): number {
        return this.RawSearchResults.PrimaryQueryResult.RelevantResults.RowCount;
    }

    public get TotalRows(): number {
        return this.RawSearchResults.PrimaryQueryResult.RelevantResults.TotalRows;
    }

    public get TotalRowsIncludingDuplicates(): number {
        return this.RawSearchResults.PrimaryQueryResult.RelevantResults.TotalRowsIncludingDuplicates;
    }

    public get RawSearchResults(): SearchResponse {
        return this._raw;
    }

    public get PrimarySearchResults(): SearchResult[] {
        if (this._primary === null) {
            this._primary = this.formatSearchResults(this._raw.PrimaryQueryResult.RelevantResults.Table.Rows);
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
        const rows = typeof pageSize !== "undefined" ? pageSize : this._query.hasOwnProperty("RowLimit") ? this._query.RowLimit : 10;

        const query: SearchQuery = Util.extend(this._query, {
            RowLimit: rows,
            StartRow: rows * (pageNumber - 1),
        });

        // we have reached the end
        if (query.StartRow > this.TotalRows) {
            return Promise.resolve(null);
        }

        const search = new Search(this._url, null);
        return search.execute(query);
    }

    /**
     * Formats a search results array
     *
     * @param rawResults The array to process
     */
    protected formatSearchResults(rawResults: any): SearchResult[] {

        const results = new Array<SearchResult>();
        const tempResults = rawResults.results ? rawResults.results : rawResults;

        for (const tempResult of tempResults) {

            const cells: { Key: string, Value: any }[] = tempResult.Cells.results ? tempResult.Cells.results : tempResult.Cells;

            results.push(cells.reduce((res, cell) => {

                Object.defineProperty(res, cell.Key,
                    {
                        configurable: false,
                        enumerable: false,
                        value: cell.Value,
                        writable: false,
                    });

                return res;

            }, {}));
        }

        return results;
    }
}

/**
 * Describes the SearchQuery interface
 */
export interface SearchQuery {

    /**
     * A string that contains the text for the search query.
     */
    Querytext?: string;

    /**
     * A string that contains the text that replaces the query text, as part of a query transform.
     */
    QueryTemplate?: string;

    /**
     * A Boolean value that specifies whether the result tables that are returned for
     * the result block are mixed with the result tables that are returned for the original query.
     */
    EnableInterleaving?: boolean;

    /**
     * A Boolean value that specifies whether stemming is enabled.
     */
    EnableStemming?: boolean;

    /**
     * A Boolean value that specifies whether duplicate items are removed from the results.
     */
    TrimDuplicates?: boolean;

    /**
     * A Boolean value that specifies whether the exact terms in the search query are used to find matches, or if nicknames are used also.
     */
    EnableNicknames?: boolean;

    /**
     * A Boolean value that specifies whether the query uses the FAST Query Language (FQL).
     */
    EnableFQL?: boolean;

    /**
     * A Boolean value that specifies whether the phonetic forms of the query terms are used to find matches.
     */
    EnablePhonetic?: boolean;

    /**
     * A Boolean value that specifies whether to perform result type processing for the query.
     */
    BypassResultTypes?: boolean;

    /**
     * A Boolean value that specifies whether to return best bet results for the query.
     * This parameter is used only when EnableQueryRules is set to true, otherwise it is ignored.
     */
    ProcessBestBets?: boolean;

    /**
     * A Boolean value that specifies whether to enable query rules for the query.
     */
    EnableQueryRules?: boolean;

    /**
     * A Boolean value that specifies whether to sort search results.
     */
    EnableSorting?: boolean;

    /**
     * Specifies whether to return block rank log information in the BlockRankLog property of the interleaved result table.
     * A block rank log contains the textual information on the block score and the documents that were de-duplicated.
     */
    GenerateBlockRankLog?: boolean;

    /**
     * The result source ID to use for executing the search query.
     */
    SourceId?: string;

    /**
     * The ID of the ranking model to use for the query.
     */
    RankingModelId?: string;

    /**
     * The first row that is included in the search results that are returned.
     * You use this parameter when you want to implement paging for search results.
     */
    StartRow?: number;

    /**
     * The maximum number of rows overall that are returned in the search results.
     * Compared to RowsPerPage, RowLimit is the maximum number of rows returned overall.
     */
    RowLimit?: number;

    /**
     * The maximum number of rows to return per page.
     * Compared to RowLimit, RowsPerPage refers to the maximum number of rows to return per page,
     * and is used primarily when you want to implement paging for search results.
     */
    RowsPerPage?: number;

    /**
     * The managed properties to return in the search results.
     */
    SelectProperties?: string[];

    /**
     * The locale ID (LCID) for the query.
     */
    Culture?: number;

    /**
     * The set of refinement filters used when issuing a refinement query (FQL)
     */
    RefinementFilters?: string[];

    /**
     * The set of refiners to return in a search result.
     */
    Refiners?: string;

    /**
     * The additional query terms to append to the query.
     */
    HiddenConstraints?: string;

    /**
     * The list of properties by which the search results are ordered.
     */
    SortList?: Sort[];

    /**
     * The amount of time in milliseconds before the query request times out.
     */
    Timeout?: number;

    /**
     * The properties to highlight in the search result summary when the property value matches the search terms entered by the user.
     */
    HitHighlightedProperties?: string[];

    /**
     * The type of the client that issued the query.
     */
    ClientType?: string;

    /**
     * The GUID for the user who submitted the search query.
     */
    PersonalizationData?: string;

    /**
     * The URL for the search results page.
     */
    ResultsUrl?: string;

    /**
     * Custom tags that identify the query. You can specify multiple query tags
     */
    QueryTag?: string[];

    /**
     * Properties to be used to configure the search query
     */
    Properties?: SearchProperty[];

    /**
     *  A Boolean value that specifies whether to return personal favorites with the search results.
     */
    ProcessPersonalFavorites?: boolean;

    /**
     * The location of the queryparametertemplate.xml file. This file is used to enable anonymous users to make Search REST queries.
     */
    QueryTemplatePropertiesUrl?: string;

    /**
     * Special rules for reordering search results.
     * These rules can specify that documents matching certain conditions are ranked higher or lower in the results.
     * This property applies only when search results are sorted based on rank.
     */
    ReorderingRules?: ReorderingRule[];

    /**
     * The number of properties to show hit highlighting for in the search results.
     */
    HitHighlightedMultivaluePropertyLimit?: number;

    /**
     * A Boolean value that specifies whether the hit highlighted properties can be ordered.
     */
    EnableOrderingHitHighlightedProperty?: boolean;

    /**
     * The managed properties that are used to determine how to collapse individual search results.
     * Results are collapsed into one or a specified number of results if they match any of the individual collapse specifications.
     * In a collapse specification, results are collapsed if their properties match all individual properties in the collapse specification.
     */
    CollapseSpecification?: string;

    /**
     * The locale identifier (LCID) of the user interface
     */
    UIlanguage?: number;

    /**
     * The preferred number of characters to display in the hit-highlighted summary generated for a search result.
     */
    DesiredSnippetLength?: number;

    /**
     * The maximum number of characters to display in the hit-highlighted summary generated for a search result.
     */
    MaxSnippetLength?: number;

    /**
     * The number of characters to display in the result summary for a search result.
     */
    SummaryLength?: number;

}

/**
 * Provides hints at the properties which may be available on the result object
 */
export interface SearchResult {

    Rank?: number;
    DocId?: number;
    WorkId?: number;
    Title?: string;
    Author?: string;
    Size?: number;
    Path?: string;
    Description?: string;
    Write?: Date;
    LastModifiedTime?: Date;
    CollapsingStatus?: number;
    HitHighlightedSummary?: string;
    HitHighlightedProperties?: string;
    contentclass?: string;
    PictureThumbnailURL?: string;
    ServerRedirectedURL?: string;
    ServerRedirectedEmbedURL?: string;
    ServerRedirectedPreviewURL?: string;
    FileExtension?: string;
    ContentTypeId?: string;
    ParentLink?: string;
    ViewsLifeTime?: number;
    ViewsRecent?: number;
    SectionNames?: string;
    SectionIndexes?: string;
    SiteLogo?: string;
    SiteDescription?: string;
    importance?: number;
    SiteName?: string;
    IsDocument?: boolean;
    FileType?: string;
    IsContainer?: boolean;
    WebTemplate?: string;
    SPWebUrl?: string;
    UniqueId?: string;
    ProgId?: string;
    OriginalPath?: string;
    RenderTemplateId?: string;
    PartitionId?: string;
    UrlZone?: number;
    Culture?: string;
}

export interface SearchResponse {
    ElapsedTime: number;
    Properties?: { Key: string, Value: any, ValueType: string }[];
    PrimaryQueryResult?: ResultTableCollection;
    SecondaryQueryResults?: ResultTableCollection;
    SpellingSuggestion?: string;
    TriggeredRules?: any[];
}

export interface ResultTableCollection {

    QueryErrors?: Dictionary<any>;
    QueryId?: string;
    QueryRuleId?: string;
    CustomResults?: ResultTable;
    RefinementResults?: ResultTable;
    RelevantResults?: ResultTable;
    SpecialTermResults?: ResultTable;
}

export interface ResultTable {

    GroupTemplateId?: string;
    ItemTemplateId?: string;
    Properties?: { Key: string, Value: any, ValueType: string }[];
    Table: { Rows: { Cells: { Key: string, Value: any, ValueType: string }[] }[] };
    ResultTitle?: string;
    ResultTitleUrl?: string;
    RowCount?: number;
    TableType?: string;
    TotalRows?: number;
    TotalRowsIncludingDuplicates?: number;
}

/**
 * Defines how search results are sorted.
 */
export interface Sort {

    /**
     * The name for a property by which the search results are ordered.
     */
    Property: string;

    /**
     * The direction in which search results are ordered.
     */
    Direction: SortDirection;
}

/**
 * Defines one search property
 */
export interface SearchProperty {
    Name: string;
    Value: SearchPropertyValue;
}

/**
 * Defines one search property value. Set only one of StrlVal/BoolVal/IntVal/StrArray.
 */
export interface SearchPropertyValue {
    StrVal?: string;
    BoolVal?: boolean;
    Intval?: number;
    StrArray?: string[];
    QueryPropertyValueTypeIndex: QueryPropertyValueType;
}

/**
 * defines the SortDirection enum
 */
export enum SortDirection {
    Ascending = 0,
    Descending = 1,
    FQLFormula = 2,
}

/**
 * Defines how ReorderingRule interface, used for reordering results
 */
export interface ReorderingRule {

    /**
     * The value to match on
     */
    MatchValue: string;

    /**
     * The rank boosting
     */
    Boost: number;

    /**
    * The rank boosting
    */
    MatchType: ReorderingRuleMatchType;
}

/**
 * defines the ReorderingRuleMatchType  enum
 */
export enum ReorderingRuleMatchType {
    ResultContainsKeyword = 0,
    TitleContainsKeyword = 1,
    TitleMatchesKeyword = 2,
    UrlStartsWith = 3,
    UrlExactlyMatches = 4,
    ContentTypeIs = 5,
    FileExtensionMatches = 6,
    ResultHasTag = 7,
    ManualCondition = 8,
}

/**
 * Specifies the type value for the property
 */
export enum QueryPropertyValueType {
    None = 0,
    StringType = 1,
    Int32TYpe = 2,
    BooleanType = 3,
    StringArrayType = 4,
    UnSupportedType = 5,
}

export class SearchBuiltInSourceId {
    public static readonly Documents = "e7ec8cee-ded8-43c9-beb5-436b54b31e84";
    public static readonly ItemsMatchingContentType = "5dc9f503-801e-4ced-8a2c-5d1237132419";
    public static readonly ItemsMatchingTag = "e1327b9c-2b8c-4b23-99c9-3730cb29c3f7";
    public static readonly ItemsRelatedToCurrentUser = "48fec42e-4a92-48ce-8363-c2703a40e67d";
    public static readonly ItemsWithSameKeywordAsThisItem = "5c069288-1d17-454a-8ac6-9c642a065f48";
    public static readonly LocalPeopleResults = "b09a7990-05ea-4af9-81ef-edfab16c4e31";
    public static readonly LocalReportsAndDataResults = "203fba36-2763-4060-9931-911ac8c0583b";
    public static readonly LocalSharePointResults = "8413cd39-2156-4e00-b54d-11efd9abdb89";
    public static readonly LocalVideoResults = "78b793ce-7956-4669-aa3b-451fc5defebf";
    public static readonly Pages = "5e34578e-4d08-4edc-8bf3-002acf3cdbcc";
    public static readonly Pictures = "38403c8c-3975-41a8-826e-717f2d41568a";
    public static readonly Popular = "97c71db1-58ce-4891-8b64-585bc2326c12";
    public static readonly RecentlyChangedItems = "ba63bbae-fa9c-42c0-b027-9a878f16557c";
    public static readonly RecommendedItems = "ec675252-14fa-4fbe-84dd-8d098ed74181";
    public static readonly Wiki = "9479bf85-e257-4318-b5a8-81a180f5faa1";
}

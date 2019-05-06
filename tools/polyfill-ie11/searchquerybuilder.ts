import { Sort, ReorderingRule, SearchProperty, SearchQuery, ISearchQueryBuilder } from "@pnp/sp";

export function SearchQueryBuilder(queryText = "", _query = {}): ISearchQueryBuilder {
    return new SearchQueryBuilderImpl(queryText, _query);
}

/**
 * Allows for the fluent construction of search queries
 */
class SearchQueryBuilderImpl {

    constructor(queryText = "", private _query = {}) {

        if (typeof queryText === "string" && queryText.length > 0) {

            this.extendQuery({ Querytext: queryText });
        }
    }

    public get query(): any {
        return this._query;
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

    public queryTag(tags: string): this {
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
        this._query = Object.assign({}, this._query, part);
        return this;
    }
}

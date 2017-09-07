import { SharePointQueryable, SharePointQueryableInstance } from "./sharepointqueryable";

/**
 * Defines a query execute against the search/suggest endpoint (see https://msdn.microsoft.com/en-us/library/office/dn194079.aspx)
 */
export interface SearchSuggestQuery {

    /**
     * A string that contains the text for the search query.
     */
    querytext: string;

    /**
     * The number of query suggestions to retrieve. Must be greater than zero (0). The default value is 5.
     */
    count?: number;


    /**
     * The number of personal results to retrieve. Must be greater than zero (0). The default value is 5.
     */
    personalCount?: number;

    /**
     * A Boolean value that specifies whether to retrieve pre-query or post-query suggestions. true to return pre-query suggestions; otherwise, false. The default value is false.
     */
    preQuery?: boolean;

    /**
     * A Boolean value that specifies whether to hit-highlight or format in bold the query suggestions. true to format in bold the terms in the returned query suggestions
     * that match terms in the specified query; otherwise, false. The default value is true.
     */
    hitHighlighting?: boolean;

    /**
     * A Boolean value that specifies whether to capitalize the first letter in each term in the returned query suggestions. true to capitalize the first letter in each term;
     * otherwise, false. The default value is false.
     */
    capitalize?: boolean;

    /**
     * The locale ID (LCID) for the query (see https://msdn.microsoft.com/en-us/library/cc233982.aspx).
     */
    culture?: string;

    /**
     * A Boolean value that specifies whether stemming is enabled. true to enable stemming; otherwise, false. The default value is true.
     */
    stemming?: boolean;

    /**
     * A Boolean value that specifies whether to include people names in the returned query suggestions. true to include people names in the returned query suggestions;
     * otherwise, false. The default value is true.
     */
    includePeople?: boolean;

    /**
     * A Boolean value that specifies whether to turn on query rules for this query. true to turn on query rules; otherwise, false. The default value is true.
     */
    queryRules?: boolean;

    /**
     * A Boolean value that specifies whether to return query suggestions for prefix matches. true to return query suggestions based on prefix matches, otherwise, false when
     * query suggestions should match the full query word.
     */
    prefixMatch?: boolean;
}

export class SearchSuggest extends SharePointQueryableInstance {

    constructor(baseUrl: string | SharePointQueryable, path = "_api/search/suggest") {
        super(baseUrl, path);
    }

    public execute(query: SearchSuggestQuery): Promise<SearchSuggestResult> {
        this.mapQueryToQueryString(query);
        return this.get().then(response => new SearchSuggestResult(response));
    }

    private mapQueryToQueryString(query: SearchSuggestQuery): void {

        this.query.add("querytext", `'${query.querytext}'`);

        if (query.hasOwnProperty("count")) {
            this.query.add("inumberofquerysuggestions", query.count.toString());
        }

        if (query.hasOwnProperty("personalCount")) {
            this.query.add("inumberofresultsuggestions", query.personalCount.toString());
        }

        if (query.hasOwnProperty("preQuery")) {
            this.query.add("fprequerysuggestions", query.preQuery.toString());
        }

        if (query.hasOwnProperty("hitHighlighting")) {
            this.query.add("fhithighlighting", query.hitHighlighting.toString());
        }

        if (query.hasOwnProperty("capitalize")) {
            this.query.add("fcapitalizefirstletters", query.capitalize.toString());
        }

        if (query.hasOwnProperty("culture")) {
            this.query.add("culture", query.culture.toString());
        }

        if (query.hasOwnProperty("stemming")) {
            this.query.add("enablestemming", query.stemming.toString());
        }

        if (query.hasOwnProperty("includePeople")) {
            this.query.add("showpeoplenamesuggestions", query.includePeople.toString());
        }

        if (query.hasOwnProperty("queryRules")) {
            this.query.add("enablequeryrules", query.queryRules.toString());
        }

        if (query.hasOwnProperty("prefixMatch")) {
            this.query.add("fprefixmatchallterms", query.prefixMatch.toString());
        }
    }
}

export class SearchSuggestResult {

    public PeopleNames: string[];
    public PersonalResults: PersonalResultSuggestion[];
    public Queries: any[];

    constructor(json: any) {
        if (json.hasOwnProperty("suggest")) {
            // verbose
            this.PeopleNames = json.suggest.PeopleNames.results;
            this.PersonalResults = json.suggest.PersonalResults.results;
            this.Queries = json.suggest.Queries.results;
        } else {
            this.PeopleNames = json.PeopleNames;
            this.PersonalResults = json.PersonalResults;
            this.Queries = json.Queries;
        }
    }
}

export interface PersonalResultSuggestion {
    HighlightedTitle?: string;
    IsBestBet?: boolean;
    Title?: string;
    TypeId?: string;
    Url?: string;
}

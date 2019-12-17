import { SharePointQueryableInstance, defaultPath } from "./sharepointqueryable";
import { hOP } from "@pnp/common";

/**
 * Defines a query execute against the search/suggest endpoint (see https://msdn.microsoft.com/en-us/library/office/dn194079.aspx)
 */
export interface SearchSuggestQuery {

    [key: string]: string | number | boolean;

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

@defaultPath("_api/search/suggest")
export class SearchSuggest extends SharePointQueryableInstance {

    public execute(query: SearchSuggestQuery): Promise<SearchSuggestResult> {
        this.mapQueryToQueryString(query);
        return this.get().then(response => {
            const mapper = hOP(response, "suggest") ? (s: string) => response.suggest[s].results : (s: string) => response[s];
            return {
                PeopleNames: mapper("PeopleNames"),
                PersonalResults: mapper("PersonalResults"),
                Queries: mapper("Queries"),
            };
        });
    }

    private mapQueryToQueryString(query: SearchSuggestQuery): void {

        const setProp = (q: SearchSuggestQuery) => (checkProp: string) => (sp: string) => {
            if (hOP(q, checkProp)) {
                this.query.set(sp, q[checkProp].toString());
            }
        };

        this.query.set("querytext", `'${query.querytext}'`);

        const querySetter = setProp(query);

        querySetter("count")("inumberofquerysuggestions");
        querySetter("personalCount")("inumberofresultsuggestions");
        querySetter("preQuery")("fprequerysuggestions");
        querySetter("hitHighlighting")("fhithighlighting");
        querySetter("capitalize")("fcapitalizefirstletters");
        querySetter("culture")("culture");
        querySetter("stemming")("enablestemming");
        querySetter("includePeople")("showpeoplenamesuggestions");
        querySetter("queryRules")("enablequeryrules");
        querySetter("prefixMatch")("fprefixmatchallterms");
    }
}

export interface SearchSuggestResult {
    readonly PeopleNames: string[];
    readonly PersonalResults: PersonalResultSuggestion[];
    readonly Queries: any[];
}

export interface ESearchSuggestResult {
    readonly PeopleNames: string[];
    readonly PersonalResults: PersonalResultSuggestion[];
    readonly Queries: any[];
}

export interface PersonalResultSuggestion {
    readonly HighlightedTitle?: string;
    readonly IsBestBet?: boolean;
    readonly Title?: string;
    readonly TypeId?: string;
    readonly Url?: string;
}

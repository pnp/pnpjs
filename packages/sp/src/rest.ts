import { Search, SearchQuery, SearchResults, SearchQueryBuilder } from "./search";
import { SearchSuggest, SearchSuggestQuery, SearchSuggestResult } from "./searchsuggest";
import { Site } from "./site";
import { Web } from "./webs";
import { ConfigOptions } from "@pnp/common";
import { UserProfileQuery } from "./userprofiles";
import { INavigationService, NavigationService } from "./navigation";
import { SPBatch } from "./batch";
import { SocialQuery, SocialMethods } from "./social";
import { SiteScripts, SiteScriptUtilityMethods } from "./sitescripts";
import { SiteDesigns, SiteDesignsUtilityMethods } from "./sitedesigns";
import { UtilityMethod, UtilityMethods } from "./utilities";
import { SharePointQueryableConstructor, SharePointQueryable } from "./sharepointqueryable";
import {
    setup as _setup,
    SPConfiguration,
} from "./config/splibconfig";

/**
 * Root of the SharePoint REST module
 */
export class SPRest {

    /** 
     * Creates a new instance of the SPRest class
     * 
     * @param options Additional options
     * @param baseUrl A string that should form the base part of the url
     */
    constructor(protected _options: ConfigOptions = {}, protected _baseUrl = "") { }

    /**
     * Configures instance with additional options and baseUrl.
     * Provided configuration used by other objects in a chain
     * 
     * @param options Additional options
     * @param baseUrl A string that should form the base part of the url
     */
    public configure(options: ConfigOptions, baseUrl = ""): SPRest {
        return new SPRest(options, baseUrl);
    }

    /**
     * Global SharePoint configuration options
     * 
     * @param config The SharePoint configuration to apply
     */
    public setup(config: SPConfiguration) {
        _setup(config);
    }

    /**
     * Executes a search against this web context
     *
     * @param query The SearchQuery definition
     */
    public searchSuggest(query: string | SearchSuggestQuery): Promise<SearchSuggestResult> {

        let finalQuery: SearchSuggestQuery;

        if (typeof query === "string") {
            finalQuery = { querytext: query };
        } else {
            finalQuery = query;
        }

        return this.create(SearchSuggest).execute(finalQuery);
    }

    /**
     * Executes a search against this web context
     *
     * @param query The SearchQuery definition
     */
    public search(query: string | SearchQuery | SearchQueryBuilder): Promise<SearchResults> {

        let finalQuery: SearchQuery;

        if (typeof query === "string") {
            finalQuery = { Querytext: query };
        } else if (query instanceof SearchQueryBuilder) {
            finalQuery = (query as SearchQueryBuilder).toSearchQuery();
        } else {
            finalQuery = query;
        }

        return this.create(Search).execute(finalQuery);
    }

    /**
     * Begins a site collection scoped REST request
     *
     */
    public get site(): Site {
        return this.create(Site);
    }

    /**
     * Begins a web scoped REST request
     *
     */
    public get web(): Web {
        return this.create(Web);
    }

    /**
     * Access to user profile methods
     *
     */
    public get profiles(): UserProfileQuery {
        return this.create(UserProfileQuery);
    }

    /**
     * Access to social methods
     */
    public get social(): SocialMethods {
        return this.create(SocialQuery);
    }

    /**
     * Access to the site collection level navigation service
     */
    public get navigation(): INavigationService {
        return new NavigationService();
    }

    /**
     * Creates a new batch object for use with the SharePointQueryable.addToBatch method
     *
     */
    public createBatch(): SPBatch {
        return this.web.createBatch();
    }

    /**
     * Static utilities methods from SP.Utilities.Utility
     */
    public get utility(): UtilityMethods {
        return this.create(UtilityMethod, "");
    }

    /**
     * Access to sitescripts methods
     */
    public get siteScripts(): SiteScriptUtilityMethods {
        return this.create(SiteScripts, "");
    }

    /**
     * Access to sitedesigns methods
     */
    public get siteDesigns(): SiteDesignsUtilityMethods {
        return this.create(SiteDesigns, "");
    }

    /**
     * Handles creating and configuring the objects returned from this class
     * 
     * @param fm The factory method used to create the instance
     * @param path Optional additional path information to pass to the factory method
     */
    private create<T extends SharePointQueryable>(fm: SharePointQueryableConstructor<T>, path?: string): T {
        return new fm(this._baseUrl, path).configure(this._options);
    }
}

export const sp = new SPRest();

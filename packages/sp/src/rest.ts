import { Search, SearchQuery, SearchResults, SearchQueryBuilder } from "./search";
import { SearchSuggest, SearchSuggestQuery, SearchSuggestResult } from "./searchsuggest";
import { Site } from "./site";
import { Web } from "./webs";
import { Util, UrlException, ConfigOptions } from "@pnp/common";
import { SharePointQueryable, SharePointQueryableConstructor } from "./sharepointqueryable";
import { UserProfileQuery } from "./userprofiles";
import { SPBatch } from "./batch";
import { UtilityMethod, UtilityMethods } from "./utilities";
import {
    setup as _setup,
    SPConfiguration,
} from "./config/splibconfig";

/**
 * Root of the SharePoint REST module
 */
export class SPRest {

    /**
     * Additional options to be set before sending actual http requests
     */
    private _options: ConfigOptions;

    /**
     * A string that should form the base part of the url
     */
    private _baseUrl: string;

    /** 
     * Creates a new instance of the SPRest class
     * 
     * @param options Additional options
     * @param baseUrl A string that should form the base part of the url
     */
    constructor(options: ConfigOptions = {}, baseUrl = "") {
        this._options = options;
        this._baseUrl = baseUrl;
    }

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

        return new SearchSuggest(this._baseUrl).configure(this._options).execute(finalQuery);
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

        return new Search(this._baseUrl).configure(this._options).execute(finalQuery);
    }

    /**
     * Begins a site collection scoped REST request
     *
     */
    public get site(): Site {
        return new Site(this._baseUrl).configure(this._options);
    }

    /**
     * Begins a web scoped REST request
     *
     */
    public get web(): Web {
        return new Web(this._baseUrl).configure(this._options);
    }

    /**
     * Access to user profile methods
     *
     */
    public get profiles(): UserProfileQuery {
        return new UserProfileQuery(this._baseUrl).configure(this._options);
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
        return new UtilityMethod(this._baseUrl, "").configure(this._options);
    }

    /**
     * Begins a cross-domain, host site scoped REST request, for use in add-in webs
     *
     * @param addInWebUrl The absolute url of the add-in web
     * @param hostWebUrl The absolute url of the host web
     */
    public crossDomainSite(addInWebUrl: string, hostWebUrl: string): Site {
        return this._cdImpl(Site, addInWebUrl, hostWebUrl, "site");
    }

    /**
     * Begins a cross-domain, host web scoped REST request, for use in add-in webs
     *
     * @param addInWebUrl The absolute url of the add-in web
     * @param hostWebUrl The absolute url of the host web
     */
    public crossDomainWeb(addInWebUrl: string, hostWebUrl: string): Web {
        return this._cdImpl(Web, addInWebUrl, hostWebUrl, "web");
    }

    /**
     * Implements the creation of cross domain REST urls
     *
     * @param factory The constructor of the object to create Site | Web
     * @param addInWebUrl The absolute url of the add-in web
     * @param hostWebUrl The absolute url of the host web
     * @param urlPart String part to append to the url "site" | "web"
     */
    private _cdImpl<T extends SharePointQueryable>(
        factory: SharePointQueryableConstructor<T>,
        addInWebUrl: string,
        hostWebUrl: string,
        urlPart: string): T {

        if (!Util.isUrlAbsolute(addInWebUrl)) {
            throw new UrlException("The addInWebUrl parameter must be an absolute url.");
        }

        if (!Util.isUrlAbsolute(hostWebUrl)) {
            throw new UrlException("The hostWebUrl parameter must be an absolute url.");
        }

        const url = Util.combinePaths(addInWebUrl, "_api/SP.AppContextSite(@target)");

        const instance = new factory(url, urlPart);
        instance.query.add("@target", "'" + encodeURIComponent(hostWebUrl) + "'");
        return instance.configure(this._options);
    }
}

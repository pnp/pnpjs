import {
    Util,
    Dictionary,
    FetchOptions,
    mergeOptions,
} from "@pnp/common";
import {
    ODataParser,
    ODataQueryable,
    RequestContext,
} from "@pnp/odata";
import { Logger, LogLevel } from "@pnp/logging";
import { SPBatch } from "./batch";
import { SPHttpClient } from "./net/sphttpclient";
import { toAbsoluteUrl } from "./utils/toabsoluteurl";

export interface SharePointQueryableConstructor<T> {
    new(baseUrl: string | SharePointQueryable, path?: string): T;
}

/**
 * SharePointQueryable Base Class
 *
 */
export class SharePointQueryable extends ODataQueryable<SPBatch> {

    /**
     * Creates a new instance of the SharePointQueryable class
     *
     * @constructor
     * @param baseUrl A string or SharePointQueryable that should form the base part of the url
     *
     */
    constructor(baseUrl: string | SharePointQueryable, path?: string) {
        super();

        if (typeof baseUrl === "string") {
            // we need to do some extra parsing to get the parent url correct if we are
            // being created from just a string.

            const urlStr = baseUrl as string;
            if (Util.isUrlAbsolute(urlStr) || urlStr.lastIndexOf("/") < 0) {
                this._parentUrl = urlStr;
                this._url = Util.combinePaths(urlStr, path);
            } else if (urlStr.lastIndexOf("/") > urlStr.lastIndexOf("(")) {
                // .../items(19)/fields
                const index = urlStr.lastIndexOf("/");
                this._parentUrl = urlStr.slice(0, index);
                path = Util.combinePaths(urlStr.slice(index), path);
                this._url = Util.combinePaths(this._parentUrl, path);
            } else {
                // .../items(19)
                const index = urlStr.lastIndexOf("(");
                this._parentUrl = urlStr.slice(0, index);
                this._url = Util.combinePaths(urlStr, path);
            }
        } else {
            const q = baseUrl as SharePointQueryable;
            this._parentUrl = q._url;
            this._options = q._options;
            const target = q._query.get("@target");
            if (target !== null) {
                this._query.add("@target", target);
            }
            this._url = Util.combinePaths(this._parentUrl, path);
        }
    }

    /**
         * Creates a new instance of the supplied factory and extends this into that new instance
         *
         * @param factory constructor for the new SharePointQueryable
         */
    public as<T>(factory: SharePointQueryableConstructor<T>): T {
        const o = <T>new factory(this._url, null);
        return Util.extend(o, this, true);
    }

    /**
     * Gets the full url with query information
     *
     */
    public toUrlAndQuery(): string {

        const aliasedParams = new Dictionary<string>();

        let url = this.toUrl().replace(/'!(@.*?)::(.*?)'/ig, (match, labelName, value) => {
            Logger.write(`Rewriting aliased parameter from match ${match} to label: ${labelName} value: ${value}`, LogLevel.Verbose);
            aliasedParams.add(labelName, `'${value}'`);
            return labelName;
        });

        // inlude our explicitly set query string params
        aliasedParams.merge(this._query);

        if (aliasedParams.count > 0) {
            url += `?${aliasedParams.getKeys().map(key => `${key}=${aliasedParams.get(key)}`).join("&")}`;
        }

        return url;
    }

    /**
     * Gets a parent for this instance as specified
     *
     * @param factory The contructor for the class to create
     */
    protected getParent<T extends SharePointQueryable>(
        factory: SharePointQueryableConstructor<T>,
        baseUrl: string | SharePointQueryable = this.parentUrl,
        path?: string,
        batch?: SPBatch): T {

        let parent = new factory(baseUrl, path);
        parent.configure(this._options);

        const target = this.query.get("@target");
        if (target !== null) {
            parent.query.add("@target", target);
        }
        if (typeof batch !== "undefined") {
            parent = parent.inBatch(batch);
        }
        return parent;
    }

    /**
     * Clones this SharePointQueryable into a new SharePointQueryable instance of T
     * @param factory Constructor used to create the new instance
     * @param additionalPath Any additional path to include in the clone
     * @param includeBatch If true this instance's batch will be added to the cloned instance
     */
    protected clone<T extends SharePointQueryable>(factory: SharePointQueryableConstructor<T>, additionalPath?: string, includeBatch = true): T {
        let clone = new factory(this, additionalPath);
        const target = this.query.get("@target");
        if (target !== null) {
            clone.query.add("@target", target);
        }
        if (includeBatch && this.hasBatch) {
            clone = clone.inBatch(this.batch);
        }
        return clone;
    }

    /**
     * Converts the current instance to a request context
     *
     * @param verb The request verb
     * @param options The set of supplied request options
     * @param parser The supplied ODataParser instance
     * @param pipeline Optional request processing pipeline
     */
    protected toRequestContext<T>(
        verb: string,
        options: FetchOptions = {},
        parser: ODataParser<T>,
        pipeline: Array<(c: RequestContext<T>) => Promise<RequestContext<T>>>): Promise<RequestContext<T>> {

        const dependencyDispose = this.hasBatch ? this.addBatchDependency() : () => { return; };

        return toAbsoluteUrl(this.toUrlAndQuery()).then(url => {

            mergeOptions(options, this._options);

            // build our request context
            const context: RequestContext<T> = {
                batch: this.batch,
                batchDependency: dependencyDispose,
                cachingOptions: this._cachingOptions,
                clientFactory: () => new SPHttpClient(),
                isBatched: this.hasBatch,
                isCached: this._useCaching,
                options: options,
                parser: parser,
                pipeline: pipeline,
                requestAbsoluteUrl: url,
                requestId: Util.getGUID(),
                verb: verb,
            };

            return context;
        });
    }
}

/**
 * Represents a REST collection which can be filtered, paged, and selected
 *
 */
export class SharePointQueryableCollection extends SharePointQueryable {

    /**
     * Filters the returned collection (https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#bk_supported)
     *
     * @param filter The string representing the filter query
     */
    public filter(filter: string): this {
        this._query.add("$filter", filter);
        return this;
    }

    /**
     * Choose which fields to return
     *
     * @param selects One or more fields to return
     */
    public select(...selects: string[]): this {
        if (selects.length > 0) {
            this._query.add("$select", selects.join(","));
        }
        return this;
    }

    /**
     * Expands fields such as lookups to get additional data
     *
     * @param expands The Fields for which to expand the values
     */
    public expand(...expands: string[]): this {
        if (expands.length > 0) {
            this._query.add("$expand", expands.join(","));
        }
        return this;
    }

    /**
     * Orders based on the supplied fields ascending
     *
     * @param orderby The name of the field to sort on
     * @param ascending If false DESC is appended, otherwise ASC (default)
     */
    public orderBy(orderBy: string, ascending = true): this {
        const keys = this._query.getKeys();
        const query: string[] = [];
        const asc = ascending ? " asc" : " desc";
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] === "$orderby") {
                query.push(this._query.get("$orderby"));
                break;
            }
        }
        query.push(`${orderBy}${asc}`);

        this._query.add("$orderby", query.join(","));

        return this;
    }

    /**
     * Skips the specified number of items
     *
     * @param skip The number of items to skip
     */
    public skip(skip: number): this {
        this._query.add("$skip", skip.toString());
        return this;
    }

    /**
     * Limits the query to only return the specified number of items
     *
     * @param top The query row limit
     */
    public top(top: number): this {
        this._query.add("$top", top.toString());
        return this;
    }
}


/**
 * Represents an instance that can be selected
 *
 */
export class SharePointQueryableInstance extends SharePointQueryable {

    /**
     * Choose which fields to return
     *
     * @param selects One or more fields to return
     */
    public select(...selects: string[]): this {
        if (selects.length > 0) {
            this._query.add("$select", selects.join(","));
        }
        return this;
    }

    /**
     * Expands fields such as lookups to get additional data
     *
     * @param expands The Fields for which to expand the values
     */
    public expand(...expands: string[]): this {
        if (expands.length > 0) {
            this._query.add("$expand", expands.join(","));
        }
        return this;
    }
}

import {
    Util,
    FetchOptions,
} from "@pnp/common";
import {
    ODataParser,
    ODataQueryable,
    RequestContext,
} from "@pnp/odata";
import { GraphHttpClient } from "./net/graphhttpclient";
import { GraphBatch } from "./batch";
import { GraphEndpoints } from "./types";


export interface GraphQueryableConstructor<T> {
    new(baseUrl: string | GraphQueryable, path?: string): T;
}

/**
 * Queryable Base Class
 *
 */
export class GraphQueryable<GetType = any> extends ODataQueryable<GraphBatch, GetType> {

    /**
     * Creates a new instance of the Queryable class
     *
     * @constructor
     * @param baseUrl A string or Queryable that should form the base part of the url
     *
     */
    constructor(baseUrl: string | GraphQueryable, path?: string) {
        super();

        if (typeof baseUrl === "string") {

            const urlStr = baseUrl as string;
            this._parentUrl = urlStr;
            this._url = Util.combinePaths(urlStr, path);
        } else {
            this.extend(baseUrl as GraphQueryable, path);
        }
    }

    /**
     * Creates a new instance of the supplied factory and extends this into that new instance
     *
     * @param factory constructor for the new queryable
     */
    public as<T>(factory: GraphQueryableConstructor<T>): T {
        const o = <T>new factory(this._url, null);
        return Util.extend(o, this, true);
    }

    /**
     * Gets the full url with query information
     *
     */
    public toUrlAndQuery(): string {

        let url = this.toUrl();

        if (!Util.isUrlAbsolute(url)) {
            url = Util.combinePaths("https://graph.microsoft.com", url);
        }

        return url + `?${this._query.getKeys().map(key => `${key}=${this._query.get(key)}`).join("&")}`;
    }

    /**
     * Gets a parent for this instance as specified
     *
     * @param factory The contructor for the class to create
     */
    protected getParent<T extends GraphQueryable>(
        factory: GraphQueryableConstructor<T>,
        baseUrl: string | GraphQueryable = this.parentUrl,
        path?: string): T {

        return new factory(baseUrl, path);
    }

    /**
     * Clones this queryable into a new queryable instance of T
     * @param factory Constructor used to create the new instance
     * @param additionalPath Any additional path to include in the clone
     * @param includeBatch If true this instance's batch will be added to the cloned instance
     */
    protected clone<T extends GraphQueryable>(factory: GraphQueryableConstructor<T>, additionalPath?: string, includeBatch = true): T {

        let clone = new factory(this, additionalPath);
        clone.configure(this._options);

        // TODO:: include batching info in clone
        if (includeBatch) {
            clone = clone.inBatch(this._batch);
        }

        return clone;
    }

    protected setEndpoint(endpoint: string): this {

        this._url = GraphEndpoints.ensure(this._url, endpoint);
        return this;
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

        // TODO:: add batch support
        return Promise.resolve({
            batch: this.batch,
            batchDependency: () => void (0),
            cachingOptions: this._cachingOptions,
            clientFactory: () => new GraphHttpClient(),
            isBatched: this.hasBatch,
            isCached: this._useCaching,
            options: options,
            parser: parser,
            pipeline: pipeline,
            requestAbsoluteUrl: this.toUrlAndQuery(),
            requestId: Util.getGUID(),
            verb: verb,
        });
    }
}

/**
 * Represents a REST collection which can be filtered, paged, and selected
 *
 */
export class GraphQueryableCollection<GetType = any[]> extends GraphQueryable<GetType> {

    /**
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
     * Orders based on the supplied fields
     *
     * @param orderby The name of the field on which to sort
     * @param ascending If false DESC is appended, otherwise ASC (default)
     */
    public orderBy(orderBy: string, ascending = true): this {
        const query = this._query.getKeys().filter(k => k === "$orderby").map(k => this._query.get(k));
        query.push(`${orderBy} ${ascending ? "asc" : "desc"}`);
        this._query.add("$orderby", query.join(","));
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

    /**
     * Skips a set number of items in the return set
     *
     * @param num Number of items to skip
     */
    public skip(num: number): this {
        this._query.add("$top", num.toString());
        return this;
    }

    /**
     * 	To request second and subsequent pages of Graph data
     */
    public skipToken(token: string): this {
        this._query.add("$skiptoken", token);
        return this;
    }

    /**
     * 	Retrieves the total count of matching resources
     */
    public get count(): this {
        this._query.add("$count", "true");
        return this;
    }
}

export class GraphQueryableSearchableCollection extends GraphQueryableCollection {

    /**
     * 	To request second and subsequent pages of Graph data
     */
    public search(query: string): this {
        this._query.add("$search", query);
        return this;
    }
}

/**
 * Represents an instance that can be selected
 *
 */
export class GraphQueryableInstance<GetType = any> extends GraphQueryable<GetType> {

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

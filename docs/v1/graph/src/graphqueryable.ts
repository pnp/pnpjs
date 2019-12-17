import {
    combine,
    extend,
    isUrlAbsolute,
    FetchOptions,
    getGUID,
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
            this._url = combine(urlStr, path);
        } else {
            this.extend(baseUrl as GraphQueryable, path);
        }
    }

    /**
     * Choose which fields to return
     *
     * @param selects One or more fields to return
     */
    public select(...selects: string[]): this {
        if (selects.length > 0) {
            this.query.set("$select", selects.join(","));
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
            this.query.set("$expand", expands.join(","));
        }
        return this;
    }

    /**
     * Creates a new instance of the supplied factory and extends this into that new instance
     *
     * @param factory constructor for the new queryable
     */
    public as<T>(factory: GraphQueryableConstructor<T>): T {
        const o = <T>new factory(this._url, null);
        return extend(o, this, true);
    }

    /**
     * Gets the full url with query information
     *
     */
    public toUrlAndQuery(): string {

        let url = this.toUrl();

        if (!isUrlAbsolute(url)) {
            url = combine("https://graph.microsoft.com", url);
        }

        if (this.query.size > 0) {
            const char = url.indexOf("?") > -1 ? "&" : "?";
            url += `${char}${Array.from(this.query).map((v: [string, string]) => v[0] + "=" + v[1]).join("&")}`;
        }

        return url;
    }

    /**
     * Allows setting the endpoint (v1.0, beta)
     * 
     * @param endpoint 
     */
    public setEndpoint(endpoint: "beta" | "v1.0"): this {

        this._url = GraphEndpoints.ensure(this._url, endpoint);
        return this;
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

        return <T>super._clone(new factory(this, additionalPath), { includeBatch });
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

        const dependencyDispose = this.hasBatch ? this._batchDependency : () => { return; };

        return Promise.resolve({
            batch: this.batch,
            batchDependency: dependencyDispose,
            cachingOptions: this._cachingOptions,
            clientFactory: () => new GraphHttpClient(),
            isBatched: this.hasBatch,
            isCached: /^get$/i.test(verb) && this._useCaching,
            options: options,
            parser: parser,
            pipeline: pipeline,
            requestAbsoluteUrl: this.toUrlAndQuery(),
            requestId: getGUID(),
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
        this.query.set("$filter", filter);
        return this;
    }

    /**
     * Orders based on the supplied fields
     *
     * @param orderby The name of the field on which to sort
     * @param ascending If false DESC is appended, otherwise ASC (default)
     */
    public orderBy(orderBy: string, ascending = true): this {
        const o = "$orderby";
        const query = this.query.has(o) ? this.query.get(o).split(",") : [];
        query.push(`${orderBy} ${ascending ? "asc" : "desc"}`);
        this.query.set(o, query.join(","));
        return this;
    }

    /**
     * Limits the query to only return the specified number of items
     *
     * @param top The query row limit
     */
    public top(top: number): this {
        this.query.set("$top", top.toString());
        return this;
    }

    /**
     * Skips a set number of items in the return set
     *
     * @param num Number of items to skip
     */
    public skip(num: number): this {
        this.query.set("$skip", num.toString());
        return this;
    }

    /**
     * 	To request second and subsequent pages of Graph data
     */
    public skipToken(token: string): this {
        this.query.set("$skiptoken", token);
        return this;
    }

    /**
     * 	Retrieves the total count of matching resources
     */
    public get count(): this {
        this.query.set("$count", "true");
        return this;
    }
}

export class GraphQueryableSearchableCollection extends GraphQueryableCollection {

    /**
     * 	To request second and subsequent pages of Graph data
     */
    public search(query: string): this {
        this.query.set("$search", query);
        return this;
    }
}

/**
 * Represents an instance that can be selected
 *
 */
export class GraphQueryableInstance<GetType = any> extends GraphQueryable<GetType> { }

/**
 * Decorator used to specify the default path for Queryable objects
 * 
 * @param path 
 */
export function defaultPath(path: string) {

    return function <T extends { new(...args: any[]): {} }>(target: T) {

        return class extends target {
            constructor(...args: any[]) {
                super(args[0], args.length > 1 && args[1] !== undefined ? args[1] : path);
            }
        };
    };
}

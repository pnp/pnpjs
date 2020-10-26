import { combine, IFetchOptions } from "@pnp/common";
import { Queryable, invokableFactory, IInvokable } from "@pnp/odata";
import { GraphEndpoints } from "./types";
import { graphGet } from "./operations";

export interface IGraphQueryableConstructor<T> {
    new(baseUrl: string | IGraphQueryable, path?: string): T;
}

export const graphInvokableFactory = <R>(f: any): (baseUrl: string | IGraphQueryable, path?: string) => R => {
    return invokableFactory<R>(f);
};

/**
 * Queryable Base Class
 *
 */
export class _GraphQueryable<GetType = any> extends Queryable<GetType> implements IGraphQueryable<GetType> {

    /**
     * Creates a new instance of the Queryable class
     *
     * @constructor
     * @param baseUrl A string or Queryable that should form the base part of the url
     *
     */
    constructor(baseUrl: string | IGraphQueryable, path?: string) {

        let url = "";
        let parentUrl = "";
        const query = new Map<string, string>();

        if (typeof baseUrl === "string") {
            parentUrl = baseUrl;
            url = combine(parentUrl, path);
        } else {
            parentUrl = baseUrl.toUrl();
            url = combine(parentUrl, path);
        }

        super({
            parentUrl,
            query,
            url,
        });

        // post init actions
        if (typeof baseUrl !== "string") {
            this.configureFrom(baseUrl);
        }
    }

    /**
     * Choose which fields to return
     *
     * @param selects One or more fields to return
     */
    public select(...selects: string[]): this {
        if (selects.length > 0) {
            this.query.set("$select", selects.map(encodeURIComponent).join(","));
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
            this.query.set("$expand", expands.map(encodeURIComponent).join(","));
        }
        return this;
    }

    public defaultAction(options?: IFetchOptions): Promise<GetType> {
        return graphGet(this, options);
    }

    public get<T = GetType>(options?: IFetchOptions): Promise<T> {
        return graphGet<T>(<any>this, options);
    }

    /**
     * Gets the full url with query information
     *
     */
    public toUrlAndQuery(): string {

        let url = this.toUrl();

        if (this.query.size > 0) {
            const char = url.indexOf("?") > -1 ? "&" : "?";
            url += `${char}${Array.from(this.query).map((v: [string, string]) => v[0] + "=" + v[1]).join("&")}`;
        }

        return url;
    }

    public setEndpoint(endpoint: "beta" | "v1.0"): this {
        this.data.url = GraphEndpoints.ensure(this.data.url, endpoint);
        return this;
    }

    /**
     * Clones this queryable into a new queryable instance of T
     * @param factory Constructor used to create the new instance
     * @param additionalPath Any additional path to include in the clone
     * @param includeBatch If true this instance's batch will be added to the cloned instance
     * @param includeQuery If true all of the query values will be copied to the cloned instance
     */
    public clone<T extends IGraphQueryable>(factory: (...args: any[]) => T, additionalPath?: string, includeBatch = true, includeQuery = false): T {

        return super.cloneTo<T>(factory(this, additionalPath), { includeBatch, includeQuery });
    }

    /**
     * Gets a parent for this instance as specified
     *
     * @param factory The contructor for the class to create
     */
    protected getParent<T extends _GraphQueryable>(
        factory: IGraphQueryableConstructor<T>,
        baseUrl: string | IGraphQueryable = this.parentUrl,
        path?: string): T {

        return new factory(baseUrl, path);
    }
}

export interface IGraphQueryable<GetType = any> extends _GraphQueryable<GetType>, IInvokable<GetType> { }
export interface _SharePointQueryable<GetType = any> extends IInvokable<GetType> { }
export interface _GraphQueryable<GetType = any> extends IInvokable<GetType> { }
export const GraphQueryable = graphInvokableFactory<IGraphQueryable>(_GraphQueryable);

/**
 * Represents a REST collection which can be filtered, paged, and selected
 *
 */
export class _GraphQueryableCollection<GetType = any[]> extends _GraphQueryable<GetType> implements IGraphQueryableCollection<GetType> {

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
        query.push(`${encodeURIComponent(orderBy)} ${ascending ? "asc" : "desc"}`);
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

export interface IGraphQueryableCollection<GetType = any[]> extends IInvokable, IGraphQueryable<GetType> {

    /**
     * 	Retrieves the total count of matching resources
     */
    count: this;

    /**
     *
     * @param filter The string representing the filter query
     */
    filter(filter: string): this;

    /**
     * Orders based on the supplied fields
     *
     * @param orderby The name of the field on which to sort
     * @param ascending If false DESC is appended, otherwise ASC (default)
     */
    orderBy(orderBy: string, ascending?: boolean): this;

    /**
     * Limits the query to only return the specified number of items
     *
     * @param top The query row limit
     */
    top(top: number): this;

    /**
     * Skips a set number of items in the return set
     *
     * @param num Number of items to skip
     */
    skip(num: number): this;

    /**
     * 	To request second and subsequent pages of Graph data
     */
    skipToken(token: string): this;
}
export interface _GraphQueryableCollection extends IInvokable { }
export const GraphQueryableCollection = graphInvokableFactory<IGraphQueryableCollection>(_GraphQueryableCollection);

export class _GraphQueryableSearchableCollection extends _GraphQueryableCollection implements IGraphQueryableSearchableCollection {

    /**
     * 	To request second and subsequent pages of Graph data
     */
    public search(query: string): this {
        this.query.set("$search", query);
        return this;
    }
}

export interface IGraphQueryableSearchableCollection<GetType = any> extends IInvokable, IGraphQueryable<GetType> {
    search(query: string): this;
}
export interface _GraphQueryableSearchableCollection extends IInvokable { }
export const GraphQueryableSearchableCollection = graphInvokableFactory<IGraphQueryableSearchableCollection>(_GraphQueryableSearchableCollection);


/**
 * Represents an instance that can be selected
 *
 */
export class _GraphQueryableInstance<GetType = any> extends _GraphQueryable<GetType> { }

export interface IGraphQueryableInstance<GetType = any> extends IInvokable, IGraphQueryable<GetType> { }
export interface _GraphQueryableInstance extends IInvokable { }
export const GraphQueryableInstance = graphInvokableFactory<IGraphQueryableInstance>(_GraphQueryableInstance);

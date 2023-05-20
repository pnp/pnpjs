import { isArray } from "@pnp/core";
import { IInvokable, Queryable, queryableFactory } from "@pnp/queryable";
import { ConsistencyLevel } from "./behaviors/consistency-level.js";
import { AsPaged, IPagedResult } from "./behaviors/paged.js";

export type GraphInit = string | IGraphQueryable | [IGraphQueryable, string];

export interface IGraphQueryableConstructor<T> {
    new(base: GraphInit, path?: string): T;
}

export type IGraphInvokableFactory<R extends IGraphQueryable> = (base: GraphInit, path?: string) => R & IInvokable;

export const graphInvokableFactory = <R extends IGraphQueryable>(f: any): IGraphInvokableFactory<R> => {
    return queryableFactory<R>(f);
};

/**
 * Queryable Base Class
 *
 */
export class _GraphQueryable<GetType = any> extends Queryable<GetType> {

    protected parentUrl: string;

    /**
     * Creates a new instance of the Queryable class
     *
     * @constructor
     * @param base A string or Queryable that should form the base part of the url
     *
     */
    constructor(base: GraphInit, path?: string) {

        super(base, path);

        if (typeof base === "string") {

            this.parentUrl = base;

        } else if (isArray(base)) {

            this.parentUrl = base[0].toUrl();

        } else {

            this.parentUrl = base.toUrl();
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
     * Gets a parent for this instance as specified
     *
     * @param factory The contructor for the class to create
     */
    protected getParent<T extends _GraphQueryable>(
        factory: IGraphQueryableConstructor<T>,
        base: GraphInit = this.parentUrl,
        path?: string): T {

        if (typeof base === "string") {
            // we need to ensure the parent has observers, even if we are rebasing the url (#2435)
            base = [this, base];
        }

        return new factory(base, path);
    }
}

export interface IGraphQueryable<GetType = any> extends _GraphQueryable<GetType> { }
export const GraphQueryable = graphInvokableFactory<IGraphQueryable>(_GraphQueryable);

/**
 * Represents a REST collection which can be filtered, paged, and selected
 *
 */
export class _GraphQueryableCollection<GetType = any[]> extends _GraphQueryable<GetType> {

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
        const query = this.query.get(o)?.split(",") || [];
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
     * Skips a set number of items in the return set
     *
     * @param num Number of items to skip
     */
    public search(query: string): this {
        this.using(ConsistencyLevel());
        this.query.set("$search", query);
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
     *  If the resource doesn't support count, this value will always be zero
     */
    public async count(): Promise<number> {
        const q = AsPaged(this);
        const r: IPagedResult = await q.top(1)();
        return r.count;
    }

    /**
     * Allows reading through a collection as pages of information whose size is determined by top or the api method's default
     *
     * @returns an object containing results, the ability to determine if there are more results, and request the next page of results
     */
    public paged(): Promise<IPagedResult> {
        return AsPaged(this)();
    }
}
export interface IGraphQueryableCollection<GetType = any[]> extends _GraphQueryableCollection<GetType> { }
export const GraphQueryableCollection = graphInvokableFactory<IGraphQueryableCollection>(_GraphQueryableCollection);

/**
 * Represents an instance that can be selected
 *
 */
export class _GraphQueryableInstance<GetType = any> extends _GraphQueryable<GetType> { }

export interface IGraphQueryableInstance<GetType = any> extends IInvokable, IGraphQueryable<GetType> { }
export const GraphQueryableInstance = graphInvokableFactory<IGraphQueryableInstance>(_GraphQueryableInstance);

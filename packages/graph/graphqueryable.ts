import { isArray, objectDefinedNotNull } from "@pnp/core";
import { IInvokable, Queryable, queryableFactory, op, get, post, patch, del, put } from "@pnp/queryable";
import { ConsistencyLevel } from "./behaviors/consistency-level.js";
import { IPagedResult, Paged } from "./behaviors/paged.js";

export type GraphInit = string | IGraphQueryable | [IGraphQueryable, string];

export interface IGraphConstructor<T> {
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

        // we need to use the graph implementation to handle our special encoding
        this._query = new GraphQueryParams();

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
        factory: IGraphConstructor<T>,
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
export class _GraphCollection<GetType = any[]> extends _GraphQueryable<GetType> {

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

    public [Symbol.asyncIterator]() {

        const q = GraphCollection(this).using(Paged(), ConsistencyLevel());

        const queryParams = ["$search", "$top", "$select", "$expand", "$filter", "$orderby"];

        for (let i = 0; i < queryParams.length; i++) {
            const param = this.query.get(queryParams[i]);
            if (objectDefinedNotNull(param)) {
                q.query.set(queryParams[i], param);
            }
        }

        return <AsyncIterator<GetType>>{

            _next: q,

            async next() {

                if (this._next === null) {
                    return { done: true, value: undefined };
                }

                const result: IPagedResult<any> = await this._next();

                if (result.hasNext) {
                    this._next = GraphCollection([this._next, result.nextLink]);
                    return { done: false, value: result.value };
                } else {
                    this._next = null;
                    return { done: false, value: result.value };
                }
            },
        };
    }
}

export interface IGraphCollection<GetType = any[]> extends _GraphCollection<GetType> { }
export const GraphCollection = graphInvokableFactory<IGraphCollection>(_GraphCollection);

/**
 * Represents an instance that can be selected
 *
 */
export class _GraphInstance<GetType = any> extends _GraphQueryable<GetType> { }

export interface IGraphInstance<GetType = any> extends IInvokable, IGraphQueryable<GetType> { }
export const GraphInstance = graphInvokableFactory<IGraphInstance>(_GraphInstance);

export const graphGet = <T = any>(o: IGraphQueryable<any>, init?: RequestInit): Promise<T> => {
    return op(o, get, init);
};

export const graphPost = <T = any>(o: IGraphQueryable<any>, init?: RequestInit): Promise<T> => {
    return op(o, post, init);
};

export const graphDelete = <T = any>(o: IGraphQueryable<any>, init?: RequestInit): Promise<T> => {
    return op(o, del, init);
};

export const graphPatch = <T = any>(o: IGraphQueryable<any>, init?: RequestInit): Promise<T> => {
    return op(o, patch, init);
};

export const graphPut = <T = any>(o: IGraphQueryable<any>, init?: RequestInit): Promise<T> => {
    return op(o, put, init);
};

class GraphQueryParams extends Map<string, string> {

    public toString(): string {

        const params = new URLSearchParams();
        const literals: string[] = [];

        for (const item of this) {

            // and here is where we add some "enhanced" parsing as we get issues.
            if (/\/any\(.*?\)/i.test(item[1])) {
                literals.push(`${item[0]}=${item[1]}`);
            } else {
                params.append(item[0], item[1]);
            }
        }

        literals.push(params.toString());

        return literals.join("&");
    }
}

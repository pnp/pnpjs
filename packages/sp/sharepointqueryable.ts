import { combine, isUrlAbsolute } from "@pnp/core";
import { IInvokable, Queryable, queryableFactory, IQueryable2, FromQueryable } from "@pnp/queryable";
import { spPostDelete, spPostDeleteETag } from "./operations.js";
import { SPTagging } from "./behaviors/telemetry.js";

export interface ISPConstructor<T extends ISPQueryable = ISPQueryable> {
    new(baseUrl: string | ISPQueryable, path?: string): T;
}

export type ISPInvokableFactory<R extends IQueryable2> = (baseUrl: string | ISPQueryable, path?: string) => R & IInvokable;

export const spInvokableFactory = <R extends IQueryable2>(f: any): ISPInvokableFactory<R> => {
    return queryableFactory<R>(f);
};

/**
 * SharePointQueryable Base Class
 *
 */
export class _SPQueryable<GetType = any> extends Queryable<GetType> implements IQueryable2<GetType> {

    protected parentUrl: string;

    /**
     * Creates a new instance of the SharePointQueryable class
     *
     * @constructor
     * @param base A string or SharePointQueryable that should form the base part of the url
     *
     */
    constructor(base: string | ISPQueryable, path?: string) {

        if (typeof base === "string") {

            let url = "";
            let parentUrl = "";

            // we need to do some extra parsing to get the parent url correct if we are
            // being created from just a string.

            if (isUrlAbsolute(base) || base.lastIndexOf("/") < 0) {
                parentUrl = base;
                url = combine(base, path);
            } else if (base.lastIndexOf("/") > base.lastIndexOf("(")) {
                // .../items(19)/fields
                const index = base.lastIndexOf("/");
                parentUrl = base.slice(0, index);
                path = combine(base.slice(index), path);
                url = combine(parentUrl, path);
            } else {
                // .../items(19)
                const index = base.lastIndexOf("(");
                parentUrl = base.slice(0, index);
                url = combine(base, path);
            }

            // init base with corrected string value
            super(url);

            this.parentUrl = parentUrl;

        } else {

            super(base, path);

            this.parentUrl = base.toUrl();

            const target = base.query.get("@target");
            if (target !== undefined) {
                this.query.set("@target", target);
            }
        }

        // always include our tagging
        this.using(SPTagging());
    }

    /**
     * Gets the full url with query information
     */
    public toRequestUrl(): string {

        const aliasedParams = new Map<string, string>(this.query);

        let url = this.toUrl().replace(/'!(@.*?)::(.*?)'/ig, (match, labelName, value) => {
            this.emit.log(`Rewriting aliased parameter from match ${match} to label: ${labelName} value: ${value}`, 0);
            aliasedParams.set(labelName, `'${value}'`);
            return labelName;
        });

        if (aliasedParams.size > 0) {
            const char = url.indexOf("?") > -1 ? "&" : "?";
            url += `${char}${Array.from(aliasedParams).map((v: [string, string]) => v[0] + "=" + v[1]).join("&")}`;
        }

        return url;
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

    /**
     * Gets a parent for this instance as specified
     *
     * @param factory The contructor for the class to create
     */
    protected getParent<T extends ISPQueryable>(
        factory: ISPInvokableFactory<any>,
        baseUrl: string | ISPQueryable = this.parentUrl,
        path?: string): T {

        const parent = factory(baseUrl, path);

        if (typeof baseUrl === "string") {
            parent.using(FromQueryable(this));
        }

        const t = "@target";
        if (this.query.has(t)) {
            parent.query.set(t, this.query.get(t));
        }

        return parent;
    }
}
export interface ISPQueryable<GetType = any> extends _SPQueryable<GetType> { }
export const SPQueryable = spInvokableFactory<ISPQueryable>(_SPQueryable);

/**
 * Represents a REST collection which can be filtered, paged, and selected
 *
 */
export class _SPCollection<GetType = any[]> extends _SPQueryable<GetType> {

    /**
     * Filters the returned collection (https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#bk_supported)
     *
     * @param filter The string representing the filter query
     */
    public filter(filter: string): this {
        this.query.set("$filter", encodeURIComponent(filter));
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
     * Skips the specified number of items
     *
     * @param skip The number of items to skip
     */
    public skip(skip: number): this {
        this.query.set("$skip", skip.toString());
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
}
export interface ISPCollection<GetType = any[]> extends _SPCollection<GetType> { }
export const SPCollection = spInvokableFactory<ISPCollection>(_SPCollection);

/**
 * Represents an instance that can be selected
 *
 */
export class _SPInstance<GetType = any> extends _SPQueryable<GetType> { }
export interface ISPInstance<GetType = any> extends _SPInstance<GetType> { }
export const SPInstance = spInvokableFactory<ISPInstance>(_SPInstance);

/**
 * Adds the a delete method to the tagged class taking no parameters and calling spPostDelete
 */
export function deleteable() {

    return function (this: ISPQueryable): Promise<void> {
        return spPostDelete<void>(this);
    };
}

export interface IDeleteable {
    /**
     * Delete this instance
     */
    delete(): Promise<void>;
}

export function deleteableWithETag() {

    return function (this: ISPQueryable, eTag = "*"): Promise<void> {
        return spPostDeleteETag<void>(this, {}, eTag);
    };
}

export interface IDeleteableWithETag {
    /**
     * Delete this instance
     *
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    delete(eTag?: string): Promise<void>;
}

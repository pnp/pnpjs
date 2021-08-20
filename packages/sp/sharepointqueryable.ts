import { combine, isUrlAbsolute, assign, jsS, IFetchOptions } from "@pnp/core";
import { IInvokable, invokableFactory, Queryable2, queryableFactory, IQueryable2, OLD_Queryable as OLD_Queryable, IRequestContext } from "@pnp/queryable";
import { Logger, LogLevel } from "@pnp/logging";
import { SPBatch } from "./batch.js";
import { metadata } from "./utils/metadata.js";
import { OLD_spGet, OLD_spPost, OLD_spPostDelete, OLD_spPostDeleteETag, spPost, spPostDelete, spPostDeleteETag } from "./operations.js";
import { tag } from "./telemetry.js";

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
export class _SPQueryable<GetType = any> extends Queryable2<GetType> implements IQueryable2<GetType> {

    protected parentUrl: string;

    /**
     * Creates a new instance of the SharePointQueryable class
     *
     * @constructor
     * @param base A string or SharePointQueryable that should form the base part of the url
     *
     */
    constructor(base: string | ISPQueryable, path: string) {

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



        // post init actions
        // TODO:: I think we can remove this based on the new architecture
        // if (typeof baseUrl !== "string") {
        //     this.configureFrom(baseUrl);
        // }
        // this._forceCaching = false;
    }

    /**
     * Gets the full url with query information
     */
    public toRequestUrl(): string {

        const aliasedParams = new Map<string, string>(this.query);

        let url = this.toUrl().replace(/'!(@.*?)::(.*?)'/ig, (match, labelName, value) => {
            Logger.write(`Rewriting aliased parameter from match ${match} to label: ${labelName} value: ${value}`, LogLevel.Verbose);
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
        path?: string,
        batch?: SPBatch): T {

        // TODO:: this doesn't work anymore
        let parent = factory(baseUrl, path).configureFrom(this);

        const t = "@target";
        if (this.query.has(t)) {
            parent.query.set(t, this.query.get(t));
        }
        if (batch !== undefined) {
            parent = parent.inBatch(batch);
        }
        return parent;
    }

    public clone<T extends OLD_ISharePointQueryable>(factory: (...args: any[]) => T, additionalPath?: string, includeBatch = true, includeQuery = false): T {

        const clone: T = factory(this, additionalPath);

        // handle sp specific clone actions
        if (!includeQuery) {
            // we would have already copied this over if we got the entire query
            const t = "@target";
            if (this.query.has(t)) {
                clone.query.set(t, this.query.get(t));
            }
        }

        return clone;
    }
}
export interface ISPQueryable<GetType = any> extends _SPQueryable<GetType> { }
// this interface is to fix build issues when moving to typescript 4. _SharePointQueryable is itself not invokable but we need to match signatures
// eslint-disable-next-line no-redeclare
// export interface _SharePointQueryable<GetType = any> {
//     <T = GetType>(options?: Partial<IRequestContext<T>>): Promise<T>;
// }
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
export class _SPInstance<GetType = any> extends _SPQueryable<GetType> {

    /**
     * Curries the update function into the common pieces
     *
     * @param type
     * @param mapper
     */
    protected _update<Return, Props = any>(type: string, mapper: (data: any, props: Props) => Return): (props: Props) => Promise<Return> {
        return (props: any) => spPost(tag.configure(this, `${type}.Update`), {
            body: jsS(assign(metadata(type), props)),
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then((d: any) => mapper(d, props));
    }
}
export interface ISPInstance<GetType = any> extends _SPInstance<GetType> { }
export const SPInstance = spInvokableFactory<ISPInstance>(_SPInstance);

/**
 * Adds the a delete method to the tagged class taking no parameters and calling spPostDelete
 */
export function deleteable(t: string) {

    return function (this: ISPQueryable): Promise<void> {
        return spPostDelete<void>(tag.configure(this, `${t}.delete`));
    };
}

export interface IDeleteable {
    /**
     * Delete this instance
     */
    delete(): Promise<void>;
}

export function deleteableWithETag(t: string) {

    return function (this: ISPQueryable, eTag = "*"): Promise<void> {
        return spPostDeleteETag<void>(tag.configure(this, `${t}.delete`), {}, eTag);
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










/*
*************************************************************************
*
* BELOW THIS IS OLD CODE FROM V2 - it will all go away
*
*************************************************************************
*/


export interface OLD_ISharePointQueryableConstructor<T extends OLD_ISharePointQueryable = OLD_ISharePointQueryable> {
    new(baseUrl: string | OLD_ISharePointQueryable, path?: string): T;
}

export type OLD_ISPInvokableFactory<R extends any> = (baseUrl: string | OLD_ISharePointQueryable, path?: string) => R & IInvokable;

export const OLD_spInvokableFactory = <R>(f: any): OLD_ISPInvokableFactory<R> => {
    return invokableFactory<R>(f);
};

/**
 * SharePointQueryable Base Class
 *
 */
export class _OLD_SharePointQueryable<GetType = any> extends OLD_Queryable<GetType> {

    protected _forceCaching: boolean;

    /**
     * Creates a new instance of the SharePointQueryable class
     *
     * @constructor
     * @param baseUrl A string or SharePointQueryable that should form the base part of the url
     *
     */
    constructor(baseUrl: string | OLD_ISharePointQueryable, path?: string) {

        let url = "";
        let parentUrl = "";
        const query = new Map<string, string>();

        if (typeof baseUrl === "string") {
            // we need to do some extra parsing to get the parent url correct if we are
            // being created from just a string.

            if (isUrlAbsolute(baseUrl) || baseUrl.lastIndexOf("/") < 0) {
                parentUrl = baseUrl;
                url = combine(baseUrl, path);
            } else if (baseUrl.lastIndexOf("/") > baseUrl.lastIndexOf("(")) {
                // .../items(19)/fields
                const index = baseUrl.lastIndexOf("/");
                parentUrl = baseUrl.slice(0, index);
                path = combine(baseUrl.slice(index), path);
                url = combine(parentUrl, path);
            } else {
                // .../items(19)
                const index = baseUrl.lastIndexOf("(");
                parentUrl = baseUrl.slice(0, index);
                url = combine(baseUrl, path);
            }
        } else {

            parentUrl = baseUrl.toUrl();
            url = combine(parentUrl, path || "");
            const target = baseUrl.query.get("@target");
            if (target !== undefined) {
                query.set("@target", target);
            }
        }

        // init base with correct values for data seed
        super({
            parentUrl,
            query,
            url,
        });

        // post init actions
        if (typeof baseUrl !== "string") {
            this.configureFrom(baseUrl);
        }
        this._forceCaching = false;
    }

    /**
     * Gets the full url with query information
     */
    public toUrlAndQuery(): string {

        const aliasedParams = new Map<string, string>(this.query);

        let url = this.toUrl().replace(/'!(@.*?)::(.*?)'/ig, (match, labelName, value) => {
            Logger.write(`Rewriting aliased parameter from match ${match} to label: ${labelName} value: ${value}`, LogLevel.Verbose);
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

    public get<T = GetType>(options?: IFetchOptions): Promise<T> {
        return OLD_spGet<T>(<any>this, options);
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
     * Clones this SharePointQueryable into a new SharePointQueryable instance of T
     * @param factory Constructor used to create the new instance
     * @param additionalPath Any additional path to include in the clone
     * @param includeBatch If true this instance's batch will be added to the cloned instance
     * @param includeQuery If true all of the query values will be copied to the cloned instance
     */
    public clone<T extends OLD_ISharePointQueryable>(factory: (...args: any[]) => T, additionalPath?: string, includeBatch = true, includeQuery = false): T {

        const clone: T = super.cloneTo(factory(this, additionalPath), { includeBatch, includeQuery });

        // handle sp specific clone actions
        if (!includeQuery) {
            // we would have already copied this over if we got the entire query
            const t = "@target";
            if (this.query.has(t)) {
                clone.query.set(t, this.query.get(t));
            }
        }

        return clone;
    }

    /**
     * The default action for this object (unless overridden spGet)
     *
     * @param options optional request options
     */
    public defaultAction(options?: IFetchOptions): Promise<GetType> {
        return OLD_spGet(this, options);
    }

    /**
     * Gets a parent for this instance as specified
     *
     * @param factory The contructor for the class to create
     */
    protected getParent<T extends OLD_ISharePointQueryable>(
        factory: OLD_ISPInvokableFactory<any>,
        baseUrl: string | OLD_ISharePointQueryable = this.parentUrl,
        path?: string,
        batch?: SPBatch): T {

        let parent = factory(baseUrl, path).configureFrom(this);

        const t = "@target";
        if (this.query.has(t)) {
            parent.query.set(t, this.query.get(t));
        }
        if (batch !== undefined) {
            parent = parent.inBatch(batch);
        }
        return parent;
    }
}
export interface OLD_ISharePointQueryable<GetType = any> extends _OLD_SharePointQueryable<GetType> { }
// this interface is to fix build issues when moving to typescript 4. _SharePointQueryable is itself not invokable but we need to match signatures
// eslint-disable-next-line no-redeclare
export interface _OLD_SharePointQueryable<GetType = any> {
    <T = GetType>(options?: Partial<IRequestContext<T>>): Promise<T>;
}
export const OLD_SharePointQueryable = OLD_spInvokableFactory<OLD_ISharePointQueryable>(_OLD_SharePointQueryable);

/**
 * Represents a REST collection which can be filtered, paged, and selected
 *
 */
export class _OLD_SharePointQueryableCollection<GetType = any[]> extends _OLD_SharePointQueryable<GetType> {

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
export interface OLD_ISharePointQueryableCollection<GetType = any[]> extends _OLD_SharePointQueryableCollection<GetType> { }
export const OLD_SharePointQueryableCollection = OLD_spInvokableFactory<OLD_ISharePointQueryableCollection>(_OLD_SharePointQueryableCollection);

/**
 * Represents an instance that can be selected
 *
 */
export class _OLD_SharePointQueryableInstance<GetType = any> extends _OLD_SharePointQueryable<GetType> {

    /**
     * Curries the update function into the common pieces
     *
     * @param type
     * @param mapper
     */
    protected _update<Return, Props = any>(type: string, mapper: (data: any, props: Props) => Return): (props: Props) => Promise<Return> {
        return (props: any) => OLD_spPost(tag.configure(this, `${type}.Update`), {
            body: jsS(assign(metadata(type), props)),
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then((d: any) => mapper(d, props));
    }
}
export interface OLD_ISharePointQueryableInstance<GetType = any> extends _OLD_SharePointQueryableInstance<GetType> { }
export const OLD_SharePointQueryableInstance = OLD_spInvokableFactory<OLD_ISharePointQueryableInstance>(_OLD_SharePointQueryableInstance);

/**
 * Adds the a delete method to the tagged class taking no parameters and calling spPostDelete
 */
export function OLD_deleteable(t: string) {

    return function (this: OLD_ISharePointQueryable): Promise<void> {
        return OLD_spPostDelete<void>(tag.configure(this, `${t}.delete`));
    };
}

export interface OLD_IDeleteable {
    /**
     * Delete this instance
     */
    delete(): Promise<void>;
}

export function OLD_deleteableWithETag(t: string) {

    return function (this: OLD_ISharePointQueryable, eTag = "*"): Promise<void> {
        return OLD_spPostDeleteETag<void>(tag.configure(this, `${t}.delete`), {}, eTag);
    };
}

export interface OLD_IDeleteableWithETag {
    /**
     * Delete this instance
     *
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    delete(eTag?: string): Promise<void>;
}




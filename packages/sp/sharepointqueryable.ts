import { combine, isUrlAbsolute, assign, jsS, IFetchOptions } from "@pnp/common";
import { Queryable, invokableFactory, IInvokable } from "@pnp/odata";
import { Logger, LogLevel } from "@pnp/logging";
import { SPBatch } from "./batch";
import { metadata } from "./utils/metadata";
import { spGet, spPost, spPostDelete, spPostDeleteETag } from "./operations";
import { tag } from "./telemetry";

export interface ISharePointQueryableConstructor<T extends ISharePointQueryable = ISharePointQueryable> {
    new(baseUrl: string | ISharePointQueryable, path?: string): T;
}

export type ISPInvokableFactory<R = any> = (baseUrl: string | ISharePointQueryable, path?: string) => R;

export const spInvokableFactory = <R>(f: any): ISPInvokableFactory<R> => {
    return invokableFactory<R>(f);
};

/**
 * SharePointQueryable Base Class
 *
 */
export class _SharePointQueryable<GetType = any> extends Queryable<GetType> {

    protected _forceCaching: boolean;

    /**
     * Creates a new instance of the SharePointQueryable class
     *
     * @constructor
     * @param baseUrl A string or SharePointQueryable that should form the base part of the url
     *
     */
    constructor(baseUrl: string | ISharePointQueryable, path?: string) {

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
        return spGet<T>(<any>this, options);
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
    public clone<T extends ISharePointQueryable>(factory: (...args: any[]) => T, additionalPath?: string, includeBatch = true, includeQuery = false): T {

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
        return spGet(this, options);
    }

    /**
     * Gets a parent for this instance as specified
     *
     * @param factory The contructor for the class to create
     */
    protected getParent<T extends ISharePointQueryable>(
        factory: ISPInvokableFactory<any>,
        baseUrl: string | ISharePointQueryable = this.parentUrl,
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
export interface ISharePointQueryable<GetType = any> extends _SharePointQueryable<GetType>, IInvokable<GetType> { }
export interface _SharePointQueryable<GetType = any> extends IInvokable<GetType> { }
export const SharePointQueryable = spInvokableFactory<ISharePointQueryable>(_SharePointQueryable);

/**
 * Represents a REST collection which can be filtered, paged, and selected
 *
 */
export class _SharePointQueryableCollection<GetType = any[]> extends _SharePointQueryable<GetType> {

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
export interface _SharePointQueryableCollection<GetType = any[]> extends IInvokable<GetType> { }
export interface ISharePointQueryableCollection<GetType = any[]> extends _SharePointQueryableCollection<GetType>, IInvokable<GetType> { }
export const SharePointQueryableCollection = spInvokableFactory<ISharePointQueryableCollection>(_SharePointQueryableCollection);

/**
 * Represents an instance that can be selected
 *
 */
export class _SharePointQueryableInstance<GetType = any> extends _SharePointQueryable<GetType> {

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
export interface ISharePointQueryableInstance<GetType = any> extends _SharePointQueryableInstance<GetType>, IInvokable<GetType> { }
export interface _SharePointQueryableInstance<GetType = any> extends IInvokable<GetType> { }
export const SharePointQueryableInstance = spInvokableFactory<ISharePointQueryableInstance>(_SharePointQueryableInstance);

/**
 * Adds the a delete method to the tagged class taking no parameters and calling spPostDelete
 */
export function deleteable(t: string) {

    return function (this: ISharePointQueryable): Promise<void> {
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

    return function (this: ISharePointQueryable, eTag = "*"): Promise<void> {
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

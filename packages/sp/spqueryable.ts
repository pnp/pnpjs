import { combine, isUrlAbsolute, isArray, objectDefinedNotNull, stringIsNullOrEmpty } from "@pnp/core";
import { IInvokable, Queryable, queryableFactory } from "@pnp/queryable";
import { spPostDelete, spPostDeleteETag } from "./operations.js";

export type SPInit = string | ISPQueryable | [ISPQueryable, string];

export interface ISPConstructor<T extends ISPQueryable = ISPQueryable> {
    new(base: SPInit, path?: string): T;
}

export type ISPInvokableFactory<R extends ISPQueryable> = (base: SPInit, path?: string) => R & IInvokable;

export const spInvokableFactory = <R extends ISPQueryable>(f: any): ISPInvokableFactory<R> => {
    return queryableFactory<R>(f);
};

/**
 * SharePointQueryable Base Class
 *
 */
export class _SPQueryable<GetType = any> extends Queryable<GetType> {

    protected parentUrl: string;

    /**
     * Creates a new instance of the SharePointQueryable class
     *
     * @constructor
     * @param base A string or SharePointQueryable that should form the base part of the url
     *
     */
    constructor(base: SPInit, path?: string) {

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

            const q: Queryable<any> = isArray(base) ? base[0] : base;
            this.parentUrl = isArray(base) ? base[1] : q.toUrl();

            const target = q.query.get("@target");
            if (objectDefinedNotNull(target)) {
                this.query.set("@target", target);
            }
        }
    }

    /**
     * Gets the full url with query information
     */
    public toRequestUrl(): string {

        const aliasedParams = new URLSearchParams(this.query);

        // this regex is designed to locate aliased parameters within url paths. These may have the form:
        // /something(!@p1::value)
        // /something(!@p1::value, param=value)
        // /something(param=value,!@p1::value)
        // /something(param=value,!@p1::value,param=value)
        // /something(param=!@p1::value)
        // there could be spaces or not around the boundaries
        let url = this.toUrl().replace(/([( *| *, *| *= *])'!(@.*?)::(.*?)'([ *)| *, *])/ig, (match, frontBoundary, labelName, value, endBoundary) => {
            this.log(`Rewriting aliased parameter from match ${match} to label: ${labelName} value: ${value}`, 0);
            aliasedParams.set(labelName,`'${value}'`);
            return `${frontBoundary}${labelName}${endBoundary}`;
        });

        const query = aliasedParams.toString();
        if (!stringIsNullOrEmpty(query)) {
            url += `${url.indexOf("?") > -1 ? "&" : "?"}${query}`;
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
    protected getParent<T extends ISPQueryable>(
        factory: ISPInvokableFactory<any>,
        path?: string,
        base: string = this.parentUrl): T {

        const parent = factory([this, base], path);

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
 * Supported Odata Operators for SharePoint
 *
 */
type FilterOperation = "eq" | "ne" | "gt" | "lt" | "startswith" | "endswith" | "substringof";

/**
* FilterField class for constructing OData filter operators
*
*/
class FilterField<GetType> {
    constructor(private parent: FilterBuilder<any>, private field: keyof any) {}

    public equals(value: string | number): FilterBuilder<GetType> {
        this.parent.addFilter(this.field as string, "eq", value);
        return this.parent;
    }

    public notEquals(value: string | number): FilterBuilder<GetType> {
        this.parent.addFilter(this.field, "ne", value);
        return this.parent;
    }

    public greaterThan(value: number|Date): FilterBuilder<GetType> {
        this.parent.addFilter(this.field, "gt", value);
        return this.parent;
    }

    public lessThan(value: number|Date): FilterBuilder<GetType> {
        this.parent.addFilter(this.field, "lt", value);
        return this.parent;
    }

    public startsWith(value: string): FilterBuilder<GetType> {
        this.parent.addFilter(this.field, "startswith", value);
        return this.parent;
    }

    public endsWith(value: string): FilterBuilder<GetType> {
        this.parent.addFilter(this.field, "endswith", value);
        return this.parent;
    }
    public substringof(value: string): FilterBuilder<GetType> {
        this.parent.addFilter(this.field, "substringof", value);
        return this.parent;
    }
}

/**
 * FilterBuilder class for constructing OData filter queries
 *
 */
export class FilterBuilder<GetType> {
    private condition = "";

    public field(field: keyof any): FilterField<GetType> {
        return new FilterField<GetType>(this, field);
    }

    public and(filter: (builder: FilterBuilder<GetType>) => void): FilterBuilder<GetType> {
        const previousCondition = this.condition;
        filter(this);
        const conditionInGroup = this.condition;
        this.condition = `(${previousCondition} and ${conditionInGroup})`;
        return this;
    }

    public or(filter: (builder: FilterBuilder<GetType>) => void): FilterBuilder<GetType> {
        const previousCondition = this.condition;
        filter(this);
        const conditionInGroup = this.condition;
        this.condition = `(${previousCondition} or ${conditionInGroup})`;
        return this;
    }

    public addFilter(field: keyof GetType, operation: FilterOperation, value: string | number | Date): void {
        switch(operation) {
            case ("startswith" || "endswith"):
                this.condition = `${operation}(${String(field)},${this.formatValue(value)})`;
                break;
            case "substringof":
                this.condition = `${operation}(${this.formatValue(value)},${String(field)})}`;
                break;
            default:
                this.condition = `${String(field)} ${operation} ${this.formatValue(value)}`;
        }
    }

    private formatValue(value: string | number | object): string {
        switch(typeof value){
            case "string":
                return `'${value}'`;
            case "number":
                return value.toString();
            case "object":
                if(value instanceof Date){
                    const isoDate = value.toISOString();
                    return `datetime'${isoDate}'`;
                }
                break;
            default:
                return `${value}`;
        }
    }

    public build(): string {
        return this.condition;
    }
}

/**
 * Represents a REST collection which can be filtered, paged, and selected
 *
 */
export class _SPCollection<GetType = any[]> extends _SPQueryable<GetType> {
    private filterConditions: string[] = [];
    /**
     * Filters the returned collection (https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#bk_supported)
     *
     * @param filter The filter condition function
     */

    public filter(filter: string | ((builder: FilterBuilder<GetType>) => void)): this {
        if (typeof filter === "string") {
            this.query.set("$filter", filter);
        } else {
            const filterBuilder = new FilterBuilder<GetType>();
            filter(filterBuilder);
            this.query.set("$filter", filterBuilder.build());
        }
        return this;
    }

    // don't really need this.
    public getFilterQuery(): string {
        if (this.filterConditions.length === 0) {
            return "";
        } else if (this.filterConditions.length === 1) {
            return `${this.filterConditions[0]}`;
        } else {
            return `${this.filterConditions.join(" and ")}`;
        }
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

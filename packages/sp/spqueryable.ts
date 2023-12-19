import { combine, isUrlAbsolute, isArray, objectDefinedNotNull, stringIsNullOrEmpty } from "@pnp/core";
import { IInvokable, Queryable, queryableFactory } from "@pnp/queryable";
import { spPostDelete, spPostDeleteETag } from "./operations.js";
import { IField } from "./fields/types.js";
import { filter } from "core-js/core/array";

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
            aliasedParams.set(labelName, `'${value}'`);
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
 * Represents a REST collection which can be filtered, paged, and selected
 *
 */
export class _SPCollection<GetType = any[]> extends _SPQueryable<GetType> {
    /**
     * Filters the returned collection (https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#bk_supported)
     *
     * @param filter The string representing the filter query
     */
    public filter<T>(filter: string | ICondition<T> | IFieldCondition<T>): this {
        this.query.set("$filter", typeof filter === "string" ? filter : filter.toQuery());
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

type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

enum FilterOperation {
    Equals = "eq",
    NotEquals = "ne",
    GreaterThan = "gt",
    GreaterThanOrEqualTo = "ge",
    LessThan = "lt",
    LessThanOrEqualTo = "le",
    StartsWith = "startswith",
    SubstringOf = "substringof"
}

enum FilterJoinOperator {
    And = "and",
    Or = "or"
}


export interface IFieldCondition<T> {
    toQuery(): string;
}

export interface ICondition<T> {
    toQuery(): string;
}

export interface INullableFieldBuilder<TBaseType, TObjectType> {
    toQuery(): string;
    toODataValue(value: TObjectType): string;
    Equals(value: TObjectType): IFieldCondition<TBaseType>;
    NotEquals(value: TObjectType): IFieldCondition<TBaseType>;
    IsNull(): IFieldCondition<TBaseType>;
}

function BaseNullableField<T, TType>(field: KeysMatching<T, TType>): INullableFieldBuilder<T, TType> {
    return {
        toQuery: () => "",
        toODataValue: val => `'${val}'`,
        Equals(value: TType): IFieldCondition<T> {
            return { toQuery: () => `${field as string} ${FilterOperation.Equals} ${this.toODataValue(value)}` };
        },
        NotEquals(value: TType): IFieldCondition<T> {
            return { toQuery: () => `${field as string} ${FilterOperation.NotEquals} ${this.toODataValue(value)}` };
        },
        IsNull(): IFieldCondition<T> {
            return { toQuery: () => `${field as string} eq null` };
        }
    };
}

export interface ITextFieldBuilder<T> extends INullableFieldBuilder<T, string> {
    StartsWith(value: string): IFieldCondition<T>;
    Contains(value: string): IFieldCondition<T>;
}

function BaseTextField<T>(field: KeysMatching<T, string>): ITextFieldBuilder<T> {
    return {
        ...BaseNullableField<T, string>(field),
        StartsWith(value: string): IFieldCondition<T> {
            return { toQuery: () => `${FilterOperation.StartsWith}(${field as string}, ${this.toODataValue(value)})` };
        },
        Contains(value: string): IFieldCondition<T> {
            return { toQuery: () => `${FilterOperation.SubstringOf}(${this.toODataValue(value)}, ${field as string})` };
        }
    };
}

export function TextField<T>(field: KeysMatching<T, string>): ITextFieldBuilder<T> {
    return BaseTextField<T>(field);
}

export function ChoiceField<T>(field: KeysMatching<T, string>): ITextFieldBuilder<T> {
    return BaseTextField<T>(field);
}

export function MultiChoiceField<T>(field: KeysMatching<T, string>): ITextFieldBuilder<T> {
    return BaseTextField<T>(field);
}



interface INumericField<T, TType> extends INullableFieldBuilder<T, TType> {
    Equals(value: TType): IFieldCondition<T>;
    GreaterThan(value: TType): IFieldCondition<T>;
    GreaterThanOrEquals(value: TType): IFieldCondition<T>;
    LessThan(value: TType): IFieldCondition<T>;
    LessThanOrEquals(value: TType): IFieldCondition<T>;
}


function BaseNumericField<T, TType>(field: KeysMatching<T, TType>): INumericField<T, TType> {
    return {
        ...BaseNullableField<T, TType>(field),
        GreaterThan(value: TType): IFieldCondition<T> {
            return { toQuery: () => `${field as string} ${FilterOperation.GreaterThan} ${this.toODataValue(value)}` };
        },
        GreaterThanOrEquals(value: TType): IFieldCondition<T> {
            return { toQuery: () => `${field as string} ${FilterOperation.GreaterThanOrEqualTo} ${this.toODataValue(value)}` };
        },
        LessThan(value: TType): IFieldCondition<T> {
            return { toQuery: () => `${field as string} ${FilterOperation.LessThan} ${this.toODataValue(value)}` };
        },
        LessThanOrEquals(value: TType): IFieldCondition<T> {
            return { toQuery: () => `${field as string} ${FilterOperation.LessThanOrEqualTo} ${this.toODataValue(value)}` };
        }
    };
}

export function NumberField<T>(field: KeysMatching<T, number>): INumericField<T, number> {
    return {
        ...BaseNumericField<T, number>(field),
        toODataValue: val => `${val}`
    };
}

export interface IDateFieldBuilder<T> extends INumericField<T, Date> {
    IsToday(): IFieldCondition<T>;
    IsBetween(start: Date, end: Date): IFieldCondition<T>;
}

export function DateField<T>(field: KeysMatching<T, Date>): IDateFieldBuilder<T> {
    return {
        ...BaseNumericField<T, Date>(field),
        toODataValue: val => `datetime'${val.toISOString()}'`,
        IsBetween(startDate: Date, endDate: Date): IFieldCondition<T> {
            return { toQuery: () => `(${field as string} ${FilterOperation.GreaterThanOrEqualTo} ${this.toODataValue(startDate)} ${FilterJoinOperator.And} ${field as string} ${FilterOperation.LessThan} ${this.toODataValue(endDate)})` };
        },
        IsToday(): IFieldCondition<T> {
            const StartToday = new Date(); StartToday.setHours(0, 0, 0, 0);
            const EndToday = new Date(); EndToday.setHours(23, 59, 59, 999);
            return this.IsBetween(StartToday, EndToday);
        }
    }

}





export interface IBooleanFieldBuilder<T> extends INullableFieldBuilder<T, boolean> {
    IsTrue(): IFieldCondition<T>;
    IsFalse(): IFieldCondition<T>;
    IsFalseOrNull(): IFieldCondition<T>;
}

export function BooleanField<T>(field: KeysMatching<T, boolean>): IBooleanFieldBuilder<T> {
    return {
        ...BaseNullableField<T, boolean>(field),
        toODataValue: val => `${val}`,
        IsTrue(): IFieldCondition<T> {
            return { toQuery: () => `${field as string} ${FilterOperation.Equals} ${this.toODataValue(true)}` };
        },
        IsFalse(): IFieldCondition<T> {
            return { toQuery: () => `${field as string} ${FilterOperation.Equals} ${this.toODataValue(false)}` };
        },
        IsFalseOrNull(): IFieldCondition<T> {
            return { toQuery: () => `(${field as string} ${FilterOperation.Equals} ${this.toODataValue(false)} ${FilterJoinOperator.Or} ${field as string} eq ${this.toODataValue(null)})` };
        }
    };
}




export function Or<T>(...conditions: Array<INullableFieldBuilder<T, any> | ICondition<T>>): ICondition<T> {
    return buildCondition(FilterJoinOperator.Or, ...conditions);
}

export function And<T>(...conditions: Array<INullableFieldBuilder<T, any> | ICondition<T>>): ICondition<T> {
    return buildCondition(FilterJoinOperator.Or, ...conditions);
}

function buildCondition<T>(operator: FilterJoinOperator, ...conditions: Array<INullableFieldBuilder<T, any> | ICondition<T>>): ICondition<T> {
    return {
        toQuery(): string {
            ;
            return `(${conditions.map(c => c.toQuery()).join(` ${operator} `)})`;
        },
    };
}
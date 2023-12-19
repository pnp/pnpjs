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
    SubstringOf = "substringof",
    In = "in"
}

enum FilterJoinOperator {
    And = "and",
    Or = "or"
}


export interface IFieldCondition<TBaseInterface> {
    toQuery(): string;
}

export interface ICondition<TBaseInterface> {
    toQuery(): string;
}

export interface INullableFieldBuilder<TBaseInterface, TObjectType> {
    toQuery(): string;
    toODataValue(value: TObjectType): string;
    IsNull(): IFieldCondition<TBaseInterface>;
}

function BaseNullableField<TBaseInterface, TType>(field: KeysMatching<TBaseInterface, TType>): INullableFieldBuilder<TBaseInterface, TType> {
    return {
        toQuery: () => "",
        toODataValue: val => `'${val}'`,
        IsNull(): IFieldCondition<TBaseInterface> {
            return { toQuery: () => `${field as string} eq null` };
        }
    };
}

interface IComperableField<TBaseInterface, TObjectType> extends INullableFieldBuilder<TBaseInterface, TObjectType> {
    Equals(value: TObjectType): IFieldCondition<TBaseInterface>;
    NotEquals(value: TObjectType): IFieldCondition<TBaseInterface>;
}

function BaseComperableField<TBaseInterface, TType>(field: KeysMatching<TBaseInterface, TType>): IComperableField<TBaseInterface, TType> {
    return {
        ...BaseNullableField<TBaseInterface, TType>(field),
        Equals(value: TType): IFieldCondition<TBaseInterface> {
            return { toQuery: () => `${field as string} ${FilterOperation.Equals} ${this.toODataValue(value)}` };
        },
        NotEquals(value: TType): IFieldCondition<TBaseInterface> {
            return { toQuery: () => `${field as string} ${FilterOperation.NotEquals} ${this.toODataValue(value)}` };
        },
    };
}

export interface ITextFieldBuilder<TBaseInterface> extends IComperableField<TBaseInterface, string> {
    StartsWith(value: string): IFieldCondition<TBaseInterface>;
    Contains(value: string): IFieldCondition<TBaseInterface>;
    In(...values: string[]): IFieldCondition<TBaseInterface>;
}

function BaseTextField<TBaseInterface>(field: KeysMatching<TBaseInterface, string>): ITextFieldBuilder<TBaseInterface> {
    return {
        ...BaseComperableField<TBaseInterface, string>(field),
        StartsWith(value: string): IFieldCondition<TBaseInterface> {
            return { toQuery: () => `${FilterOperation.StartsWith}(${field as string}, ${this.toODataValue(value)})` };
        },
        Contains(value: string): IFieldCondition<TBaseInterface> {
            return { toQuery: () => `${FilterOperation.SubstringOf}(${this.toODataValue(value)}, ${field as string})` };
        },
        In(...values: string[]): IFieldCondition<TBaseInterface> {
            return Or(...values.map(v => this.Equals(v)));
        }
    };
}

export function TextField<TBaseInterface>(field: KeysMatching<TBaseInterface, string>): ITextFieldBuilder<TBaseInterface> {
    return BaseTextField<TBaseInterface>(field);
}

export function ChoiceField<TBaseInterface>(field: KeysMatching<TBaseInterface, string>): ITextFieldBuilder<TBaseInterface> {
    return BaseTextField<TBaseInterface>(field);
}

export function MultiChoiceField<TBaseInterface>(field: KeysMatching<TBaseInterface, string>): ITextFieldBuilder<TBaseInterface> {
    return BaseTextField<TBaseInterface>(field);
}



interface INumericField<TBaseInterface, TType> extends INullableFieldBuilder<TBaseInterface, TType> {
    Equals(value: TType): IFieldCondition<TBaseInterface>;
    GreaterThan(value: TType): IFieldCondition<TBaseInterface>;
    GreaterThanOrEquals(value: TType): IFieldCondition<TBaseInterface>;
    LessThan(value: TType): IFieldCondition<TBaseInterface>;
    LessThanOrEquals(value: TType): IFieldCondition<TBaseInterface>;
}


function BaseNumericField<T, TType>(field: KeysMatching<T, TType>): INumericField<T, TType> {
    return {
        ...BaseComperableField<T, TType>(field),
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

export interface IDateFieldBuilder<TBaseInterface> extends INumericField<TBaseInterface, Date> {
    IsToday(): IFieldCondition<TBaseInterface>;
    IsBetween(start: Date, end: Date): IFieldCondition<TBaseInterface>;
}

export function DateField<TBaseInterface>(field: KeysMatching<TBaseInterface, Date>): IDateFieldBuilder<TBaseInterface> {
    return {
        ...BaseNumericField<TBaseInterface, Date>(field),
        toODataValue: val => `datetime'${val.toISOString()}'`,
        IsBetween(startDate: Date, endDate: Date): IFieldCondition<TBaseInterface> {
            return { toQuery: () => `(${field as string} ${FilterOperation.GreaterThanOrEqualTo} ${this.toODataValue(startDate)} ${FilterJoinOperator.And} ${field as string} ${FilterOperation.LessThan} ${this.toODataValue(endDate)})` };
        },
        IsToday(): IFieldCondition<TBaseInterface> {
            const StartToday = new Date(); StartToday.setHours(0, 0, 0, 0);
            const EndToday = new Date(); EndToday.setHours(23, 59, 59, 999);
            return this.IsBetween(StartToday, EndToday);
        }
    }

}





export interface IBooleanFieldBuilder<TBaseInterface> extends INullableFieldBuilder<TBaseInterface, boolean> {
    IsTrue(): IFieldCondition<TBaseInterface>;
    IsFalse(): IFieldCondition<TBaseInterface>;
    IsFalseOrNull(): IFieldCondition<TBaseInterface>;
}

export function BooleanField<TBaseInterface>(field: KeysMatching<TBaseInterface, boolean>): IBooleanFieldBuilder<TBaseInterface> {
    return {
        ...BaseNullableField<TBaseInterface, boolean>(field),
        toODataValue: val => `${val === null ? null : val ? 1 : 0}`,
        IsTrue(): IFieldCondition<TBaseInterface> {
            return { toQuery: () => `${field as string} ${FilterOperation.Equals} ${this.toODataValue(true)}` };
        },
        IsFalse(): IFieldCondition<TBaseInterface> {
            return { toQuery: () => `${field as string} ${FilterOperation.Equals} ${this.toODataValue(false)}` };
        },
        IsFalseOrNull(): IFieldCondition<TBaseInterface> {
            return { toQuery: () => `(${field as string} ${FilterOperation.Equals} ${this.toODataValue(false)} ${FilterJoinOperator.Or} ${field as string} eq ${this.toODataValue(null)})` };
        }
    };
}

export function LookupFieldId<TBaseInterface>(field: KeysMatching<TBaseInterface, number | object>): INumericField<TBaseInterface, number> {
    const col: string = (field as string).endsWith("Id") ? field as string : `${field as string}Id`;
    return BaseNumericField<TBaseInterface, number>(col as any as KeysMatching<TBaseInterface, number>);
}



interface ILookupValueFieldBuilder<TBaseInterface, TExpandedType> extends INullableFieldBuilder<TBaseInterface, TExpandedType> {
    Id: (Id: number) => IFieldCondition<TExpandedType>;
    TextField: (Field: KeysMatching<TExpandedType, string>) => ITextFieldBuilder<TExpandedType>;
    NumberField: (Field: KeysMatching<TExpandedType, number>) => INumericField<TExpandedType, number>;
}

export function LookupField<TBaseInterface, TExpandedType>(field: KeysMatching<TBaseInterface, object>): ILookupValueFieldBuilder<TBaseInterface, TExpandedType> {
    return {
        toQuery: () => "",
        toODataValue: val => `${val}`,
        IsNull: () => ({ toQuery: () => `${field as string} ${FilterOperation.Equals} ${this.toODataValue(null)}` }),
        Id: Id => NumberField(`${field as string}Id` as any as KeysMatching<TExpandedType, number>).Equals(Id),
        TextField: lookupField =>  TextField<TExpandedType>(`${field as string}/${lookupField as string}` as any as KeysMatching<TExpandedType, string>),
        NumberField: lookupField => NumberField<TExpandedType>(`${field as string}/${lookupField as string}` as any as KeysMatching<TExpandedType, number>),

    };
}



export function Or<T>(...conditions: Array<INullableFieldBuilder<T, any> | ICondition<T>>): ICondition<T> {
    return buildCondition(FilterJoinOperator.Or, ...conditions);
}

export function And<T>(...conditions: Array<INullableFieldBuilder<T, any> | ICondition<T>>): ICondition<T> {
    return buildCondition(FilterJoinOperator.And, ...conditions);
}

function buildCondition<T>(operator: FilterJoinOperator, ...conditions: Array<INullableFieldBuilder<T, any> | ICondition<T>>): ICondition<T> {
    return {
        toQuery(): string {
            ;
            return `(${conditions.map(c => c.toQuery()).join(` ${operator} `)})`;
        },
    };
}
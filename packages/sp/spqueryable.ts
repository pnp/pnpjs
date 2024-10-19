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
    public filter<T = any>(filter: string | ComparisonResult<T> | ((f: QueryableFields<T>) => ComparisonResult<T>)): this {
        if (typeof filter === "object") {
            this.query.set("$filter", filter.ToString());
            return this;
        }
        if (typeof filter === "function") {
            this.query.set("$filter", filter(SPOData.Where<T>()).ToString());
            return this;
        }
        this.query.set("$filter", filter.toString());
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














type KeysMatching<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];
type KeysMatchingObjects<T> = { [K in keyof T]: T[K] extends object ? (T[K] extends Date ? never : K) : never }[keyof T];

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
    AndWithSpace = " and ",
    Or = "or",
    OrWithSpace = " or "
}

export class SPOData {
    public static Where<T = any>() {
        return new QueryableFields<T>([]);
    }
}

// Linting complains that TBaseInterface is unused, but without it all the intellisense is lost since it's carrying it through the chain
class BaseQuery<TBaseInterface> {
    protected query: string[] = [];

    constructor(query: string[]) {
        this.query = query;
    }
}


class QueryableFields<TBaseInterface> extends BaseQuery<TBaseInterface> {
    constructor(q: string[]) {
        super(q);
    }

    public TextField(InternalName: KeysMatching<TBaseInterface, string>): TextField<TBaseInterface> {
        return new TextField<TBaseInterface>([...this.query, (InternalName as string)]);
    }

    public ChoiceField(InternalName: KeysMatching<TBaseInterface, string>): TextField<TBaseInterface> {
        return new TextField<TBaseInterface>([...this.query, (InternalName as string)]);
    }

    public MultiChoiceField(InternalName: KeysMatching<TBaseInterface, string[]>): TextField<TBaseInterface> {
        return new TextField<TBaseInterface>([...this.query, (InternalName as string)]);
    }

    public NumberField(InternalName: KeysMatching<TBaseInterface, number>): NumberField<TBaseInterface> {
        return new NumberField<TBaseInterface>([...this.query, (InternalName as string)]);
    }

    public DateField(InternalName: KeysMatching<TBaseInterface, Date>): DateField<TBaseInterface> {
        return new DateField<TBaseInterface>([...this.query, (InternalName as string)]);
    }

    public BooleanField(InternalName: KeysMatching<TBaseInterface, boolean>): BooleanField<TBaseInterface> {
        return new BooleanField<TBaseInterface>([...this.query, (InternalName as string)]);
    }

    public LookupField<TKey extends KeysMatchingObjects<TBaseInterface>>(InternalName: TKey): LookupQueryableFields<TBaseInterface, TBaseInterface[TKey]> {
        return new LookupQueryableFields<TBaseInterface, TBaseInterface[TKey]>([...this.query], InternalName as string);
    }

    public LookupIdField<TKey extends KeysMatching<TBaseInterface, number>>(InternalName: TKey): NumberField<TBaseInterface> {
        const col: string = (InternalName as string).endsWith("Id") ? InternalName as string : `${InternalName as string}Id`;
        return new NumberField<TBaseInterface>([...this.query, col]);
    }

    public All(...queries: (ComparisonResult<TBaseInterface> | ((f: QueryableFields<TBaseInterface>) => ComparisonResult<TBaseInterface>))[]): ComparisonResult<TBaseInterface> {
        const query: ComparisonResult<TBaseInterface>[] = [];

        for (const q of queries) {
            if (typeof q === "function") {
                query.push(q(SPOData.Where<TBaseInterface>()));
            } else {
                query.push(q);
            }
        }
        return new ComparisonResult<TBaseInterface>([...this.query, `(${query.map(x => x.ToString()).join(FilterJoinOperator.AndWithSpace)})`]);
    }

    public Some(...queries: (ComparisonResult<TBaseInterface> | ((f: QueryableFields<TBaseInterface>) => ComparisonResult<TBaseInterface>))[]): ComparisonResult<TBaseInterface> {
        const query: ComparisonResult<TBaseInterface>[] = [];

        for (const q of queries) {
            if (typeof q === "function") {
                query.push(q(SPOData.Where<TBaseInterface>()));
            } else {
                query.push(q);
            }
        }
        return new ComparisonResult<TBaseInterface>([...this.query, `(${query.map(x => x.ToString()).join(FilterJoinOperator.OrWithSpace)})`]);
    }
}

class LookupQueryableFields<TBaseInterface, TExpandedType> extends BaseQuery<TExpandedType> {
    private LookupField: string;
    constructor(q: string[], LookupField: string) {
        super(q);
        this.LookupField = LookupField;
    }

    public Id(Id: number): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, `${this.LookupField}/Id`, FilterOperation.Equals, Id.toString()]);
    }

    public TextField(InternalName: KeysMatching<TExpandedType, string>): TextField<TBaseInterface> {
        return new TextField<TBaseInterface>([...this.query, `${this.LookupField}/${InternalName as string}`]);
    }

    public NumberField(InternalName: KeysMatching<TExpandedType, number>): NumberField<TBaseInterface> {
        return new NumberField<TBaseInterface>([...this.query, `${this.LookupField}/${InternalName as string}`]);
    }

    // Support has been announced, but is not yet available in SharePoint Online
    // https://www.microsoft.com/en-ww/microsoft-365/roadmap?filters=&searchterms=100503
    // public BooleanField(InternalName: KeysMatching<TExpandedType, boolean>): BooleanField<TBaseInterface> {
    //     return new BooleanField<TBaseInterface>([...this.query, `${this.LookupField}/${InternalName as string}`]);
    // }
}

class NullableField<TBaseInterface, TInputValueType> extends BaseQuery<TBaseInterface> {
    protected LastIndex: number;
    protected InternalName: string;

    constructor(q: string[]) {
        super(q);
        this.LastIndex = q.length - 1;
        this.InternalName = q[this.LastIndex];
    }

    protected ToODataValue(value: TInputValueType): string {
        return `'${value}'`;
    }

    public IsNull(): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.Equals, "null"]);
    }

    public IsNotNull(): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.NotEquals, "null"]);
    }
}

class ComparableField<TBaseInterface, TInputValueType> extends NullableField<TBaseInterface, TInputValueType> {
    constructor(q: string[]) {
        super(q);
    }

    public EqualTo(value: TInputValueType): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.Equals, this.ToODataValue(value)]);
    }

    public NotEqualTo(value: TInputValueType): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.NotEquals, this.ToODataValue(value)]);
    }

    public In(values: TInputValueType[]): ComparisonResult<TBaseInterface> {
        return SPOData.Where<TBaseInterface>().Some(...values.map(x => this.EqualTo(x)));
    }
}

class TextField<TBaseInterface> extends ComparableField<TBaseInterface, string> {
    constructor(q: string[]) {
        super(q);
    }

    public StartsWith(value: string): ComparisonResult<TBaseInterface> {
        const filter = `${FilterOperation.StartsWith}(${this.InternalName}, ${this.ToODataValue(value)})`;
        this.query[this.LastIndex] = filter;
        return new ComparisonResult<TBaseInterface>([...this.query]);
    }

    public Contains(value: string): ComparisonResult<TBaseInterface> {
        const filter = `${FilterOperation.SubstringOf}(${this.ToODataValue(value)}, ${this.InternalName})`;
        this.query[this.LastIndex] = filter;
        return new ComparisonResult<TBaseInterface>([...this.query]);
    }
}

class BooleanField<TBaseInterface> extends NullableField<TBaseInterface, boolean> {
    constructor(q: string[]) {
        super(q);
    }

    protected override ToODataValue(value: boolean | null): string {
        return `${value == null ? "null" : value ? 1 : 0}`;
    }

    public IsTrue(): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.Equals, this.ToODataValue(true)]);
    }

    public IsFalse(): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.Equals, this.ToODataValue(false)]);
    }

    public IsFalseOrNull(): ComparisonResult<TBaseInterface> {
        const filter = `(${[
            this.InternalName,
            FilterOperation.Equals,
            this.ToODataValue(null),
            FilterJoinOperator.Or,
            this.InternalName,
            FilterOperation.Equals,
            this.ToODataValue(false),
        ].join(" ")})`;
        this.query[this.LastIndex] = filter;
        return new ComparisonResult<TBaseInterface>([...this.query]);
    }
}

class NumericField<TBaseInterface, TInputValueType> extends ComparableField<TBaseInterface, TInputValueType> {
    constructor(q: string[]) {
        super(q);
    }

    public GreaterThan(value: TInputValueType): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.GreaterThan, this.ToODataValue(value)]);
    }

    public GreaterThanOrEqualTo(value: TInputValueType): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.GreaterThanOrEqualTo, this.ToODataValue(value)]);
    }

    public LessThan(value: TInputValueType): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.LessThan, this.ToODataValue(value)]);
    }

    public LessThanOrEqualTo(value: TInputValueType): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.LessThanOrEqualTo, this.ToODataValue(value)]);
    }
}


class NumberField<TBaseInterface> extends NumericField<TBaseInterface, number> {
    constructor(q: string[]) {
        super(q);
    }

    protected override ToODataValue(value: number): string {
        return `${value}`;
    }
}

class DateField<TBaseInterface> extends NumericField<TBaseInterface, Date> {
    constructor(q: string[]) {
        super(q);
    }

    protected override ToODataValue(value: Date): string {
        return `'${value.toISOString()}'`;
    }

    public IsBetween(startDate: Date, endDate: Date): ComparisonResult<TBaseInterface> {
        const filter = `(${[
            this.InternalName,
            FilterOperation.GreaterThan,
            this.ToODataValue(startDate),
            FilterJoinOperator.And,
            this.InternalName,
            FilterOperation.LessThan,
            this.ToODataValue(endDate),
        ].join(" ")})`;
        this.query[this.LastIndex] = filter;
        return new ComparisonResult<TBaseInterface>([...this.query]);
    }

    public IsToday(): ComparisonResult<TBaseInterface> {
        const StartToday = new Date(); StartToday.setHours(0, 0, 0, 0);
        const EndToday = new Date(); EndToday.setHours(23, 59, 59, 999);
        return this.IsBetween(StartToday, EndToday);
    }
}






class ComparisonResult<TBaseInterface> extends BaseQuery<TBaseInterface> {
    constructor(q: string[]) {
        super(q);
    }

    public Or(): QueryableFields<TBaseInterface> {
        return new QueryableFields<TBaseInterface>([...this.query, FilterJoinOperator.Or]);
    }

    public And(): QueryableFields<TBaseInterface> {
        return new QueryableFields<TBaseInterface>([...this.query, FilterJoinOperator.And]);
    }

    public ToString(): string {
        return this.query.join(" ");
    }
}

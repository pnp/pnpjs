import { combine, isUrlAbsolute, isArray, stringIsNullOrEmpty } from "@pnp/core";
import { Queryable, queryableFactory, op, get, post, patch, del, IInvokable } from "@pnp/queryable";

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
        }
    }

    /**
     * Gets the full url with query information
     */
    public toRequestUrl(): string {

        const aliasedParams = new URLSearchParams(<any>this.query);

        // this regex is designed to locate aliased parameters within url paths
        let url = this.toUrl().replace(/'!(@.+?)::((?:[^']|'')+)'/ig, (match, labelName, value) => {
            this.log(`Rewriting aliased parameter from match ${match} to label: ${labelName} value: ${value}`, 0);
            aliasedParams.set(labelName, `'${value}'`);
            return labelName;
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

        return factory([this, base], path);
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
    public filter<T = UnwrapArray<GetType>>(filter: string | ComparisonResult<T> | ((f: InitialFieldQuery<T>) => ComparisonResult<T>)): this {
        if (typeof filter === "object") {
            this.query.set("$filter", filter.toString());
            return this;
        }
        if (typeof filter === "function") {
            this.query.set("$filter", filter(SPOData.Where<T>()).toString());
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

export const spGet = <T = any>(o: ISPQueryable<any>, init?: RequestInit): Promise<T> => {
    return op(o, get, init);
};

export const spPost = <T = any>(o: ISPQueryable<any>, init?: RequestInit): Promise<T> => op(o, post, init);

export const spPostMerge = <T = any>(o: ISPQueryable<any>, init?: RequestInit): Promise<T> => {
    init = init || {};
    init.headers = { ...init.headers, "X-HTTP-Method": "MERGE" };

    return spPost<T>(o, init);
};

export const spPostDelete = <T = any>(o: ISPQueryable<any>, init?: RequestInit): Promise<T> => {
    init = init || {};
    init.headers = { ...init.headers || {}, "X-HTTP-Method": "DELETE" };

    return spPost<T>(o, init);
};

export const spPostDeleteETag = <T = any>(o: ISPQueryable<any>, init?: RequestInit, eTag = "*"): Promise<T> => {
    init = init || {};
    init.headers = { ...init.headers || {}, "IF-Match": eTag };

    return spPostDelete<T>(o, init);
};

export const spDelete = <T = any>(o: ISPQueryable<any>, init?: RequestInit): Promise<T> => op(o, del, init);

export const spPatch = <T = any>(o: ISPQueryable<any>, init?: RequestInit): Promise<T> => op(o, patch, init);



type KeysMatching<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];
type KeysMatchingObjects<T> = { [K in keyof T]: T[K] extends object ? (T[K] extends Date ? never : K) : never }[keyof T];
type UnwrapArray<T> = T extends (infer U)[] ? U : T;

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

class SPOData {
    public static Where<T = any>() {
        return new InitialFieldQuery<T>([]);
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

    public text(internalName: KeysMatching<TBaseInterface, string>): TextField<TBaseInterface> {
        return new TextField<TBaseInterface>([...this.query, (internalName as string)]);
    }

    public choice(internalName: KeysMatching<TBaseInterface, string>): TextField<TBaseInterface> {
        return new TextField<TBaseInterface>([...this.query, (internalName as string)]);
    }

    public multiChoice(internalName: KeysMatching<TBaseInterface, string[]>): TextField<TBaseInterface> {
        return new TextField<TBaseInterface>([...this.query, (internalName as string)]);
    }

    public number(internalName: KeysMatching<TBaseInterface, number>): NumberField<TBaseInterface> {
        return new NumberField<TBaseInterface>([...this.query, (internalName as string)]);
    }

    public date(internalName: KeysMatching<TBaseInterface, Date>): DateField<TBaseInterface> {
        return new DateField<TBaseInterface>([...this.query, (internalName as string)]);
    }

    public boolean(internalName: KeysMatching<TBaseInterface, boolean>): BooleanField<TBaseInterface> {
        return new BooleanField<TBaseInterface>([...this.query, (internalName as string)]);
    }

    public lookup<TKey extends KeysMatchingObjects<TBaseInterface>>(internalName: TKey): LookupQueryableFields<TBaseInterface, TBaseInterface[TKey]> {
        return new LookupQueryableFields<TBaseInterface, TBaseInterface[TKey]>([...this.query], internalName as string);
    }

    public lookupId<TKey extends KeysMatching<TBaseInterface, number>>(internalName: TKey): NumberField<TBaseInterface> {
        const col: string = (internalName as string).endsWith("Id") ? internalName as string : `${internalName as string}Id`;
        return new NumberField<TBaseInterface>([...this.query, col]);
    }
}

class QueryableAndResult<TBaseInterface> extends QueryableFields<TBaseInterface> {
    public or(...queries: (ComparisonResult<TBaseInterface> | ((f: QueryableFields<TBaseInterface>) => ComparisonResult<TBaseInterface>))[]): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, `(${queries.map(x => x.toString()).join(FilterJoinOperator.OrWithSpace)})`]);
    }
}

class QueryableOrResult<TBaseInterface> extends QueryableFields<TBaseInterface> {
    public and(...queries: (ComparisonResult<TBaseInterface> | ((f: QueryableFields<TBaseInterface>) => ComparisonResult<TBaseInterface>))[]): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, `(${queries.map(x => x.toString()).join(FilterJoinOperator.AndWithSpace)})`]);
    }
}

class InitialFieldQuery<TBaseInterface> extends QueryableFields<TBaseInterface> {
    public or(): QueryableFields<TBaseInterface>;
    public or(...queries: (ComparisonResult<TBaseInterface> | ((f: QueryableFields<TBaseInterface>) => ComparisonResult<TBaseInterface>))[]): ComparisonResult<TBaseInterface>;
    public or(...queries: (ComparisonResult<TBaseInterface> | ((f: QueryableFields<TBaseInterface>) => ComparisonResult<TBaseInterface>))[]): (ComparisonResult<TBaseInterface> | QueryableFields<TBaseInterface>) {
        if (queries == null || queries.length == 0) 
            return new QueryableFields<TBaseInterface>([...this.query, FilterJoinOperator.Or]);
        return new ComparisonResult<TBaseInterface>([...this.query, `(${queries.map(x => x.toString()).join(FilterJoinOperator.OrWithSpace)})`]);
    }

    public and(): QueryableFields<TBaseInterface>;
    public and(...queries: (ComparisonResult<TBaseInterface> | ((f: QueryableFields<TBaseInterface>) => ComparisonResult<TBaseInterface>))[]): ComparisonResult<TBaseInterface>
    public and(...queries: (ComparisonResult<TBaseInterface> | ((f: QueryableFields<TBaseInterface>) => ComparisonResult<TBaseInterface>))[]): (ComparisonResult<TBaseInterface> | QueryableFields<TBaseInterface>) {
        if (queries == null || queries.length == 0)
            return new QueryableFields<TBaseInterface>([...this.query, FilterJoinOperator.And]);
        return new ComparisonResult<TBaseInterface>([...this.query, `(${queries.map(x => x.toString()).join(FilterJoinOperator.AndWithSpace)})`]);
    }
}



class LookupQueryableFields<TBaseInterface, TExpandedType> extends BaseQuery<TExpandedType> {
    private LookupField: string;
    constructor(q: string[], LookupField: string) {
        super(q);
        this.LookupField = LookupField;
    }

    public Id(id: number): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, `${this.LookupField}/Id`, FilterOperation.Equals, id.toString()]);
    }

    public text(internalName: KeysMatching<TExpandedType, string>): TextField<TBaseInterface> {
        return new TextField<TBaseInterface>([...this.query, `${this.LookupField}/${internalName as string}`]);
    }

    public number(internalName: KeysMatching<TExpandedType, number>): NumberField<TBaseInterface> {
        return new NumberField<TBaseInterface>([...this.query, `${this.LookupField}/${internalName as string}`]);
    }

    // Support has been announced, but is not yet available in SharePoint Online
    // https://www.microsoft.com/en-ww/microsoft-365/roadmap?filters=&searchterms=100503
    // public boolean(InternalName: KeysMatching<TExpandedType, boolean>): BooleanField<TBaseInterface> {
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

    protected toODataValue(value: TInputValueType): string {
        return `'${value}'`;
    }

    public isNull(): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.Equals, "null"]);
    }

    public isNotNull(): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.NotEquals, "null"]);
    }
}

class ComparableField<TBaseInterface, TInputValueType> extends NullableField<TBaseInterface, TInputValueType> {
    public equals(value: TInputValueType): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.Equals, this.toODataValue(value)]);
    }

    public notEquals(value: TInputValueType): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.NotEquals, this.toODataValue(value)]);
    }

    public in(...values: TInputValueType[]): ComparisonResult<TBaseInterface> {
        return SPOData.Where<TBaseInterface>().or(...values.map(x => this.equals(x)));
    }

    public notIn(...values: TInputValueType[]): ComparisonResult<TBaseInterface> {
        return SPOData.Where<TBaseInterface>().and(...values.map(x => this.notEquals(x)));
    }
}

class TextField<TBaseInterface> extends ComparableField<TBaseInterface, string> {
    public startsWith(value: string): ComparisonResult<TBaseInterface> {
        const filter = `${FilterOperation.StartsWith}(${this.InternalName}, ${this.toODataValue(value)})`;
        this.query[this.LastIndex] = filter;
        return new ComparisonResult<TBaseInterface>([...this.query]);
    }

    public contains(value: string): ComparisonResult<TBaseInterface> {
        const filter = `${FilterOperation.SubstringOf}(${this.toODataValue(value)}, ${this.InternalName})`;
        this.query[this.LastIndex] = filter;
        return new ComparisonResult<TBaseInterface>([...this.query]);
    }
}

class BooleanField<TBaseInterface> extends NullableField<TBaseInterface, boolean> {
    protected override toODataValue(value: boolean | null): string {
        return `${value == null ? "null" : value ? 1 : 0}`;
    }

    public isTrue(): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.Equals, this.toODataValue(true)]);
    }

    public isFalse(): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.Equals, this.toODataValue(false)]);
    }

    public isFalseOrNull(): ComparisonResult<TBaseInterface> {
        const filter = `(${[
            this.InternalName,
            FilterOperation.Equals,
            this.toODataValue(null),
            FilterJoinOperator.Or,
            this.InternalName,
            FilterOperation.Equals,
            this.toODataValue(false),
        ].join(" ")})`;
        this.query[this.LastIndex] = filter;
        return new ComparisonResult<TBaseInterface>([...this.query]);
    }
}

class NumericField<TBaseInterface, TInputValueType> extends ComparableField<TBaseInterface, TInputValueType> {
    public greaterThan(value: TInputValueType): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.GreaterThan, this.toODataValue(value)]);
    }

    public greaterThanOrEquals(value: TInputValueType): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.GreaterThanOrEqualTo, this.toODataValue(value)]);
    }

    public lessThan(value: TInputValueType): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.LessThan, this.toODataValue(value)]);
    }

    public lessThanOrEquals(value: TInputValueType): ComparisonResult<TBaseInterface> {
        return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.LessThanOrEqualTo, this.toODataValue(value)]);
    }
}


class NumberField<TBaseInterface> extends NumericField<TBaseInterface, number> {
    protected override toODataValue(value: number): string {
        return `${value}`;
    }
}

class DateField<TBaseInterface> extends NumericField<TBaseInterface, Date> {
    protected override toODataValue(value: Date): string {
        return `'${value.toISOString()}'`;
    }

    public isBetween(startDate: Date, endDate: Date): ComparisonResult<TBaseInterface> {
        const filter = `(${[
            this.InternalName,
            FilterOperation.GreaterThan,
            this.toODataValue(startDate),
            FilterJoinOperator.And,
            this.InternalName,
            FilterOperation.LessThan,
            this.toODataValue(endDate),
        ].join(" ")})`;
        this.query[this.LastIndex] = filter;
        return new ComparisonResult<TBaseInterface>([...this.query]);
    }

    public isToday(): ComparisonResult<TBaseInterface> {
        const StartToday = new Date(); StartToday.setHours(0, 0, 0, 0);
        const EndToday = new Date(); EndToday.setHours(23, 59, 59, 999);
        return this.isBetween(StartToday, EndToday);
    }
}

class ComparisonResult<TBaseInterface> extends BaseQuery<TBaseInterface> {
    public and(): QueryableAndResult<TBaseInterface>;
    public and(...queries: (ComparisonResult<TBaseInterface> | ((f: QueryableFields<TBaseInterface>) => ComparisonResult<TBaseInterface>))[]): ComparisonResult<TBaseInterface>
    public and(...queries: (ComparisonResult<TBaseInterface> | ((f: QueryableFields<TBaseInterface>) => ComparisonResult<TBaseInterface>))[]): (ComparisonResult<TBaseInterface> | QueryableAndResult<TBaseInterface>) {
        if (queries == null || queries.length == 0) 
            return new QueryableAndResult<TBaseInterface>([...this.query, FilterJoinOperator.And]);
        return new ComparisonResult<TBaseInterface>([...this.query, FilterJoinOperator.And, `(${queries.map(x => x.toString()).join(FilterJoinOperator.AndWithSpace)})`]);
    }

    public or(): QueryableOrResult<TBaseInterface>;
    public or(...queries: (ComparisonResult<TBaseInterface> | ((f: QueryableFields<TBaseInterface>) => ComparisonResult<TBaseInterface>))[]): ComparisonResult<TBaseInterface>;
    public or(...queries: (ComparisonResult<TBaseInterface> | ((f: QueryableFields<TBaseInterface>) => ComparisonResult<TBaseInterface>))[]): (ComparisonResult<TBaseInterface> | QueryableOrResult<TBaseInterface>) {
        if (queries == null || queries.length == 0) 
            return new QueryableOrResult<TBaseInterface>([...this.query, FilterJoinOperator.Or]);
        return new ComparisonResult<TBaseInterface>([...this.query, FilterJoinOperator.Or, `(${queries.map(x => x.toString()).join(FilterJoinOperator.OrWithSpace)})`]);
    }

    public toString(): string {
        return this.query.join(" ");
    }
}
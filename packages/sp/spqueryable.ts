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

    public filter<T = any>(filter: string | ((builder: QueryableGroups<T>) => ComparisonResult<T>)): this {
        if (typeof filter === "string") {
            this.query.set("$filter", filter);
        } else {
            this.query.set("$filter", filter(SPOData.Where<T>()).ToString());
            // const filterBuilder = new FilterBuilder<GetType>();
            // filter(filterBuilder);
            // this.query.set("$filter", filterBuilder.build());
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
    AndWithSpace = " and ",
    Or = "or",
    OrWithSpace = " or "
}

export class SPOData {
    static Where<T = any>() {
        return new QueryableGroups<T>();
    }
}

class BaseQuery<TBaseInterface> {
    protected query: string[] = [];

    protected AddToQuery(InternalName: keyof TBaseInterface, Operation: FilterOperation, Value: string) {
        this.query.push(`${InternalName as string} ${Operation} ${Value}`);
    }

    protected AddQueryableToQuery(Queries: ComparisonResult<TBaseInterface>) {
        this.query.push(Queries.ToString());
    }

    constructor(BaseQuery?: BaseQuery<TBaseInterface>) {
        if (BaseQuery != null) {
            this.query = BaseQuery.query;
        }
    }
}


class QueryableFields<TBaseInterface> extends BaseQuery<TBaseInterface> {
    public TextField(InternalName: KeysMatching<TBaseInterface, string>): TextField<TBaseInterface> {
        return new TextField<TBaseInterface>(this, InternalName);
    }

    public ChoiceField(InternalName: KeysMatching<TBaseInterface, string>): TextField<TBaseInterface> {
        return new TextField<TBaseInterface>(this, InternalName);
    }

    public MultiChoiceField(InternalName: KeysMatching<TBaseInterface, string[]>): TextField<TBaseInterface> {
        return new TextField<TBaseInterface>(this, InternalName);
    }

    public NumberField(InternalName: KeysMatching<TBaseInterface, number>): NumberField<TBaseInterface> {
        return new NumberField<TBaseInterface>(this, InternalName);
    }

    public DateField(InternalName: KeysMatching<TBaseInterface, Date>): DateField<TBaseInterface> {
        return new DateField<TBaseInterface>(this, InternalName);
    }

    public BooleanField(InternalName: KeysMatching<TBaseInterface, boolean>): BooleanField<TBaseInterface> {
        return new BooleanField<TBaseInterface>(this, InternalName);
    }

    public LookupField<TKey extends KeysMatching<TBaseInterface, object>>(InternalName: TKey): LookupQueryableFields<TBaseInterface, TBaseInterface[TKey]> {
        return new LookupQueryableFields<TBaseInterface, TBaseInterface[TKey]>(this, InternalName as string);
    }

    public LookupIdField<TKey extends KeysMatching<TBaseInterface, number>>(InternalName: TKey): NumberField<TBaseInterface> {
        const col: string = (InternalName as string).endsWith("Id") ? InternalName as string : `${InternalName as string}Id`;
        return new NumberField<TBaseInterface>(this, col as any as keyof TBaseInterface);
    }
}

class LookupQueryableFields<TBaseInterface, TExpandedType> extends BaseQuery<TBaseInterface>{
    private LookupField: string;
    constructor(q: BaseQuery<TBaseInterface>, LookupField: string) {
        super(q);
        this.LookupField = LookupField;
    }

    public Id(Id: number): ComparisonResult<TBaseInterface> {
        this.AddToQuery(`${this.LookupField}Id` as keyof TBaseInterface, FilterOperation.Equals, Id.toString());
        return new ComparisonResult<TBaseInterface>(this);
    }

    public TextField(InternalName: KeysMatching<TExpandedType, string>): TextField<TBaseInterface> {
        return new TextField<TBaseInterface>(this, `${this.LookupField}/${InternalName as string}` as any as keyof TBaseInterface);
    }

    public NumberField(InternalName: KeysMatching<TExpandedType, number>): NumberField<TBaseInterface> {
        return new NumberField<TBaseInterface>(this, `${this.LookupField}/${InternalName as string}` as any as keyof TBaseInterface);
    }

    // Support has been announced, but is not yet available in SharePoint Online
    // https://www.microsoft.com/en-ww/microsoft-365/roadmap?filters=&searchterms=100503
    // public BooleanField(InternalName: KeysMatching<tExpandedType, boolean>): BooleanField<tBaseObjectType> {
    //     return new BooleanField<tBaseObjectType>([...this.query, `${this.LookupField}/${InternalName as string}`]);
    // }
}

class QueryableGroups<TBaseInterface> extends QueryableFields<TBaseInterface>{
    public And(queries: ComparisonResult<TBaseInterface>[] | ((builder: QueryableGroups<TBaseInterface>) => ComparisonResult<TBaseInterface>)[]): ComparisonResult<TBaseInterface> {
        if (Array.isArray(queries) && queries.every(x => x instanceof ComparisonResult)) {
            this.query.push(`(${queries.map(x => x.ToString()).join(FilterJoinOperator.AndWithSpace)})`);
        } else {
            const result = queries.map(x => x(SPOData.Where<TBaseInterface>()));
            this.query.push(`(${result.map(x => x.ToString()).join(FilterJoinOperator.AndWithSpace)})`);
        }
        return new ComparisonResult<TBaseInterface>(this);
    }

    public Or(queries: ComparisonResult<TBaseInterface>[] | ((builder: QueryableGroups<TBaseInterface>) => ComparisonResult<TBaseInterface>)[]): ComparisonResult<TBaseInterface> {
        if (Array.isArray(queries) && queries.every(x => x instanceof ComparisonResult)) {
            this.query.push(`(${queries.map(x => x.ToString()).join(FilterJoinOperator.AndWithSpace)})`);
        } else {
            const result = queries.map(x => x(SPOData.Where<TBaseInterface>()));
            this.query.push(`(${result.map(x => x.ToString()).join(FilterJoinOperator.AndWithSpace)})`);
        }
        return new ComparisonResult<TBaseInterface>(this);
    }
}





class NullableField<TBaseInterface, TInputValueType> extends BaseQuery<TBaseInterface>{
    protected InternalName: KeysMatching<TBaseInterface, TInputValueType>;

    constructor(base: BaseQuery<TBaseInterface>, InternalName: keyof TBaseInterface) {
        super(base);
        this.InternalName = InternalName as any as KeysMatching<TBaseInterface, TInputValueType>;
    }

    protected ToODataValue(value: TInputValueType): string {
        return `'${value}'`;
    }

    public IsNull(): ComparisonResult<TBaseInterface> {
        this.AddToQuery(this.InternalName, FilterOperation.Equals, "null");
        return new ComparisonResult<TBaseInterface>(this);
    }

    public IsNotNull(): ComparisonResult<TBaseInterface> {
        this.AddToQuery(this.InternalName, FilterOperation.NotEquals, "null");
        return new ComparisonResult<TBaseInterface>(this);
    }
}

class ComparableField<TBaseInterface, TInputValueType> extends NullableField<TBaseInterface, TInputValueType>{
    public EqualTo(value: TInputValueType): ComparisonResult<TBaseInterface> {
        this.AddToQuery(this.InternalName, FilterOperation.Equals, this.ToODataValue(value));
        return new ComparisonResult<TBaseInterface>(this);
    }

    public NotEqualTo(value: TInputValueType): ComparisonResult<TBaseInterface> {
        this.AddToQuery(this.InternalName, FilterOperation.NotEquals, this.ToODataValue(value));
        return new ComparisonResult<TBaseInterface>(this);
    }

    public In(values: TInputValueType[]): ComparisonResult<TBaseInterface> {

        const query = values.map(x =>
            `${this.InternalName as string} ${FilterOperation.Equals} ${this.ToODataValue(x)}`
        ).join(FilterJoinOperator.OrWithSpace);

        this.query.push(`(${query})`);
        return new ComparisonResult<TBaseInterface>(this);
    }
}

class TextField<TBaseInterface> extends ComparableField<TBaseInterface, string>{

    public StartsWith(value: string): ComparisonResult<TBaseInterface> {
        this.query.push(`${FilterOperation.StartsWith}(${this.InternalName as string}, ${this.ToODataValue(value)})`);
        return new ComparisonResult<TBaseInterface>(this);
    }

    public Contains(value: string): ComparisonResult<TBaseInterface> {
        this.query.push(`${FilterOperation.SubstringOf}(${this.ToODataValue(value)}, ${this.InternalName as string})`);
        return new ComparisonResult<TBaseInterface>(this);
    }
}

class BooleanField<TBaseInterface> extends NullableField<TBaseInterface, boolean>{

    protected override ToODataValue(value: boolean | null): string {
        return `${value == null ? "null" : value ? 1 : 0}`;
    }

    public IsTrue(): ComparisonResult<TBaseInterface> {
        this.AddToQuery(this.InternalName, FilterOperation.Equals, this.ToODataValue(true));
        return new ComparisonResult<TBaseInterface>(this);
    }

    public IsFalse(): ComparisonResult<TBaseInterface> {
        this.AddToQuery(this.InternalName, FilterOperation.Equals, this.ToODataValue(false));
        return new ComparisonResult<TBaseInterface>(this);
    }

    public IsFalseOrNull(): ComparisonResult<TBaseInterface> {
        this.AddQueryableToQuery(SPOData.Where<TBaseInterface>().Or([
            SPOData.Where<TBaseInterface>().BooleanField(this.InternalName).IsFalse(),
            SPOData.Where<TBaseInterface>().BooleanField(this.InternalName).IsNull()
        ]));

        return new ComparisonResult<TBaseInterface>(this);
    }
}

class NumericField<TBaseInterface, TInputValueType> extends ComparableField<TBaseInterface, TInputValueType>{

    public GreaterThan(value: TInputValueType): ComparisonResult<TBaseInterface> {
        this.AddToQuery(this.InternalName, FilterOperation.GreaterThan, this.ToODataValue(value));
        return new ComparisonResult<TBaseInterface>(this);
    }

    public GreaterThanOrEqualTo(value: TInputValueType): ComparisonResult<TBaseInterface> {
        this.AddToQuery(this.InternalName, FilterOperation.GreaterThanOrEqualTo, this.ToODataValue(value));
        return new ComparisonResult<TBaseInterface>(this);
    }

    public LessThan(value: TInputValueType): ComparisonResult<TBaseInterface> {
        this.AddToQuery(this.InternalName, FilterOperation.LessThan, this.ToODataValue(value));
        return new ComparisonResult<TBaseInterface>(this);
    }

    public LessThanOrEqualTo(value: TInputValueType): ComparisonResult<TBaseInterface> {
        this.AddToQuery(this.InternalName, FilterOperation.LessThanOrEqualTo, this.ToODataValue(value));
        return new ComparisonResult<TBaseInterface>(this);
    }
}


class NumberField<TBaseInterface> extends NumericField<TBaseInterface, number>{
    protected override ToODataValue(value: number): string {
        return `${value}`;
    }
}

class DateField<TBaseInterface> extends NumericField<TBaseInterface, Date>{
    protected override ToODataValue(value: Date): string {
        return `'${value.toISOString()}'`
    }

    public IsBetween(startDate: Date, endDate: Date): ComparisonResult<TBaseInterface> {
        this.AddQueryableToQuery(SPOData.Where().And([
            SPOData.Where().DateField(this.InternalName as string).GreaterThanOrEqualTo(startDate),
            SPOData.Where().DateField(this.InternalName as string).LessThanOrEqualTo(endDate)
        ]));

        return new ComparisonResult<TBaseInterface>(this);
    }

    public IsToday(): ComparisonResult<TBaseInterface> {
        const StartToday = new Date(); StartToday.setHours(0, 0, 0, 0);
        const EndToday = new Date(); EndToday.setHours(23, 59, 59, 999);
        return this.IsBetween(StartToday, EndToday);
    }
}






class ComparisonResult<TBaseInterface> extends BaseQuery<TBaseInterface>{
    public Or(): QueryableFields<TBaseInterface> {
        this.query.push(FilterJoinOperator.Or);
        return new QueryableFields<TBaseInterface>(this);
    }

    public And(): QueryableFields<TBaseInterface> {
        this.query.push(FilterJoinOperator.And);
        return new QueryableFields<TBaseInterface>(this);
    }

    public ToString(): string {
        return this.query.join(" ");
    }
}
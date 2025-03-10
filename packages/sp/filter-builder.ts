import { _Lists, IListInfo } from "./lists/types.js";
import { _SPCollection, ISPCollection } from "./spqueryable.js";
import { encodePath } from "./utils/encode-path-str.js";

declare module "./spqueryable" {
    interface _SPCollection {

        /**
         * Access the filter builder fluent API
        **/
        where: <T extends _SPCollection>(this: T, cb: (this: T, builder: OpenClause<T>) => void) => this;
    }
}

_SPCollection.prototype.where = function <T extends _SPCollection>(this: T, cb: (this: T, builder: OpenClause<T>) => void): any {
    const w = new _Where(this);
    cb.call(this, w);
    return this.filter(w.toString());
}

type OpenClause<T extends _SPCollection> = Pick<_Where<T>, "str" | "date" | "num" | "testing">;

// these are the methods that 
type CloseClause<T extends _SPCollection, ValueType> = Pick<_Where<T>, "eq" | "neq" | "gt" | "lt" | "gte" | "lte">;

// this defines a clause, and we need to start trimming off "filter"? optional
type Clause<T extends _SPCollection> = Pick<_Where<T>, "and" | "or">;

// export class _Lists extends _SPCollection<IListInfo[]> {

// type H<T extends _SPCollection>

// type ParentType<T extends _SPCollection> = T extends { __proto__: infer P } ? P : never;

// type ExtractGeneric<T> = T extends _SPCollection<infer X> ? X : never;

// type GetArrayElementType<T> = T extends (infer U)[] ? U : never;

// T == ILists

class _b extends Array<string> {

}
interface b extends _b {};

type b2 = _Lists extends _SPCollection<infer U> ? U : never;



type ValueType = any;

class _Where<T extends _SPCollection> {

    private clauseBuilder = [];
    private clauses: string[] = [];

    constructor(protected collection: T) { }

    public toString(): string {

        if (this.clauseBuilder.length > 0) {
            throw Error("The where clause is not properly closed.");
        }

        return this.clauses.join(" ");
    }

    public testing(): any {
        return null;
    }

    public get and(): OpenClause<T> {
        const last = this.clauses.pop();
        this.clauseBuilder.push(last);
        this.clauseBuilder.push("and");
        return <any>this;
    }

    public get or(): OpenClause<T> {
        const last = this.clauses.pop();
        this.clauseBuilder.push(last);
        this.clauseBuilder.push("or");
        return <any>this;
    }

    public str(fieldName: string, options?: { escape?: boolean }): CloseClause<T, string> {

        return this.openClause<string>(<string>fieldName, (v: string) => {
            return `'${options?.escape ? encodePath(v) : v}'`;
        });
    }

    public num(fieldName: string): CloseClause<T, number> {
        return this.openClause<number>(fieldName);
    }

    public date(fieldName: string): CloseClause<T, Date> {
        return this.openClause<Date>(fieldName, (v: Date) => v.toISOString());
    }

    public eq(v: ValueType): Clause<T> {
        return this.closeClause("eq", v);
    }

    public neq(v: ValueType): Clause<T> {
        return this.closeClause("neq", v);
    }

    public gt(v: ValueType): Clause<T> {
        return this.closeClause("gt", v);
    }

    public lt(v: ValueType): Clause<T> {
        return this.closeClause("lt", v);
    }

    public gte(v: ValueType): Clause<T> {
        return this.closeClause("gte", v);
    }

    public lte(v: ValueType): Clause<T> {
        return this.closeClause("lte", v);
    }

    // public startswith(v: ValueType): Clause<T> {
    //     return this.closeClause("startswith", v);
    // }

    // public substringof(v: ValueType): Clause<T> {
    //     return this.closeClause("substringof", v);
    // }

    private openClause<VT>(fieldName: string, toString: (v: VT) => string = (v) => v.toString()): CloseClause<T, VT> {
        this.clauseBuilder.push(fieldName);
        this.clauseBuilder.push(toString);
        return <any>this;
    }

    private closeClause(op: string, value: ValueType): Clause<T> {
        const toString = this.clauseBuilder.pop();
        this.clauseBuilder.push(op);
        this.clauseBuilder.push(toString(value));
        this.clauses.push(this.clauseBuilder.join(" "));
        this.clauseBuilder = [];
        return this;
    }
}

export type KeysMatching<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];
export type KeysMatchingObjects<T> = { [K in keyof T]: T[K] extends object ? (T[K] extends Date ? never : K) : never }[keyof T];
export type UnwrapArray<T> = T extends (infer U)[] ? U : T;

export enum FilterOperation {
    Equals = "eq",
    NotEquals = "ne",
    GreaterThan = "gt",
    GreaterThanOrEqualTo = "ge",
    LessThan = "lt",
    LessThanOrEqualTo = "le",
    StartsWith = "startswith",
    SubstringOf = "substringof"
}

// export enum FilterJoinOperator {
//     And = "and",
//     AndWithSpace = " and ",
//     Or = "or",
//     OrWithSpace = " or "
// }

// export class SPOData {
//     public static Where<T = any>() {
//         return new InitialFieldQuery<T>([]);
//     }
// }

// // Linting complains that TBaseInterface is unused, but without it all the intellisense is lost since it's carrying it through the chain
// class BaseQuery {

//     protected query: string[] = [];

//     constructor(query: string[]) {
//         this.query = query;
//     }
// }


// class QueryableFields<T> extends BaseQuery {
//     constructor(q: string[]) {
//         super(q);
//     }

//     public text(internalName: KeysMatching<T, string>): TextField<T> {
//         return new TextField<T>([...this.query, (internalName as string)]);
//     }

//     public choice(internalName: KeysMatching<T, string>): TextField<T> {
//         return new TextField<T>([...this.query, (internalName as string)]);
//     }

//     public multiChoice(internalName: KeysMatching<T, string[]>): TextField<T> {
//         return new TextField<T>([...this.query, (internalName as string)]);
//     }

//     public number(internalName: KeysMatching<T, number>): NumberField<T> {
//         return new NumberField<T>([...this.query, (internalName as string)]);
//     }

//     public date(internalName: KeysMatching<T, Date>): DateField<T> {
//         return new DateField<T>([...this.query, (internalName as string)]);
//     }

//     public boolean(internalName: KeysMatching<T, boolean>): BooleanField<T> {
//         return new BooleanField<T>([...this.query, (internalName as string)]);
//     }

//     public lookup<TKey extends KeysMatchingObjects<T>>(internalName: TKey): LookupQueryableFields<T, T[TKey]> {
//         return new LookupQueryableFields<T, T[TKey]>([...this.query], internalName as string);
//     }

//     public lookupId<TKey extends KeysMatching<T, number>>(internalName: TKey): NumberField<T> {
//         const col: string = (internalName as string).endsWith("Id") ? internalName as string : `${internalName as string}Id`;
//         return new NumberField<T>([...this.query, col]);
//     }
// }

// class QueryableAndResult<T> extends QueryableFields<T> {
//     public or(...queries: (ComparisonResult<T> | ((f: QueryableFields<T>) => ComparisonResult<T>))[]): ComparisonResult<T> {
//         return new ComparisonResult<T>([...this.query, `(${queries.map(x => x.toString()).join(FilterJoinOperator.OrWithSpace)})`]);
//     }
// }

// class QueryableOrResult<T> extends QueryableFields<T> {
//     public and(...queries: (ComparisonResult<T> | ((f: QueryableFields<T>) => ComparisonResult<T>))[]): ComparisonResult<T> {
//         return new ComparisonResult<T>([...this.query, `(${queries.map(x => x.toString()).join(FilterJoinOperator.AndWithSpace)})`]);
//     }
// }

// class InitialFieldQuery<T> extends QueryableFields<T> {
//     public or(): QueryableFields<T>;
//     public or(...queries: (ComparisonResult<T> | ((f: QueryableFields<T>) => ComparisonResult<T>))[]): ComparisonResult<T>;
//     public or(...queries: (ComparisonResult<T> | ((f: QueryableFields<T>) => ComparisonResult<T>))[]): (ComparisonResult<T> | QueryableFields<T>) {
//         if (queries == null || queries.length === 0) {
//             return new QueryableFields<T>([...this.query, FilterJoinOperator.Or]);
//         }
//         return new ComparisonResult<T>([...this.query, `(${queries.map(x => x.toString()).join(FilterJoinOperator.OrWithSpace)})`]);
//     }

//     public and(): QueryableFields<T>;
//     public and(...queries: (ComparisonResult<T> | ((f: QueryableFields<T>) => ComparisonResult<T>))[]): ComparisonResult<T>;
//     public and(...queries: (ComparisonResult<T> | ((f: QueryableFields<T>) => ComparisonResult<T>))[]): (ComparisonResult<T> | QueryableFields<T>) {
//         if (queries == null || queries.length === 0) {
//             return new QueryableFields<T>([...this.query, FilterJoinOperator.And]);
//         }
//         return new ComparisonResult<T>([...this.query, `(${queries.map(x => x.toString()).join(FilterJoinOperator.AndWithSpace)})`]);
//     }
// }



// class LookupQueryableFields<TBaseInterface, TExpandedType> extends BaseQuery {
//     private LookupField: string;
//     constructor(q: string[], LookupField: string) {
//         super(q);
//         this.LookupField = LookupField;
//     }

//     public Id(id: number): ComparisonResult<TBaseInterface> {
//         return new ComparisonResult<TBaseInterface>([...this.query, `${this.LookupField}/Id`, FilterOperation.Equals, id.toString()]);
//     }

//     public text(internalName: KeysMatching<TExpandedType, string>): TextField<TBaseInterface> {
//         return new TextField<TBaseInterface>([...this.query, `${this.LookupField}/${internalName as string}`]);
//     }

//     public number(internalName: KeysMatching<TExpandedType, number>): NumberField<TBaseInterface> {
//         return new NumberField<TBaseInterface>([...this.query, `${this.LookupField}/${internalName as string}`]);
//     }

//     // Support has been announced, but is not yet available in SharePoint Online
//     // https://www.microsoft.com/en-ww/microsoft-365/roadmap?filters=&searchterms=100503
//     // public boolean(InternalName: KeysMatching<TExpandedType, boolean>): BooleanField<TBaseInterface> {
//     //     return new BooleanField<TBaseInterface>([...this.query, `${this.LookupField}/${InternalName as string}`]);
//     // }
// }

// class NullableField<TBaseInterface, TInputValueType> extends BaseQuery {
//     protected LastIndex: number;
//     protected InternalName: string;

//     constructor(q: string[]) {
//         super(q);
//         this.LastIndex = q.length - 1;
//         this.InternalName = q[this.LastIndex];
//     }

//     protected toODataValue(value: TInputValueType): string {
//         return `'${value}'`;
//     }

//     public isNull(): ComparisonResult<TBaseInterface> {
//         return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.Equals, "null"]);
//     }

//     public isNotNull(): ComparisonResult<TBaseInterface> {
//         return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.NotEquals, "null"]);
//     }
// }

// class ComparableField<T, TInputValueType> extends NullableField<T, TInputValueType> {
//     public equals(value: TInputValueType): ComparisonResult<T> {
//         return new ComparisonResult<T>([...this.query, FilterOperation.Equals, this.toODataValue(value)]);
//     }

//     public notEquals(value: TInputValueType): ComparisonResult<T> {
//         return new ComparisonResult<T>([...this.query, FilterOperation.NotEquals, this.toODataValue(value)]);
//     }

//     public in(...values: TInputValueType[]): ComparisonResult<T> {
//         return SPOData.Where<T>().or(...values.map(x => this.equals(x)));
//     }

//     public notIn(...values: TInputValueType[]): ComparisonResult<T> {
//         return SPOData.Where<T>().and(...values.map(x => this.notEquals(x)));
//     }
// }

// class TextField<TBaseInterface> extends ComparableField<TBaseInterface, string> {
//     public startsWith(value: string): ComparisonResult<TBaseInterface> {
//         const filter = `${FilterOperation.StartsWith}(${this.InternalName}, ${this.toODataValue(value)})`;
//         this.query[this.LastIndex] = filter;
//         return new ComparisonResult<TBaseInterface>([...this.query]);
//     }

//     public contains(value: string): ComparisonResult<TBaseInterface> {
//         const filter = `${FilterOperation.SubstringOf}(${this.toODataValue(value)}, ${this.InternalName})`;
//         this.query[this.LastIndex] = filter;
//         return new ComparisonResult<TBaseInterface>([...this.query]);
//     }
// }

// class BooleanField<TBaseInterface> extends NullableField<TBaseInterface, boolean> {
//     protected override toODataValue(value: boolean | null): string {
//         return `${value == null ? "null" : value ? 1 : 0}`;
//     }

//     public isTrue(): ComparisonResult<TBaseInterface> {
//         return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.Equals, this.toODataValue(true)]);
//     }

//     public isFalse(): ComparisonResult<TBaseInterface> {
//         return new ComparisonResult<TBaseInterface>([...this.query, FilterOperation.Equals, this.toODataValue(false)]);
//     }

//     public isFalseOrNull(): ComparisonResult<TBaseInterface> {
//         const filter = `(${[
//             this.InternalName,
//             FilterOperation.Equals,
//             this.toODataValue(null),
//             FilterJoinOperator.Or,
//             this.InternalName,
//             FilterOperation.Equals,
//             this.toODataValue(false),
//         ].join(" ")})`;
//         this.query[this.LastIndex] = filter;
//         return new ComparisonResult<TBaseInterface>([...this.query]);
//     }
// }

// class NumericField<T, TInputValueType> extends ComparableField<T, TInputValueType> {
//     public greaterThan(value: TInputValueType): ComparisonResult<T> {
//         return new ComparisonResult<T>([...this.query, FilterOperation.GreaterThan, this.toODataValue(value)]);
//     }

//     public greaterThanOrEquals(value: TInputValueType): ComparisonResult<T> {
//         return new ComparisonResult<T>([...this.query, FilterOperation.GreaterThanOrEqualTo, this.toODataValue(value)]);
//     }

//     public lessThan(value: TInputValueType): ComparisonResult<T> {
//         return new ComparisonResult<T>([...this.query, FilterOperation.LessThan, this.toODataValue(value)]);
//     }

//     public lessThanOrEquals(value: TInputValueType): ComparisonResult<T> {
//         return new ComparisonResult<T>([...this.query, FilterOperation.LessThanOrEqualTo, this.toODataValue(value)]);
//     }
// }


// class NumberField<T> extends NumericField<T, number> {
//     protected override toODataValue(value: number): string {
//         return `${value}`;
//     }
// }

// class DateField<TBaseInterface> extends NumericField<TBaseInterface, Date> {
//     protected override toODataValue(value: Date): string {
//         return `'${value.toISOString()}'`;
//     }

//     public isBetween(startDate: Date, endDate: Date): ComparisonResult<TBaseInterface> {
//         const filter = `(${[
//             this.InternalName,
//             FilterOperation.GreaterThan,
//             this.toODataValue(startDate),
//             FilterJoinOperator.And,
//             this.InternalName,
//             FilterOperation.LessThan,
//             this.toODataValue(endDate),
//         ].join(" ")})`;
//         this.query[this.LastIndex] = filter;
//         return new ComparisonResult<TBaseInterface>([...this.query]);
//     }

//     public isToday(): ComparisonResult<TBaseInterface> {
//         const StartToday = new Date(); StartToday.setHours(0, 0, 0, 0);
//         const EndToday = new Date(); EndToday.setHours(23, 59, 59, 999);
//         return this.isBetween(StartToday, EndToday);
//     }
// }

// class ComparisonResult<T> extends BaseQuery {
//     public and(): QueryableAndResult<T>;
//     // eslint-disable-next-line @typescript-eslint/semi
//     public and(...queries: (ComparisonResult<T> | ((f: QueryableFields<T>) => ComparisonResult<T>))[]): ComparisonResult<T>
//     // eslint-disable-next-line max-len
//     public and(...queries: (ComparisonResult<T> | ((f: QueryableFields<T>) => ComparisonResult<T>))[]): (ComparisonResult<T> | QueryableAndResult<T>) {
//         if (queries == null || queries.length === 0) {
//             return new QueryableAndResult<T>([...this.query, FilterJoinOperator.And]);
//         }
//         return new ComparisonResult<T>([...this.query, FilterJoinOperator.And, `(${queries.map(x => x.toString()).join(FilterJoinOperator.AndWithSpace)})`]);
//     }

//     public or(): QueryableOrResult<T>;
//     public or(...queries: (ComparisonResult<T> | ((f: QueryableFields<T>) => ComparisonResult<T>))[]): ComparisonResult<T>;
//     // eslint-disable-next-line max-len
//     public or(...queries: (ComparisonResult<T> | ((f: QueryableFields<T>) => ComparisonResult<T>))[]): (ComparisonResult<T> | QueryableOrResult<T>) {
//         if (queries == null || queries.length === 0) {
//             return new QueryableOrResult<T>([...this.query, FilterJoinOperator.Or]);
//         }
//         return new ComparisonResult<T>([...this.query, FilterJoinOperator.Or, `(${queries.map(x => x.toString()).join(FilterJoinOperator.OrWithSpace)})`]);
//     }

//     public toString(): string {
//         return this.query.join(" ");
//     }
// }

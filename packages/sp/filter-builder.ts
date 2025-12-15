import { _SPCollection } from "./spqueryable.js";
import { encodePath } from "./utils/encode-path-str.js";

declare module "./spqueryable" {
    interface _SPCollection {

        /**
         * Access the filter builder fluent API
        **/
        where<U = any>(this: this, cb: (this: this, builder: OpenClause<U>) => void): this;

    }
}

_SPCollection.prototype.where = function <U = any>(this: _SPCollection, cb: (this: _SPCollection, builder: OpenClause<U>) => void) {
    const w = new _Where<U>(this as any);
    cb.call(this, w);
    return this.filter(w.toString());
};

type KeysMatching<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];

// this is the opening clause
type OpenClause<T> = {
    text<K extends KeysMatching<T, string>>(fieldName: K, options?: { escape?: boolean }): CloseClauseStr<T>;
    date<K extends KeysMatching<T, Date>>(fieldName: K): CloseClauseDate<T>;
    number<K extends KeysMatching<T, number>>(fieldName: K): CloseClauseNum<T>;
    bool<K extends KeysMatching<T, boolean>>(fieldName: K): CloseClauseBool<T>;
};

type Op<T> = OpenClause<T> & ((cb: (builder: OpenClause<T>) => Clause<T>) => Clause<T>);
type Clause<T> = {
    and: Op<T>;
    or: Op<T>;
};

// Close clause
type CloseClauseStr<T> = {
    eq(v: string): Clause<T>;
    ne(v: string): Clause<T>;
    startsWith(v: string): Clause<T>;
    substringOf(v: string): Clause<T>;
};

type CloseClauseNum<T> = {
    eq(v: number): Clause<T>;
    ne(v: number): Clause<T>;
    gt(v: number): Clause<T>;
    lt(v: number): Clause<T>;
    ge(v: number): Clause<T>;
    le(v: number): Clause<T>;
};

type CloseClauseBool<T> = {
    eq(v: boolean): Clause<T>;
    ne(v: boolean): Clause<T>;
};

type CloseClauseDate<T> = {
    eq(v: Date): Clause<T>;
    ne(v: Date): Clause<T>;
    gt(v: Date): Clause<T>;
    lt(v: Date): Clause<T>;
    ge(v: Date): Clause<T>;
    le(v: Date): Clause<T>;
};

class _Where<T> implements OpenClause<T>, Clause<T> {

    private clauseBuilder = [];
    private clauses: string[] = [];

    constructor(protected collection: T) { }

    public toString(): string {

        if (this.clauseBuilder.length > 0) {
            throw Error("The where clause is not properly closed.");
        }

        return this.clauses.join(" ");
    }    

    private createOperator(op: "and" | "or"): Op<T> {

        const fn = ((cb: (builder: OpenClause<T>) => Clause<T>) => {
            const group = new _Where<T>(this.collection);
            cb(group);
            const groupClause = `(${group.toString()})`;

            const last = this.clauses.pop();
            this.clauses.push(`${last} ${op} ${groupClause}`);
            return this;
        }) as any;

        return (["text", "number", "date", "bool"] as const).reduce((cb, fieldType) => {
            cb[fieldType] = (fieldName: any, options?: any) => {
                const last = this.clauses.pop();
                this.clauseBuilder.push(last, op);
                return (this as any)[fieldType](fieldName, options);
            };
            return cb;
        }, fn) as Op<T>;
    }

    public get and(): Op<T> {
        return this.createOperator("and");
    }

    public get or(): Op<T> {
        return this.createOperator("or");
    }

    /** Field Types */
    public text<K extends KeysMatching<T, string>>(fieldName: K, options?: { escape?: boolean }): CloseClauseStr<T> {
        return this.openClause<string>(fieldName as string, (v: string) => {
            return `'${options?.escape ? encodePath(v) : v}'`;
        });
    }

    public number<K extends KeysMatching<T, number>>(fieldName: K): CloseClauseNum<T> {
        return this.openClause<number>(fieldName as string);
    }

    public date<K extends KeysMatching<T, Date>>(fieldName: K): CloseClauseDate<T> {
        return this.openClause<Date>(fieldName as string, (v: Date) => `datetime'${v.toISOString()}'`);
    }

    public bool<K extends KeysMatching<T, boolean>>(fieldName: K): CloseClauseBool<T> {
        return this.openClause<boolean>(fieldName as string, (v: boolean) => v ? "1" : "0");
    }

    /** Operators */
    public eq(v: any): Clause<T> {
        return this.closeClause("eq", v);
    }

    public ne(v: any): Clause<T> {
        return this.closeClause("ne", v);
    }

    public gt(v: any): Clause<T> {
        return this.closeClause("gt", v);
    }

    public lt(v: any): Clause<T> {
        return this.closeClause("lt", v);
    }

    public ge(v: any): Clause<T> {
        return this.closeClause("ge", v);
    }

    public le(v: any): Clause<T> {
        return this.closeClause("le", v);
    }

    public startsWith(v: any): Clause<T> {
        const toString = this.clauseBuilder.pop();
        const fieldName = this.clauseBuilder.pop();
        const functionClause = `startswith(${fieldName}, ${toString(v)})`;

        if (this.clauseBuilder.length > 0) {
            // We have a previous clause with an operator
            this.clauseBuilder.push(functionClause);
            this.clauses.push(this.clauseBuilder.join(" "));
        } else {
            this.clauses.push(functionClause);
        }
        this.clauseBuilder = [];
        return this;
    }

    public substringOf(v: any): Clause<T> {
        const toString = this.clauseBuilder.pop();
        const fieldName = this.clauseBuilder.pop();
        const functionClause = `substringof(${toString(v)}, ${fieldName})`;

        if (this.clauseBuilder.length > 0) {
            // We have a previous clause with an operator
            this.clauseBuilder.push(functionClause);
            this.clauses.push(this.clauseBuilder.join(" "));
        } else {
            this.clauses.push(functionClause);
        }
        this.clauseBuilder = [];
        return this;
    }

    /** Clauses */
    private openClause<VT>(fieldName: string, toString: (v: VT) => string = (v) => v.toString()): any {
        this.clauseBuilder.push(fieldName);
        this.clauseBuilder.push(toString);
        return <any>this;
    }

    private closeClause(op: string, value: any): Clause<T> {
        const toString = this.clauseBuilder.pop();
        this.clauseBuilder.push(op);
        this.clauseBuilder.push(toString(value));
        this.clauses.push(this.clauseBuilder.join(" "));
        this.clauseBuilder = [];
        return this;
    }
}

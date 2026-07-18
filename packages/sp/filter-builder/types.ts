import { encodePath } from "../utils/encode-path-str.js";

export class _Where<T> implements OpenClause<T>, Clause<T> {

    private clauseBuilder: any[] = [];
    private clauses: string[] = [];

    constructor(protected collection: T) { }

    public get and(): Op<T> {
        return this.createOperator("and");
    }

    public get or(): Op<T> {
        return this.createOperator("or");
    }

    /** Field Types */
    public text<K extends KeysMatching<T, string>>(fieldName: K, options?: TextFieldOptions): StrClause<T> {
        return this.openClause<string>(fieldName as string, (v: string) => {
            return `'${options?.escape ? encodePath(v) : v}'`;
        });
    }

    public number<K extends KeysMatching<T, number>>(fieldName: K): NumClause<T> {
        return this.openClause<number>(fieldName as string);
    }

    public date<K extends KeysMatching<T, Date>>(fieldName: K): DateClause<T> {
        return this.openClause<Date>(fieldName as string, (v: Date) => `datetime'${v.toISOString()}'`);
    }

    public bool<K extends KeysMatching<T, boolean>>(fieldName: K): BoolClause<T> {
        return this.openClause<boolean>(fieldName as string, (v: boolean) => v ? "1" : "0");
    }

    public lookup(fieldName: string): LookupClause<T> {
        const lv = (v: string | number) => typeof v === "string" ? `'${v}'` : `${v}`;
        const pushClause = (clause: string): Clause<T> => {
            if (this.clauseBuilder.length > 0) {
                this.clauseBuilder.push(clause);
                this.clauses.push(this.clauseBuilder.join(" "));
                this.clauseBuilder = [];
            } else {
                this.clauses.push(clause);
            }
            return this;
        };
        return {
            eq: (subField, value) => pushClause(`${fieldName}/${subField} eq ${lv(value)}`),
            ne: (subField, value) => pushClause(`${fieldName}/${subField} ne ${lv(value)}`),
            in: (subField, values) => pushClause(`(${values.map(v => `${fieldName}/${subField} eq ${lv(v)}`).join(" or ")})`),
            notIn: (subField, values) => pushClause(`(${values.map(v => `${fieldName}/${subField} ne ${lv(v)}`).join(" and ")})`),
        };
    }

    public lookupId(fieldName: string): LookupIdClause<T> {
        const pushClause = (clause: string): Clause<T> => {
            if (this.clauseBuilder.length > 0) {
                this.clauseBuilder.push(clause);
                this.clauses.push(this.clauseBuilder.join(" "));
                this.clauseBuilder = [];
            } else {
                this.clauses.push(clause);
            }
            return this;
        };
        return {
            eq: (id) => pushClause(`${fieldName}/Id eq ${id}`),
            ne: (id) => pushClause(`${fieldName}/Id ne ${id}`),
            in: (ids) => pushClause(`(${ids.map(id => `${fieldName}/Id eq ${id}`).join(" or ")})`),
            notIn: (ids) => pushClause(`(${ids.map(id => `${fieldName}/Id ne ${id}`).join(" and ")})`),
        };
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
            this.clauseBuilder.push(functionClause);
            this.clauses.push(this.clauseBuilder.join(" "));
        } else {
            this.clauses.push(functionClause);
        }
        this.clauseBuilder = [];
        return this;
    }

    public in(values: any[]): Clause<T> {
        const toString = this.clauseBuilder.pop();
        const fieldName = this.clauseBuilder.pop();
        const clause = `(${values.map(v => `${fieldName} eq ${toString(v)}`).join(" or ")})`;

        if (this.clauseBuilder.length > 0) {
            this.clauseBuilder.push(clause);
            this.clauses.push(this.clauseBuilder.join(" "));
        } else {
            this.clauses.push(clause);
        }
        this.clauseBuilder = [];
        return this;
    }

    public notIn(values: any[]): Clause<T> {
        const toString = this.clauseBuilder.pop();
        const fieldName = this.clauseBuilder.pop();
        const clause = `(${values.map(v => `${fieldName} ne ${toString(v)}`).join(" and ")})`;

        if (this.clauseBuilder.length > 0) {
            this.clauseBuilder.push(clause);
            this.clauses.push(this.clauseBuilder.join(" "));
        } else {
            this.clauses.push(clause);
        }
        this.clauseBuilder = [];
        return this;
    }

    public isNull(): Clause<T> {
        this.clauseBuilder.pop(); // discard toString
        const fieldName = this.clauseBuilder.pop();
        const clause = `${fieldName} eq null`;

        if (this.clauseBuilder.length > 0) {
            this.clauseBuilder.push(clause);
            this.clauses.push(this.clauseBuilder.join(" "));
        } else {
            this.clauses.push(clause);
        }
        this.clauseBuilder = [];
        return this;
    }

    public isNotNull(): Clause<T> {
        this.clauseBuilder.pop(); // discard toString
        const fieldName = this.clauseBuilder.pop();
        const clause = `${fieldName} ne null`;

        if (this.clauseBuilder.length > 0) {
            this.clauseBuilder.push(clause);
            this.clauses.push(this.clauseBuilder.join(" "));
        } else {
            this.clauses.push(clause);
        }
        this.clauseBuilder = [];
        return this;
    }

    public isBetween(start: Date, end: Date): Clause<T> {
        const toString = this.clauseBuilder.pop();
        const fieldName = this.clauseBuilder.pop();
        const clause = `(${fieldName} ge ${toString(start)} and ${fieldName} le ${toString(end)})`;

        if (this.clauseBuilder.length > 0) {
            this.clauseBuilder.push(clause);
            this.clauses.push(this.clauseBuilder.join(" "));
        } else {
            this.clauses.push(clause);
        }
        this.clauseBuilder = [];
        return this;
    }

    public isToday(): Clause<T> {
        const toString = this.clauseBuilder.pop();
        const fieldName = this.clauseBuilder.pop();
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
        const clause = `(${fieldName} ge ${toString(today)} and ${fieldName} lt ${toString(tomorrow)})`;

        if (this.clauseBuilder.length > 0) {
            this.clauseBuilder.push(clause);
            this.clauses.push(this.clauseBuilder.join(" "));
        } else {
            this.clauses.push(clause);
        }
        this.clauseBuilder = [];
        return this;
    }

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

        return (["text", "number", "date", "bool", "lookup", "lookupId"] as const).reduce((cb, fieldType) => {
            cb[fieldType] = (fieldName: any, options?: any) => {
                const last = this.clauses.pop();
                this.clauseBuilder.push(last, op);
                return (this as any)[fieldType](fieldName, options);
            };
            return cb;
        }, fn) as Op<T>;
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

export type KeysMatching<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];

export type TextFieldOptions = {
    escape?: boolean;
};

export type OpenClause<T> = {
    text<K extends KeysMatching<T, string>>(fieldName: K, options?: TextFieldOptions): StrClause<T>;
    date<K extends KeysMatching<T, Date>>(fieldName: K): DateClause<T>;
    number<K extends KeysMatching<T, number>>(fieldName: K): NumClause<T>;
    bool<K extends KeysMatching<T, boolean>>(fieldName: K): BoolClause<T>;
    lookup(fieldName: string): LookupClause<T>;
    lookupId(fieldName: string): LookupIdClause<T>;
};

export type Op<T> = OpenClause<T> & ((cb: (builder: OpenClause<T>) => Clause<T>) => Clause<T>);
export type Clause<T> = {
    and: Op<T>;
    or: Op<T>;
};

export type StrClause<T> = {
    eq(v: string): Clause<T>;
    ne(v: string): Clause<T>;
    startsWith(v: string): Clause<T>;
    substringOf(v: string): Clause<T>;
    in(values: string[]): Clause<T>;
    notIn(values: string[]): Clause<T>;
    isNull(): Clause<T>;
    isNotNull(): Clause<T>;
};

export type NumClause<T> = {
    eq(v: number): Clause<T>;
    ne(v: number): Clause<T>;
    gt(v: number): Clause<T>;
    lt(v: number): Clause<T>;
    ge(v: number): Clause<T>;
    le(v: number): Clause<T>;
    in(values: number[]): Clause<T>;
    notIn(values: number[]): Clause<T>;
    isNull(): Clause<T>;
    isNotNull(): Clause<T>;
};

export type BoolClause<T> = {
    eq(v: boolean): Clause<T>;
    ne(v: boolean): Clause<T>;
    isNull(): Clause<T>;
    isNotNull(): Clause<T>;
};

export type DateClause<T> = {
    eq(v: Date): Clause<T>;
    ne(v: Date): Clause<T>;
    gt(v: Date): Clause<T>;
    lt(v: Date): Clause<T>;
    ge(v: Date): Clause<T>;
    le(v: Date): Clause<T>;
    in(values: Date[]): Clause<T>;
    notIn(values: Date[]): Clause<T>;
    isBetween(start: Date, end: Date): Clause<T>;
    isToday(): Clause<T>;
    isNull(): Clause<T>;
    isNotNull(): Clause<T>;
};

export type LookupClause<T> = {
    eq(subField: string, value: string | number): Clause<T>;
    ne(subField: string, value: string | number): Clause<T>;
    in(subField: string, values: (string | number)[]): Clause<T>;
    notIn(subField: string, values: (string | number)[]): Clause<T>;
};

export type LookupIdClause<T> = {
    eq(value: number): Clause<T>;
    ne(value: number): Clause<T>;
    in(values: number[]): Clause<T>;
    notIn(values: number[]): Clause<T>;
};

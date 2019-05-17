import { IQueryable } from "./queryable";
import { RequestContext } from "./pipeline";
import { IFetchOptions, RuntimeConfig, isArray, isFunc } from "@pnp/common";

export type IHybrid<T, R = Promise<any>> = T & {
    (this: T, ...args: any[]): R;
};

export type IInvoker<T, R> = (this: T, ...args: any[]) => R;

export type IHybridConstructor<T, R> = (...args: any[]) => IHybrid<T, R>;

// export interface IHook<T extends object = {}> extends  { }

export type IHook<T extends object = {}> = Pick<ProxyHandler<T>, "apply" | "get" | "has" | "set"> | { (op: string, target: T, ...rest: any[]): void };

const hooks: IHook[] = [];

function hookOr(op: string, or: (...args: any[]) => any, target: any, ...rest: any[]): any {

    // we need to first invoke hooks tied to only this object
    if (Reflect.has(target, "__hooks")) {
        const hc: IHook[] = Reflect.get(target, "__hooks");
        for (let i = 0; i < hc.length; i++) {
            const h = hc[i];
            const r = isFunc(h) ? (<any>h)(op, target, ...rest) : Reflect.has(h, op) ? h[op](target, ...rest) : undefined;
            if (typeof r !== "undefined") {
                return r;
            }
        }
    }

    // second we need to process any global hooks
    for (let i = 0; i < hooks.length; i++) {
        const h = hooks[i];
        const r = isFunc(h) ? (<any>h)(op, target, ...rest) : Reflect.has(h, op) ? h[op](target, ...rest) : undefined;
        if (typeof r !== "undefined") {
            return r;
        }
    }

    return or(target, ...rest);
}

export const hook = (h: IHook | IHook[]) => {
    if (isArray(h)) {
        // @ts-ignore
        [].push.apply(hooks, h);
    } else {
        // @ts-ignore
        hooks.push(h);
    }
};

export const hookObj = (o: object, h: IHook) => {
    if (!Reflect.has(o, "__hooks")) {
        Reflect.set(o, "__hooks", []);
    }

    (<any[]>Reflect.get(o, "__hooks")).push(h);
};

const invokableBinder = <T extends { new(): T; new(...args: any[]): T }, R = any>(invoker: IInvoker<T, R>) => (constructor: T): IHybridConstructor<T, R> => {

    return (...args: any[]) => {

        const factory = (as: any[]) => {
            const r = Object.assign(function (...ags: any[]) { return invoker.apply(r, ags); }, new constructor(...as));
            Reflect.setPrototypeOf(r, constructor.prototype);
            return r;
        };

        if (RuntimeConfig.ie11) {
            return factory(args);
        } else {
            return new Proxy<IHybrid<T, R>>(factory(args), {
                apply: (target: any, _thisArg: any, argArray?: any) => {
                    return hookOr("apply", (...a: any[]) => Reflect.apply(a[0], a[1], a[2]), target, _thisArg, argArray);
                },
                get: (target: any, p: PropertyKey, receiver: any) => {
                    return hookOr("get", (...a: any[]) => Reflect.get(a[0], a[1], a[2]), target, p, receiver);
                },
                has: (target: any, p: PropertyKey) => {
                    return hookOr("has", (...a: any[]) => Reflect.get(a[0], a[1]), target, p);
                },
                set: (target: any, p: PropertyKey, value: any, receiver: any) => {
                    return hookOr("set", (...a: any[]) => Reflect.set(a[0], a[1], a[2], a[3]), target, p, value, receiver);
                },
            });
        }
    };
};

function defaultAction<R = any>(this: IQueryable<R>, options?: IFetchOptions): Promise<R> {
    return this.defaultAction(options);
}

// @ts-ignore (reason: there is not a great way to describe the "this" type for this operation)
export const invokable = invokableBinder(defaultAction);

export interface IGetable<R = any> {
    <T = R>(options?: Partial<RequestContext<T>>): Promise<T>;
}

export const invokableFactory = <T>(f: { new(...args: any[]): T }) => (...args: any[]): T => {
    return invokable<T>(f)(...args);
};

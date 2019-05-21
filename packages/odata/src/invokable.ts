import { IQueryable } from "./queryable";
import { RequestContext } from "./pipeline";
import { IFetchOptions, RuntimeConfig } from "@pnp/common";
import { hookOr, doFactoryHooks } from "./hooking";

export type IHybrid<T, R = Promise<any>> = T & {
    (this: T, ...args: any[]): R;
};

export type IInvoker<T, R> = (this: T, ...args: any[]) => R;

export type IHybridConstructor<T, R> = (...args: any[]) => IHybrid<T, R>;

// const invokableBinder = <T extends { new(): T; new(...args: any[]): T }, R = any>(invoker: IInvoker<T, T & R>) => (constructor: T): IHybridConstructor<T, T & R> => {
// const invokableBinder = <T extends { new(): T; new(...args: any[]): T }, R = any>(invoker: IInvoker<T, T & R>) => (constructor: T): IHybridConstructor<T, any> => {
// const invokableBinder = <T extends { new(): T; new(...args: any[]): T }, R = any>(invoker: IInvoker<T, R>) => (constructor: T): IHybridConstructor<T, R> => {
const invokableBinder = <R = any>(invoker: IInvoker<any, R>) => <T extends { new(): T; new(...args: any[]): T }>(constructor: T): IHybridConstructor<T, R> => {

    return function (...args: any[]) {

        const factory = (as: any[]) => {
            const r = Object.assign(function (...ags: any[]) { return invoker.apply(r, ags); }, new constructor(...as));
            Reflect.setPrototypeOf(r, constructor.prototype);
            return r;
        };

        if (RuntimeConfig.ie11) {
            return factory(args);
        } else {

            return new Proxy<IHybrid<T, R>>(doFactoryHooks(factory, args), {
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

// <<Partial<IQueryable<R>>, R>>
// <T extends { new(): T; new(...args: any[]): T; defaultAction(options) => R }, R = any>
function defaultAction(this: any, options?: IFetchOptions): Promise<any> {
    return this.defaultAction(options);
}

// @ ts-ignore (reason: there is not a great way to describe the "this" type for this operation)
export const invokableFactory = invokableBinder(defaultAction);

export interface IInvokable<R = any> {
    <T = R>(options?: Partial<RequestContext<T>>): Promise<T>;
}

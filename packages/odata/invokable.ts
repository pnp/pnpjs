import { IQueryable, Queryable } from "./queryable";
import { RequestContext } from "./pipeline";
import { IFetchOptions, RuntimeConfig } from "@pnp/common";
import { extensionOrDefault, doFactoryExtensions } from "./extensions";

export type IHybrid<T, R = any> = T & {
    (this: T, ...args: any[]): Promise<R>;
};

export type IInvoker<R> = (this: IQueryable<R>, ...args: any[]) => Promise<R>;

const invokableBinder = <T = Queryable<any>>(invoker: IInvoker<T>) => <R>(constructor: { new(...args: any[]): any }): (...args: any[]) => R => {

    return function (...args: any[]) {

        const factory = (as: any[]) => {
            const r = Object.assign(function (...ags: any[]) { return invoker.apply(r, ags); }, new constructor(...as));
            Reflect.setPrototypeOf(r, constructor.prototype);
            return r;
        };

        if (RuntimeConfig.ie11) {
            return factory(args);
        } else {

            return new Proxy<IHybrid<T>>(doFactoryExtensions(factory, args), {
                apply: (target: any, _thisArg: any, argArray?: any) => {
                    return extensionOrDefault("apply", (...a: any[]) => Reflect.apply(a[0], a[1], a[2]), target, _thisArg, argArray);
                },
                get: (target: any, p: PropertyKey, receiver: any) => {
                    return extensionOrDefault("get", (...a: any[]) => Reflect.get(a[0], a[1], a[2]), target, p, receiver);
                },
                has: (target: any, p: PropertyKey) => {
                    return extensionOrDefault("has", (...a: any[]) => Reflect.get(a[0], a[1]), target, p);
                },
                set: (target: any, p: PropertyKey, value: any, receiver: any) => {
                    return extensionOrDefault("set", (...a: any[]) => Reflect.set(a[0], a[1], a[2], a[3]), target, p, value, receiver);
                },
            });
        }
    };
};

function defaultAction<R = any>(this: IQueryable<R>, options?: IFetchOptions): Promise<R> {
    return this.defaultAction(options);
}

export const invokableFactory = invokableBinder(defaultAction);

export interface IInvokable<R = any> {
    <T = R>(options?: Partial<RequestContext<T>>): Promise<T>;
}

import { IQueryable } from "./queryable";
import { RequestContext } from "./pipeline";
import { IFetchOptions, RuntimeConfig } from "@pnp/common";

export type IHybrid<T, R = Promise<any>> = T & {
    (this: T, ...args: any[]): R;
};

export type IInvoker<T, R> = (this: T, ...args: any[]) => R;

export type IHybridConstructor<T, R> = (...args: any[]) => IHybrid<T, R>;

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
                    return Reflect.apply(target, _thisArg, argArray);
                },
                get: (target: any, p: PropertyKey, receiver: any) => {
                    return Reflect.get(target, p, receiver);
                },
                has: (target: any, p: PropertyKey) => {
                    return Reflect.has(target, p);
                },
                set: (target: any, p: PropertyKey, value: any, receiver: any) => {
                    return Reflect.set(target, p, value, receiver);
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

import { extensionOrDefault, applyFactoryExtensions } from "./invokable-extensions.js";
import { Queryable2 } from "./queryable-2.js";
import { get } from "./operations.js";

type defaultActionType<T, R> = (this: T, init?: RequestInit) => Promise<R>;

export type IHybrid2<T extends Queryable2, R> = T & {
    (this: T, init?: RequestInit): Promise<R>;
};


// eslint-disable-next-line max-len
export function invokableFactory2<T extends Queryable2, R>(constructor: { new(...args: any[]): T }, defaultAction?: defaultActionType<T, R>): (...args: any[]) => IHybrid2<T, R> {

    if (typeof defaultAction !== "function") {
        defaultAction = function (this: T, init?: RequestInit) {
            return get(this, init);
        };
    }

    return (...args: any[]) => {

        const factory = (passedArgs: any[]) => {
            const r = Object.assign(function (init?: RequestInit) {
                return Reflect.apply(defaultAction, r, [init]);
            }, new constructor(...passedArgs));
            Reflect.setPrototypeOf(r, constructor.prototype);
            return r;
        };

        return new Proxy<IHybrid2<T, R>>(applyFactoryExtensions(factory, args), {
            apply: (target: any, _thisArg: any, argArray?: any) => {
                return extensionOrDefault("apply", (...a: any[]) => Reflect.apply(a[0], a[1], a[2]), target, _thisArg, argArray);
            },
            get: (target: any, p: PropertyKey, receiver: any) => {
                return extensionOrDefault("get", (...a: any[]) => Reflect.get(a[0], a[1], a[2]), target, p, receiver);
            },
            has: (target: any, p: PropertyKey) => {
                return extensionOrDefault("has", (...a: any[]) => Reflect.has(a[0], a[1]), target, p);
            },
            set: (target: any, p: PropertyKey, value: any, receiver: any) => {
                return extensionOrDefault("set", (...a: any[]) => Reflect.set(a[0], a[1], a[2], a[3]), target, p, value, receiver);
            },
        });
    };
}

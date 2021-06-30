import { extensionOrDefault, applyFactoryExtensions } from "./invokable-extensions.js";
import { IQueryable2 } from "./queryable-2.js";
import { get, op } from "./operations.js";

export type ActionType<T, R> = (this: T, init?: RequestInit) => Promise<R>;

/**
 * Represents a type comprised of an object and a function, allowing the object to be invoked directly
 */
export type IHybrid2<T extends IQueryable2, R> = T & {
    (this: T, init?: RequestInit): Promise<R>;
};

/**
 * Creates an factory function binding the supplied constructor to a function enabling it to be invoked directly
 *
 * @param constructor Constructor of the underlying object which will be wrapped in the Proxy
 * @param invokeableAction The action executed when the object is called as a function
 * @returns Factory used to create extendable hybrid objects
 */
export function invokableFactory2<InstanceType extends IQueryable2, InvokableReturnType = ReturnType<InstanceType>>(

    constructor: { new(init: IQueryable2<any> | string, path?: string): InstanceType },
    invokeableAction?: ActionType<InstanceType, InvokableReturnType>

): (init: IQueryable2<any> | string, path?: string) => InstanceType {

    if (typeof invokeableAction !== "function") {
        invokeableAction = function (this: InstanceType, init?: RequestInit) {
            return op(this, get, init);
            // return Reflect.apply(get, this, [init]);
        };
    }

    return (init: IQueryable2<any> | string, path?: string) => {

        const factory = () => {
            const r = Object.assign(function (init2?: RequestInit) {
                return Reflect.apply(invokeableAction, r, [init2]);
            }, new constructor(init, path));
            Reflect.setPrototypeOf(r, constructor.prototype);
            return r;
        };

        return <any>new Proxy<IHybrid2<InstanceType, InvokableReturnType>>(applyFactoryExtensions(factory), {
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

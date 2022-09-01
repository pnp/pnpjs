import { get, op } from "./operations.js";
import { isFunc } from "@pnp/core";

/**
 * Allows a decorated object to be invoked as a function, optionally providing an implementation for that action
 *
 * @param invokeableAction Optional. The logic to execute upon invoking the object as a function.
 * @returns Decorator which applies the invokable logic to the tagged class
 */
export function invokable(invokeableAction?: (this: any, init?: RequestInit) => Promise<any>) {

    if (!isFunc(invokeableAction)) {
        invokeableAction = function (this: any, init?: RequestInit) {
            return op(this, get, init);
        };
    }

    return (target: any) => {

        return new Proxy(target, {

            construct(clz, args, newTarget: any) {

                const invokableInstance = Object.assign(function (init?: RequestInit) {

                    // the "this" for our invoked object will be set by extendable OR we use invokableInstance directly
                    const localThis = typeof this === "undefined" ? invokableInstance : this;
                    return Reflect.apply(invokeableAction, localThis, [init]);

                }, Reflect.construct(clz, args, newTarget));

                Reflect.setPrototypeOf(invokableInstance, newTarget.prototype);

                return invokableInstance;
            },
        });
    };
}

export interface IInvokable<R = any> {
    <T = R>(init?: RequestInit): Promise<T>;
}

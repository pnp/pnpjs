/* eslint-disable @typescript-eslint/no-unused-vars */
import { isFunc, TimelinePipe } from "@pnp/core";
import { Queryable } from "../queryable.js";

// this is a special moment used to broadcast when a request is canceled
const CancelMoment = "__CancelMoment";

// represents a Promise including the cancel method
export type CancelablePromise<T = any> = Promise<T> & { cancel(): void };

let inScope = false;
let scopeCancel: () => void | undefined;

function disposeScope() {
    inScope = false;
    scopeCancel = undefined;
}

export type CancelableObserver = (this: Queryable, ev: Event) => void;

export const asCancelableScope = <T extends any[], U>(func: (...args: T) => U): (...args: T) => U => {

    // this needs to include the parameter types, etc and return a wrapped function
    return function (...args: T): U {

        inScope = true;

        const result = func.apply(this, args);

        // if result is async we need to attach a finally, otherwise we just clear the scope
        if (typeof result?.finally === "function") {

            (<Promise<any>>result).finally(disposeScope);

            // ensure we have cancel set to use the current scope's cancel function
            (<CancelablePromise>result).cancel = scopeCancel;

        } else {

            disposeScope();
        }

        return result;
    };
};

export function cancelableScope() {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        // wrapping the original method
        descriptor.value = asCancelableScope(descriptor.value);
    };
}


// TODO:: need to
// - solve for awaiting cancel moment, we need to give subscribed observers time to do async things (cancel upload)
// - solve for holding all cancel actions in a scope level array when inScope is true
// - test fully multi-call, single call, multi-call across class methods

/**
 * Allows requests to be canceled by the caller by adding a cancel method to the Promise returned by the library
 *
 * @returns Timeline pipe to setup canelability
 */
export function Cancelable(): TimelinePipe<Queryable> {

    if (!AbortController) {
        throw Error("The current environment appears to not support AbortController, please include a suitable polyfill.");
    }

    return (instance: Queryable) => {

        let signal: AbortSignal;

        instance.on.init(function (this: Queryable) {

            // this event will run before pre in the lifecycle, so signal should be properly set
            this.on[this.InternalPromise]((promise: Promise<any>) => {

                if (inScope && isFunc(scopeCancel)) {

                    // we are inside a scope and this is a call INSIDE an established scope
                    (<CancelablePromise>promise).cancel = scopeCancel;

                } else if (inScope) {

                    // we are inside a scope and this is a call to establish the scope
                    const controller = new AbortController();

                    signal = controller.signal;

                    // this will allow us to still emit the CancelMoment even if they have supplied their own signal
                    signal.addEventListener("abort", (ev) => {
                        signal = null;
                        this.emit[CancelMoment](ev);
                    });

                    scopeCancel = () => controller.abort();

                    (<CancelablePromise>promise).cancel = scopeCancel;

                } else {

                    const controller = new AbortController();

                    signal = controller.signal;

                    // this will allow us to still emit the CancelMoment even if they have supplied their own signal
                    signal.addEventListener("abort", (ev) => {
                        signal = null;
                        this.emit[CancelMoment](ev);
                    });

                    (<CancelablePromise>promise).cancel = () => controller.abort();

                }

                return [promise];
            });
        });

        instance.on.pre(async function (this: Queryable, url, init, result) {

            // if they have included their own signal then we are stuck with respecting the one alredy on init
            // they should avoid using Cancelable and supplying their own signal
            if (signal && !init.signal) {

                init.signal = signal;

            } else if (init.signal) {

                // this will allow us to still emit the CancelMoment even if they have supplied their own signal
                init.signal.addEventListener("abort", (ev) => {
                    signal = null;
                    this.emit[CancelMoment](ev);
                });
            }

            return [url, init, result];
        });
 
        return instance;
    };
}

export function CancelAction(action: CancelableObserver): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.on.pre(async function (...args) {

            this.on[CancelMoment](action);
            return args;
        });

        return instance;
    };
}

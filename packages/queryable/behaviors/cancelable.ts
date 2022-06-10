import { asyncBroadcast, isFunc, TimelinePipe } from "@pnp/core";
import { Queryable } from "../queryable.js";

// this is a special moment used to broadcast when a request is canceled
const CancelMoment = "__CancelMoment__";

// represents a Promise including the cancel method
export type CancelablePromise<T = any> = Promise<T> & { cancel(): void };

// these values are used to track module state while in a scope
let inScope = false;
const scopeActions: CancelableObserver[] = [];
let definedCancel: () => void | undefined;

/**
 * Defines the signature for observers subscribing to the cancelable moment
 */
export type CancelableObserver = (this: Queryable) => Promise<void>;

/**
 * Function wrapper that turns the supplied function into a cancellation scope
 *
 * @param func Func to wrap
 * @returns The same func signature, wrapped with our cancel scoping logic
 */
export const asCancelableScope = <T extends any[], U>(func: (...args: T) => U): (...args: T) => U => {

    // this needs to include the parameter types, etc and return a wrapped function
    return function (...args: T): U {

        // set that we are in a scope
        inScope = true;

        // execute the original function
        const result = func.apply(this, args);

        // if result is async we need to attach the cancel to the promise
        if (typeof result?.finally === "function") {

            // ensure we have cancel set to use the current scope's cancel function
            // we rely on the timing of the Cancelable behavior logic completing in the above
            // func.apply so that scopeCancel is set
            (<CancelablePromise>result).cancel = definedCancel;

            result.finally(() => {
                // we need to clean up even when the promise is not cancelled, so we attach a finally handler
                inScope = false;
                scopeActions.length = 0;
            });
        }

        return result;
    };
};

/**
 * Decorator used to mark multi-step methods to ensure all subrequests are properly cancelled
 */
export function cancelableScope(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    // wrapping the original method
    descriptor.value = asCancelableScope(descriptor.value);
}

/**
 * This method is partially bound and used as the cancel method exposed to the user via cancelable promise
 *
 * @param this Current queryable
 * @param controller The controller associated with this cancel method
 */
async function cancelPrimitive(this: Queryable, controller: AbortController): Promise<void> {

    definedCancel = undefined;
    if (inScope) {
        // ensure we register our scope level actions before we emit
        scopeActions.map(action => this.on[CancelMoment](action));
    }

    try {
        await this.emit[CancelMoment]();
    } catch (e) {
        this.log(`Error in CancelMoment: ${e?.message || "unknown"}`);
    }

    controller.abort();
}

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

        // init our queryable to support cancellation
        instance.on.init(function (this: Queryable) {

            // define the moment's implementation
            this.moments[CancelMoment] = asyncBroadcast<CancelableObserver>();

            // this event will run before pre in the lifecycle, so signal should be properly set
            this.on[this.InternalPromise]((promise: Promise<any>) => {

                if (inScope && isFunc(definedCancel)) {

                    // we are inside a scope and this is a call INSIDE an established scope
                    (<CancelablePromise>promise).cancel = definedCancel;

                } else {

                    // we are inside a scope or an individual request and this is a call to establish the controller
                    const controller = new AbortController();
                    signal = controller.signal;

                    definedCancel = cancelPrimitive.bind(this, controller);
                    (<CancelablePromise>promise).cancel = definedCancel;
                }

                return [promise];
            });
        });

        instance.on.pre(async function (this: Queryable, url, init, result) {

            // if they have included their own signal then we are stuck with respecting the one alredy on init
            // they should avoid using Cancelable and supplying their own signal
            if (signal && !init.signal) {
                init.signal = signal;
            } else {

                // we do our best to hook their signal into our logic
                init.signal.addEventListener("abort", () => {
                    definedCancel();
                });
            }

            return [url, init, result];
        });

        return instance;
    };
}

/**
 * Allows you to define an action that is run when a request is cancelled
 *
 * @param action The action to run
 * @returns A timeline pipe used in the request lifecycle
 */
export function CancelAction(action: CancelableObserver): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.on.pre(async function (...args) {

            // if we are in a scope, and haven't already tracked this action we add it
            // we need to check as the CancelAction behavior will be passed down across
            // instances within the scope, but we only want to do the action once
            if (inScope && scopeActions.indexOf(action) < 0) {
                scopeActions.push(action);
            } else {
                this.on[CancelMoment](action);
            }

            return args;
        });

        return instance;
    };
}

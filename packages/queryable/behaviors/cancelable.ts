import { asyncBroadcast, isArray, TimelinePipe } from "@pnp/core";
import { Queryable, QueryableInit } from "../queryable.js";

/**
 * Cancelable is a fairly complex behavior as there is a lot to consider through multiple timelines. We have
 * two main cases:
 *
 * 1. basic method that is a single call and returns the result of an operation (return spPost(...))
 * 2. complex method that has multiple async calls within
 *
 * 1. For basic calls the cancel info is attached in init as it is only involved within a single request.
 *    This works because there is only one request and the cancel logic doesn't need to persist across
 *    inheriting instances. Also, many of these requests are so fast canceling is likely unnecessary
 *
 * 2. Complex method present a larger challenge because they are comprised of > 1 request and the promise
 *    that is actually returned to the user is not directly from one of our calls. This promise is the
 *    one "created" by the language when you await. For complex method we have two things that solve these
 *    needs.
 *
 *    The first is the use of either the cancelableScope decorator of the asCancelableScope method
 *    wrapper. These create an upper level cancel info that is then shared across the child requests within
 *    the complex method. Meaning if I do a files.addChunked the same cancel info (signal and cancel method)
 *    are set on the current "this" which is user object on which the method was called. This info is then
 *    passed down to any child requests using the original "this" as a base using the construct moment.
 *
 * The CancelAction behavior is used to apply additional actions to a request once it is canceled. For example
 * in the case of uploading files chunked in sp we cancel the upload by id.
 */

// this is a special moment used to broadcast when a request is canceled
const CancelMoment = "__CancelMoment__";

// represents a Promise including the cancel method
export type CancelablePromise<T = any> = Promise<T> & { cancel(): Promise<void> };

// this value is used to track cancel state and the value is represetented by ICancelInfo
const CancelMethodProp = Symbol.for("CancelMethodProp");

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

    return function (this: Queryable, ...args: T): U {

        // ensure we have setup "this" to cancel
        // 1. for single requests the value is set in the behavior's init observer
        // 2. for complex requests the value is set here
        // ensureCancelProp(this);

        if (!Reflect.has(this, CancelMethodProp)) {
            this[CancelMethodProp] = cancelPrimitive;
        }

        // execute the original function, but don't await it
        const result = func.apply(this, args);

        // if result is async we need to attach the cancel to the promise
        if (typeof result?.finally === "function") {

            // ensure the synthetic promise from a complex method has a cancel method
            (<CancelablePromise>result).cancel = this[CancelMethodProp];

            result.finally(() => {
                // remove any cancel scope stuff tied to this instance
                delete this[CancelMethodProp];
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
async function cancelPrimitive(): Promise<void> {

    if (isArray(this?.cancel?.cancelActions)) {
        this.cancel.cancelActions.map(action => this.cancel.self.on[CancelMoment](action));
    }

    try {
        await this.cancel.self.emit[CancelMoment]();
    } catch (e) {
        this.log(`Error in CancelMoment: ${e?.message || "unknown"}`);
    }

    try {
        this.cancel.controller.abort();
    } catch (e) {
        console.error(e);
    }
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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        instance.on.construct(function (this: Queryable, init: QueryableInit, path?: string) {

            if (typeof init !== "string") {

                const parent = isArray(init) ? init[0] : init;

                if (Reflect.has(parent, CancelMethodProp)) {

                    this[CancelMethodProp] = parent[CancelMethodProp];

                } else {

                    // ensure we have setup "this" to cancel
                    // 1. for single requests this will set the value
                    // 2. for complex requests the value is set in asCancelableScope
                    // ensureCancelProp(this);
                    if (!Reflect.has(this, CancelMethodProp)) {
                        this[CancelMethodProp] = cancelPrimitive;
                    }
                }

                // define the moment's implementation
                this.moments[CancelMoment] = asyncBroadcast<CancelableObserver>();
            }
        });

        // init our queryable to support cancellation
        instance.on.init(function (this: Queryable) {

            this.on[this.InternalPromise]((promise: Promise<any>) => {

                // when a new promise is created add a cancel method
                (<CancelablePromise>promise).cancel = this[CancelMethodProp];

                return [promise];
            });
        });

        instance.on.pre(async function (this: Queryable, url, init, result) {

            const controller = new AbortController();

            this[CancelMethodProp].controller = controller;
            this[CancelMethodProp].self = this;

            if (init.signal) {

                // we do our best to hook our logic to the existing signal
                init.signal.addEventListener("abort", () => {
                    this[CancelMethodProp]();
                });

            } else {

                init.signal = controller.signal;
            }

            return [url, init, result];
        });

        // clean up any cancel info from the object after the request lifecycle is complete
        instance.on.dispose(function (this: Queryable) {
            delete this[CancelMethodProp];
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

        instance.on.pre(async function (this: Queryable, ...args) {

            if (!isArray(this[CancelMethodProp].cancelActions)) {
                this[CancelMethodProp].cancelActions = [];
            }

            if (this[CancelMethodProp].cancelActions.indexOf(action) < 0) {
                this[CancelMethodProp].cancelActions.push(action);
            }

            return args;
        });

        return instance;
    };
}

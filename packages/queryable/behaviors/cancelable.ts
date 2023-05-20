import { asyncBroadcast, isArray, TimelinePipe, getGUID, objectDefinedNotNull } from "@pnp/core";
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
 *    one "created" by the language when you await. For complex methods we have two things that solve these
 *    needs.
 *
 *    The first is the use of either the cancelableScope decorator or the asCancelableScope method
 *    wrapper. These create an upper level cancel info that is then shared across the child requests within
 *    the complex method. Meaning if I do a files.addChunked the same cancel info (and cancel method)
 *    are set on the current "this" which is user object on which the method was called. This info is then
 *    passed down to any child requests using the original "this" as a base using the construct moment.
 *
 *    The CancelAction behavior is used to apply additional actions to a request once it is canceled. For example
 *    in the case of uploading files chunked in sp we cancel the upload by id.
 */

// this is a special moment used to broadcast when a request is canceled
const MomentName = "__CancelMoment__";

// represents a Promise including the cancel method
export type CancelablePromise<T = any> = Promise<T> & { cancel(): Promise<void> };

// this value is used to track cancel state and the value is represetented by IScopeInfo
const ScopeId = Symbol.for("CancelScopeId");

/**
 * Defines the information we store for each cancelation scope
 */
interface IScopeInfo {
    actions: any[];
    currentSelf: Queryable<any>;
    controller: AbortController;
    cancel: () => Promise<void>;
}

// module map of all currently tracked cancel scopes
const cancelScopes = new Map<string, IScopeInfo>();

/**
 * This method is bound to a scope id and used as the cancel method exposed to the user via cancelable promise
 *
 * @param this unused, the current promise
 * @param scopeId Id bound at creation time
 */
async function cancelPrimitive(scopeId: string): Promise<void> {

    const scope = cancelScopes.get(scopeId);

    scope.controller.abort();

    if (isArray(scope?.actions)) {
        scope.actions.map(action => scope.currentSelf.on[MomentName](action));
    }

    try {

        await (<any>scope.currentSelf).emit[MomentName]();

    } catch (e) {
        scope.currentSelf.log(`Error in cancel: ${e}`, 3);
    }
}

/**
 * Creates a new scope id, sets it on the instance's ScopeId property, and adds the info to the map
 *
 * @returns the new scope id (GUID)
 */
function createScope(instance: Queryable): string {
    const id = getGUID();
    instance[ScopeId] = id;
    cancelScopes.set(id, {
        cancel: cancelPrimitive.bind({}, id),
        actions: [],
        controller: null,
        currentSelf: instance,
    });
    return id;
}

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
export const asCancelableScope = <F extends (...args: any[]) => any>(func: F): (...args: Parameters<F>) => ReturnType<F> => {

    return function (this: Queryable, ...args: Parameters<F>): ReturnType<F> {

        // ensure we have setup "this" to cancel
        // 1. for single requests the value is set in the behavior's init observer
        // 2. for complex requests the value is set here
        if (!Reflect.has(this, ScopeId)) {
            createScope(this);
        }

        // execute the original function, but don't await it
        const result = func.apply(this, args).finally(() => {
            // remove any cancel scope values tied to this instance
            cancelScopes.delete(this[ScopeId]);
            delete this[ScopeId];
        });

        // ensure the synthetic promise from a complex method has a cancel method
        (<CancelablePromise>result).cancel = cancelScopes.get(this[ScopeId]).cancel;

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

                if (Reflect.has(parent, ScopeId)) {
                    // ensure we carry over the scope id to the new instance from the parent
                    this[ScopeId] = parent[ScopeId];
                }

                // define the moment's implementation
                this.moments[MomentName] = asyncBroadcast<CancelableObserver>();
            }
        });

        // init our queryable to support cancellation
        instance.on.init(function (this: Queryable) {

            if (!Reflect.has(this, ScopeId)) {

                // ensure we have setup "this" to cancel
                // 1. for single requests this will set the value
                // 2. for complex requests the value is set in asCancelableScope
                const id = createScope(this);

                // if we are creating the scope here, we have not created it within asCancelableScope
                // meaning the finally handler there will not delete the tracked scope reference
                this.on.dispose(() => {
                    cancelScopes.delete(id);
                });
            }

            this.on[this.InternalPromise]((promise: Promise<any>) => {

                // when a new promise is created add a cancel method
                (<CancelablePromise>promise).cancel = cancelScopes.get(this[ScopeId]).cancel;

                return [promise];
            });
        });

        instance.on.pre(async function (this: Queryable, url, init, result) {

            // grab the current scope, update the controller and currentSelf
            const existingScope = cancelScopes.get(this[ScopeId]);

            // if we are here without a scope we are likely running a CancelAction request so we just ignore canceling
            if (objectDefinedNotNull(existingScope)) {

                const controller = new AbortController();

                existingScope.controller = controller;
                existingScope.currentSelf = this;

                if (init.signal) {

                    // we do our best to hook our logic to the existing signal
                    init.signal.addEventListener("abort", () => {
                        existingScope.cancel();
                    });

                } else {

                    init.signal = controller.signal;
                }
            }

            return [url, init, result];
        });

        // clean up any cancel info from the object after the request lifecycle is complete
        instance.on.dispose(function (this: Queryable) {
            delete this[ScopeId];
            delete this.moments[MomentName];
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

            const existingScope = cancelScopes.get(this[ScopeId]);

            // if we don't have a scope this request is not using Cancelable so we do nothing
            if (objectDefinedNotNull(existingScope)) {

                if (!isArray(existingScope.actions)) {
                    existingScope.actions = [];
                }

                if (existingScope.actions.indexOf(action) < 0) {
                    existingScope.actions.push(action);
                }
            }

            return args;
        });

        return instance;
    };
}

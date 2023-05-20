import { broadcast, lifecycle } from "./moments.js";
import { objectDefinedNotNull, isArray, isFunc } from "./util.js";

/**
 * Represents an observer that does not affect the timeline
 */
export type ObserverAction = (this: Timeline<any>, ...args: any[]) => void;

/**
 * Represents an observer with side effects within the timeline
 */
export type ObserverFunction<R = any> = (this: Timeline<any>, ...args: any[]) => Promise<R>;

/**
 * Defines the set of all valid observer types
 */
export type ValidObserver = ObserverAction | ObserverFunction;

/**
 * The set of moments that make up a timeline
 */
export type Moments = Record<string, (this: Timeline<any>, handlers: ValidObserver[], ...args: any[]) => void>;

/**
 * Represents the collection of observers
 */
export type ObserverCollection = Record<string, ValidObserver[]>;

/**
 * A type used to represent the proxied Timeline.on property
 */
type DistributeOn<T extends Moments, R extends Moments = T> =
    { [Prop in string & keyof T]: {
        (handler: Parameters<T[Prop]>[0][number]): Timeline<R>;
        toArray(): Parameters<T[Prop]>[0][number][];
        replace(handler: Parameters<T[Prop]>[0][number]): Timeline<R>;
        prepend(handler: Parameters<T[Prop]>[0][number]): Timeline<R>;
        clear(): boolean;
    }
    };

/**
 * A type used to represent the proxied Timeline.emit property
 */
type DistributeEmit<T extends Moments> =
    { [Prop in string & keyof T]: (...args: Parameters<Parameters<T[Prop]>[0][number]>) => ReturnType<Parameters<T[Prop]>[0][number]> };

/**
 * Virtual events that are present on all Timelines
 */
type DefaultTimelineMoments<T extends Moments> = {
    init: (observers: ((this: Timeline<T>) => void)[], ...args: any[]) => void;
    dispose: (observers: ((this: Timeline<T>) => void)[], ...args: any[]) => void;
    log: (observers: ((this: Timeline<T>, message: string, level: number) => void)[], ...args: any[]) => void;
    error: (observers: ((this: Timeline<T>, err: string | Error) => void)[], ...args: any[]) => void;
};

/**
 * The type combining the defined moments and DefaultTimelineEvents
 */
type OnProxyType<T extends Moments> = DistributeOn<T> & DistributeOn<DefaultTimelineMoments<T>, T>;

/**
 * The type combining the defined moments and DefaultTimelineEvents
 */
type EmitProxyType<T extends Moments> = DistributeEmit<T> & DistributeEmit<DefaultTimelineMoments<T>>;

/**
 * Represents a function accepting and returning a timeline, possibly manipulating the observers present
 */
export type TimelinePipe<T extends Timeline<any> = any> = (intance: T) => T;

/**
 * Field name to hold any flags on observer functions used to modify their behavior
 */
const flags = Symbol.for("ObserverLifecycleFlags");

/**
 * Bitwise flags to indicate modified behavior
 */
const enum ObserverLifecycleFlags {
    // eslint-disable-next-line no-bitwise
    noInherit = 1 << 0,
    // eslint-disable-next-line no-bitwise
    once = 1 << 1,
}

/**
 * Creates a filter function for use in Array.filter that will filter OUT any observers with the specified [flag]
 *
 * @param flag The flag used to exclude observers
 * @returns An Array.filter function
 */
// eslint-disable-next-line no-bitwise
const byFlag = (flag: ObserverLifecycleFlags) => ((observer) => !((observer[flags] || 0) & flag));

/**
 * Creates an observer lifecycle modification flag application function
 * @param flag The flag to the bound function should add
 * @returns A function that can be used to apply [flag] to any valid observer
 */
const addFlag = (flag: ObserverLifecycleFlags) => (<T extends ValidObserver>(observer: T): T => {
    // eslint-disable-next-line no-bitwise
    observer[flags] = (observer[flags] || 0) | flag;
    return observer;
});

/**
 * Observer lifecycle modifier that indicates this observer should NOT be inherited by any child
 * timelines.
 */
export const noInherit = addFlag(ObserverLifecycleFlags.noInherit);

/**
 * Observer lifecycle modifier that indicates this observer should only fire once per instance, it is then removed.
 *
 * Note: If you have a parent and child timeline "once" will affect both and the observer will fire once for a parent lifecycle
 * and once for a child lifecycle
 */
export const once = addFlag(ObserverLifecycleFlags.once);

/**
 * Timeline represents a set of operations executed in order of definition,
 * with each moment's behavior controlled by the implementing function
 */
export abstract class Timeline<T extends Moments> {

    private _onProxy: typeof Proxy | null = null;
    private _emitProxy: typeof Proxy | null = null;
    protected _inheritingObservers: boolean;

    /**
     * Creates a new instance of Timeline with the supplied moments and optionally any observers to include
     *
     * @param moments The moment object defining this timeline
     * @param observers Any observers to include (optional)
     */
    constructor(protected readonly moments: T, protected observers: ObserverCollection = {}) {
        this._inheritingObservers = true;
    }

    /**
     * Apply the supplied behavior(s) to this timeline
     *
     * @param behaviors One or more behaviors
     * @returns `this` Timeline
     */
    public using(...behaviors: TimelinePipe[]): this {

        for (let i = 0; i < behaviors.length; i++) {
            behaviors[i](this);
        }

        return this;
    }

    /**
     * Property allowing access to manage observers on moments within this timeline
     */
    public get on(): OnProxyType<T> {

        if (this._onProxy === null) {

            this._onProxy = new Proxy(this, {
                get: (target: any, p: string) => Object.assign((handler: ValidObserver) => {

                    target.cloneObserversOnChange();
                    addObserver(target.observers, p, handler, "add");
                    return target;

                }, {
                    toArray: (): ValidObserver[] => {
                        return Reflect.has(target.observers, p) ? [...Reflect.get(target.observers, p)] : [];
                    },
                    replace: (handler: ValidObserver) => {

                        target.cloneObserversOnChange();
                        addObserver(target.observers, p, handler, "replace");
                        return target;
                    },
                    prepend: (handler: ValidObserver) => {

                        target.cloneObserversOnChange();
                        addObserver(target.observers, p, handler, "prepend");
                        return target;
                    },
                    clear: (): boolean => {

                        if (Reflect.has(target.observers, p)) {
                            target.cloneObserversOnChange();
                            // we trust ourselves that this will be an array
                            (<ObserverCollection>target.observers)[p].length = 0;
                            return true;
                        }

                        return false;
                    },
                }),
            });
        }

        return <any>this._onProxy;
    }

    /**
     * Shorthand method to emit a logging event tied to this timeline
     *
     * @param message The message to log
     * @param level The level at which the message applies
     */
    public log(message: string, level = 0): void {
        this.emit.log(message, level);
    }

    /**
     * Shorthand method to emit an error event tied to this timeline
     *
     * @param e Optional. Any error object to emit. If none is provided no emit occurs
     */
    protected error(e?: any): void {
        if (objectDefinedNotNull(e)) {
            this.emit.error(e);
        }
    }

    /**
     * Property allowing access to invoke a moment from within this timeline
     */
    protected get emit(): EmitProxyType<T> {

        if (this._emitProxy === null) {

            this._emitProxy = new Proxy(this, {

                get: (target: any, p: string) => (...args: any[]) => {

                    // handle the case where no observers registered for the target moment
                    const observers = Reflect.has(target.observers, p) ? Reflect.get(target.observers, p) : [];

                    if ((!isArray(observers) || observers.length < 1) && p === "error") {

                        // if we are emitting an error, and no error observers are defined, we throw
                        throw Error(`Unhandled Exception: ${args[0]}`);
                    }

                    try {

                        // default to broadcasting any events without specific impl (will apply to log and error)
                        const moment = Reflect.has(target.moments, p) ? Reflect.get(target.moments, p) : p === "init" || p === "dispose" ? lifecycle() : broadcast();

                        // pass control to the individual moment's implementation
                        return Reflect.apply(moment, target, [observers, ...args]);

                    } catch (e) {

                        if (p !== "error") {

                            this.error(e);

                        } else {

                            // if all else fails, re-throw as we are getting errors from error observers meaning something is sideways
                            throw e;
                        }

                    } finally {

                        // here we need to remove any "once" observers
                        if (observers && observers.length > 0) {
                            Reflect.set(target.observers, p, observers.filter(byFlag(ObserverLifecycleFlags.once)));
                        }
                    }
                },
            });
        }

        return <any>this._emitProxy;
    }

    /**
     * Starts a timeline
     *
     * @description This method first emits "init" to allow for any needed initial conditions then calls execute with any supplied init
     *
     * @param init A value passed into the execute logic from the initiator of the timeline
     * @returns The result of this.execute
     */
    protected start(init?: any): Promise<any> {

        // initialize our timeline
        this.emit.init();

        // get a ref to the promise returned by execute
        const p = this.execute(init);

        // attach our dispose logic
        p.finally(() => {

            try {

                // provide an opportunity for cleanup of the timeline
                this.emit.dispose();

            } catch (e) {

                // shouldn't happen, but possible dispose throws - which may be missed as the usercode await will have resolved.
                const e2 = Object.assign(Error("Error in dispose."), {
                    innerException: e,
                });

                this.error(e2);
            }
        }).catch(() => void (0));

        // give the promise back to the caller
        return p;
    }

    /**
     * Method orchestrating the emit calls for the moments defined in inheriting classes
     *
     * @param init A value passed into start from the initiator of the timeline
     */
    protected abstract execute(init?: any): Promise<any>;

    /**
     * By default a timeline references the same observer collection as a parent timeline,
     * if any changes are made to the observers this method first clones them ensuring we
     * maintain a local copy and de-ref the parent
     */
    protected cloneObserversOnChange() {
        if (this._inheritingObservers) {
            this._inheritingObservers = false;
            this.observers = cloneObserverCollection(this.observers);
        }
    }
}

/**
 * Adds an observer to a given target
 *
 * @param target The object to which events are registered
 * @param moment The name of the moment to which the observer is registered
 * @param addBehavior Determines how the observer is added to the collection
 *
 */
function addObserver(target: Record<string, any>, moment: string, observer: ValidObserver, addBehavior: "add" | "replace" | "prepend"): any[] {

    if (!isFunc(observer)) {
        throw Error("Observers must be functions.");
    }

    if (!Reflect.has(target, moment)) {

        // if we don't have a registration for this moment, then we just add a new prop
        target[moment] = [observer];

    } else {

        // if we have an existing property then we follow the specified behavior
        switch (addBehavior) {
            case "add":
                target[moment].push(observer);
                break;
            case "prepend":
                target[moment].unshift(observer);
                break;
            case "replace":
                target[moment].length = 0;
                target[moment].push(observer);
                break;
        }
    }

    return target[moment];
}

export function cloneObserverCollection(source: ObserverCollection): ObserverCollection {

    return Reflect.ownKeys(source).reduce((clone: ObserverCollection, key: string) => {

        // eslint-disable-next-line no-bitwise
        clone[key] = [...source[key].filter(byFlag(ObserverLifecycleFlags.noInherit))];

        return clone;
    }, {});
}

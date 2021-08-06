import { broadcast, init } from "./moments.js";
import { addObserver } from "./utils.js";
import { objectDefinedNotNull, isArray } from "../util.js";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloneDeep = require("lodash.clonedeep");

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
type DefaultTimelineEvents<T extends Moments> = {
    init: (observers: ((this: Timeline<T>) => Timeline<T>)[], ...args: any[]) => void;
    dispose: (observers: ((this: Timeline<T>) => Timeline<T>)[], ...args: any[]) => void;
    log: (observers: ((this: Timeline<T>, message: string, level: number) => void)[], ...args: any[]) => void;
    error: (observers: ((this: Timeline<T>, err: string | Error) => void)[], ...args: any[]) => void;
};

/**
 * The type combining the defined moments and DefaultTimelineEvents
 */
type OnProxyType<T extends Moments> = DistributeOn<T> & DistributeOn<DefaultTimelineEvents<T>, T>;

/**
 * The type combining the defined moments and DefaultTimelineEvents
 */
type EmitProxyType<T extends Moments> = DistributeEmit<T> & DistributeEmit<DefaultTimelineEvents<T>>;

/**
 * Timeline represents a set of operations executed in order of definition,
 * with each moment's behavior controlled by the implementing function
 */
export abstract class Timeline<T extends Moments> {

    private _inheritingObservers: boolean;
    private _parentObservers: ObserverCollection;
    private _onProxy: typeof Proxy | null = null;
    private _emitProxy: typeof Proxy | null = null;

    constructor(protected readonly moments: T, protected observers?: ObserverCollection, protected state: Record<symbol, any> = {}) {

        // TODO:: this work isn't correct
        if (objectDefinedNotNull(this.observers)) {
            this._inheritingObservers = true;
        } else {
            this._inheritingObservers = false;
            this.observers = {};
        }
    }

    /**
     * Property allowing access to subscribe observers to all the moments within this timeline
     */
    public get on(): OnProxyType<T> {

        if (this._onProxy === null) {

            this._onProxy = new Proxy(this, {
                get: (target: any, p: string) => Object.assign((handler: ValidObserver) => {

                    // TODO:: we need better logic here depending on how objects are constructed
                    if (this._inheritingObservers) {
                        // ONLY clone the observers the first time this instance of timeline sets an observer
                        // this should work all up and down the tree.
                        this._parentObservers = target.observers;
                        target.observers = cloneDeep(target.observers);
                        this._inheritingObservers = false;
                    }

                    addObserver(target.observers, p, handler, "add");
                    return target;

                }, {
                    toArray: (): ValidObserver[] => {
                        return Reflect.has(target.observers, p) ? cloneDeep(Reflect.get(target.observers, p)) : [];
                    },
                    replace: (handler: ValidObserver) => {
                        addObserver(target.observers, p, handler, "replace");
                        return target;
                    },
                    prepend: (handler: ValidObserver) => {
                        addObserver(target.observers, p, handler, "prepend");
                        return target;
                    },
                    clear: (): boolean => {

                        if (Reflect.has(target.observers, p)) {
                            // we trust outselves that this will be an array
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
    public log(message: string, level: number): void {
        this.emit.log(message, level);
    }

    // TODO:: WIP to correctly enable this capability
    public resetObservers(): void {
        if (!this._inheritingObservers && objectDefinedNotNull(this._parentObservers)) {
            this.observers = this._parentObservers;
            this._inheritingObservers = true;
            this._parentObservers = null;
        }
    }

    /**
     * Shorthand method to emit a dispose event tied to this timeline
     *
     */
    protected dispose(): void {
        this.emit.dispose();
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
     * Shorthand method to emit an init event tied to this timeline
     *
     */
    protected init(): void {
        this.emit.init();
    }

    /**
     * Property allowing access to invoke a moment from within this timeline
     */
    protected get emit(): EmitProxyType<T> {

        if (this._emitProxy === null) {
            this._emitProxy = new Proxy(this, {
                get: (target: any, p: string) => (...args: any[]) => {

                    // handle the case there are no observers registered to the target
                    const observers = Reflect.has(target.observers, p) ? Reflect.get(target.observers, p) : [];

                    if (p === "error" && (!isArray(observers) || observers.length < 1)) {

                        // if we are emitting an error, and no error observers are defined, we throw
                        throw Error(`Unhandled Exception: ${args[0]}`);
                    }

                    try {

                        // default to broadcasting any events without specific impl (will apply to log and error as well)
                        const moment = Reflect.has(target.moments, p) ? Reflect.get(target.moments, p) : p === "init" ? init() : broadcast();

                        return Reflect.apply(moment, target, [observers, ...args]);

                    } catch (e) {

                        if (p !== "error") {

                            this.error(e);

                        } else {

                            // if all else fails, re-throw as we are getting errors out of error observers meaning someting is sideways
                            throw e;
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

        try {

            // TODO:: should we somehow create a copy of "this" so that any modifications (extensions, whatever)
            // are left only to each execution of start vs. running it twice init is called twice and things could be double extended etc.

            // initialize our timeline
            this.init();

            // execute the timeline
            return this.execute(init);

        } catch (e) {

            this.error(e);

        } finally {

            try {

                this.dispose();

            } catch (e) {

                const e2 = Object.assign(Error("Error in dispose."), {
                    innerException: e,
                });

                this.error(e2);
            }
        }
    }

    /**
     * Method orchestrating the emit calls for the moments defined in inheriting classes
     *
     * @param init A value passed into start from the initiator of the timeline
     */
    protected abstract execute(init?: any): Promise<any>;
}

import { LogLevel } from "@pnp/logging";
import { isArray, isFunc } from "@pnp/common";
import { broadcast } from "./moments.js";

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
 * A type used to represent the proxied Timeline.on property
 */
type DistributeOn<T extends Moments> =
    { [Prop in string & keyof T]: (handlers: Parameters<T[Prop]>[0][number], prepend?: boolean) => ReturnType<Parameters<T[Prop]>[0][number]> };

/**
 * A type used to represent the proxied Timeline.emit property
 */
type DistributeEmit<T extends Moments> =
    { [Prop in string & keyof T]: (...args: Parameters<Parameters<T[Prop]>[0][number]>) => ReturnType<Parameters<T[Prop]>[0][number]> };

/**
 * Virtual events that are present on all Timelines
 */
export type DefaultTimelineEvents = {
    log: (observers: ((this: Timeline<any>, message: string, level: LogLevel) => void)[], ...args: any[]) => void;
    error: (observers: ((this: Timeline<any>, err: string | Error) => void)[], ...args: any[]) => void;
};

/**
 * The type combining the defined moments and DefaultTimelineEvents
 */
export type OnProxyType<T extends Moments> = DistributeOn<T> & DistributeOn<DefaultTimelineEvents>;

/**
 * The type combining the defined moments and DefaultTimelineEvents
 */
export type EmitProxyType<T extends Moments> = DistributeEmit<T> & DistributeEmit<DefaultTimelineEvents>;

/**
 * Timeline represents a set of operations executed in order of definition,
 * with each "moment's" behavior controlled by the implementing function
 */
export abstract class Timeline<T extends Moments> {

    private _onProxy: typeof Proxy | null = null;
    private _emitProxy: typeof Proxy | null = null;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    constructor(private readonly moments: T, private observers = {}) { }

    /**
     * Property allowing access to subscribe observers to all the moments within this timline
     */
    public get on(): OnProxyType<T> {

        if (this._onProxy === null) {
            this._onProxy = new Proxy(this, {
                get: (target: any, p: string) => (handler, prepend = false) => {
                    return addObserver(target.observers, p, handler, prepend);
                },
            });
        }

        return <any>this._onProxy;
    }

    /**
     * Shorthand method to emit a logging event tied to this timeline
     *
     * @param message The message to log
     * @param level The level at which the message applies (default: LogLevel.Info)
     */
    public log(message: string, level: LogLevel = LogLevel.Info): void {
        this.emit.log(message, level);
    }

    /**
     * Shorthand method to emit an error tied to this timeline
     *
     * @param err The error details to emit
     */
    public error(err: string | Error): void {
        this.emit.error(err);
    }

    /**
     * Property allowing access to invoke a moment from within this timeline
     */
    public get emit(): EmitProxyType<T> {

        if (this._emitProxy === null) {
            this._emitProxy = new Proxy(this, {
                get: (target: any, p: string) => (...args: any[]) => {

                    const observers = Reflect.get(target.observers, p);

                    if (isArray(observers) && observers.length > 0) {

                        // default to broadcasting any events without specific impl (will apply to defaults)
                        const moment = Reflect.has(target.moments, p) ? Reflect.get(target.moments, p) : broadcast();

                        return Reflect.apply(moment, this, [observers, ...args]);

                    } else if (p === "error") {

                        // if we are emitting an error, and no error observers are defined, we throw
                        throw Error(`Unhandled Exception: ${args[0]}`);
                    }
                },
            });
        }

        return <any>this._emitProxy;
    }

    /**
     * When implemented by an instance of Timeline orchestrates the moments within the timeline
     */
    protected abstract start(): Promise<void>;
}

/**
 * Adds an observer to a given target
 *
 * @param target The object to which events are registered
 * @param moment The name of the moment to which the observer is registered
 * @param prepend If true the observer is prepended to the collection (default: false)
 *
 */
function addObserver(target: Record<string, any>, moment: string, observer: ValidObserver, prepend = false): any[] {

    if (!isFunc(observer)) {
        throw Error("Observers must be functions.");
    }

    if (!Reflect.has(target, moment)) {
        Reflect.defineProperty(target, moment, {
            value: [observer],
            configurable: true,
            enumerable: true,
            writable: true,
        });
    } else {

        if (prepend) {
            target[moment].unshift(observer);
        } else {
            target[moment].push(observer);
        }
    }

    return target[moment];
}

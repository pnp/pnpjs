import { isArray, isFunc } from "@pnp/common";
import { LogLevel } from "@pnp/logging";


export type ObserverAction = (this: _Timeline<any>, ...args: any[]) => void;

export type ObserverFunction<R = any> = (this: _Timeline<any>, ...args: any[]) => Promise<R>;

export type ValidObservers = ObserverAction | ObserverFunction;

export type Moments = Record<string, (this: _Timeline<any>, handlers: ValidObservers[], ...args: any[]) => void>;

type DistributeOn<T extends Moments> =
    { [Prop in string & keyof T]: (handlers: Parameters<T[Prop]>[0][number], prepend?: boolean) => ReturnType<Parameters<T[Prop]>[0][number]> };

type DistributeEmit<T extends Moments> =
    { [Prop in string & keyof T]: (...args: Parameters<Parameters<T[Prop]>[0][number]>) => ReturnType<Parameters<T[Prop]>[0][number]> };

/**
 * Virtual events that are present on all Timelines
 */
export type DefaultTimelineEvents = {
    log: (observers: ((this: _Timeline<any>, message: string, level: LogLevel) => void)[], ...args: any[]) => void;
    error: (observers: ((this: _Timeline<any>, err: string | Error) => void)[], ...args: any[]) => void;
};

export type OnProxyType<T extends Moments> = DistributeOn<T> & DistributeOn<DefaultTimelineEvents>;

export type EmitProxyType<T extends Moments> = DistributeEmit<T> & DistributeEmit<DefaultTimelineEvents>;





export function Timeline<T extends Moments>(moments: T): _Timeline<T> {
    return new _Timeline<T>(moments);
}

export class _Timeline<T extends Moments> {

    private _onProxy: typeof Proxy | null = null;
    private _emitProxy: typeof Proxy | null = null;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    constructor(private readonly moments: T, private observers = {}) { }

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

    public get emit(): EmitProxyType<T> {

        if (this._emitProxy === null) {
            this._emitProxy = new Proxy(this, {
                get: (target: any, p: string) => (...args: any[]) => {

                    const observers = Reflect.get(target.observers, p);

                    if (isArray(observers) && observers.length > 0) {

                        // default to broadcasting any events without specific impl (will apply to defaults)
                        const moment = Reflect.has(target.moments, p) ? Reflect.get(target.moments, p) : broadcast();

                        return Reflect.apply(moment, this, [observers, ...args]);
                    }
                },
            });
        }

        return <any>this._emitProxy;
    }

    public log(message: string, level: LogLevel = LogLevel.Info): void {
        this.emit.log(message, level);
    }

    public error(err: string | Error): void {
        this.emit.error(err);
    }
}

export function broadcast<T extends ObserverAction>(): (handlers: T[], ...args: any[]) => void {

    return function (handlers: T[], ...args: any[]): void {

        for (let i = 0; i < handlers.length; i++) {
            try {
                Reflect.apply(handlers[i], this, args);
            } catch (e) {
                this.error(e);
            }
        }
    };
}

export function asyncReduce<T extends ObserverFunction<[...Parameters<T>]>>(): (handlers: T[], ...args: [...Parameters<T>]) => Promise<[...Parameters<T>]> {

    return async function (handlers: T[], ...args: [...Parameters<T>]): Promise<[...Parameters<T>]> {

        // get our intial values
        let r = args;

        // process each handler which updates our "state" in order
        // returning the new "state" as a tuple [...Parameters<T>]
        for (let i = 0; i < handlers.length; i++) {

            try {
                r = await Reflect.apply(handlers[i], this, r);
            } catch (e) {
                this.error(e);
            }
        }

        return r;
    };
}

function addObserver(target: Record<string, any>, moment: string, observer: ValidObservers | ObserverFunction, prepend = false): any[] {

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

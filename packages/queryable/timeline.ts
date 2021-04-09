import { isArray, isFunc } from "@pnp/common";
import { LogLevel } from "@pnp/logging";


export type ObserverThis<F extends (...args: any[]) => any, T = Pick<_Timeline<any>, "error" | "log">> = (this: T, ...args: Parameters<F>) => ReturnType<F>;

export type ObserverAction = ObserverThis<(...args: any[]) => void>;

export type ObserverFunction = ObserverThis<(...args: any[]) => Promise<any>>;

export type ValidObservers = ObserverAction | ObserverFunction;

export type Moments = Record<string, (this: _Timeline<any>, handlers: ValidObservers[], ...args: any[]) => void>;

type DistributeOn<T extends Moments> = { [Prop in string & keyof T]: (handler: Parameters<T[Prop]>[0][number], prepend?: boolean) => ReturnType<Parameters<T[Prop]>[0][number]> };

type DistributeEmit<T extends Moments> = { [Prop in string & keyof T]: (...args: Parameters<Parameters<T[Prop]>[0][number]>) => ReturnType<Parameters<T[Prop]>[0][number]> };

/**
 * Virtual events that are present on all Timelines
 */
export type DefaultTimelineEvents = {
    log: (observers: ObserverThis<(message: string, level: LogLevel) => void>[], ...args: any[]) => void;
    error: (observers: ObserverThis<(err: string | Error) => void>[], ...args: any[]) => void;
};

export type OnProxyType<T extends Moments> = DistributeOn<T> & DistributeOn<DefaultTimelineEvents>;

export type EmitProxyType<T extends Moments> = DistributeEmit<T> & DistributeEmit<DefaultTimelineEvents>;








export function Timeline<T extends Moments>(moments: T): _Timeline<T> {
    return new _Timeline<T>(moments);
}

class _Timeline<T extends Moments> {

    private _onProxy: typeof Proxy | null = null;
    private _emitProxy: typeof Proxy | null = null;

    constructor(private readonly moments: T, private observers = {}) { }

    public get on(): OnProxyType<T> {

        if (this._onProxy === null) {
            this._onProxy = new Proxy(this.observers, {
                get: (target: any, p: string) => (handler, prepend = false) => {
                    return addObserver(target, p, handler, prepend);
                },
            });
        }

        return <any>this._onProxy;
    }

    public get emit(): EmitProxyType<T> {

        if (this._emitProxy === null) {
            this._emitProxy = new Proxy(this.observers, {
                get: (target: any, p: string) => (...args: any[]) => {
                    const moment = Reflect.get(this.moments, p);
                    const observers = Reflect.get(target, p);
                    return Reflect.apply(moment, this, [observers, ...args]);
                },
            });
        }

        return <any>this._emitProxy;
    }

    public log(message: string) {
        console.log(`timeline log: ${message}`);
    }

    public error(err: string | Error) {

        if (err instanceof Error) {
            throw err;
        }

        throw Error(err);
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

export function asyncReduce<T extends ObserverFunction>(): (handlers: T[], ...args: any[]) => Promise<ReturnType<T>> {

    return async function (handlers: T[], ...args: any[]): Promise<ReturnType<T>> {

        let r: ReturnType<T> = undefined;

        for (let i = 0; i < handlers.length; i++) {

            try {
                r = await Reflect.apply(handlers[i], this, args);
            } catch (e) {
                this.error(e);
            }
        }

        return r;
    };
}

function addObserver(target: Record<string, any>, moment: string, observer: ValidObservers | ObserverFunction, prepend = false): any[] {

    if (!isFunc(observer)) {
        throw Error("Event handlers must be functions.");
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

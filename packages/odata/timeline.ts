import { isArray, isFunc } from "@pnp/common";
import { LogLevel } from "@pnp/logging";

export interface Context {
    // timeline: Timeline<T>;
    observers: ValidObservers;
    // emit(moment: string, ...args: any[]): void | Context | Promise<Context>;
    log: (message: string, level: LogLevel) => void;
    error: (err: string | Error) => void;
}

function addObserver(target: ObserverRecord, moment: string, observer: ValidObservers | ObserverFunction, prepend = false): any[] {

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

export type ObserverAction = (this: any, ...args: any[]) => void;

export type ObserverFunction = (this: any, ...args: any[]) => Promise<any>;

export type ValidObservers = ObserverAction | ObserverFunction;

export type ObserverRecord = Record<string, any>;

export type MomentImpl = (this: Timeline<Moments>, handlers: ValidObservers[], ...args: any[]) => void;

export type Moments = Record<string, MomentImpl>;

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

export function CreateTimeline<T extends Moments>(moments: T): Timeline<T> {
    return new Timeline(moments);
}

export type DefaultTimelineEvents = {
    log: (observers: ((message: string, level: LogLevel) => void)[], ...args: any[]) => void;
    error: (observers: ((err: string | Error) => void)[], ...args: any[]) => void;
};

type DistributeOn<T extends Moments> = { [Prop in string & keyof T]: (handler: Parameters<T[Prop]>[0][number], prepend?: boolean) => ReturnType<Parameters<T[Prop]>[0][number]> };

type DistributeEmit<T extends Moments> = { [Prop in string & keyof T]: (...args: Parameters<Parameters<T[Prop]>[0][number]>) => ReturnType<Parameters<T[Prop]>[0][number]> };

export type OnProxyType<T extends Moments> = DistributeOn<T & DefaultTimelineEvents>;

export type EmitProxyType<T extends Moments> = DistributeEmit<T> & DistributeEmit<DefaultTimelineEvents>;

export class Timeline<T extends Moments> {

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

    protected get emit(): EmitProxyType<T> {

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
        console.log(`log: ${message}`);
    }

    public error(handler: (err: string | Error) => void) {
        addObserver(this, "error", handler);
    }

    // public async run(): Promise<any> {


    //     // create our initial context
    //     const ctx = {};

    //     // these represent all the moments
    //     const keys = Reflect.ownKeys(this.moments);

    //     for (let i = 0; i < keys.length; i++) {

    //         const momentDef = Reflect.get(this.moments, keys[i]);

    //         if (isFunc(momentDef)) {
    //             throw Error(`Moments must be defined by functions. Moment definition found for key '${String(keys[i])} is not valid.'`);
    //         }

    //         if (!Reflect.has(this.observers, keys[i])) {
    //             // we have nothing to do for this moment as there are not registered observers
    //             continue;
    //         }

    //         // we need to pick off the observers for this moment
    //         const observers = Reflect.get(this.observers, keys[i]);

    //         if (isArray(observers)) {
    //             momentDef(ctx, observers);
    //         }
    //     }



    // // const ctx: TimelineCtx<T> = yield this.getCtx();

    // function* marty(moments: T, observers: ) {



    // }

    // const g = marty(this.moments, this.observers);

    // function* getPage(pageSize = 1, list) {
    //     let output = [];
    //     let index = 0;

    //     while (index < list.length) {
    //         output = [];
    //         for (let i = index; i < index + pageSize; i++) {
    //             if (list[i]) {
    //                 output.push(list[i]);
    //             }
    //         }

    //         yield output;
    //         index += pageSize;
    //     }
    // }



    // function* gen() {
    //   while (true) {
    //     let value = yield null;
    //     console.log(value);
    //   }
    // }

    // const g = gen();
    // g.next(1);
    // // "{ value: null, done: false }"
    // g.next(2);
    // // 2
    // // "{ value: null, done: false }"

    // generator for each event in order

    //

    // let selfCheckInLI = new SelfCheckInLI();

    //   Object.getOwnPropertyNames(selfCheckInLI).forEach(prop => {

    //     if (this.JSONFIELDS.indexOf(prop) > -1) {

    //       selfCheckInLI[prop] = JSON.stringify(checkIn[`${prop}Value`]);

    //     } else {

    //       selfCheckInLI[prop] = checkIn[prop];

    //     }

    //   });
}

// private getCtx(): TimelineContext<T> {
//     return {
//         timeline: this,
//     };
// }



// public sync(event: string, ...args: any[]): boolean {

//     const handlers = this._events[event];
//     if (!isArray(handlers) || handlers.length < 1) {

//         if (event === "error") {
//             if (args.length > 0 && args[0] instanceof Error) {
//                 throw args[0]; // Unhandled exception
//             } else {
//                 throw Error("Unhandled Exception");
//             }
//         }

//         return false;
//     }

//     const handlersCopy = [...handlers];

//     for (let i = 0; i < handlersCopy.length; i++) {
//         Reflect.apply(handlersCopy[i], this, args);
//     }

//     return true;
// }

// think of the context as thing moving through time defining and being modified by its experiences during the request
// each encounter with a handler
// support sp.on.pre(handler: () =>)
// sp.on.error(handler: )
// sp.web.on.error(handler: )

// all children inherit

// public async async(event: string, ...args: any[]): Promise<any> {

//     const handlers = this._events[event];
//     if (!isArray(handlers) || handlers.length < 1) {
//         return false;
//     }

//     const handlersCopy = [...handlers];

//     for (let i = 0; i < handlersCopy.length; i++) {
//         const c = await Reflect.apply(handlersCopy[i], this, args);
//         if (!c) {
//             break;
//         }
//     }

//     return true;
// }

//     public prependListener(event: string, handler: (...args: any[]) => any): void {
//     addListener(this._events, event, handler, true);
// }

//     public clear(event: string): ((...args: any[]) => any)[] {
//     const handlers = this._events[event];
//     this._events[event].length = 0;
//     return handlers;
// }

//     public static From(emitter: Timeline): Timeline {
//     return new Timeline(emitter._events);
// }

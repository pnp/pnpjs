import { isArray } from "@pnp/common";
import { ObserverAction, ObserverFunction, Timeline } from "./timeline.js";

export function broadcast<T extends ObserverAction>(): (observers: T[], ...args: any[]) => void {

    return function (observers: T[], ...args: any[]): void {

        const obs = [...observers];

        for (let i = 0; i < obs.length; i++) {
            Reflect.apply(obs[i], this, args);
        }
    };
}

export function asyncReduce<T extends ObserverFunction<[...Parameters<T>]>>(): (observers: T[], ...args: [...Parameters<T>]) => Promise<[...Parameters<T>]> {

    return async function (this: Timeline<any>, observers: T[], ...args: [...Parameters<T>]): Promise<[...Parameters<T>]> {

        // get our initial values
        let r = args;

        const obs = [...observers];

        // process each handler which updates our "state" in order
        // returning the new "state" as a tuple [...Parameters<T>]
        for (let i = 0; i < obs.length; i++) {
            r = await Reflect.apply(obs[i], this, r);
        }

        return r;
    };
}

export function request<T extends ObserverFunction>(): (observers: T[], ...args: [...Parameters<T>]) => ReturnType<T> {

    // here we expect our observers to produce a result given the set of arguments
    // TODO:: if more than one handler is registered, what do we do? Take the first? Take the last?

    return <any>function (this: Timeline<any>, observers: T[], ...args: [...Parameters<T>]): Promise<any> {

        if (!isArray(observers) || observers.length < 1) {
            return undefined;
        }

        const handler = observers[0];

        return Reflect.apply(handler, this, args);
    };
}

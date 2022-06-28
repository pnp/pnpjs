import { ObserverAction, ObserverFunction, Timeline } from "./timeline.js";
import { isArray } from "./util.js";

/**
 * Emits to all registered observers the supplied arguments. Any values returned by the observers are ignored
 *
 * @returns void
 */
export function broadcast<T extends ObserverAction>(): (observers: T[], ...args: any[]) => void {

    return function (observers: T[], ...args: any[]): void {

        const obs = [...observers];

        for (let i = 0; i < obs.length; i++) {
            Reflect.apply(obs[i], this, args);
        }
    };
}

/**
 * Defines a moment that executes each observer asynchronously in parallel awaiting all promises to resolve or reject before continuing
 *
 * @returns The final set of arguments
 */
export function asyncBroadcast<T extends ObserverFunction<void>>(): (observers: T[], ...args: [...Parameters<T>]) => Promise<any[]> {

    return async function (this: Timeline<any>, observers: T[], ...args: [...Parameters<T>]): Promise<any[]> {

        // get our initial values
        const r = args;

        const obs = [...observers];

        const promises = [];

        // process each handler which updates our "state" in order
        for (let i = 0; i < obs.length; i++) {
            promises.push(Reflect.apply(obs[i], this, r));
        }

        return Promise.all(promises);
    };
}


/**
 * Defines a moment that executes each observer synchronously, passing the returned arguments as the arguments to the next observer.
 * This is very much like the redux pattern taking the arguments as the state which each observer may modify then returning a new state
 *
 * @returns The final set of arguments
 */
export function reduce<T extends ObserverFunction<[...Parameters<T>]>>(): (observers: T[], ...args: [...Parameters<T>]) => [...Parameters<T>] {

    return function (this: Timeline<any>, observers: T[], ...args: [...Parameters<T>]): [...Parameters<T>] {

        // get our initial values
        let r = args;

        const obs = [...observers];

        // process each handler which updates our "state" in order
        // returning the new "state" as a tuple [...Parameters<T>]
        for (let i = 0; i < obs.length; i++) {
            r = Reflect.apply(obs[i], this, r);
        }

        return r;
    };
}

/**
 * Defines a moment that executes each observer asynchronously, awaiting the result and passes the returned arguments as the arguments to the next observer.
 * This is very much like the redux pattern taking the arguments as the state which each observer may modify then returning a new state
 *
 * @returns The final set of arguments
 */
export function asyncReduce<T extends ObserverFunction<[...Parameters<T>]>>(): (observers: T[], ...args: [...Parameters<T>]) => Promise<[...Parameters<T>]> {

    return async function (this: Timeline<any>, observers: T[], ...args: [...Parameters<T>]): Promise<[...Parameters<T>]> {

        // get our initial values
        let r = args;

        const obs = [...observers];

        // process each handler which updates our "state" in order
        // returning the new "state" as a tuple [...Parameters<T>]
        // this is conceptually the redux pattern, each function gets a copy of the
        // previous state, may optionally modify it, and return a new state
        for (let i = 0; i < obs.length; i++) {
            r = await Reflect.apply(obs[i], this, r);
        }

        return r;
    };
}

/**
 * Defines a moment where the first registered observer is used to asynchronously execute a request, returning a single result
 * If no result is returned (undefined) no further action is taken and the result will be undefined (i.e. additional observers are not used)
 *
 * @returns The result returned by the first registered observer
 */
export function request<T extends ObserverFunction>(): (observers: T[], ...args: [...Parameters<T>]) => Promise<ReturnType<T>> {

    return async function (this: Timeline<any>, observers: T[], ...args: [...Parameters<T>]): Promise<ReturnType<T>> {

        if (!isArray(observers) || observers.length < 1) {
            return undefined;
        }

        const handler = observers[0];

        const result = await Reflect.apply(handler, this, args);

        return result;
    };
}

/**
 * Defines a special moment used to configure the timeline itself before starting. Each observer is executed in order,
 * possibly modifying the "this" instance, with the final product returned
 *
 */
export function lifecycle<T extends ObserverAction>(): (observers: T[], ...args: [...Parameters<T>]) => Timeline<any> {

    return function (this: Timeline<any>, observers: T[], ...args: [...Parameters<T>]): Timeline<any> {

        const obs = [...observers];

        // process each handler which updates our instance in order
        // very similar to asyncReduce but the state is the object itself
        for (let i = 0; i < obs.length; i++) {
            Reflect.apply(obs[i], this, args);
        }

        return this;
    };
}

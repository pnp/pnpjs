import { ObserverAction, ObserverFunction, Timeline } from "./timeline.js";
import { isArray } from "./util.js";

// TODO:: docs
// - you don't need error handling here because that is handled in emit within the timeline


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
 * Defines a moment that executes each observer asynchronously, awaiting the result and passes the returned arguments as the arguments to the next observer.
 * This is very much like the redux pattern taking the arguments as the state which each observer may modify, returning a new state
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
export function request<T extends ObserverFunction>(): (observers: T[], ...args: [...Parameters<T>]) => ReturnType<T> {

    return <any>function (this: Timeline<any>, observers: T[], ...args: [...Parameters<T>]): Promise<any> {

        if (!isArray(observers) || observers.length < 1) {
            return undefined;
        }

        const handler = observers[0];

        return Reflect.apply(handler, this, args);
    };
}

/**
 * Defines a special moment used to configure the timeline itself before starting. Each observer is executed in order,
 * possibly modifying the "this" instance, with the final product returned
 *
 */
export function init<T extends ObserverFunction>(): (observers: T[]) => ReturnType<T> {

    return <any>function (this: Timeline<any>, observers: T[]): Timeline<any> {

        // get our initial values
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let r = this;

        const obs = [...observers];

        // process each handler which updates our instance in order
        // very similar to asyncReduce but the state is the object itself
        for (let i = 0; i < obs.length; i++) {
            r = Reflect.apply(obs[i], r, []);
        }

        return r;
    };
}

/**
 * Defines a special moment used to dispose of the timeline itself after running. Each observer is executed in order,
 * possibly modifying the "this" instance, with the final product returned. This allows for cleaning up any resources
 * associated with the timeline run or removing any changes done during init.
 *
 */
export function dispose<T extends ObserverFunction>(): (observers: T[]) => ReturnType<T> {

    return <any>function (this: Timeline<any>, observers: T[]): Timeline<any> {

        // get our initial values
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let r = this;

        const obs = [...observers];

        // process each handler which updates our instance in order
        // very similar to asyncReduce but the state is the object itself
        for (let i = 0; i < obs.length; i++) {
            r = Reflect.apply(obs[i], r, []);
        }

        return r;
    };
}

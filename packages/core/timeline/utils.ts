import { ValidObserver } from "./timeline.js";
import { isFunc } from "../util.js";

/**
 * Adds an observer to a given target
 *
 * @param target The object to which events are registered
 * @param moment The name of the moment to which the observer is registered
 * @param prepend If true the observer is prepended to the collection (default: false)
 *
 */
export function addObserver(target: Record<string, any>, moment: string, observer: ValidObserver, addBehavior: "add" | "replace" | "prepend"): any[] {

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

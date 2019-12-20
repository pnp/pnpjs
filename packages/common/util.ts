import { ITypedHash } from "./collections";

/**
 * Gets a callback function which will maintain context across async calls.
 * Allows for the calling pattern getCtxCallback(thisobj, method, methodarg1, methodarg2, ...)
 *
 * @param context The object that will be the 'this' value in the callback
 * @param method The method to which we will apply the context and parameters
 * @param params Optional, additional arguments to supply to the wrapped method when it is invoked
 */
export function getCtxCallback(context: any, method: Function, ...params: any[]): Function {
    return function () {
        method.apply(context, params);
    };
}

export type DateAddInterval = "year" | "quarter" | "month" | "week" | "day" | "hour" | "minute" | "second";

/**
 * Adds a value to a date
 *
 * @param date The date to which we will add units, done in local time
 * @param interval The name of the interval to add, one of: ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second']
 * @param units The amount to add to date of the given interval
 *
 * http://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object
 */
export function dateAdd(date: Date, interval: DateAddInterval, units: number): Date | undefined {
    let ret: Date | undefined = new Date(date.toString()); // don't change original date
    switch (interval.toLowerCase()) {
        case "year": ret.setFullYear(ret.getFullYear() + units); break;
        case "quarter": ret.setMonth(ret.getMonth() + 3 * units); break;
        case "month": ret.setMonth(ret.getMonth() + units); break;
        case "week": ret.setDate(ret.getDate() + 7 * units); break;
        case "day": ret.setDate(ret.getDate() + units); break;
        case "hour": ret.setTime(ret.getTime() + units * 3600000); break;
        case "minute": ret.setTime(ret.getTime() + units * 60000); break;
        case "second": ret.setTime(ret.getTime() + units * 1000); break;
        default: ret = undefined; break;
    }
    return ret;
}

/**
 * Combines an arbitrary set of paths ensuring and normalizes the slashes
 *
 * @param paths 0 to n path parts to combine
 */
export function combine(...paths: string[]): string {

    return paths
        .filter(path => !stringIsNullOrEmpty(path))
        .map(path => path.replace(/^[\\|\/]/, "").replace(/[\\|\/]$/, ""))
        .join("/")
        .replace(/\\/g, "/");
}

/**
 * Gets a random string of chars length
 * 
 * https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
 *
 * @param chars The length of the random string to generate
 */
export function getRandomString(chars: number): string {
    const text = new Array(chars);
    for (let i = 0; i < chars; i++) {
        text[i] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 62));
    }
    return text.join("");
}

/**
 * Gets a random GUID value
 *
 * http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */
/* tslint:disable no-bitwise */
export function getGUID(): string {
    let d = Date.now();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
/* tslint:enable */

/**
 * Determines if a given value is a function
 *
 * @param cf The thing to test for functionness
 */
export function isFunc(f: any): boolean {
    return typeof f === "function";
}

/**
 * Determines if an object is both defined and not null
 * @param obj Object to test
 */
export function objectDefinedNotNull(obj: any): boolean {
    return typeof obj !== "undefined" && obj !== null;
}

/**
 * @returns whether the provided parameter is a JavaScript Array or not.
*/
export function isArray(array: any): boolean {

    return Array.isArray ? Array.isArray(array) : array && typeof array.length === "number" && array.constructor === Array;
}

/**
 * Provides functionality to extend the given object by doing a shallow copy
 *
 * @param target The object to which properties will be copied
 * @param source The source object from which properties will be copied
 * @param noOverwrite If true existing properties on the target are not overwritten from the source
 * @param filter If provided allows additional filtering on what properties are copied (propName: string) => boolean
 *
 */
export function assign<T extends ITypedHash<any> = any, S extends ITypedHash<any> = any>(target: T, source: S, noOverwrite = false,
    filter: (propName: string) => boolean = () => true): T & S {

    if (!objectDefinedNotNull(source)) {
        return <T & S>target;
    }

    // ensure we don't overwrite things we don't want overwritten
    const check: (o: any, i: string) => Boolean = noOverwrite ? (o, i) => !(i in o) : () => true;

    // final filter we will use
    const f = (v: string) => check(target, v) && filter(v);

    return Object.getOwnPropertyNames(source)
        .filter(f)
        .reduce((t: any, v: string) => {
            t[v] = source[v];
            return t;
        }, target);
}

/**
 * Determines if a given url is absolute
 *
 * @param url The url to check to see if it is absolute
 */
export function isUrlAbsolute(url: string): boolean {
    return /^https?:\/\/|^\/\//i.test(url);
}

/**
 * Determines if a string is null or empty or undefined
 *
 * @param s The string to test
 */
export function stringIsNullOrEmpty(s: string): boolean {
    return s === undefined || s === null || s.length < 1;
}

/**
 * Ensures guid values are represented consistently as "ea123463-137d-4ae3-89b8-cf3fc578ca05"
 * 
 * @param guid The candidate guid
 */
export function sanitizeGuid(guid: string): string {

    if (stringIsNullOrEmpty(guid)) {
        return guid;
    }

    const matches = /([0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12})/i.exec(guid);

    return matches === null ? guid : matches[1];
}

/**
 * Shorthand for JSON.stringify
 * 
 * @param o Any type of object
 */
export function jsS(o: any): string {
    return JSON.stringify(o);
}

/**
 * Shorthand for Object.hasOwnProperty
 * 
 * @param o Object to check for
 * @param p Name of the property
 */
export function hOP(o: any, p: string): boolean {
    return Object.hasOwnProperty.call(o, p);
}

/**
 * Generates a ~unique hash code
 * 
 * From: https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
 */
// tslint:disable:no-bitwise
export function getHashCode(s: string): number {
    let hash = 0;
    if (s.length === 0) {
        return hash;
    }

    for (let i = 0; i < s.length; i++) {
        const chr = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
// tslint:enable:no-bitwise

import { TypedHash } from "./collections";
import { deprecatedClass } from "./decorators";

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

/**
 * Adds a value to a date
 *
 * @param date The date to which we will add units, done in local time
 * @param interval The name of the interval to add, one of: ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second']
 * @param units The amount to add to date of the given interval
 *
 * http://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object
 */
export function dateAdd(date: Date, interval: string, units: number): Date | undefined {
    let ret: Date | undefined = new Date(date); // don't change original date
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
export function combinePaths(...paths: string[]): string {

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
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < chars; i++) {
        text[i] = possible.charAt(Math.floor(Math.random() * possible.length));
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
    let d = new Date().getTime();
    const guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return guid;
}
/* tslint:enable */

/**
 * Determines if a given value is a function
 *
 * @param cf The thing to test for functionness
 */
export function isFunc(cf: any): boolean {
    return typeof cf === "function";
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

    if (Array.isArray) {
        return Array.isArray(array);
    }

    return array && typeof array.length === "number" && array.constructor === Array;
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
export function extend<T extends TypedHash<any> = any, S extends TypedHash<any> = any>(target: T, source: S, noOverwrite = false, filter?: (propName: string) => boolean): T & S {

    if (!objectDefinedNotNull(source)) {
        return <T & S>target;
    }

    // ensure we don't overwrite things we don't want overwritten
    const check: (o: any, i: string) => Boolean = noOverwrite ? (o, i) => !(i in o) : () => true;

    // allow filtering of copied properties
    const check2: (p: string) => boolean = isFunc(filter) ? filter : () => true;

    // final filter we will use
    const f = (v: string) => check(target, v) && check2(v);

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
    return typeof s === "undefined" || s === null || s.length < 1;
}

/**
 * Gets an attribute value from an html/xml string block. NOTE: if the input attribute value has
 * RegEx special characters they will be escaped in the returned string
 * 
 * @param html HTML to search
 * @param attrName The name of the attribute to find
 */
export function getAttrValueFromString(html: string, attrName: string): string {

    // make the input safe for regex
    html = html.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const reg = new RegExp(`${attrName}\\s*?=\\s*?("|')([^\\1]*?)\\1`, "i");
    const match = reg.exec(html);
    return match !== null && match.length > 0 ? match[2] : null;
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

deprecatedClass("1.1.0", "The Util class will be removed two major releases from the stated version. Please migrate to the individual exposed methods.");
export class Util {

    /**
     * Gets a callback function which will maintain context across async calls.
     * Allows for the calling pattern getCtxCallback(thisobj, method, methodarg1, methodarg2, ...)
     *
     * @param context The object that will be the 'this' value in the callback
     * @param method The method to which we will apply the context and parameters
     * @param params Optional, additional arguments to supply to the wrapped method when it is invoked
     */
    public static getCtxCallback = getCtxCallback;


    /**
     * Adds a value to a date
     *
     * @param date The date to which we will add units, done in local time
     * @param interval The name of the interval to add, one of: ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second']
     * @param units The amount to add to date of the given interval
     *
     * http://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object
     */
    public static dateAdd = dateAdd;

    /**
     * Combines an arbitrary set of paths ensuring and normalizes the slashes
     *
     * @param paths 0 to n path parts to combine
     */
    public static combinePaths = combinePaths;

    /**
     * Gets a random string of chars length
     *
     * @param chars The length of the random string to generate
     */
    public static getRandomString = getRandomString;

    /**
     * Gets a random GUID value
     *
     * http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
     */
    public static getGUID = getGUID;

    /**
     * Determines if a given value is a function
     *
     * @param cf The thing to test for functionness
     */
    public static isFunc = isFunc;

    /**
     * Determines if an object is both defined and not null
     * @param obj Object to test
     */
    public static objectDefinedNotNull = objectDefinedNotNull;

    /**
     * @returns whether the provided parameter is a JavaScript Array or not.
    */
    public static isArray = isArray;

    /**
     * Provides functionality to extend the given object by doing a shallow copy
     *
     * @param target The object to which properties will be copied
     * @param source The source object from which properties will be copied
     * @param noOverwrite If true existing properties on the target are not overwritten from the source
     *
     */
    public static extend = extend;

    /**
     * Determines if a given url is absolute
     *
     * @param url The url to check to see if it is absolute
     */
    public static isUrlAbsolute = isUrlAbsolute;

    /**
     * Determines if a string is null or empty or undefined
     *
     * @param s The string to test
     */
    public static stringIsNullOrEmpty = stringIsNullOrEmpty;

    /**
     * Gets an attribute value from an html/xml string block
     * 
     * @param html HTML to search
     * @param attrName The name of the attribute to find
     */
    public static getAttrValueFromString = getAttrValueFromString;

    /**
     * Ensures guid values are represented consistently as "ea123463-137d-4ae3-89b8-cf3fc578ca05"
     * 
     * @param guid The candidate guid id
     */
    public static sanitizeGuid = sanitizeGuid;
}

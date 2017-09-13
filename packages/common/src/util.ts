import { TypedHash } from "./collections";

export class Util {

    /**
     * Gets a callback function which will maintain context across async calls.
     * Allows for the calling pattern getCtxCallback(thisobj, method, methodarg1, methodarg2, ...)
     *
     * @param context The object that will be the 'this' value in the callback
     * @param method The method to which we will apply the context and parameters
     * @param params Optional, additional arguments to supply to the wrapped method when it is invoked
     */
    public static getCtxCallback(context: any, method: Function, ...params: any[]): Function {
        return function () {
            method.apply(context, params);
        };
    }

    /**
     * Tests if a url param exists
     *
     * @param name The name of the url paramter to check
     */
    public static urlParamExists(name: string): boolean {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        return regex.test(location.search);
    }

    /**
     * Gets a url param value by name
     *
     * @param name The name of the paramter for which we want the value
     */
    public static getUrlParamByName(name: string): string {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        const results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    /**
     * Gets a url param by name and attempts to parse a bool value
     *
     * @param name The name of the paramter for which we want the boolean value
     */
    public static getUrlParamBoolByName(name: string): boolean {
        const p = this.getUrlParamByName(name);
        const isFalse = (p === "" || /false|0/i.test(p));
        return !isFalse;
    }

    /**
     * Inserts the string s into the string target as the index specified by index
     *
     * @param target The string into which we will insert s
     * @param index The location in target to insert s (zero based)
     * @param s The string to insert into target at position index
     */
    public static stringInsert(target: string, index: number, s: string): string {
        if (index > 0) {
            return target.substring(0, index) + s + target.substring(index, target.length);
        }
        return s + target;
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
    public static dateAdd(date: Date, interval: string, units: number): Date | undefined {
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
     * Loads a stylesheet into the current page
     *
     * @param path The url to the stylesheet
     * @param avoidCache If true a value will be appended as a query string to avoid browser caching issues
     */
    public static loadStylesheet(path: string, avoidCache: boolean): void {
        if (avoidCache) {
            path += "?" + encodeURIComponent((new Date()).getTime().toString());
        }
        const head = document.getElementsByTagName("head");
        if (head.length > 0) {
            const e = document.createElement("link");
            head[0].appendChild(e);
            e.setAttribute("type", "text/css");
            e.setAttribute("rel", "stylesheet");
            e.setAttribute("href", path);
        }
    }

    /**
     * Combines an arbitrary set of paths ensuring that the slashes are normalized
     *
     * @param paths 0 to n path parts to combine
     */
    public static combinePaths(...paths: string[]): string {

        return paths
            .filter(path => !Util.stringIsNullOrEmpty(path))
            .map(path => path.replace(/^[\\|\/]/, "").replace(/[\\|\/]$/, ""))
            .join("/")
            .replace(/\\/g, "/");
    }

    /**
     * Gets a random string of chars length
     *
     * @param chars The length of the random string to generate
     */
    public static getRandomString(chars: number): string {
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
    public static getGUID(): string {
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
     * @param candidateFunction The thing to test for being a function
     */
    public static isFunction(candidateFunction: any): boolean {
        return typeof candidateFunction === "function";
    }

    /**
     * Determines if an object is both defined and not null
     * @param obj Object to test
     */
    public static objectDefinedNotNull(obj: any): boolean {
        return typeof obj !== "undefined" && obj !== null;
    }

    /**
     * @returns whether the provided parameter is a JavaScript Array or not.
    */
    public static isArray(array: any): boolean {

        if (Array.isArray) {
            return Array.isArray(array);
        }

        return array && typeof array.length === "number" && array.constructor === Array;
    }


    /**
     * Determines if a string is null or empty or undefined
     *
     * @param s The string to test
     */
    public static stringIsNullOrEmpty(s: string): boolean {
        return typeof s === "undefined" || s === null || s.length < 1;
    }

    /**
     * Provides functionality to extend the given object by doing a shallow copy
     *
     * @param target The object to which properties will be copied
     * @param source The source object from which properties will be copied
     * @param noOverwrite If true existing properties on the target are not overwritten from the source
     *
     */
    public static extend(target: any, source: TypedHash<any>, noOverwrite = false): any {

        if (source === null || typeof source === "undefined") {
            return target;
        }

        // ensure we don't overwrite things we don't want overwritten
        const check: (o: any, i: string) => Boolean = noOverwrite ? (o, i) => !(i in o) : () => true;

        return Object.getOwnPropertyNames(source)
            .filter((v: string) => check(target, v))
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
    public static isUrlAbsolute(url: string): boolean {
        return /^https?:\/\/|^\/\//i.test(url);
    }
}

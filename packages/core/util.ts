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
export function combine(...paths: (string | null | undefined)[]): string {

    return paths
        .filter(path => !stringIsNullOrEmpty(path))
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map(path => path!.replace(/^[\\|/]/, "").replace(/[\\|/]$/, ""))
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
/* eslint-disable no-bitwise */
export function getGUID(): string {
    let d = Date.now();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
/* eslint-enable no-bitwise */

/**
 * Determines if a given value is a function
 *
 * @param f The thing to test for functionness
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunc(f: any): f is Function {
    return typeof f === "function";
}

/**
 * @returns whether the provided parameter is a JavaScript Array or not.
*/
export function isArray(array: any): array is any[] {
    return Array.isArray(array);
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
export function stringIsNullOrEmpty(s: string | undefined | null): s is undefined | null | "" {
    return typeof s === "undefined" || s === null || s.length < 1;
}

/**
 * Determines if an object is both defined and not null
 * @param obj Object to test
 */
export function objectDefinedNotNull<T>(obj: T | undefined | null): obj is T {
    return typeof obj !== "undefined" && obj !== null;
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
export function hOP<T extends string>(o: any, p: T): boolean {
    return Object.hasOwnProperty.call(o, p);
}



/**
 * Generates a ~unique hash code
 *
 * From: https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
 */
/* eslint-disable no-bitwise */
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
/* eslint-enable no-bitwise */

/**
 * Waits a specified number of milliseconds before resolving
 *
 * @param ms Number of ms to wait
 */
export function delay(ms: number): Promise<void> {

    return new Promise((resolve: () => void) => {
        setTimeout(resolve, ms);
    });
}

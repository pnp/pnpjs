# @pnp/common/util

This module contains utility methods that you can import individually from the common library.

```TypeScript
import {
    getRandomString,
} from "@pnp/common";

// use from individual;y imported method
console.log(getRandomString(10));
```

## getCtxCallback

Gets a callback function which will maintain context across async calls.

```TypeScript
import { getCtxCallback } from "@pnp/common";

const contextThis = {
    myProp: 6,
};

function theFunction() {
    // "this" within this function will be the context object supplied
    // in this case the variable contextThis, so myProp will exist
    return this.myProp;
}

const callback = getCtxCallback(contextThis, theFunction);

callback(); // returns 6

// You can also supply additional parameters if needed

function theFunction2(g: number) {
    // "this" within this function will be the context object supplied
    // in this case the variable contextThis, so myProp will exist
    return this.myProp + g;
}

const callback2 = getCtxCallback(contextThis, theFunction, 4);

callback2(); // returns 10 (6 + 4)
```

## dateAdd

Manipulates a date, please see the [Stackoverflow discussion](https://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object) from where this method was taken.

## combine

Combines any number of paths, normalizing the slashes as required

```TypeScript
import { combine } from "@pnp/common";

// "https://microsoft.com/something/more"
const paths = combine("https://microsoft.com", "something", "more");

// "also/works/with/relative"
const paths2 = combine("/also/", "/works", "with/", "/relative\\");
```

## getRandomString

Gets a random string consisting of the number of characters requested.

```TypeScript
import { getRandomString } from "@pnp/common";

const randomString = getRandomString(10);
```

## getGUID

Creates a random guid, please see the [Stackoverflow discussion](https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript) from where this method was taken. 

## isFunc

Determines if a supplied variable represents a function.

## objectDefinedNotNull

Determines if an object is defined and not null.

## isArray

Determines if a supplied variable represents an array.

## extend

Merges a source object's own enumerable properties into a single target object. Similar to Object.assign, but allows control of overwriting of existing
properties.

```TypeScript
import { extend } from "@pnp/common";

let obj1 = {
    prop: 1,
    prop2: 2,
};

const obj2 = {
    prop: 4,
    prop3: 9,
};

const example1 = extend(obj1, obj2);
// example1 = { prop: 4, prop2: 2, prop3: 9 }

const example2 = extend(obj1, obj2, true);
// example2 = { prop: 1, prop2: 2, prop3: 9 }
```

## isUrlAbsolute

Determines if a supplied url is absolute and returns true; otherwise returns false.

## stringIsNullOrEmpty

Determines if a supplied string is null or empty

## Removed

Some methods that were no longer used internally by the @pnp libraries have been removed. You can find the source for those methods
below for use in your projects should you require.

```TypeScript
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
 * Tests if a url param exists
 *
 * @param name The name of the url parameter to check
 */
public static urlParamExists(name: string): boolean {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    return regex.test(location.search);
}

/**
 * Gets a url param value by name
 *
 * @param name The name of the parameter for which we want the value
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
 * @param name The name of the parameter for which we want the boolean value
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
```

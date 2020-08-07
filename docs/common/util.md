# @pnp/common/util

This module contains utility methods that you can import individually from the common library.

```TypeScript
import {
    getRandomString,
} from "@pnp/common";

// use from individually imported method
console.log(getRandomString(10));
```

## assign

Merges a source object's own enumerable properties into a single target object. Similar to Object.assign, but allows control of overwriting of existing
properties.

```TypeScript
import { assign } from "@pnp/common";

let obj1 = {
    prop: 1,
    prop2: 2,
};

const obj2 = {
    prop: 4,
    prop3: 9,
};

const example1 = assign(obj1, obj2);
// example1 = { prop: 4, prop2: 2, prop3: 9 }

//noOverwrite = true stops overwriting existing properties
const example2 = assign(obj1, obj2, true);
// example2 = { prop: 1, prop2: 2, prop3: 9 }
```

## combine

Combines any number of paths, normalizing the slashes as required

```TypeScript
import { combine } from "@pnp/common";

// "https://microsoft.com/something/more"
const paths = combine("https://microsoft.com", "something", "more");

// "also/works/with/relative"
const paths2 = combine("/also/", "/works", "with/", "/relative\\");
```

## dateAdd

Manipulates a date, please see the [Stack Overflow discussion](https://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object) from where this method was taken.

```TypeScript
import { dateAdd } from "@pnp/common";

const testDate = new Date();

dateAdd(testDate,'minute',10);
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

const callback2 = getCtxCallback(contextThis, theFunction2, 4);

callback2(); // returns 10 (6 + 4)
```

## getGUID

Creates a random guid, please see the [Stack Overflow discussion](https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript) from where this method was taken.

```TypeScript
import { getGUID } from "@pnp/common";

const newGUID = getGUID();
```

## getRandomString

Gets a random string consisting of the number of characters requested.

```TypeScript
import { getRandomString } from "@pnp/common";

const randomString = getRandomString(10);
```

## hOP

Shortcut for Object.hasOwnProperty. Determines if an object has a specified property.

```TypeScript
import { HttpRequestError } from "@pnp/odata";
import { hOP } from "@pnp/common";

export async function handleError(e: Error | HttpRequestError): Promise<void> {

  //Checks to see if the error object has a property called isHttpRequestError. Returns a bool.
  if (hOP(e, "isHttpRequestError")) {
      // Handle this type or error
  } else {
    // not an HttpRequestError so we do something else

  }
}
```

## isArray

Determines if a supplied variable represents an array.

```TypeScript
import { isArray } from "@pnp/common";

let x:String[] = [1,2,3]];

if (isArray(x)){
    console.log("I am an array");
}else{
    console.log("I am not an array");
}
```

## isFunc

Determines if a supplied variable represents a function.

```TypeScript
import { isFunc } from "@pnp/common";

public testFunction() {
    console.log("test function");
    return
}

if (isFunc(testFunction)){
    console.log("this is a function");
    testFunction();
}
```

## isUrlAbsolute

Determines if a supplied url is absolute and returns true; otherwise returns false.

```TypeScript
import { isUrlAbsolute } from "@pnp/common";

const webPath = 'https://{tenant}.sharepoint.com/sites/dev/';

if (isUrlAbsolute(webPath)){
    console.log("URL is absolute");
}else{
    console.log("URL is not absolute");
}
```

## objectDefinedNotNull

Determines if an object is defined and not null.

```TypeScript
import { objectDefinedNotNull } from "@pnp/common";

let obj = {
    prop: 1
};

if (objectDefinedNotNull(obj)){
    console.log("Not null");
}else{
    console.log("Null");
}
```

## stringIsNullOrEmpty

Determines if a supplied string is null or empty.

```TypeScript
import { stringIsNullOrEmpty } from "@pnp/common";

let x:String = "hello";

if (stringIsNullOrEmpty(x)){
    console.log("Null or empty");
}else{
    console.log("Not null or empty");
}
```

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

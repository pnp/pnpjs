# @pnp/core : util

This module contains utility methods that you can import individually from the core library.

## combine

Combines any number of paths, normalizing the slashes as required

```TypeScript
import { combine } from "@pnp/core";

// "https://microsoft.com/something/more"
const paths = combine("https://microsoft.com", "something", "more");

// "also/works/with/relative"
const paths2 = combine("/also/", "/works", "with/", "/relative\\");
```

## dateAdd

Manipulates a date, please see the [Stack Overflow discussion](https://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object) from which this method was taken.

```TypeScript
import { dateAdd } from "@pnp/core";

const now = new Date();

const newData = dateAdd(now, "minute", 10);
```

## getGUID

Creates a random guid, please see the [Stack Overflow discussion](https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript) from which this method was taken.

```TypeScript
import { getGUID } from "@pnp/core";

const newGUID = getGUID();
```

## getRandomString

Gets a random string containing the number of characters specified.

```TypeScript
import { getRandomString } from "@pnp/core";

const randomString = getRandomString(10);
```

## hOP

Shortcut for Object.hasOwnProperty. Determines if an object has a specified property.

```TypeScript
import { HttpRequestError } from "@pnp/queryable";
import { hOP } from "@pnp/core";

export async function handleError(e: Error | HttpRequestError): Promise<void> {

  //Checks to see if the error object has a property called isHttpRequestError. Returns a bool.
  if (hOP(e, "isHttpRequestError")) {
      // Handle this type or error
  } else {
    // not an HttpRequestError so we do something else

  }
}
```

## jsS

Shorthand for JSON.stringify

```TypeScript
import { jsS } from "@pnp/core";

const s: string = jsS({ hello: "world" });
```

## isArray

Determines if a supplied variable represents an array.

```TypeScript
import { isArray } from "@pnp/core";

const x = [1, 2, 3];

if (isArray(x)){
    console.log("I am an array");
} else {
    console.log("I am not an array");
}
```

## isFunc

Determines if a supplied variable represents a function.

```TypeScript
import { isFunc } from "@pnp/core";

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

Determines if a supplied url is absolute, returning true; otherwise returns false.

```TypeScript
import { isUrlAbsolute } from "@pnp/core";

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
import { objectDefinedNotNull } from "@pnp/core";

const obj = {
    prop: 1
};

if (objectDefinedNotNull(obj)){
    console.log("Not null");
} else {
    console.log("Null");
}
```

## stringIsNullOrEmpty

Determines if a supplied string is null or empty.

```TypeScript
import { stringIsNullOrEmpty } from "@pnp/core";

const x: string = "hello";

if (stringIsNullOrEmpty(x)){
    console.log("Null or empty");
} else {
    console.log("Not null or empty");
}
```

## getHashCode

Gets a (mostly) unique hashcode for a specified string.

> Taken from: [https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript](https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript)

```TypeScript
import { getHashCode } from "@pnp/core";

const x: string = "hello";

const hash = getHashCode(x);
```

## delay

Provides an awaitable delay specified in milliseconds.

```TypeScript
import { delay } from "@pnp/core";

// wait 1 second
await delay(1000);

// wait 10 second
await delay(10000);
```

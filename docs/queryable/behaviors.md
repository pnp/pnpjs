# @pnp/queryable : behaviors

The article describes the behaviors exported by the `@pnp/queryable` library. Please also see available behaviors in [@pnp/core](../core/behaviors.md), [@pnp/nodejs](../nodejs/behaviors.md), [@pnp/sp](../sp/behaviors.md), and [@pnp/graph](../graph/behaviors.md).

Generally you won't need to use these behaviors individually when using the defaults supplied by the library, but when appropriate you can create your own [composed behaviors](../core/behavior-recipes.md) using these as building blocks.

## Bearer Token

Allows you to inject an existing bearer token into the request. This behavior will _not replace_ any existing authentication behaviors, so you may want to ensure they are cleared if you are supplying your own tokens, regardless of their source. This behavior does no caching or performs any operation other than including your token in an authentication heading.

```TypeScript
import { BearerToken } from "@pnp/queryable";

import "@pnp/sp/webs";

const sp = spfi(...).using(BearerToken("HereIsMyBearerTokenStringFromSomeSource"));

// optionally clear any configured authentication as you are supplying a token so additional calls shouldn't be needed
// but take care as other behaviors may add observers to auth
sp.on.auth.clear();

// the bearer token supplied above will be applied to all requests made from `sp`
const webInfo = await sp.webs();
```

## BrowserFetch

This behavior, for use in web browsers, provides basic fetch support through the browser's fetch global method. It replaces any other registered observers on the send moment by default, but this can be controlled via the props. Remember, when registering observers on the send moment only the first one will be used so not replacing

> For fetch configuration in nodejs please see [@pnp/nodejs behaviors]("../../../nodejs/behaviors.md).

```TypeScript
import { BrowserFetch } from "@pnp/queryable";

import "@pnp/sp/webs";

const sp = spfi(...).using(BrowserFetch());

const webInfo = await sp.webs();
```

```TypeScript
import { BrowserFetch } from "@pnp/queryable";

import "@pnp/sp/webs";

const sp = spfi(...).using(BrowserFetch({ replace: false }));

const webInfo = await sp.webs();
```

## BrowserFetchWithRetry

This behavior makes fetch requests but will attempt to retry the request on certain failures such as throttling.

```TypeScript
import { BrowserFetchWithRetry } from "@pnp/queryable";

import "@pnp/sp/webs";

const sp = spfi(...).using(BrowserFetchWithRetry());

const webInfo = await sp.webs();
```

You can also control how the behavior works through its props. The `replace` value works as described above for BrowserFetch. `interval` specifies the initial dynamic back off value in milliseconds. This value is ignored if a "Retry-After" header exists in the response. `retries` indicates the number of times to retry before failing the request, the default is 3. A default of 3 will result in up to 4 total requests being the initial request and threee potential retries.

```TypeScript
import { BrowserFetchWithRetry } from "@pnp/queryable";

import "@pnp/sp/webs";

const sp = spfi(...).using(BrowserFetchWithRetry({
    retries: 2,
    interval: 400,
    replace: true,
}));

const webInfo = await sp.webs();
```

## Caching

This behavior allows you to cache the results of get requests in either session or local storage. If neither is available (such as in Nodejs) the library will shim using an in memory map. It is a good idea to include caching in your projects to improve performance. By default items in the cache will expire after 5 minutes.

```TypeScript
import { Caching } from "@pnp/queryable";

import "@pnp/sp/webs";

const sp = spfi(...).using(Caching());

// caching will save the data into session storage on the first request - the key is based on the full url including query strings
const webInfo = await sp.webs();

// caching will retriece this value from the cache saving a network requests the second time it is loaded (either in the same page, a reload of the page, etc.)
const webInfo2 = await sp.webs();
```

### Custom Key Function

You can also supply custom functionality to control how keys are generated and calculate the expirations.

The cache key factory has the form `(url: string) => string` and you must ensure your keys are unique enough that you won't have collisions.

The expire date factory has the form `(url: string) => Date` and should return the Date when the cached data should expire. If you know that some particular data won't expire often you can set this date far in the future, or for more frequently updated information you can set it lower. If you set the expiration too short there is no reason to use caching as any stored information will likely always be expired. Additionally, you can set the storage to use local storage which will persist across sessions.

> Note that for sp.search() requests if you want to specify a key you will need to use the CacheKey behavior below, the keyFactory value will be overwritten

```TypeScript
import { getHashCode, PnPClientStorage, dateAdd, TimelinePipe } from "@pnp/core";
import { Caching } from "@pnp/queryable";

import "@pnp/sp/webs";

const sp = spfi(...).using(Caching({
    store: "local",
    // use a hascode for the key
    keyFactory: (url) => getHashCode(url.toLowerCase()).toString(),
    // cache for one minute
    expireFunc: (url) => dateAdd(new Date(), "minute", 1),
}));

// caching will save the data into session storage on the first request - the key is based on the full url including query strings
const webInfo = await sp.webs();

// caching will retriece this value from the cache saving a network requests the second time it is loaded (either in the same page, a reload of the page, etc.)
const webInfo2 = await sp.webs();
```

As with any behavior you have the option to only apply caching to certain requests:

```TypeScript
import { getHashCode, dateAdd } from "@pnp/core";
import { Caching } from "@pnp/queryable";

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi(...);

// caching will only apply to requests using `cachingList` as the base of the fluent chain
const cachingList = sp.web.lists.getByTitle("{List Title}").using(Caching());

// caching will save the data into session storage on the first request - the key is based on the full url including query strings
const itemsInfo = await cachingList.items();

// caching will retriece this value from the cache saving a network requests the second time it is loaded (either in the same page, a reload of the page, etc.)
const itemsInfo2 = await cachingList.items();
```

### bindCachingCore

_Added in 3.10.0_

The `bindCachingCore` method is supplied to allow all caching behaviors to share a common logic around the handling of ICachingProps. Usage of this function is not required to build your own caching method. However, it does provide consistent logic and will incoroporate any future enhancements. It can be used to create your own caching behavior. Here we show how we use the binding function within `Caching` as a basic example.

The `bindCachingCore` method is designed for use in a `pre` observer and the first two parameters are the url and init passed to pre. The third parameter is an optional Partial<ICachingProps>. It returns a tuple with three values. The first is a calculated value indicating if this request should be cached based on the internal default logic of the library, you can use this value in conjunction with your own logic. The second value is a function that will get a cached value, note no key is passed - the key is calculated and held within `bindCachingCore`. The third value is a function to which you pass a value to cache. The key and expiration are similarly calculated and held within `bindCachingCore`.

```TS
import { TimelinePipe } from "@pnp/core";
import { bindCachingCore, ICachingProps, Queryable } from "@pnp/queryable";

export function Caching(props?: ICachingProps): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.on.pre(async function (this: Queryable, url: string, init: RequestInit, result: any): Promise<[string, RequestInit, any]> {

            const [shouldCache, getCachedValue, setCachedValue] = bindCachingCore(url, init, props);

            // only cache get requested data or where the CacheAlways header is present (allows caching of POST requests)
            if (shouldCache) {

                const cached = getCachedValue();

                // we need to ensure that result stays "undefined" unless we mean to set null as the result
                if (cached === null) {

                    // if we don't have a cached result we need to get it after the request is sent and parsed
                    this.on.post(async function (url: URL, result: any) {

                        setCachedValue(result);

                        return [url, result];
                    });

                } else {

                    result = cached;
                }
            }

            return [url, init, result];
        });

        return instance;
    };
}
```

## CacheKey

_Added in 3.5.0_

This behavior allows you to set a pre-determined cache key for a given request. It needs to be used **PER** request otherwise the value will be continuously overwritten.

```TypeScript
import { Caching, CacheKey } from "@pnp/queryable";
import "@pnp/sp/webs";
import "@pnp/sp/lists";

const sp = spfi(...).using(Caching());

// note the application of the behavior on individual requests, if you share a CacheKey behavior across requests you'll encounter conflicts
const webInfo = await sp.web.using(CacheKey("MyWebInfoCacheKey"))();

const listsInfo = await sp.web.lists.using(CacheKey("MyListsInfoCacheKey"))();
```

## CacheAlways

_Added in 3.8.0_

This behavior allows you to force caching for a given request. This should not be used for update/create operations as the request will not execute if a result is found in the cache

```TypeScript
import { Caching, CacheAlways } from "@pnp/queryable";
import "@pnp/sp/webs";
import "@pnp/sp/lists";

const sp = spfi(...).using(Caching());

const webInfo = await sp.web.using(CacheAlways())();
```

## CacheNever

_Added in 3.10.0_

This behavior allows you to force skipping caching for a given request.

```TypeScript
import { Caching, CacheNever } from "@pnp/queryable";
import "@pnp/sp/webs";
import "@pnp/sp/lists";

const sp = spfi(...).using(Caching());

const webInfo = await sp.web.using(CacheNever())();
```

## Caching Pessimistic Refresh

This behavior is slightly different than our default Caching behavior in that it will always return the cached value if there is one, but also asyncronously update the cached value in the background. Like the default CAchine behavior it allows you to cache the results of get requests in either session or local storage. If neither is available (such as in Nodejs) the library will shim using an in memory map.

If you do not provide an expiration function then the cache will be updated asyncronously on every call, if you do provide an expiration then the cached value will only be updated, although still asyncronously, only when the cache has expired.

```TypeScript
import { CachingPessimisticRefresh } from "@pnp/queryable";

import "@pnp/sp/webs";

const sp = spfi(...).using(CachingPessimisticRefresh());

// caching will save the data into session storage on the first request - the key is based on the full url including query strings
const webInfo = await sp.webs();

// caching will retriece this value from the cache saving a network requests the second time it is loaded (either in the same page, a reload of the page, etc.)
const webInfo2 = await sp.webs();
```

Again as with the default Caching behavior you can provide custom functions for key generation and expiration. Please see the [Custom Key Function documentation above](#Custom-Key-Function) for more details.

## InjectHeaders

Adds any specified headers to a given request. Can be used multiple times with a timeline. The supplied headers are added to all requests, and last applied wins - meaning if two InjectHeaders are included in the pipeline which inlcude a value for the same header, the second one applied will be used.

```TypeScript
import { InjectHeaders } from "@pnp/queryable";

import "@pnp/sp/webs";

const sp = spfi(...).using(InjectHeaders({
    "X-Something": "a value",
    "MyCompanySpecialAuth": "special company token",
}));

const webInfo = await sp.webs();
```

## Parsers

Parsers convert the returned fetch Response into something usable. We have included the most common parsers we think you'll need - but you can always write your own parser based on the [signature of the parse moment](./queryable.md#parse).

> All of these parsers when applied through using will replace any other observers on the parse moment.

### DefaultParse

Performs error handling and parsing of JSON responses. This is the one you'll use for most of your requests and it is included in all the defaults.

```TypeScript
import { DefaultParse } from "@pnp/queryable";

import "@pnp/sp/webs";

const sp = spfi(...).using(DefaultParse());

const webInfo = await sp.webs();
```

### TextParse

Checks for errors and parses the results as text with no further manipulation.

```TypeScript
import { TextParse } from "@pnp/queryable";

import "@pnp/sp/webs";

const sp = spfi(...).using(TextParse());
```

### BlobParse

Checks for errors and parses the results a Blob with no further manipulation.

```TypeScript
import { BlobParse } from "@pnp/queryable";

import "@pnp/sp/webs";

const sp = spfi(...).using(BlobParse());
```

### JSONParse

Checks for errors and parses the results as JSON with no further manipulation. Meaning you will get the raw JSON response vs DefaultParse which will remove wrapping JSON.

```TypeScript
import { JSONParse } from "@pnp/queryable";

import "@pnp/sp/webs";

const sp = spfi(...).using(JSONParse());
```

### BufferParse

Checks for errors and parses the results a Buffer with no further manipulation.

```TypeScript
import { BufferParse } from "@pnp/queryable";

import "@pnp/sp/webs";

const sp = spfi(...).using(BufferParse());
```

### HeaderParse

Checks for errors and parses the headers of the Response as the result. This is a specialised parses which can be used in those infrequent scenarios where you need information from the headers of a response.

```TypeScript
import { HeaderParse } from "@pnp/queryable";

import "@pnp/sp/webs";

const sp = spfi(...).using(HeaderParse());
```

### JSONHeaderParse

Checks for errors and parses the headers of the Respnose as well as the JSON and returns an object with both values.

```TypeScript
import { JSONHeaderParse } from "@pnp/queryable";

import "@pnp/sp/webs";

const sp = spfi(...).using(JSONHeaderParse());

...sp.data
...sp.headers
```

## Resolvers

These two behaviors are special and should always be included when composing your own defaults. They implement the expected behavior of resolving or rejecting the promise returned when executing a timeline. They are implemented as behaviors should there be a need to do something different the logic is not locked into the core of the library.

### ResolveOnData, RejectOnError

```TypeScript
import { ResolveOnData, RejectOnError } from "@pnp/queryable";

import "@pnp/sp/webs";

const sp = spfi(...).using(ResolveOnData(), RejectOnError());
```

## Timeout

The Timeout behavior allows you to include a timeout in requests. You can specify either a number, representing the number of milliseconds until the request should timeout or an AbortSignal.

> In Nodejs you will need to polyfill `AbortController` if your version (&lt;15) does not include it when using Timeout and passing a number. If you are supplying your own AbortSignal you do not.

```TypeScript
import { Timeout } from "@pnp/queryable";

import "@pnp/sp/webs";

// requests should timeout in 5 seconds
const sp = spfi(...).using(Timeout(5000));
```

```TypeScript
import { Timeout } from "@pnp/queryable";

import "@pnp/sp/webs";

const controller = new AbortController();

const sp = spfi(...).using(Timeout(controller.signal));

// abort requests after 6 seconds using our own controller
const timer = setTimeout(() => {
    controller.abort();
}, 6000);

// this request will be cancelled if it doesn't complete in 6 seconds
const webInfo = await sp.webs();

// be a good citizen and cancel unneeded timers
clearTimeout(timer);
```

## Cancelable

![Beta](https://img.shields.io/badge/Beta-important.svg)

_Updated as Beta 2 in 3.5.0_

This behavior allows you to cancel requests before they are complete. It is similar to timeout however you control when and if the request is canceled. Please consider this behavior as beta while we work to stabalize the functionality.

### Known Issues

- Due to how the event loop works you may get unhandled rejections after canceling a request

```TypeScript
import { Cancelable, CancelablePromise } from "@pnp/queryable";
import { IWebInfo } from "@pnp/sp/webs";
import "@pnp/sp/webs";

const sp = spfi().using(Cancelable());

const p: CancelablePromise<IWebInfo> = <any>sp.web();

setTimeout(() => {

    // you should await the cancel operation to ensure it completes
    await p.cancel();
}, 200);

// this is awaiting the results of the request
const webInfo: IWebInfo = await p;
```

### Cancel long running operations

Some operations such as chunked uploads that take longer to complete are good candidates for canceling based on user input such as a button select.

```TypeScript
import { Cancelable, CancelablePromise } from "@pnp/queryable";
import { IFileAddResult } from "@pnp/sp/files";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import { getRandomString } from "@pnp/core";
import { createReadStream } from "fs";

const sp = spfi().using(Cancelable());

const file = createReadStream(join("C:/some/path", "test.mp4"));

const p: CancelablePromise<IFileAddResult> = <any>sp.web.getFolderByServerRelativePath("/sites/dev/Shared Documents").files.addChunked(`te's't-${getRandomString(4)}.mp4`, <any>file);

setTimeout(() => {

    // you should await the cancel operation to ensure it completes
    await p.cancel();
}, 10000);

// this is awaiting the results of the request
await p;
```

# @pnp/queryable : behaviors

The article describes the behaviors exported by the `@pnp/queryable` library. Please also see available behaviors in [@pnp/core](../core/behaviors.md), [@pnp/nodejs](../nodejs/behaviors.md), [@pnp/sp](../sp/behaviors.md), and [@pnp/graph](../graph/behaviors.md).

Generally you won't need to use these behaviors individually when using the defaults supplied by the library, but when appropriate you can create your own [composed behaviors](../concepts/compose-behaviors.md) using these as building blocks.

## Bearer Token

Allows you to inject an existing bearer token into the request. This behavior will _not replace_ any existing authentication behaviors, so you may want to ensure they are cleared if you are supplying your own tokens, regardless of their source. This behavior does no caching or performs any operation other than including your token in an authentication heading.

```TypeScript
import { BearerToken } from "@pnp/queryable";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi().using(BearerToken("HereIsMyBearerTokenStringFromSomeSource"));

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
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi().using(BrowserFetch());

const webInfo = await sp.webs();
```

```TypeScript
import { BrowserFetch } from "@pnp/queryable";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi().using(BrowserFetch({ replace: false }));

const webInfo = await sp.webs();
```

## BrowserFetchWithRetry

This behavior makes fetch requests but will attempt to retry the request on certain failures such as throttling.

```TypeScript
import { BrowserFetchWithRetry } from "@pnp/queryable";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi().using(BrowserFetchWithRetry());

const webInfo = await sp.webs();
```

You can also control how the behavior works through its props. The `replace` value works as described above for BrowserFetch. `interval` specifies the initial dynamic back off value in milliseconds. This value is ignored if a "Retry-After" header exists in the response. `retries` indicates the number of times to retry before failing the request, the default is 3. A default of 3 will result in up to 4 total requests being the initial request and threee potential retries.

```TypeScript
import { BrowserFetchWithRetry } from "@pnp/queryable";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi().using(BrowserFetchWithRetry({
    retries: 2,
    interval: 400,
    replace: true,
}));

const webInfo = await sp.webs();
```

## Caching Pessimistic

// TODO:: Julie to write

## Caching

This behavior allows you to cache the results of get requests in either session or local storage. If neither is available (such as in Nodejs) the library will shim using an in memory map. It is a good idea to include caching in your projects to improve performance. By default items in the cache will expire after 5 minutes.

```TypeScript
import { Caching } from "@pnp/queryable";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi().using(Caching());

// caching will save the data into session storage on the first request - the key is based on the full url including query strings
const webInfo = await sp.webs();

// caching will retriece this value from the cache saving a network requests the second time it is loaded (either in the same page, a reload of the page, etc.)
const webInfo2 = await sp.webs();
```

You can also supply custom functionality to control how keys are generated and calculate the expirations.

The cache key factory has the form `(url: string) => string` and you must ensure your keys are unique enough that you won't have collisions.

The expire date factory has the form `(url: string) => Date` and should return the Date when the cached data should expire. If you know that some particular data won't expire often you can set this date far in the future, or for more frequently updated information you can set it lower. If you set the expiration too short there is no reason to use caching as any stored information will likely always be expired. Additionally, you can set the storage to use local storage which will persist across sessions.

```TypeScript
import { getHashCode, PnPClientStorage, dateAdd, TimelinePipe } from "@pnp/core";
import { Caching } from "@pnp/queryable";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi().using(Caching({
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
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi();

// caching will only apply to requests using `cachingList` as the base of the fluent chain
const cachingList = sp.web.lists.getByTitle("{List Title}").using(Caching());

// caching will save the data into session storage on the first request - the key is based on the full url including query strings
const itemsInfo = await cachingList.items();

// caching will retriece this value from the cache saving a network requests the second time it is loaded (either in the same page, a reload of the page, etc.)
const itemsInfo2 = await cachingList.items();
```

## InjectHeaders

Adds any specified headers to a given request. Can be used multiple times with a timeline. The supplied headers are added to all requests, and last applied wins - meaning if two InjectHeaders are included in the pipeline which inlcude a value for the same header, the second one applied will be used.

```TypeScript
import { InjectHeaders } from "@pnp/queryable";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi().using(InjectHeaders({
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
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi().using(DefaultParse());

const webInfo = await sp.webs();
```

### TextParse

Checks for errors and parses the results as text with no further manipulation.

```TypeScript
import { TextParse } from "@pnp/queryable";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi().using(TextParse());
```

### BlobParse

Checks for errors and parses the results a Blob with no further manipulation.

```TypeScript
import { BlobParse } from "@pnp/queryable";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi().using(BlobParse());
```

### JSONParse

Checks for errors and parses the results as JSON with no further manipulation. Meaning you will get the raw JSON response vs DefaultParse which will remove wrapping JSON.

```TypeScript
import { JSONParse } from "@pnp/queryable";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi().using(JSONParse());
```

### BufferParse

Checks for errors and parses the results a Buffer with no further manipulation.

```TypeScript
import { BufferParse } from "@pnp/queryable";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi().using(BufferParse());
```

### HeaderParse

Checks for errors and parses the headers of the Response as the result. This is a specialised parses which can be used in those infrequent scenarios where you need information from the headers of a response.

```TypeScript
import { HeaderParse } from "@pnp/queryable";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi().using(HeaderParse());
```

## Resolvers

These two behaviors are special and should always be included when composing your own defaults. They implement the expected behavior of resolving or rejecting the promise returned when executing a timeline. They are implemented as behaviors should there be a need to do something different the logic is not locked into the core of the library.

### ResolveOnData, RejectOnError

```TypeScript
import { ResolveOnData, RejectOnError } from "@pnp/queryable";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi().using(ResolveOnData(), RejectOnError());
```

## Timeout

The Timeout behavior allows you to include a timeout in requests. You can specify either a number, representing the number of milliseconds until the request should timeout or an AbortSignal.

> In Nodejs you will need to polyfill `AbortController` if your version (&lt;15) does not include it when using Timeout and passing a number. If you are supplying your own AbortSignal you do not.

```TypeScript
import { Timeout } from "@pnp/queryable";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

// requests should timeout in 5 seconds
const sp = spfi().using(Timeout(5000));
```

```TypeScript
import { Timeout } from "@pnp/queryable";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const controller = new AbortController();

const sp = spfi().using(Timeout(controller.signal));

// abort requests after 6 seconds using our own controller
const timer = setTimeout(() => {
    controller.abort();
}, 6000);

// this request will be cancelled if it doesn't complete in 6 seconds
const webInfo = await sp.webs();

// be a good citizen and cancel unneeded timers
clearTimeout(timer);
```





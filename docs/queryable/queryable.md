# @pnp/queryable/queryable

Queryable is the base class for both the sp and graph fluent interfaces and provides the structure to which [observers](../core/observers.md) are registered. As a background to understand more of the mechanics please see the articles on [Timeline](../core/timeline.md), [moments](../core/moments.md), and [observers](../core/observers.md). For reuse it is recommended to compose your observer registrations with [behaviors](../core/behaviors.md).

## Queryable Constructor

By design the library is meant to allow creating the next part of a url from the current part. In this way each queryable instance is built from a previous instance. As such understanding the Queryable constructor's behavior is important. The constructor takes two parameters, the first required and the second optional.

The first parameter can be another queryable, a string, or a tuple of [Queryable, string].

|Parameter|Behavior|
|---|---|
|Queryable|The new queryable inherits all of the supplied queryable's observers. Any supplied path (second constructor param) is appended to the supplied queryable's url becoming the url of the newly constructed queryable|
|string|The new queryable will have NO registered observers. Any supplied path (second constructor param) is appended to the string becoming the url of the newly constructed queryable|
|[Queryable, string]|The observers from the supplied queryable are used by the new queryable. The url is a combination of the second tuple argument (absolute url string) and any supplied path.

> The tuple constructor call can be used to rebase a queryable to call a different host in an otherwise identical way to another queryable. When using the tuple constructor the url provided must be absolute.

### Examples

```TS
// represents a fully configured queryable with url and registered observers
// url: https://something.com
const baseQueryable;

// child1 will:
// - reference the observers of baseQueryable
// - have a url of "https://something.com/subpath"
const child1 = Child(baseQueryable, "subpath");

// child2 will:
// - reference the observers of baseQueryable
// - have a url of "https://something.com"
const child2 = Child(baseQueryable);

// nonchild1 will:
// - have NO registered observers or connection to baseQueryable
// - have a url of "https://somethingelse.com"
const nonchild1 = Child("https://somethingelse.com");

// nonchild2 will:
// - have NO registered observers or connection to baseQueryable
// - have a url of "https://somethingelse.com/subpath"
const nonchild2 = Child("https://somethingelse.com", "subpath");

// rebased1 will:
// - reference the observers of baseQueryable
// - have a url of "https://somethingelse.com"
const rebased1 = Child([baseQueryable, "https://somethingelse.com"]);

// rebased2 will:
// - reference the observers of baseQueryable
// - have a url of "https://somethingelse.com/subpath"
const rebased2 = Child([baseQueryable, "https://somethingelse.com"], "subpath");
```

# Queryable Lifecycle

The Queryable lifecycle is:

- `construct` (Added in 3.5.0)
- `init`
- `pre`
- `auth`
- `send`
- `parse`
- `post`
- `data`
- `dispose`

As well `log` and `error` can emit at any point during the lifecycle.

## No observers registered for this request

If you see an error thrown with the message `No observers registered for this request.` it means at the time of execution the given object has no actions to take. Because all the request logic is defined within observers, an absence of observers is _likely_ an error condition. If the object was created by a method within the library please report an issue as it is likely a bug. If you created the object through direct use of one of the factory functions, please be sure you have registered observers with `using` or `on` as appropriate. [More information on observers is available in this article](../core/observers.md).

If you for some reason want to execute a queryable with no registred observers, you can simply register a noop observer to any of the moments.

## Queryable Observers

This section outlines how to write observers for the Queryable lifecycle, and the expectations of each moment's observer behaviors.

> In the below samples consider the variable `query` to mean any valid Queryable derived object.

### log

Anything can log to a given timeline's log using the public `log` method and to intercept those message you can subscribed to the log event.

The `log` observer's signature is: `(this: Timeline<T>, message: string, level: number) => void`

```TypeScript
query.on.log((message, level) => {

    // log only warnings or errors
    if (level > 1) {
        console.log(message);
    }
});
```

> The level value is a number indicating the severity of the message. Internally we use the values from the LogLevel enum in @pnp/logging: Verbose = 0, Info = 1, Warning = 2, Error = 3. Be aware that nothing enforces those values other than convention and log can be called with any value for level.

As well we provide easy support to use PnP logging within a Timeline derived class:

```TypeScript
import { LogLevel, PnPLogging } from "@pnp/logging";

// any messages of LogLevel Info or higher (1) will be logged to all subscribers of the logging framework
query.using(PnPLogging(LogLevel.Info));
```

> More details on the [pnp logging framework](../logging/index.md)

### error

Errors can happen at anytime and for any reason. If you are using the `RejectOnError` behavior, and both sp and graph include that in the defaults, the request promise will be rejected as expected and you can handle the error that way.

The `error` observer's signature is: `(this: Timeline<T>, err: string | Error) => void`

```TypeScript
import { spfi, DefaultInit, DefaultHeaders } from "@pnp/sp";
import { BrowserFetchWithRetry, DefaultParse } from "@pnp/queryable";
import "@pnp/sp/webs";

const sp = spfi().using(DefaultInit(), DefaultHeaders(), BrowserFetchWithRetry(), DefaultParse());

try {

    const result = await sp.web();

} catch(e) {

    // any errors emitted will result in the promise being rejected
    // and ending up in the catch block as expected
}
```

In addition to the default behavior you can register your own observers on `error`, though it is recommended you leave the default behavior in place.

```TypeScript
query.on.error((err) => {

    if (err) {
        console.error(err);
        // do other stuff with the error (send it to telemetry)
    }
});
```

### construct

_Added in 3.5.0_

This moment exists to assist behaviors that need to transfer some information from a parent to a child through the fluent chain. We added this to support cancelable scopes for the Cancelable behavior, but it may have other uses. It is invoked AFTER the new instance is fully realized via `new` and supplied with the parameters used to create the new instance. As with all moments the "this" within the observer is the current (NEW) instance.

For your observers on the construct method to work correctly they must be registered before the instance is created.

> The construct moment is NOT async and is designed to support simple operations.

```TypeScript
query.on.construct(function (this: Queryable, init: QueryableInit, path?: string): void {
    if (typeof init !== "string") {
        
        // get a ref to the parent Queryable instance used to create this new instance
        const parent = isArray(init) ? init[0] : init;

        if (Reflect.has(parent, "SomeSpecialValueKey")) {

            // copy that specail value to the new child
            this["SomeSpecialValueKey"] = parent["SomeSpecialValueKey"];
        }
    }     
});

query.on.pre(async function(url, init, result) {

    // we have access to the copied special value throughout the lifecycle
    this.log(this["SomeSpecialValueKey"]);

    return [url, init, result];
});

query.on.dispose(() => {

    // be a good citizen and clean up your behavior's values when you're done
    delete this["SomeSpecialValueKey"];
});
```

### init

Along with `dispose`, `init` is a special moment that occurs before any of the other lifecycle providing a first chance at doing any tasks before the rest of the lifecycle starts. It is not await aware so only sync operations are supported in init by design.

The `init` observer's signature is: `(this: Timeline<T>) => void`

> In the case of init you manipulate the Timeline instance itself

```TypeScript
query.on.init(function (this: Queryable) {

    // init is a great place to register additioanl observers ahead of the lifecycle
    this.on.pre(async function (this: Quyerable, url, init, result) {
        // stuff happens
        return [url, init, result];
    });
});
```

### pre

Pre is used by observers to configure the request before sending. Note there is a dedicated auth moment which is prefered by convention to handle auth related tasks.

The `pre` observer's signature is: `(this: IQueryable, url: string, init: RequestInit, result: any) => Promise<[string, RequestInit, any]>`

> The `pre`, `auth`, `parse`, and `post` are asyncReduce moments, meaning you are expected to always asyncronously return a tuple of the arguments supplied to the function. These are then passed to the next observer registered to the moment.

Example of when to use pre are updates to the init, caching scenarios, or manipulation of the url (ensuring it is absolute). The init passed to pre (and auth) is the same object that will be eventually passed to fetch, meaning you can add any properties/congifuration you need. The result should always be left undefined unless you intend to end the lifecycle. If pre completes and result has any value other than undefined that value will be emitted to `data` and the timeline lifecycle will end.

```TypeScript
query.on.pre(async function(url, init, result) {

    init.cache = "no-store";

    return [url, init, result];
});

query.on.pre(async function(url, init, result) {

    // setting result causes no moments after pre to be emitted other than data
    // once data is emitted (resolving the request promise by default) the lifecycle ends
    result = "My result";

    return [url, init, result];
});
```

### auth

Auth functions very much like `pre` except it does not have the option to set the result, and the url is considered immutable by convention. Url manipulation should be done in pre. Having a seperate moment for auth allows for easily changing auth specific behavior without having to so a lot of complicated parsing of `pre` observers.

The `auth` observer's signature is: `(this: IQueryable, url: URL, init: RequestInit) => Promise<[URL, RequestInit]>`.

> The `pre`, `auth`, `parse`, and `post` are asyncReduce moments, meaning you are expected to always asyncronously return a tuple of the arguments supplied to the function. These are then passed to the next observer registered to the moment.

```TypeScript
query.on.auth(async function(url, init) {

    // some code to get a token
    const token = getToken();

    init.headers["Authorization"] = `Bearer ${token}`;

    return [url, init];
});
```

### send

Send is implemented using the [request](../core/moments.md#request) moment which uses the first registered observer and invokes it expecting an async Response.

The `send` observer's signature is: `(this: IQueryable, url: URL, init: RequestInit) => Promise<Response>`.

```TypeScript
query.on.send(async function(url, init) {

    // this could represent reading a file, querying a database, or making a web call
    return fetch(url.toString(), init);
});
```

### parse

Parse is responsible for turning the raw Response into something usable. By default we handle errors and parse JSON responses, but any logic could be injected here. Perhaps your company encrypts things and you need to decrypt them before parsing further.

The `parse` observer's signature is: `(this: IQueryable, url: URL, response: Response, result: any | undefined) => Promise<[URL, Response, any]>`.

> The `pre`, `auth`, `parse`, and `post` are asyncReduce moments, meaning you are expected to always asyncronously return a tuple of the arguments supplied to the function. These are then passed to the next observer registered to the moment.

```TypeScript
// you should be careful running multiple parse observers so we replace with our functionality
// remember every registered observer is run, so if you set result and a later observer sets a
// different value last in wins.
query.on.parse.replace(async function(url, response, result) {

    if (response.ok) {

        result = await response.json();

    } else {

        // just an example
        throw Error(response.statusText);
    }

    return [url, response, result];
});
```

### post

Post is run after parse, meaning you should have a valid fully parsed result, and provides a final opportunity to do caching, some final checks, or whatever you might need immediately prior to the request promise resolving with the value. It is recommened to NOT manipulate the result within post though nothing prevents you from doing so.

The `post` observer's signature is: `(this: IQueryable, url: URL, result: any | undefined) => Promise<[URL, any]>`.

> The `pre`, `auth`, `parse`, and `post` are asyncReduce moments, meaning you are expected to always asyncronously return a tuple of the arguments supplied to the function. These are then passed to the next observer registered to the moment.

```TypeScript
query.on.post(async function(url, result) {

    // here we do some caching of a result
    const key = hash(url);
    cache(key, result);   

    return [url, result];
});
```

### data

Data is called with the result of the Queryable lifecycle produced by `send`, understood by `parse`, and passed through `post`. By default the request promise will resolve with the value, but you can add any additional observers you need.

The `data` observer's signature is: `(this: IQueryable, result: T) => void`.

> Clearing the data moment (ie. .on.data.clear()) after the lifecycle has started will result in the request promise never resolving

```TypeScript
query.on.data(function(result) {

    console.log(`Our result! ${JSON.stringify(result)}`);
});
```

### dispose

Along with `init`, `dispose` is a special moment that occurs after all other lifecycle moments have completed. It is not await aware so only sync operations are supported in dispose by design.

The `dispose` observer's signature is: `(this: Timeline<T>) => void`

> In the case of dispose you manipulate the Timeline instance itself

```TypeScript
query.on.dispose(function (this: Queryable) {

    // maybe your queryable calls a database?
    db.connection.close();
});
```

## Other Methods

Queryable exposes some additional methods beyond the observer registration.

### concat

Appends the supplied string to the url without mormalizing slashes.

```TypeScript
// url: something.com/items
query.concat("(ID)");
// url: something.com/items(ID)
```

### toRequestUrl

Converts the queryable's internal url parameters (url and query) into a relative or absolute url.

```TypeScript
const s = query.toRequestUrl();
```

### query

Map used to manage any query string parameters that will be included. Anything added here will be represented in `toRequestUrl`'s output.

```TypeScript
query.query.add("$select", "Title");
```

### toUrl

Returns the url currently represented by the Queryable, without the querystring part

```TypeScript
const s = query.toUrl();
```

# Debugging Proxy Objects

Because all queryables are now represented as Proxy objects you can't immediately see the properties/method of the object or the data stored about the request. In certain debugging scenarios it can help to get visibility into the object that is wrapped by the proxy. To enable this we provide [a set of extensions](./extensions.md) to help.

The debug extensions are added by including the `import "@pnp/odata/debug";` statement in your project. It should be removed for production. This module provides several methods to help with debugging Queryable Proxy objects.

## Unwrap

The `__unwrap()` method returns the concrete Queryable instance wrapped by the Proxy. You can then examine this object in various ways or dump it to the console for debugging.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/odata/debug";

// unwrap the underlying concrete queryable instance
const unwrapped = sp.web.__unwrap();

console.log(JSON.stringify(unwrapped, null, 2));
```

> Note: It is not supported to unwrap objects and then use them. It may work in some cases, but this behavior may change as what is contained with the Proxy is an implementation detail and should not be relied upon. Without the Proxy wrapper we make no guarantees.

## Data

All of the information related to a queryable's request is contained within the "data" property. If you need to grab that information you can use the `__data` property.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/odata/debug";

// get the underlying queryable's data
const data = sp.web.__data;

console.log(JSON.stringify(data, null, 2));
```

## JSON

You can also get a representation of the wrapped instance in JSON format consisting of all its own properties and values.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/odata/debug";

// get the underlying queryable's as JSON
const data = sp.web.__json();

console.log(JSON.stringify(data, null, 2));
```

## Deep Trace

Deep tracing is the ability to write every property and method access to the log. This produces VERY verbose output but can be helpful in situations where you need to trace how things are called and when within the Proxy. You enable deep tracing using the `__enableDeepTrace` method and disable using `__disableDeepTrace`.

```TypeScript
import { Logger, ConsoleListener } from "@pnp/logging";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/odata/debug";

Logger.subscribe(new ConsoleListener());

// grab an instance to enable deep trace
const web = sp.web;

// enable deep trace on the instance
web.__enableDeepTrace();

const y = await web.lists();

// disable deep trace
web.__disableDeepTrace();
```

The example above produces the following output:

```
Message: get ::> lists
Message: get ::> lists
Message: get ::> toUrl
Message: get ::> toUrl
Message: get ::> data
Message: get ::> data
Message: get ::> _data
Message: get ::> query
Message: get ::> query
Message: get ::> data
Message: get ::> data
Message: get ::> _data
Message: get ::> _data
Message: get ::> data
Message: get ::> data
Message: get ::> _data
Message: get ::> _data
Message: [5912fe3e-6c2a-4538-84ee-eec28a29cfef] (1580232122352) Beginning GET request (_api/web/lists) Data: {}
Message: [5912fe3e-6c2a-4538-84ee-eec28a29cfef] (1580232122352) Beginning GET request (_api/web/lists) Data: {}
Message: [5912fe3e-6c2a-4538-84ee-eec28a29cfef] (1580232122354) Sending request.
Message: [5912fe3e-6c2a-4538-84ee-eec28a29cfef] (1580232122354) Sending request.
Message: [5912fe3e-6c2a-4538-84ee-eec28a29cfef] (1580232124099) Completing GET request. Data: {}
Message: [5912fe3e-6c2a-4538-84ee-eec28a29cfef] (1580232124099) Completing GET request. Data: {}
Message: [5912fe3e-6c2a-4538-84ee-eec28a29cfef] (1580232124102) Returning result from pipeline. Set logging to verbose to see data. Data: {}
Message: [5912fe3e-6c2a-4538-84ee-eec28a29cfef] (1580232124102) Returning result from pipeline. Set logging to verbose to see data. Data: {}
Message: get ::> __disableDeepTrace
Message: get ::> __disableDeepTrace
```

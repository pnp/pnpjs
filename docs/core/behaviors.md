# @pnp/core : behaviors

While you can always register observers to any Timeline's moments using the `.on.moment` syntax, to make things easier we have included the ability to create behaviors. Behaviors define one or more observer registrations abstracted into a single registration. To differentiate behaviors are applied with the `.using` method. The power of behaviors is they are composable so a behavior can apply other behaviors.

## Basic Example

Let's create a behavior that will register two observers to a Timeline. We'll use error and log since they exist on all Timelines. In this example let's imagine we need to include some special secret into every lifecycle for logging to work. And we also want a company wide method to track errors. So we roll our own behavior.

```TypeScript
import { Timeline, TimelinePipe } from "@pnp/core";
import { MySpecialLoggingFunction } from "../mylogging.js";

// top level function allows binding of values within the closure
export function MyBehavior(specialSecret: string): TimelinePipe {

    // returns the actual behavior function that is applied to the instance
    return (instance: Timeline<any>) => {

        // register as many observers as needed
        instance.on.log(function (message: string, severity: number) {

            MySpecialLoggingFunction(message, severity, specialSecret);
        });

        instance.on.error(function (err: string | Error) {

            MySpecialLoggingFunction(typeof err === "string" ? err : err.toString(), severity, specialSecret);
        });

        return instance;
    };
}

// apply the behavior to a Timeline/Queryable
obj.using(MyBehavior("HereIsMySuperSecretValue"));
```

## Composing Behaviors

We encourage you to use our defaults, or create your own default behavior appropriate to your needs. You can see all of the behaviors available in [@pnp/nodejs](../nodejs/behaviors.md), [@pnp/queryable](../queryable/behaviors.md), [@pnp/sp](../sp/behaviors.md), and [@pnp/graph](../graph/behaviors.md).

As an example, let's create our own behavior for a nodejs project. We want to call the graph, default to the beta endpoint, setup MSAL, and include a custom header we need for our environment. To do so we create a composed behavior consisting of graph's DefaultInit, graph's DefaultHeaders, nodejs's MSAL, nodejs's NodeFetchWithRetry, and queryable's DefaultParse & InjectHeaders. Then we can import this behavior into all our projects to configure them.

_company-default.ts_
```TypeScript
import { TimelinePipe } from "@pnp/core";
import { DefaultParse, Queryable, InjectHeaders } from "@pnp/queryable";
import { DefaultHeaders, DefaultInit } from "@pnp/graph";
import { NodeFetchWithRetry, MSAL } from "@pnp/nodejs";

export function CompanyDefault(): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.using(
            // use the default headers
            DefaultHeaders(),
            // use the default init, but change the base url to beta
            DefaultInit("https://graph.microsoft.com/beta"),
            // use node-fetch with retry
            NodeFetchWithRetry(),
            // use the default parsing
            DefaultParse(),
            // inject our special header to all requests
            InjectHeaders({
                "X-SomeSpecialToken": "{THE SPECIAL TOKEN VALUE}",
            }),
            // setup node's MSAL with configuration from the environment (or any source)
            MSAL(process.env.MSAL_CONFIG));

        return instance;
    };
}
```

_index.ts_
```TypeScript
import { CompanyDefault } from "./company-default.ts";
import { graphfi } from "@pnp/graph";

// we can consistently and easily setup our graph instance using a single behavior
const graph = graphfi().using(CompanyDefault());
```

> You can easily share your composed behaviors across your projects using [library components in SPFx](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/library-component-overview), a company CDN, or an npm package.

[](#assignfrom)

## Core Behaviors

This section describes two behaviors provided by the `@pnp/core` library, AssignFrom and CopyFrom. Likely you won't often need them directly - they are used in some places internally - but they are made available should they prove useful.

### AssignFrom

This behavior creates a ref to the supplied Timeline implementation's observers and resets the inheriting flag. This means that changes to the parent, here being the supplied Timeline, will begin affecting the target to which this behavior is applied.

```TypeScript
import { spfi, SPBrowser } from "@pnp/sp";
import "@pnp/sp/webs";
import { AssignFrom } from "@pnp/core";
// some local project file
import { MyCustomeBehavior } from "./behaviors.ts";

const source = spfi().using(SPBrowser());

const target = spfi().using(MyCustomeBehavior());

// target will now hold a reference to the observers contained in source
// changes to the subscribed observers in source will apply to target
// anything that was added by "MyCustomeBehavior" will no longer be present
target.using(AssignFrom(source.web));

// you can always apply additional behaviors or register directly on the events
// but once you modify target it will not longer ref source and changes to source will no longer apply
target.using(SomeOtherBehavior());
target.on.log(console.log);
```

### CopyFrom

Similar to AssignFrom, this method creates a copy of all the observers on the source and applies them to the target. This can be done either as a `replace` or `append` operation using the second parameter. The default is "append".

- "replace" will first clear each source moment's registered observers then apply each in source-order via the `on` operation.
- "append" will apply each source moment's registered observers in source-order via the `on` operation

> By design CopyFrom does NOT include moments defined by symbol keys.

```TypeScript
import { spfi, SPBrowser } from "@pnp/sp";
import "@pnp/sp/webs";
import { CopyFrom } from "@pnp/core";
// some local project file
import { MyCustomeBehavior } from "./behaviors.ts";

const source = spfi().using(SPBrowser());

const target = spfi().using(MyCustomeBehavior());

// target will have the observers copied from source, but no reference to source. Changes to source's registered observers will not affect target.
// any previously registered observers in target are maintained as the default behavior is to append
target.using(CopyFrom(source.web));

// target will have the observers copied from source, but no reference to source. Changes to source's registered observers will not affect target.
// any previously registered observers in target are removed
target.using(CopyFrom(source.web, "replace"));

// you can always apply additional behaviors or register directly on the events
// with CopyFrom no reference to source is maintained
target.using(SomeOtherBehavior());
target.on.log(console.log);
```

As well `CopyFrom` supports a filter parameter if you only want to copy the observers from a subset of moments. This filter is a predicate function taking a single string key and returning true if the observers from that moment should be copied to the target.

```TypeScript
import { spfi, SPBrowser } from "@pnp/sp";
import "@pnp/sp/webs";
import { CopyFrom } from "@pnp/core";
// some local project file
import { MyCustomeBehavior } from "./behaviors.ts";

const source = spfi().using(SPBrowser());

const target = spfi().using(MyCustomeBehavior());

// target will have the observers copied from source, but no reference to source. Changes to source's registered observers will not affect target.
// any previously registered observers in target are maintained as the default behavior is to append
target.using(CopyFrom(source.web));

// target will have the observers `auth` and `send` copied from source, but no reference to source. Changes to source's registered observers will not affect target.
// any previously registered observers in target are removed
target.using(CopyFrom(source.web, "replace", (k) => /(auth|send)/i.test(k)));

// you can always apply additional behaviors or register directly on the events
// with CopyFrom no reference to source is maintained
target.using(SomeOtherBehavior());
target.on.log(console.log);
```


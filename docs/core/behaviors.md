# @pnp/core : behaviors

While you can always register observers to any Timeline's moments using the `.on.moment` syntax, to make things easier we have included the ability to create behaviors. Behaviors define one or more observer registrations abstracted into a single registration. To differentiate behaviors are applied with the `.using` method. The power of behaviors is they are composable so a behavior can apply other behaviors.

## Basic Example

Let's create a behavior that will register two observers to a Timeline. We'll use error and log since they exist on all Timelines. In this example let's imagine we need to include some special secret into every lifecycle for logging to work. And we also want a company wide method to track errors. So we roll our own behavior.

```TypeScript
import { Timeline, TimelinePipe } from "@pnp/core";
import { MySpecialLoggingFunction } from "../mylogging.js";

// top level function allows binding of values within the closure
export function MyBehavior(specialSecret: string): TimelinePipe {

    return (instance: Timeline<any>) => {

        instance.on.log(function (message: string, severity: number) {

            MySpecialLoggingFunction(message, severity, specialSecret);
        });

        instance.on.error(function (err: string | Error) {

            MySpecialLoggingFunction(typeof err === "string" ? err : err.toString(), severity, specialSecret);
        });

        return instance;
    };
}

obj.using(MyBehavior("HereIsMySuperSecretValue"));
```

## Composing Behaviors

We encourage you to use our defaults, or create your own default behavior appropriate to your needs. You can see all of the behaviors available in [@pnp/nodejs](../nodejs/behaviors.md), [@pnp/queryable](../queryable/behaviors.md), [@pnp/sp](../sp/behaviors.md), and [@pnp/graph](../graph/behaviors.md). These articles describe available defaults, as well as the foundational behaviors you can use to compose your own.

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

> You can easily share your composed behaviors across your projects using [library components in SPFx](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/library-component-overview), a company CDN, or an npm package.

_index.ts_
```TypeScript
import { CompanyDefault } from "./company-default.ts";
import { graphfi } from "@pnp/graph";

// we can consistently and easily setup our graph instance using a single behavior
const graph = graphfi().using(CompanyDefault());
```

[](#assignfrom)

## Core Behaviors

This section describes two behaviors provided by the `@pnp/core` library, AssignFrom and CopyFrom. Likely you won't often need them directly - they are used in some places internally - but they are made available should they prove useful.

### AssignFrom

This behavior creates a ref to the supplied Timeline implementation's observers and resets the inheriting flag. This means that changes to the parent, here being the supplied Timeline, will begin affecting the target to which this behavior is applied.

```TypeScript
import { spfi, SPBrowser } from "@pnp/sp";
import { AssignFrom } from "@pnp/core";
// some local project file
import { MyCustomeBehavior } from "./behaviors.ts";

const source = spfi().using(SPBrowser());

const target = spfi().using(MyCustomeBehavior());

// target will now hold a reference to the observers contained in source
// changes to the subscribed observers in source will apply to target
// anything that was added by "MyCustomeBehavior" will no longer be present
target.using(AssignFrom(source));

// you can always apply additional behaviors or register directly on the events
// but once you modify target it will not longer ref source and changes to source will no longer apply
target.using(SomeOtherBehavior());
target.on.log(console.log);
```

### CopyFrom

Similar to AssignFrom, this method creates a copy of all the observers on the source and applies them to the target. This can be done either as a `replace` or `append` operation using the second parameter. The default is "append".

- "replace" will first clear each source moment's registered observers then apply each in source-order via the `on` operation.
- "append" will apply each source moment's registered observers in source-order via the `on` operation

```TypeScript
import { spfi, SPBrowser } from "@pnp/sp";
import { CopyFrom } from "@pnp/core";
// some local project file
import { MyCustomeBehavior } from "./behaviors.ts";

const source = spfi().using(SPBrowser());

const target = spfi().using(MyCustomeBehavior());

// target will have the observers copied from source, but no reference to source. Changes to source's registered observers will not affect target.
// any previously registered observers in target are maintained as the default behavior is to append
target.using(CopyFrom(source));

// target will have the observers assigned from source, but no reference to source. Changes to source's registered observers will not affect target.
// any previously registered observers in target are removed
target.using(CopyFrom(source, "replace"));

// you can always apply additional behaviors or register directly on the events
// with CopyFrom no reference to source is maintained
target.using(SomeOtherBehavior());
target.on.log(console.log);
```

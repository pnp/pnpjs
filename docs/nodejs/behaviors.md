# @pnp/nodejs : behaviors

The article describes the behaviors exported by the `@pnp/nodejs` library. Please also see available behaviors in [@pnp/core](../core/behaviors.md), [@pnp/queryable](../queryable/behaviors.md), [@pnp/sp](../sp/behaviors.md), and [@pnp/graph](../graph/behaviors.md).

## NodeFetch

This behavior, for use in nodejs, provides basic fetch support through the `node-fetch` package. It replaces any other registered observers on the send moment by default, but this can be controlled via the props. Remember, when registering observers on the send moment only the first one will be used so not replacing

> For fetch configuration in browsers please see [@pnp/queryable behaviors]("../../../queryable/behaviors.md).

```TypeScript
import { NodeFetch } from "@pnp/nodejs";

import "@pnp/sp/webs/index.js";

const sp = spfi().using(NodeFetch());

await sp.webs();
```

```TypeScript
import { NodeFetch } from "@pnp/nodejs";

import "@pnp/sp/webs/index.js";

const sp = spfi().using(NodeFetch({ replace: false }));

await sp.webs();
```

## NodeFetchWithRetry

This behavior makes fetch requests but will attempt to retry the request on certain failures such as throttling.

```TypeScript
import { NodeFetchWithRetry } from "@pnp/nodejs";

import "@pnp/sp/webs/index.js";

const sp = spfi().using(NodeFetchWithRetry());

await sp.webs();
```

You can also control how the behavior works through its props. The `replace` value works as described above for NodeFetch. `interval` specifies the initial dynamic back off value in milliseconds. This value is ignored if a "Retry-After" header exists in the response. `retries` indicates the number of times to retry before failing the request, the default is 3. A default of 3 will result in up to 4 total requests being the initial request and threee potential retries.

```TypeScript
import { NodeFetchWithRetry } from "@pnp/nodejs";

import "@pnp/sp/webs/index.js";

const sp = spfi().using(NodeFetchWithRetry({
    retries: 2,
    interval: 400,
    replace: true,
}));

await sp.webs();
```

## GraphDefault

The `GraphDefault` behavior is a composed behavior including MSAL, NodeFetchWithRetry, DefaultParse, graph's DefaultHeaders, and graph's DefaultInit. It is configured using a props argument:

```TypeScript
interface IGraphDefaultProps {
    baseUrl?: string;
    msal: {
        config: Configuration;
        scopes?: string[];
    };
}
```

You can use the baseUrl property to specify either v1.0 or beta - or one of the [special graph urls](https://docs.microsoft.com/en-us/graph/deployments#microsoft-graph-and-graph-explorer-service-root-endpoints).

```TypeScript
import { GraphDefault } from "@pnp/nodejs";
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users/index.js";

const graph = graphfi().using(GraphDefault({
    // use the German national graph endpoint
    baseUrl: "https://graph.microsoft.de/v1.0",
    msal: {
        config: { /* my msal config */ },
    }
}));

await graph.me();
```

## MSAL

This behavior provides a thin wrapper around the `@azure/msal-node` library. The options you provide are passed directly to msal, and all options are available.

```TypeScript
import { MSAL } from "@pnp/nodejs";
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users/index.js";

const graph = graphfi().using(MSAL(config: { /* my msal config */ }, scopes: ["https://graph.microsoft.com/.default"]);

await graph.me();
```

## SPDefault

The `SPDefault` behavior is a composed behavior including MSAL, NodeFetchWithRetry, DefaultParse,sp's DefaultHeaders, and sp's DefaultInit. It is configured using a props argument:

```TypeScript
interface ISPDefaultProps {
    baseUrl?: string;
    msal: {
        config: Configuration;
        scopes: string[];
    };
}
```

You can use the baseUrl property to specify the absolute site/web url to which queries should be set. 

```TypeScript
import { SPDefault } from "@pnp/nodejs";

import "@pnp/sp/webs/index.js";

const sp = spfi().using(SPDefault({
    msal: {
        config: { /* my msal config */ },
        scopes: ["Scope.Value", "Scope2.Value"],
    }
}));

await sp.web();
```

## StreamParse

`StreamParse` is a specialized parser allowing request results to be read as a nodejs stream. The return value when using this parser will be of the shape:

```TypeScript
{
    body: /* The .body property of the Response object */,
    knownLength: /* number value calculated from the Response's content-length header */
}
```

```TypeScript
import { StreamParse } from "@pnp/nodejs";

import "@pnp/sp/webs/index.js";

const sp = spfi().using(StreamParse());

const streamResult = await sp.someQueryThatReturnsALargeFile();

// read the stream as text
const txt = await new Promise<string>((resolve) => {
    let data = "";
    streamResult.body.on("data", (chunk) => data += chunk);
    streamResult.body.on("end", () => resolve(data));
});
```

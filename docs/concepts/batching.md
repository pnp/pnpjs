# Batching

Where possible batching can significantly increase application performance by combining multiple requests to the server into one. This is especially useful when first establishing state, but applies for any scenario where you need to make multiple requests before loading or based on a user action. Batching is supported within the sp and graph libraries as shown below.


## SP Example

```ts
import { spfi } from "@pnp/sp";
import { SPDefault } from "@pnp/nodejs";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/batching";

const sp = spfi().using(SPDefault(this.context));

const [batchedSP, execute] = sp.batched();

let res = [];

// you need to use .then syntax here as otherwise the application will stop and await the result
batchedSP.web().then(r => res.push(r));

// you need to use .then syntax here as otherwise the application will stop and await the result
// ODATA operations such as select, filter, and expand are supported as normal
batchedSP.web.lists.select("Title")().then(r => res.push(r));

// Executes the batched calls
await execute();

// Results for all batched calls are available
for(let i=0; i<res.length; i++){
    ///Do something with the results
}
```

> Batches must be for the same web, you cannot combine requests from multiple webs into a batch.


## Graph Example

```ts
import { graphfi } from "@pnp/graph";
import { GraphDefault } from "@pnp/nodejs";
import "@pnp/graph/users";
import "@pnp/graph/groups";
import "@pnp/graph/batching";

const graph = graphfi().using(GraphDefault({
    msal: {
        config: {msal config},
        scopes: {msal scopes},
    },
}));

const [batchedGraph, execute] = graph.batched();

let res = [];

// Pushes the results of these calls to an array
// you need to use .then syntax here as otherwise the application will stop and await the result
batchedGraph.users().then(r => res.push(r));

// you need to use .then syntax here as otherwise the application will stop and await the result
// ODATA operations such as select, filter, and expand are supported as normal
batchedGraph.groups.select("Id")().then(r => res.push(r));

// Executes the batched calls
await execute();

// Results for all batched calls are available
for(let i=0; i<res.length; i++){
    // Do something with the results
}
```

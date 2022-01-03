# Batching
// TODO: Intro

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

batchedSP.web().then(r => res.push(r));

batchedSP.web.lists().then(r => res.push(r));

//Executes the batched calls
await execute();

//Results for all batched calls are available
for(let i=0; i<res.length; i++){
    ///Do something with the results
}
```

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

//Pushes the results of these calls to an array
batchedGraph.users().then(r => res.push(r));

batchedGraph.groups().then(r => res.push(r));

//Executes the batched calls
await execute();

//Results for all batched calls are available
for(let i=0; i<res.length; i++){
    ///Do something with the results
}
```
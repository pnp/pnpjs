# Batching

Where possible batching can significantly increase application performance by combining multiple requests to the server into one. This is especially useful when first establishing state, but applies for any scenario where you need to make multiple requests before loading or based on a user action. Batching is supported within the sp and graph libraries as shown below.

## SP Example

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/batching";

const sp = spfi(...);

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
for(let i = 0; i < res.length; i++) {
    ///Do something with the results
}
```

### Using a batched web

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/batching";

const sp = spfi(...);

const [batchedWeb, execute] = sp.web.batched();

let res = [];

// you need to use .then syntax here as otherwise the application will stop and await the result
batchedWeb().then(r => res.push(r));

// you need to use .then syntax here as otherwise the application will stop and await the result
// ODATA operations such as select, filter, and expand are supported as normal
batchedWeb.lists.select("Title")().then(r => res.push(r));

// Executes the batched calls
await execute();

// Results for all batched calls are available
for(let i = 0; i < res.length; i++) {
    ///Do something with the results
}
```

> Batches must be for the same web, you cannot combine requests from multiple webs into a batch.

## Graph Example

```TypeScript
import { graphfi } from "@pnp/graph";
import { GraphDefault } from "@pnp/nodejs";
import "@pnp/graph/users";
import "@pnp/graph/groups";
import "@pnp/graph/batching";

const graph = graphfi().using(GraphDefault({ /* ... */ }));

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

## Advanced Batching

For most cases the above usage should be sufficient, however you may be in a situation where you do not have convenient access to either an spfi instance or a web. Let's say for example you want to add a lot of items to a list and have an IList. You can in these cases use the createBatch function directly. We recommend as much as possible using the sp or web or graph batched method, but also provide this additional flexibility if you need it.

```TypeScript
import { createBatch } from "@pnp/sp/batching";
import { SPDefault } from "@pnp/nodejs";
import { IList } from "@pnp/sp/lists";
import "@pnp/sp/items/list";

const sp = spfi("https://tenant.sharepoint.com/sites/dev").using(SPDefault({ /* ... */ }));

// in one part of your application you setup a list instance
const list: IList = sp.web.lists.getByTitle("MyList");


// in another part of your application you want to batch requests, but do not have the sp instance available, just the IList

// note here the first part of the tuple is NOT the object, rather the behavior that enables batching. You must still register it with `using`.
const [batchedListBehavior, execute] = createBatch(list);
// this list is now batching all its requests
list.using(batchedListBehavior);

// these will all occur within a single batch
list.items.add({ Title: `1: ${getRandomString(4)}` });
list.items.add({ Title: `2: ${getRandomString(4)}` });
list.items.add({ Title: `3: ${getRandomString(4)}` });
list.items.add({ Title: `4: ${getRandomString(4)}` });

await execute();
```

This is of course also possible with the graph library as shown below.

```TypeScript
import { graphfi } from "@pnp/graph";
import { createBatch } from "@pnp/graph/batching";
import { GraphDefault } from "@pnp/nodejs";
import "@pnp/graph/users";

const graph = graphfi().using(GraphDefault({ /* ... */ }));

const users = graph.users;

const [batchedBehavior, execute] = createBatch(users);
users.using(batchedBehavior);

users();
// we can only place the 'users' instance into the batch once
graph.users.using(batchedBehavior)();
graph.users.using(batchedBehavior)();
graph.users.using(batchedBehavior)();

await execute();       
```

[](#reuse)

## Don't reuse objects in Batching

It shouldn't come up often, but you can not make multiple requests using the same instance of a queryable in a batch. Let's consider the **incorrect** example below:

> The error message will be "This instance is already part of a batch. Please review the docs at <https://pnp.github.io/pnpjs/concepts/batching#reuse>."

```TypeScript
import { graphfi } from "@pnp/graph";
import { createBatch } from "@pnp/graph/batching";
import { GraphDefault } from "@pnp/nodejs";
import "@pnp/graph/users";

const graph = graphfi().using(GraphDefault({ /* ... */ }));

// gain a batched instance of the graph
const [batchedGraph, execute] = graph.batched();

// we take a reference to the value returned from .users
const users = batchedGraph.users;

// we invoke it, adding it to the batch (this is a request to /users), it will succeed
users();

// we invoke it again, because this instance has already been added to the batch, this request will throw an error
users();

// we execute the batch, this promise will resolve
await execute();        
```

To overcome this you can either start a new fluent chain or use the factory method. Starting a new fluent chain at any point will create a new instance. Please review the **corrected** sample below.

```TypeScript
import { graphfi } from "@pnp/graph";
import { createBatch } from "@pnp/graph/batching";
import { GraphDefault } from "@pnp/nodejs";
import { Users } from "@pnp/graph/users";

const graph = graphfi().using(GraphDefault({ /* ... */ }));

// gain a batched instance of the graph
const [batchedGraph, execute] = graph.batched();

// we invoke a new instance of users from the batchedGraph
batchedGraph.users();

// we again invoke a new instance of users from the batchedGraph, this is fine
batchedGraph.users();

const users = batchedGraph.users;
// we can do this once
users();

// by creating a new users instance using the Users factory we can keep adding things to the batch
// users2 will be part of the same batch
const users2 = Users(users);
users2();

// we execute the batch, this promise will resolve
await execute();        
```

> In addition you cannot continue using a batch after execute. Once execute has resolved the batch is done. You should create a new batch using one of the described methods to conduct another batched call.

## Case where batch result returns an object that can be invoked

In the following example, the results of adding items to the list is an object with a type of **IItemAddResult** which is `{data: any, item: IItem}`. Since version v1 the expectation is that the `item` object is immediately usable to make additional queries. When this object is the result of a batched call, this was not the case so we have added additional code to reset the observers using the original base from witch the batch was created, mimicing the behavior had the **IItem** been created from that base withyout a batch involved. We use [CopyFrom](../core/behaviors.md#CopyFrom) to ensure that we maintain the references to the InternalResolve and InternalReject events through the end of this timelines lifecycle.

```TypeScript
import { createBatch } from "@pnp/sp/batching";
import { SPDefault } from "@pnp/nodejs";
import { IList } from "@pnp/sp/lists";
import "@pnp/sp/items/list";

const sp = spfi("https://tenant.sharepoint.com/sites/dev").using(SPDefault({ /* ... */ }));

// in one part of your application you setup a list instance
const list: IList = sp.web.lists.getByTitle("MyList");

const [batchedListBehavior, execute] = createBatch(list);
// this list is now batching all its requests
list.using(batchedListBehavior);

let res: IItemAddResult[] = [];

// these will all occur within a single batch
list.items.add({ Title: `1: ${getRandomString(4)}` }).then(r => res.push(r));
list.items.add({ Title: `2: ${getRandomString(4)}` }).then(r => res.push(r));
list.items.add({ Title: `3: ${getRandomString(4)}` }).then(r => res.push(r));
list.items.add({ Title: `4: ${getRandomString(4)}` }).then(r => res.push(r));

await execute();

let newItems: IItem[] = [];

for(let i=0; i<res.length; i++){
    //This line will correctly resolve
    const newItem = await res[i].item.select("Title")<{Title: string}>();
    newItems.push(newItem);
}
```

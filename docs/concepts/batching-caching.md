# Batching and Caching

When optimizing for performance you can combine [batching](batching.md) and [caching](../queryable/behaviors.md#caching) to reduce the overall number of requests. On the first request any cachable data is stored as expected once the request completes. On subsequent requests if data is found in the cache it is returned immediately and that request is not added to the batch, in fact the batch will never register the request. This can work across many requests such that some returned cached data and others do not - the non-cached requests will be added to and processed by the batch as expected.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import { Caching } from "@pnp/queryable";

const sp = spfi(...);

const [batchedSP, execute] = sp.batched();

batchedSP.using(Caching());

batchedSP.web().then(console.log);

batchedSP.web.lists().then(console.log);

// execute the first set of batched requests, no information is currently cached
await execute();

// create a new batch
const [batchedSP2, execute2] = await sp.batched();
batchedSP2.using(Caching());

// add the same requests - this simulates the user navigating away from or reloading the page
batchedSP2.web().then(console.log);
batchedSP2.web.lists().then(console.log);

// executing the batch will return the cached values from the initial requests
await execute2();
```

In this second example we include an update to the web's title. Because non-get requests are never cached the update code will always run, but the results from the two get requests will resolve from the cache prior to being added to the batch.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import { Caching } from "@pnp/queryable";

const sp = spfi(...);

const [batchedSP, execute] = sp.batched();

batchedSP.using(Caching());

batchedSP.web().then(console.log);

batchedSP.web.lists().then(console.log);

// this will never be cached
batchedSP.web.update({
    Title: "dev web 1",
});

// execute the first set of batched requests, no information is currently cached
await execute();

// create a new batch
const [batchedSP2, execute2] = await sp.batched();
batchedSP2.using(Caching());

// add the same requests - this simulates the user navigating away from or reloading the page
batchedSP2.web().then(console.log);
batchedSP2.web.lists().then(console.log);

// this will never be cached
batchedSP2.web.update({
    Title: "dev web 2",
});

// executing the batch will return the cached values from the initial requests
await execute2();
```

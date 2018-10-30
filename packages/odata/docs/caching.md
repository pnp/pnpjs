# @pnp/odata/caching

Often times data doesn't change that quickly, especially in the case of rolling up corporate news or upcoming events. These types of things can be cached for minutes if not hours. To help make caching easy you just need to insert the usingCaching method in your chain. This only applies to get requests. The usingCaching method can be used with the inBatch method as well to cache the results of batched requests.

The below examples uses the @pnp/sp library as the example - but this works equally well for any library making use of the @pnp/odata base classes, such as @pnp/graph.

## Basic example

You can use the method without any additional configuration. We have made some default choices for you and will discuss ways to override them later. The below code will get the items from the list, first checking the cache for the value. You can also use it with OData operators such as top and orderBy. The usingCaching() should always be the last method in the chain before the get() (OR if you are using [[batching]] these methods can be transposed, more details below).

```TypeScript
import { sp } from "@pnp/sp";

sp.web.lists.getByTitle("Tasks").items.usingCaching().get().then(r => {
    console.log(r)
});

sp.web.lists.getByTitle("Tasks").items.top(5).orderBy("Modified").usingCaching().get().then(r => {
    console.log(r)
});
```

## Globally Configure Cache Settings

If you would like to not use the default values, but don't want to clutter your code by setting the caching values on each request you can configure custom options globally. These will be applied to all calls to usingCaching() throughout your application.

```TypeScript
import { sp } from "@pnp/sp";

sp.setup({
    defaultCachingStore: "session", // or "local"
    defaultCachingTimeoutSeconds: 30,
    globalCacheDisable: false // or true to disable caching in case of debugging/testing
});

sp.web.lists.getByTitle("Tasks").items.top(5).orderBy("Modified").usingCaching().get().then(r => {
    console.log(r)
});
```

## Per Call Configuration

If you prefer more verbose code or have a need to manage the cache settings on a per request basis you can include individual caching settings for each request. These settings are passed to the usingCaching method call and are defined in the following interface. If you want to use the per-request options you must include the key.

```TypeScript
export interface ICachingOptions {
    expiration?: Date;
    storeName?: "session" | "local";
    key: string;
}
```

```TypeScript
import { sp } from "@pnp/sp";
import { dateAdd } from "@pnp/common";

sp.web.lists.getByTitle("Tasks").items.top(5).orderBy("Modified").usingCaching({
    expiration: dateAdd(new Date(), "minute", 20),
    key: "My Key",
    storeName: "local"
}).get().then(r => {
    console.log(r)
});
```

## Using [Batching](odata-batch.md) with Caching

You can use batching and caching together, but remember caching is only applied to get requests. When you use them together the methods can be transposed, the below example is valid.

```TypeScript
import { sp } from "@pnp/sp";

let batch = sp.createBatch();

sp.web.lists.inBatch(batch).usingCaching().get().then(r => {
    console.log(r)
});

sp.web.lists.getByTitle("Tasks").items.usingCaching().inBatch(batch).get().then(r => {
    console.log(r)
});

batch.execute().then(() => console.log("All done!"));
```

# Transition Guide V3 -> V4

    **For more information about migrating from an earlier version of PnPjs please see the transition guides below**

    - [V2 -> V3 Transition Guide](https://pnp.github.io/pnpjs/v3/transition-guide/)
    - [V1 -> V2 Transition Guide](https://pnp.github.io/pnpjs/v2/transition-guide/)

It is our hope that the transition from version 3.\* to 4.\* will be as painless as possible as the changes we have made are not as extensive as with version 3. Below are some highlights of the most disruptive changes that were made. For a full, detailed list of what's been added, updated, and removed please see our [CHANGELOG](https://github.com/pnp/pnpjs/blob/main/CHANGELOG.md)

## SharePoint Taxonomy has moved to @pnp/graph from @pnp/sp

To better support Taxonomy authentication and control we've moved our Taxonomy implementation from the @pnp/sp module to the @pnp/graph module. We were utilizing the v2.x endpoints to continue to support taxonomy in the SharePoint bundle and we decided that this was not the best approach. You will need to update your taxonomy implementations to use the graph endpoints.

## Add/Update methods no longer returning data and a queryable instance

The primary breaking change will be with add and update method return values. We are going to return what the calling endpoint returns in all cases instead of an object that includes data property and an "item" property. This means anywhere that you are referencing the return objects `data` property you will need to remove that reference. Many of the graph endpoints return the added or updated object so, other than changing the reference this will not impact your code.

SharePoint returns the object for add events but many update events return 204, which would translate into a return type of void. In that case you will have to adjust your code to make a second call if you want to validate that the item has been updated:

Ex:

    ```TypeScript
    // Version 3 
    const update = await sp.web.lists.getByTitle("My List").items.getById(1).update({Title: "My New Title"});
    const newTitle = update.data.Title;

    // Version 4
    await sp.web.lists.getByTitle("My List").items.getById(1).update({Title: "My New Title"});
    const updatedItem = await sp.web.lists.getByTitle("My List").items.getById(1)();
    ```

As stated before, when adding items in both graph and SharePoint the call will return the object that was created. So you can get the newly created objects `id` by simply referencing it directly:

Ex:

    ```TypeScript
    // Version 3 
    const newItem = await sp.web.lists.getByTitle("My List").items.add({Title: "My New Title"});
    const newItemId = newItem.data.Id;

    // Version 4
    const newItem = await sp.web.lists.getByTitle("My List").items.add({Title: "My New Title"});
    const newItemId = newItem.Id;
    ```

## Async Iterator Pattern

As an updated pattern we are recommending you move to an async iterator pattern to get more than 5000 items from a list.

With that in mind we've removed the `/items/get-all` endpoint. In addition we've updated the @pnp/sp package's `IItems` and `_Items` collections as well as the @pnp/graph `IGraphQueryableCollection` to support the async iterator pattern.

Check out this example for more information on this pattern: [Get Paged Items](./sp/items.md#get-paged-items).

For advanced async patterns: [Async Paging](./concepts/async-paging.md).

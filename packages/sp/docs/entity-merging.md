# @pnp/sp - entity merging

Sometimes when we make a query entity's data we would like then to immediately run other commands on the returned entity. To have data returned as its represending type we make use of the _spODataEntity_ and _spODataEntityArray_ parsers. The below approach works for all instance types such as List, Web, Item, or Field as examples.

## Request a single entity

If we are loading a single entity we use the _spODataEntity_ method. Here we show loading a list item using the Item class and a simple get query.

```TypeScript
import { sp, spODataEntity, Item } from "@pnp/sp";

// interface defining the returned properites
interface MyProps {
    Id: number;
}

try {

    // get a list item laoded with data and merged into an instance of Item
    const item = await sp.web.lists.getByTitle("ListTitle").items.getById(1).get(spODataEntity<Item, MyProps>(Item));

    // log the item id, all properties specified in MyProps will be type checked
    Logger.write(`Item id: ${item.Id}`);

    // now we can call update because we have an instance of the Item type to work with as well
    await item.update({
        Title: "New title.",
    });

} catch (e) {
    Logger.error(e);
}
```

## Request a collection

The same pattern works when requesting a collection of objects with the exception of using the _spODataEntityArray_ method.

```TypeScript
import { sp, spODataEntityArray, Item } from "@pnp/sp";

// interface defining the returned properites
interface MyProps {
    Id: number;
    Title: string;
}

try {

    // get a list item laoded with data and merged into an instance of Item
    const items = await sp.web.lists.getByTitle("ListTitle").items.select("Id", "Title").get(spODataEntityArray<Item, MyProps>(Item));

    Logger.write(`Item id: ${items.length}`);

    Logger.write(`Item id: ${items[0].Title}`);

    // now we can call update because we have an instance of the Item type to work with as well
    await items[0].update({
        Title: "New title.",
    });

} catch (e) {

    Logger.error(e);
}
```

## Use with Item getPaged

_Added in 1.3.4_

Starting with 1.3.4 you can now include entity merging in the getPaged command as shown below. This approach will work with any objects matching the required factory pattern.

```TypeScript
// create Item instances with the defined property Title
const items = await sp.web.lists.getByTitle("BigList").items.select("Title").getPaged(spODataEntityArray<Item, { Title: string }>(Item));

console.log(items.results.length);

// now invoke methods on the Item object
const perms = await items.results[0].getCurrentUserEffectivePermissions();

console.log(JSON.stringify(perms, null, 2));

// you can also type the result slightly differently if you prefer this, but the results are the same functionally.
const items2 = await sp.web.lists.getByTitle("BigList").items.select("Title").getPaged<(Item & { Title: string })[]>(spODataEntityArray(Item));
```

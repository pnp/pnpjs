# @pnp/sp - entity merging

Sometimes when we make a query entity's data we would like then to immediately run other commands on the returned entity. To have data returned as its representing type we make use of the _spODataEntity_ and _spODataEntityArray_ parsers. The below approach works for all instance types such as List, Web, Item, or Field as examples.

## Importing spODataEntity and spODataEntityArray

You can import spODataEntity and spODataEntityArray in two ways, depending on your use case. The simplest way is to use the presets/all import as shown in the examples. The downside of this approach is that you can't take advantage of selective imports.

If you want to take advantage of selective imports while using either of the entity parsers you can use:

```TypeScript
import { spODataEntity, spODataEntityArray } from "@pnp/sp/odata";
```

The full selective import for the first sample would be:

```TypeScript
import { sp } from "@pnp/sp";
import { spODataEntity } from "@pnp/sp/odata";
import { Item, IItem } from "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
```

## Request a single entity

If we are loading a single entity we use the _spODataEntity_ method. Here we show loading a list item using the Item class and a simple get query.

```TypeScript
import { sp, spODataEntity, Item, IItem } from "@pnp/sp/presets/all";

// interface defining the returned properties
interface MyProps {
    Id: number;
}

try {

    // get a list item loaded with data and merged into an instance of Item
    const item = await sp.web.lists.getByTitle("ListTitle").items.getById(1).usingParser(spODataEntity<IItem, MyProps>(Item))();

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
import { sp, spODataEntityArray, Item, IItem } from "@pnp/sp/presets/all";

// interface defining the returned properties
interface MyProps {
    Id: number;
    Title: string;
}

try {

    // get a list item loaded with data and merged into an instance of Item
    const items = await sp.web.lists.getByTitle("OrderByList").items.select("Id", "Title").usingParser(spODataEntityArray<IItem, MyProps>(Item))();

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

# @pnp/graph/lists

More information can be found in the official Graph documentation:

- [List Resource Type](https://docs.microsoft.com/en-us/graph/api/resources/list?view=graph-rest-1.0)

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Get Lists

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/lists";

const graph = graphfi(...);

const siteLists = await graph.site.getById("{site identifier}").lists();
```

## Get List by Id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/lists";

const graph = graphfi(...);

const listInfo = await graph.sites.getById("{site identifier}").lists.getById("{list identifier}")();
```

## Add a List

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/lists";

const graph = graphfi(...);

const sampleList: List = {
    displayName: "PnPGraphTestList",
    list: { "template": "genericList" },
};

const list = await graph.sites.getById("{site identifier}").lists.add(listTemplate);
```

## Update a List

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/lists";

const graph = graphfi(...);

const list = await graph.sites.getById("{site identifier}").lists.getById("{list identifier}").update({ displayName: "MyNewListName" });
```

## Delete a List

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/lists";

const graph = graphfi(...);

await graph.sites.getById("{site identifier}").lists.getById("{list identifier}").delete();
```

## Get List Columns

For more information about working please see documentation on [columns](./columns.md)

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/lists";
import "@pnp/graph/columns";

const graph = graphfi(...);

await graph.sites.getById("{site identifier}").lists.getById("{list identifier}").columns();
```

## Get List Items

Currently, recieving list items via @pnpjs/graph API is not possible.

This can currently be done with a call by path as documented under [@pnpjs/graph/items](./items.md)

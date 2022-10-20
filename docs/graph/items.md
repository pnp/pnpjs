# @pnp/graph/items

Currently, there is no module in graph to access all items directly. Please, instead, default to search by path using the following methods.

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

### Get list items

```TypeScript
import { Site } from "@pnp/graph/sites";

const sites = graph.sites.getById("{site id}");

const items = await Site(sites, "lists/{listid}/items")();
```

### Get File/Item version information

```TypeScript
import { Site } from "@pnp/graph/sites";

const sites = graph.sites.getById("{site id}");

const users = await Site(sites, "lists/{listid}/items/{item id}/versions")();
```

### Get list items with fields included

```TypeScript
import { Site } from "@pnp/graph/sites";
import "@pnp/graph/lists";

const sites = graph.sites.getById("{site id}");

const listItems : IList[] = await Site(sites, "lists/{site id}/items?$expand=fields")();
```

#### Hint: Note that you can just use normal [graph queries](https://developer.microsoft.com/en-us/graph/graph-explorer) in this search.

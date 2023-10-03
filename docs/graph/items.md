# @pnp/graph/items

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

### Get list items

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/list-items";
import "@pnp/graph/lists";

const graph = graphfi(...);
const items = const siteLists = await graph.site.getById("{site identifier}").lists.getById("{list identifier}").items();

```

### Get File/Item version information

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/list-items";
import "@pnp/graph/lists";

const graph = graphfi(...);
const itemVersions = const siteLists = await graph.site.getById("{site identifier}").lists.getById("{list identifier}").items.getById(1).versions();
   
```

### Get list items with fields included

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/list-items";
import "@pnp/graph/lists";

const graph = graphfi(...);
const listItems = await graph.site.getById("{site identifier}").lists.getById("{list identifier}").items..expand("fields")();
   
```

### Create a new list item

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/list-items";
import "@pnp/graph/lists";

const graph = graphfi(...);
var newItem = await graph.sites.getById("{site identifier}").lists.getById("{list identifier}").items.add({
        Title: "Widget",
});
   
```
### Update a list item

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/list-items";
import "@pnp/graph/lists";

const graph = graphfi(...);
var newItem = await graph.sites.getById("{site identifier}").lists.getById("{list identifier}").items.getById("{item identifier}").update({
        Title: "Widget",
});
   
```

### Delete a list item

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/list-items";
import "@pnp/graph/lists";

const graph = graphfi(...);
var newItem = await graph.sites.getById("{site identifier}").lists.getById("{list identifier}").items.getById("{item identifier}").delete();
   
```

### Get Document Set Versions of an Item

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/list-items";
import "@pnp/graph/lists";
import "@pnp/graph/documentSetVersions";
const graph = graphfi(...);
var item = await graph.sites.getById("{site identifier}").lists.getById("{list identifier}").items.getById("{item identifier}")();
var documentSetVersions = item.documentSetVersions();
   
```

### Create a new Document Set Version

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/list-items";
import "@pnp/graph/lists";
import "@pnp/graph/documentSetVersions";

const graph = graphfi(...);
var item = await graph.sites.getById("{site identifier}").lists.getById("{list identifier}").items.getById("{item identifier}").documentSetVersions.add("New Comment");        
   
```

### Restore a Document Set version

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/list-items";
import "@pnp/graph/lists";
import "@pnp/graph/documentSetVersions";

const graph = graphfi(...);
var item = await graph.sites.getById("{site identifier}").lists.getById("{list identifier}").items.getById("{item identifier}").documentSetVersions.getById(1).restore();
   
```

#### Hint: Note that you can just use normal [graph queries](https://developer.microsoft.com/en-us/graph/graph-explorer) in this search.

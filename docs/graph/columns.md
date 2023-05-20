# Graph Columns

More information can be found in the official Graph documentation:

- [Columns Resource Type](https://docs.microsoft.com/en-us/graph/api/resources/columndefinition?view=graph-rest-1.0)
- [List Resource Type](https://docs.microsoft.com/en-us/graph/api/resources/list?view=graph-rest-1.0)
- [Content Type Resource Type](https://docs.microsoft.com/en-us/graph/api/resources/contenttype?view=graph-rest-1.0)

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Get Columns

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/columns";
//Needed for lists
import "@pnp/graph/lists";
//Needed for content types
import "@pnp/graph/content-types";

const graph = graphfi(...);

const siteColumns = await graph.site.getById("{site identifier}").columns();
const listColumns = await graph.site.getById("{site identifier}").lists.getById("{list identifier}").columns();
const contentTypeColumns = await graph.site.getById("{site identifier}").contentTypes.getById("{content type identifier}").columns();
```

## Get Columns by Id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/columns";
//Needed for lists
import "@pnp/graph/lists";
//Needed for content types
import "@pnp/graph/content-types";

const graph = graphfi(...);

const siteColumn = await graph.site.getById("{site identifier}").columns.getById("{column identifier}")();
const listColumn = await graph.site.getById("{site identifier}").lists.getById("{list identifier}").columns.getById("{column identifier}")();
const contentTypeColumn = await graph.site.getById("{site identifier}").contentTypes.getById("{content type identifier}").columns.getById("{column identifier}")();
```

## Add a Columns (Sites and List)

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/columns";
//Needed for lists
import "@pnp/graph/lists";

const graph = graphfi(...);

const sampleColumn: ColumnDefinition = {
    description: "PnPTestColumn Description",
    enforceUniqueValues: false,
    hidden: false,
    indexed: false,
    name: "PnPTestColumn",
    displayName: "PnPTestColumn",
    text: {
        allowMultipleLines: false,
        appendChangesToExistingText: false,
        linesForEditing: 0,
        maxLength: 255,
    },
};

const siteColumn = await graph.site.getById("{site identifier}").columns.add(sampleColumn);
const listColumn = await graph.site.getById("{site identifier}").lists.getById("{list identifier}").columns.add(sampleColumn);
```

## Add a Column Reference (Content Types)

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/columns";
//Needed for content types
import "@pnp/graph/content-ypes";

const graph = graphfi(...);

const siteColumn = await graph.site.getById("{site identifier}").columns.getById("{column identifier}")();
const contentTypeColumn = await graph.site.getById("{site identifier}").contentTypes.getById("{content type identifier}").columns.addRef(siteColumn);
```

## Update a Column (Sites and List)

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/columns";
//Needed for lists
import "@pnp/graph/lists";

const graph = graphfi(...);

const site = graph.site.getById("{site identifier}");
const updatedSiteColumn = await site.columns.getById("{column identifier}").update({ displayName: "New Name" });
const updateListColumn = await site.lists.getById("{list identifier}").columns.getById("{column identifier}").update({ displayName: "New Name" });
```

## Delete a Column

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/columns";
//Needed for lists
import "@pnp/graph/lists";
//Needed for content types
import "@pnp/graph/content-types";

const graph = graphfi(...);

const site = graph.site.getById("{site identifier}");
const siteColumn = await site.columns.getById("{column identifier}").delete();
const listColumn = await site.lists.getById("{list identifier}").columns.getById("{column identifier}").delete();
const contentTypeColumn = await site.contentTypes.getById("{content type identifier}").columns.getById("{column identifier}").delete();
```

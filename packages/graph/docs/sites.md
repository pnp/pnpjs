# @pnp/graph/sites

The ability to manage sites, lists and listitems in SharePoint is a capability introduced in version 1.3.0 of @pnp/graph.

## Get the Root Site

Using the sites.root().get() you can get the tenant root site

```TypeScript
import { graph } from "@pnp/graph";

const tenantRootSite = await graph.sites.root.get()

```

## Get the Root Site by Id

Using the sites.getById().get() you can get the root site as well

```TypeScript
import { graph } from "@pnp/graph";

const tenantRootSite = await graph.sites.getById('contoso.sharepoint.com').get()

```

## Access a Site by server-relative URL

Using the sites.getById().get() you can get a specific site. With the combination of the base URL and a relative URL.
We are using an internal method for combining the URL in the right combination, with `:` ex: `contoso.sharepoint.com:/sites/site1:`

Here are a few url combinations that works:

```TypeScript
import { graph } from "@pnp/graph";

// No / in the URLs
const siteByRelativeUrl = await graph.sites.getById('contoso.sharepoint.com', 'sites/site1').get()

// Both trailing / in the base URL and starting / in the relative URL
const siteByRelativeUrl = await graph.sites.getById('contoso.sharepoint.com/', '/sites/site1').get()

// Both trailing / in the base URL and starting and trailing / in the relative URL
const siteByRelativeUrl = await graph.sites.getById('contoso.sharepoint.com/', '/sites/site1/').get()

```

## Get the Sub Sites in a Site

Using the sites().get() you can get the sub sites of a site. As this is returned as Sites, you could use getById() for a specific site and use the operations.

```TypeScript
import { graph } from "@pnp/graph";

const subsites = await graph.sites.getById('contoso.sharepoint.com').sites.get();

```
---

## Get Content Types

Using the contentTypes().get() you can get the Content Types from a Site or from a List

```TypeScript
import { graph } from "@pnp/graph";

const contentTypesFromSite = await graph.sites.getById('contoso.sharepoint.com').contentTypes.get();

const contentTypesFromList = await graph.sites.getById('contoso.sharepoint.com').lists.getById('listId').contentTypes.get();

```

## Get Specific Content Type

Using the getById() you can get a specific Content Type from a Site or from a List

```TypeScript
import { graph } from "@pnp/graph";

const contentTypeFromSite = await graph.sites.getById('contoso.sharepoint.com').contentTypes.getById('contentTypeId').get();

const contentTypeFromList = await graph.sites.getById('contoso.sharepoint.com').lists.getById('listId').contentTypes.getById('contentTypeId').get();

```
---
## Get the Lists in a Site

Using the lists() you can get the lists of a site. 

```TypeScript
import { graph } from "@pnp/graph";

const lists = await graph.sites.getById('contoso.sharepoint.com').lists.get();

```

## Get a specific List in a Site

Using the lists.getById() you can get the lists of a site. 

```TypeScript
import { graph } from "@pnp/graph";

const list = await graph.sites.getById('contoso.sharepoint.com').lists.getById('listId').get();

```

## Create a Lists in a Site

Using the lists.create() you can create a list in a site. 

```TypeScript
import { graph } from "@pnp/graph";

const newLists = await graph.sites.getById('contoso.sharepoint.com').lists.create('DisplayName', {contentTypesEnabled: true, hidden: false, template: "genericList"})
```

---

## Get the default drive

Using the drive.get() you can get the default drive from a Site or a List

```TypeScript
import { graph } from "@pnp/graph";

const drive = await graph.sites.getById('contoso.sharepoint.com').drive.get();

const drive = await graph.sites.getById('contoso.sharepoint.com').lists.getById('listId').drive.get();

```

## Get all of the drives

Using the drives.get() you can get the drives from the Site

```TypeScript
import { graph } from "@pnp/graph";

const drives = await graph.sites.getById('contoso.sharepoint.com').drives.get();

```

## Get drive by Id

Using the drives.getById() you can get one specific Drive. For more operations make sure to have a look in the `onedrive` documentation.

```TypeScript
import { graph } from "@pnp/graph";

const drive = await raph.sites.getById('contoso.sharepoint.com').lists.getById('listId').drives.getById('driveId').get();

```

---

## Get Columns

Using the columns() you can get the columns from a Site or from a List

```TypeScript
import { graph } from "@pnp/graph";

const columnsFromSite = await graph.sites.getById('contoso.sharepoint.com').columns.get();

const columnsFromList = await graph.sites.getById('contoso.sharepoint.com').lists.getById('listId').columns.get();

```

## Get Specific Column

Using the columns.getById() you can get a specific column from a Site or from a List

```TypeScript
import { graph } from "@pnp/graph";

const columnFromSite = await graph.sites.getById('contoso.sharepoint.com').columns.getById('columnId').get();

const columnsFromList = await graph.sites.getById('contoso.sharepoint.com').lists.getById('listId').columns.getById('columnId').get();

```

## Get Column Links

Using the column.columnLinks() you can get the column links for a specific column, from a Site or from a List

```TypeScript
import { graph } from "@pnp/graph";

const columnLinksFromSite = await graph.sites.getById('contoso.sharepoint.com').columns.getById('columnId').columnLinks.get();

const columnLinksFromList = await graph.sites.getById('contoso.sharepoint.com').lists.getById('listId').columns.getById('columnId').columnLinks.get();

```

## Get Column Link

Using the column.columnLinks().getById() you can get a specific column link for a specific column, from a Site or from a List

```TypeScript
import { graph } from "@pnp/graph";

const columnLinkFromSite = await graph.sites.getById('contoso.sharepoint.com').columns.getById('columnId').columnLinks.getById('columnLinkId').get();

const columnLinkFromList = await graph.sites.getById('contoso.sharepoint.com').lists.getById('listId').columns.getById('columnId').columnLinks.getById('columnLinkId').get();

```
---

## Get Items

Using the items.get() you can get the Items from a List

```TypeScript
import { graph } from "@pnp/graph";

const itemsFromList = await graph.sites.getById('contoso.sharepoint.com').lists.getById('listId').items.get();

```

## Get Specific Item

Using the getById().get() you can get a specific Item from a List

```TypeScript

import { graph } from "@pnp/graph";

const itemFromList = await graph.sites.getById('contoso.sharepoint.com').lists.getById('listId').items.getById('itemId').get();

```

## Create Item

Using the items.create() you can create an Item in a List. 

```TypeScript

import { graph } from "@pnp/graph";

const newItem = await graph.sites.getById('contoso.sharepoint.com').lists.getById('listId').items.create({
"fields": {
    "Title": "Widget",
    "Color": "Purple",
    "Weight": 32
  }
})

```

## Update Item

Using the update() you can update an Item in a List. 

```TypeScript

import { graph } from "@pnp/graph";

const Item = await graph.sites.getById('contoso.sharepoint.com').lists.getById('listId').items.getById('itemId').update({
{
    "Color": "Fuchsia"
}
})

```

## Delete Item

Using the delete() you can delete an Item in a List. 

```TypeScript

import { graph } from "@pnp/graph";

const Item = await graph.sites.getById('contoso.sharepoint.com').lists.getById('listId').items.getById('itemId').delete()

```

## Get Fields from Item

Using the fields.get() you can the Fields in an Item

```TypeScript
import { graph } from "@pnp/graph";

const fieldsFromItem = await graph.sites.getById('contoso.sharepoint.com').lists.getById('listId').items.getById('itemId').fields.get();

```

## Get Versions from Item

Using the versions.get() you can the Versions of an Item

```TypeScript
import { graph } from "@pnp/graph";

const versionsFromItem = await graph.sites.getById('contoso.sharepoint.com').lists.getById('listId').items.getById('itemId').versions.get();

```

## Get Version from Item

Using the versions.getById().get() you can the Versions of an Item

```TypeScript
import { graph } from "@pnp/graph";

const versionFromItem = await graph.sites.getById('contoso.sharepoint.com').lists.getById('listId').items.getById('itemId').versions.getById('versionId').get();

```


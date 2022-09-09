# @pnp/sp/ - favorites

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

The favorites API allows you to fetch and manipulate followed sites and list items (also called _saved for later_). Note, all of these methods only work with the context of a logged in user, and not with app-only permissions.

## Get current user's followed sites

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/favorites";

const sp = spfi(...);

const favSites = await sp.favorites.getFollowedSites();
```

## Add a site to current user's followed sites

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/favorites";

const sp = spfi(...);

const tenantUrl = "contoso.sharepoint.com";
const siteId = "e3913de9-bfee-4089-b1bc-fb147d302f11";
const webId = "11a53c2b-0a67-46c8-8599-db50b8bc4dd1"
const webUrl = "https://contoso.sharepoint.com/sites/favsite"

const favSiteInfo = await sp.favorites.getFollowedSites.add(tenantUrl, siteId, webId, webUrl);
```

## Remove a site from current user's followed sites

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/favorites";

const sp = spfi(...);

const tenantUrl = "contoso.sharepoint.com";
const siteId = "e3913de9-bfee-4089-b1bc-fb147d302f11";
const webId = "11a53c2b-0a67-46c8-8599-db50b8bc4dd1"
const webUrl = "https://contoso.sharepoint.com/sites/favsite"

await sp.favorites.getFollowedSites.remove(tenantUrl, siteId, webId, webUrl);
```

## Get current user's followed list items

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/favorites";

const sp = spfi(...);

const favListItems = await sp.favorites.getFollowedListItems();
```

## Add an item to current user's followed list items

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/favorites";

const sp = spfi(...);

const siteId = "e3913de9-bfee-4089-b1bc-fb147d302f11";
const webId = "11a53c2b-0a67-46c8-8599-db50b8bc4dd1";
const listId = "f09fe67e-0160-4fcc-9144-905bd4889f31";
const listItemUniqueId = "1425C841-626A-44C9-8731-DA8BDC0882D1";

const favListItemInfo = await sp.favorites.getFollowedListItems.add(siteId, webId, listId, listItemUniqueId);
```

## Remove an item from current user's followed list items

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/favorites";

const sp = spfi(...);

const siteId = "e3913de9-bfee-4089-b1bc-fb147d302f11";
const webId = "11a53c2b-0a67-46c8-8599-db50b8bc4dd1";
const listId = "f09fe67e-0160-4fcc-9144-905bd4889f31";
const listItemUniqueId = "1425C841-626A-44C9-8731-DA8BDC0882D1";

const favListItemInfo = await sp.favorites.getFollowedListItems.remove(siteId, webId, listId, listItemUniqueId);
```
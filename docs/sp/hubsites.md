# @pnp/sp/hubsites

This module helps you with working with hub sites in your tenant.

## IHubSites

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

### Get a Listing of All Hub sites

```TypeScript
import { spfi } from "@pnp/sp";
import { IHubSiteInfo } from  "@pnp/sp/hubsites";
import "@pnp/sp/hubsites";

const sp = spfi(...);

// invoke the hub sites object
const hubsites: IHubSiteInfo[] = await sp.hubSites();

// you can also use select to only return certain fields:
const hubsites2: IHubSiteInfo[] = await sp.hubSites.select("ID", "Title", "RelatedHubSiteIds")();
```

### Get Hub site by Id

Using the getById method on the hubsites module to get a hub site by site Id (guid).

```TypeScript
import { spfi } from "@pnp/sp";
import { IHubSiteInfo } from  "@pnp/sp/hubsites";
import "@pnp/sp/hubsites";

const sp = spfi(...);

const hubsite: IHubSiteInfo = await sp.hubSites.getById("3504348e-b2be-49fb-a2a9-2d748db64beb")();

// log hub site title to console
console.log(hubsite.Title);
```

### Get ISite instance

We provide a helper method to load the ISite instance from the HubSite

```TypeScript
import { spfi } from "@pnp/sp";
import { ISite } from  "@pnp/sp/sites";
import "@pnp/sp/hubsites";

const sp = spfi(...);

const site: ISite = await sp.hubSites.getById("3504348e-b2be-49fb-a2a9-2d748db64beb").getSite();

const siteData = await site();

console.log(siteData.Title);
```

### Get Hub site data for a web

```TypeScript
import { spfi } from "@pnp/sp";
import { IHubSiteWebData } from  "@pnp/sp/hubsites";
import "@pnp/sp/webs";
import "@pnp/sp/hubsites/web";

const sp = spfi(...);

const webData: Partial<IHubSiteWebData> = await sp.web.hubSiteData();

// you can also force a refresh of the hub site data
const webData2: Partial<IHubSiteWebData> = await sp.web.hubSiteData(true);
```

### syncHubSiteTheme

Allows you to apply theme updates from the parent hub site collection.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/hubsites/web";

const sp = spfi(...);

await sp.web.syncHubSiteTheme();
```

## Hub site Site Methods

You manage hub sites at the Site level.

### joinHubSite

Id of the hub site collection you want to join. If you want to disassociate the site collection from hub site, then pass the siteId as 00000000-0000-0000-0000-000000000000

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/hubsites/site";

const sp = spfi(...);

// join a site to a hub site
await sp.site.joinHubSite("{parent hub site id}");

// remove a site from a hub site
await sp.site.joinHubSite("00000000-0000-0000-0000-000000000000");
```

### registerHubSite

Registers the current site collection as hub site collection

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/hubsites/site";

const sp = spfi(...);

// register current site as a hub site
await sp.site.registerHubSite();
```

### unRegisterHubSite

Un-registers the current site collection as hub site collection.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/hubsites/site";

const sp = spfi(...);

// make a site no longer a hub
await sp.site.unRegisterHubSite();
```

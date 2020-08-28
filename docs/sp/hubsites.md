# @pnp/sp/hubsites

This module helps you with working with hub sites in your tenant.

## IHubSites

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

| Scenario    | Import Statement                                                  |
| ----------- | ----------------------------------------------------------------- |
| Selective   | import { sp } from "@pnp/sp";<br />import "@pnp/sp/hubsites"; |
| Preset: All | import { sp, HubSites, IHubSites } from "@pnp/sp/presets/all";    |

### Get a Listing of All Hub sites

```TypeScript
import { sp } from "@pnp/sp";
import { IHubSiteData } from  "@pnp/sp/hubsites";
import "@pnp/sp/hubsites";

// invoke the hub sites object
const hubsites: IHubSiteData[] = await sp.hubSites();

// you can also use select to only return certain fields:
const hubsites2: IHubSiteData[] = await sp.hubSites.select("ID", "Title", "RelatedHubSiteIds")();
```

### Get Hub site by Id

Using the getById method on the hubsites module to get a hub site by site Id (guid).

```TypeScript
import { sp } from "@pnp/sp";
import { IHubSiteData } from  "@pnp/sp/hubsites";
import "@pnp/sp/hubsites";

const hubsite: IHubSiteData = await sp.hubSites.getById("3504348e-b2be-49fb-a2a9-2d748db64beb")();

// log hub site title to console
console.log(hubsite.Title);
```

### Get ISite instance

We provide a helper method to load the ISite instance from the HubSite

```TypeScript
import { sp } from "@pnp/sp";
import { IHubSiteData } from  "@pnp/sp/hubsites";
import { ISite } from  "@pnp/sp/sites";
import "@pnp/sp/hubsites";

const site: ISite = await sp.hubSites.getById("3504348e-b2be-49fb-a2a9-2d748db64beb").getSite();

const siteData = await site();

console.log(siteData.Title);
```

### Get Hub site data for a web

```TypeScript
import { sp } from "@pnp/sp";
import { IHubSiteWebData } from  "@pnp/sp/hubsites";
import "@pnp/sp/webs";
import "@pnp/sp/hubsites/web";

const webData: IHubSiteWebData = await sp.web.hubSiteData();

// you can also force a refresh of the hub site data
const webData2: IHubSiteWebData = await sp.web.hubSiteData(true);
```

### syncHubSiteTheme

Allows you to apply theme updates from the parent hub site collection.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/hubsites/web";

await sp.web.syncHubSiteTheme();
```

## Hub site Site Methods

You manage hub sites at the Site level.

### joinHubSite

Id of the hub site collection you want to join. If you want to disassociate the site collection from hub site, then pass the siteId as 00000000-0000-0000-0000-000000000000

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/hubsites/site";

// join a site to a hub site
await sp.site.joinHubSite("{parent hub site id}");

// remove a site from a hub site
await sp.site.joinHubSite("00000000-0000-0000-0000-000000000000");
```

### registerHubSite

Registers the current site collection as hub site collection

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/hubsites/site";

// regsiter current site as a hub site
await sp.site.registerHubSite();
```

### unRegisterHubSite

Un-registers the current site collection as hub site collection.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/hubsites/site";

// make a site no longer a hub
await sp.site.unRegisterHubSite();
```

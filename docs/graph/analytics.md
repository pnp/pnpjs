# @pnp/graph/analytics

The ability to get analytics for OneDrive and SharePoint drive items, SharePoint sites, and SharePoint list items.

More information can be found in the official Graph documentation:

- [Analytics Resource Type](https://docs.microsoft.com/en-us/graph/api/itemanalytics-get?view=graph-rest-1.0)

## IAnalyticsOptions

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Get Drive Item Analytics

Using analytics() you get the Item Analytics for a Drive Item

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/drive";
import "@pnp/graph/analytics";
import { IAnalyticsOptions } from "@pnp/graph/analytics";

const graph = graphfi(...);

// Defaults to lastSevenDays
const analytics = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").items.getById("{item id}").analytics()();

const analytics = await graph.me.drives.getById("{drive id}").items.getById("{item id}").analytics()();

// Get analytics for all time
const analyticOptions: IAnalyticsOptions = {
    timeRange: "allTime"
};

const analyticsAllTime = await graph.me.drives.getById("{drive id}").items.getById("{item id}").analytics(analyticOptions)();
```

## Get Site Analytics

Using analytics() you can get the analytics for a SharePoint site

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/analytics";
import { IAnalyticsOptions } from "@pnp/graph/analytics";

const graph = graphfi(...);

const site = this.pnp.graph.sites.getById(this.pnp.settings.graph.id);

// Defaults to lastSevenDays
const analytics = await site.analytics();

// Get analytics for all time
const analyticOptions: IAnalyticsOptions = {
    timeRange: "allTime"
};

const analyticsAllTime = await site.analytics(analyticOptions);
```

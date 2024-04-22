# @pnp/graph/sites

The search module allows you to access the Microsoft Graph Sites API.

More information can be found in the official Graph documentation:

- [Sites Resource Type](https://docs.microsoft.com/en-us/graph/api/resources/site?view=graph-rest-1.0)

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## sites

### list

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";

const graph = graphfi(...);

const sitesInfo = await graph.sites();
```

### getById

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";

const graph = graphfi(...);

const siteInfo = await graph.sites.getById("{site identifier}")();
```

### getByUrl

Using the sites.getByUrl() you can get a site using url instead of identifier

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";

const graph = graphfi(...);
const sharepointHostName = "contoso.sharepoint.com";
const serverRelativeUrl = "/sites/teamsite1";
const siteInfo = await graph.sites.getByUrl(sharepointHostName, serverRelativeUrl)();
```

### getAllSites

List sites across geographies in an organization. This API can also be used to enumerate all sites in a non-multi-geo tenant.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";

const graph = graphfi(...);

const siteslist = [];

// use async iterator pattern
for await (const sites of graph.sites.getAllSites()) {
    siteslist.push(sites);
}

// supports query params, here we get the sites in pages of 5 as an example
for await (const sites of graph.sites.getAllSites().top(5)) {
    siteslist.push(sites);
}
```

## site

### get

Access sub-sites of the current site

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";

const graph = graphfi(...);

const siteInfo = await graph.sites.getById("{site id}")();
```

### sites

Access sub-sites of the current site

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";

const graph = graphfi(...);

const subsites = await graph.sites.getById("{site id}").sites();
```

### rebase

Ensures the underlying url used in queries for this site is of the pattern /sites/{site id} regardless of how the ISite instance was addressed.

>> We internally rebase sites using this method so you probably don't need to call it directly, but it is available in case you do😀 

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";

const graph = graphfi(...);

const rebasedSite = await Site([graph.sites, "/sites/tenant.sharepoint.com:/sites/dev:"]).rebase();

const items = await rebasedSite.drive.root.children();
```

## followedSites

Provides access to the sites a user is following.

### list

>> At this time you can not list a user's followed sites using app-only permissions

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/users";

const graph = graphfi(...);

const followedSites = await graph.me.followedSites();
```

### add

Adds a followed site to a user's collection

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/users";

const graph = graphfi(...);

const followedSites = await graph.me.followedSites.add("{site id}");

// supports multiple ids in a single call
const followedSites2 = await graph.me.followedSites.add("{site id}", "{site id2}", "{site id3}", "{site id4}");

// callable for any user
const followedSites3 = await graph.users.getById("{user id}").followedSites.add("{site id}", "{site id2}", "{site id3}", "{site id4}");
```

### remove

Removes a followed site to a user's collection

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/users";

const graph = graphfi(...);

await graph.me.followedSites.remove("{site id}");

// supports multiple ids in a single call
await graph.me.followedSites.remove("{site id}", "{site id2}", "{site id3}", "{site id4}");

// callable for any user
await graph.users.getById("{user id}").followedSites.remove("{site id}", "{site id2}", "{site id3}", "{site id4}");
```

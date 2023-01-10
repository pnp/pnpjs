# @pnp/graph/sites

The search module allows you to access the Microsoft Graph Sites API.

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Call graph.sites

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";

const graph = graphfi(...);

const sitesInfo = await graph.sites();
```

## Call graph.sites.getById

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";

const graph = graphfi(...);

const siteInfo = await graph.sites.getById("{site identifier}")();
```

## Call graph.sites.getByUrl

Using the sites.getByUrl() you can get a site using url instead of identifier

![Known Issue Banner](https://img.shields.io/badge/Known%20Issue-important.svg) If you get a site with this method, the graph does not support chaining a request further than .drive. We will review and try and create a work around for this issue.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";

const graph = graphfi(...);
const sharepointHostName = "contoso.sharepoint.com";
const serverRelativeUrl = "/sites/teamsite1";
const siteInfo = await graph.sites.getByUrl(sharepointHostName, serverRelativeUrl)();
```

## Make additional calls or recieve items from lists

We don't currently implement all of the available options in graph for sites, rather focusing on the sp library. While we do accept PRs to add functionality, you can [also make calls by path.](./items.md)

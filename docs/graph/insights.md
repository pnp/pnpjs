# @pnp/graph/insights

This module helps you get Insights in form of ***Trending***, ***Used*** and ***Shared***. The results are based on relationships calculated using advanced analytics and machine learning techniques.

## IInsights

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

### Get all Trending documents

Returns documents from OneDrive and SharePoint sites trending around a user.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/insights";
import "@pnp/graph/users";

const graph = graphfi(...);

const trending = await graph.me.insights.trending()

const trending = await graph.users.getById("userId").insights.trending()
```

### Get a Trending document by Id

Using the getById method to get a trending document by Id.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/insights";
import "@pnp/graph/users";

const graph = graphfi(...);

const trendingDoc = await graph.me.insights.trending.getById('Id')()

const trendingDoc = await graph.users.getById("userId").insights.trending.getById('Id')()
```

### Get the resource from Trending document

Using the resources method to get the resource from a trending document.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/insights";
import "@pnp/graph/users";

const graph = graphfi(...);

const resource = await graph.me.insights.trending.getById('Id').resource()

const resource = await graph.users.getById("userId").insights.trending.getById('Id').resource()
```

### Get all Used documents

Returns documents viewed and modified by a user. Includes documents the user used in OneDrive for Business, SharePoint, opened as email attachments, and as link attachments from sources like Box, DropBox and Google Drive.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/insights";
import "@pnp/graph/users";

const graph = graphfi(...);

const used = await graph.me.insights.used()

const used = await graph.users.getById("userId").insights.used()
```

### Get a Used document by Id

Using the getById method to get a used document by Id.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/insights";
import "@pnp/graph/users";

const graph = graphfi(...);

const usedDoc = await graph.me.insights.used.getById('Id')()

const usedDoc = await graph.users.getById("userId").insights.used.getById('Id')()
```

### Get the resource from Used document

Using the resources method to get the resource from a used document.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/insights";
import "@pnp/graph/users";

const graph = graphfi(...);

const resource = await graph.me.insights.used.getById('Id').resource()

const resource = await graph.users.getById("userId").insights.used.getById('Id').resource()
```

### Get all Shared documents

Returns documents shared with a user. Documents can be shared as email attachments or as OneDrive for Business links sent in emails.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/insights";
import "@pnp/graph/users";

const graph = graphfi(...);

const shared = await graph.me.insights.shared()

const shared = await graph.users.getById("userId").insights.shared()
```

### Get a Shared document by Id

Using the getById method to get a shared document by Id.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/insights";
import "@pnp/graph/users";

const graph = graphfi(...);

const sharedDoc = await graph.me.insights.shared.getById('Id')()

const sharedDoc = await graph.users.getById("userId").insights.shared.getById('Id')()
```

### Get the resource from a Shared document

Using the resources method to get the resource from a shared document.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/insights";
import "@pnp/graph/users";

const graph = graphfi(...);

const resource = await graph.me.insights.shared.getById('Id').resource()

const resource = await graph.users.getById("userId").insights.shared.getById('Id').resource()
```

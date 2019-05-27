# @pnp/graph/insights

Insights are relationships calculated using advanced analytics and machine learning techniques. You can, for example, identify OneDrive documents trending around users.

## Get the trending documents

Using the trending.get() returns documents from OneDrive and from SharePoint sites trending around a user.

```TypeScript
import { graph } from "@pnp/graph";

const trending = await graph.users.getById('user@tenant.onmicrosoft.com').insights.trending.get();

const trending = await graph.me.insights.trending.get();

```

## Get the used documents

Using the used.get() returns documents viewed and modified by a user. Includes documents the user used in OneDrive for Business, SharePoint, opened as email attachments, and as link attachments from sources like Box, DropBox and Google Drive.

```TypeScript
import { graph } from "@pnp/graph";

const used = await graph.users.getById('user@tenant.onmicrosoft.com').insights.used.get();

const used = await graph.me.insights.used.get();

```

## Get the shared documents

Using the shared.get() returns documents shared with a user. Documents can be shared as email attachments or as OneDrive for Business links sent in emails.

```TypeScript
import { graph } from "@pnp/graph";

const shared = await graph.users.getById('user@tenant.onmicrosoft.com').insights.shared.get();

const shared = await graph.me.insights.shared.get();

```

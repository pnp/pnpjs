# @pnp/sp/subscriptions

Webhooks on a SharePoint list are used to notify any change in the list, to other applications using a push model. This module provides methods to add, update or delete webhooks on a particlar SharePoint list or library.

## ISubscriptions

[![](https://img.shields.io/badge/Invokable-informational.svg)](../invokable.md) [![](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../selective-imports.md)

|Scenario|Import Statement|
|--|--|
|Selective|import { sp } from "@pnp/sp";<br />import "@pnp/sp/src/webs";<br />import "@pnp/sp/src/lists";<br />import { Subscriptions, ISubscriptions} from "@pnp/sp/src/subscriptions";<br />import "@pnp/sp/src/subscriptions/list"|
|Preset: All|import {sp, Webs, IWebs, Lists, ILists, Subscriptions, ISubscriptions, Subscription, ISubscription} from "@pnp/sp/presets/all";|


### Add a webhook
Using this library, you can add a webhook to a specified list within the SharePoint site.
```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/lists";

import { Subscriptions, ISubscriptions} from "@pnp/sp/src/subscriptions";
import "@pnp/sp/src/subscriptions/list";

// This is the URL which will be called by SharePoint when there is a change in the list
const notificationUrl = "<notification-url>";

// Set the expiry date to 180 days from now, which is the maximum allowed for the webhook expiry date.
const expiryDate = dateAdd(new Date(), "day" , 180).toISOString();

// Adds a webhook to the Documents library
var res = await sp.web.lists.getByTitle("Documents").subscriptions.add(notificationUrl,expiryDate);
```

### Get all webhooks added to a list

Read all the webhooks' details which are associated to the list

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/lists";
import "@pnp/sp/src/subscriptions";

const res = await sp.web.lists.getByTitle("Documents").subscriptions();
```

## ISubscription

This interface provides the methods for managing a particular webhook.

[![](https://img.shields.io/badge/Invokable-informational.svg)](../invokable.md) [![](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../selective-imports.md)

|Scenario|Import Statement|
|--|--|
|Selective|import { sp } from "@pnp/sp";<br />import "@pnp/sp/src/webs";<br />import "@pnp/sp/src/lists";<br />import { Subscriptions, ISubscriptions, Subscription, ISubscription} from "@pnp/sp/src/subscriptions";<br />import "@pnp/sp/src/subscriptions/list"|
|Preset: All|import {sp, Webs, IWebs, Lists, ILists, Subscriptions, ISubscriptions, Subscription, ISubscription} from "@pnp/sp/presets/all";|

### Managing a webhook

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/lists";
import "@pnp/sp/src/subscriptions";

// Get details of a webhook based on its ID
const webhookId = "1f029e5c-16d4-4941-b46f-67899118763f";
const webhook = await sp.web.lists.getByTitle("Documents").subscriptions.getById(webhookId)();

// Update a webhook
const newDate = dateAdd(new Date(), "day" , 150).toISOString();
const updatedWebhook = await sp.web.lists.getByTitle("Documents").subscriptions.getById(webhookId).update(newDate);

// Delete a webhook
await sp.web.lists.getByTitle("Documents").subscriptions.getById(webhookId).delete();
```
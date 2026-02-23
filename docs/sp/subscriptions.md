# @pnp/sp/subscriptions

Webhooks on a SharePoint list are used to notify any change in the list, to other applications using a push model. This module provides methods to add, update or delete webhooks on a particular SharePoint list or library.

## ISubscriptions

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

### Add a webhook

Using this library, you can add a webhook to a specified list within the SharePoint site.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";

import { Subscriptions, ISubscriptions} from "@pnp/sp/subscriptions";
import "@pnp/sp/subscriptions/list";

const sp = spfi(...);

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
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/subscriptions";

const sp = spfi(...);

const res = await sp.web.lists.getByTitle("Documents").subscriptions();
```

## ISubscription

This interface provides the methods for managing a particular webhook.

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

| Scenario    | Import Statement                                                                                                                                                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Selective   | import "@pnp/sp/webs";<br />import "@pnp/sp/lists";<br />import { Subscriptions, ISubscriptions, Subscription, ISubscription} from "@pnp/sp/subscriptions";<br />import "@pnp/sp/subscriptions/list" |
| Preset: All | import { sp, Webs, IWebs, Lists, ILists, Subscriptions, ISubscriptions, Subscription, ISubscription } from "@pnp/sp/presets/all";                                                                                                                       |

### Managing a webhook

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/subscriptions";

const sp = spfi(...);

// Get details of a webhook based on its ID
const webhookId = "1f029e5c-16e4-4941-b46f-67895118763f";
const webhook = await sp.web.lists.getByTitle("Documents").subscriptions.getById(webhookId)();

// Update a webhook
const newDate = dateAdd(new Date(), "day" , 150).toISOString();
const updatedWebhook = await sp.web.lists.getByTitle("Documents").subscriptions.getById(webhookId).update(newDate);

// Delete a webhook
await sp.web.lists.getByTitle("Documents").subscriptions.getById(webhookId).delete();
```

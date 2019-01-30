# @pnp/graph/subscriptions

The ability to manage subscriptions is a capability introduced in version 1.2.9 of @pnp/graph. A subscription allows a client app to receive notifications about changes to data in Microsoft Graph. Currently, subscriptions are enabled for the following resources:
* Mail, events, and contacts from Outlook.
* Conversations from Office Groups.
* Drive root items from OneDrive.
* Users and Groups from Azure Active Directory.
* Alerts from the Microsoft Graph Security API.

## Get all of the Subscriptions

Using the subscriptions.get(). If successful this method returns a 200 OK response code and a list of subscription objects in the response body.

```TypeScript
import { graph } from "@pnp/graph";

const subscriptions = await graph.subscriptions.get();

```

## Create a new Subscription

Using the subscriptions.add(). Creating a subscription requires read scope to the resource. For example, to get notifications messages, your app needs the Mail.Read permission. 
To learn more about the scopes visit [this](https://docs.microsoft.com/en-us/graph/api/subscription-post-subscriptions?view=graph-rest-1.0) url.

```TypeScript
import { graph } from "@pnp/graph";

const addedSubscription = await graph.subscriptions.add("created,updated", "https://webhook.azurewebsites.net/api/send/myNotifyClient", "me/mailFolders('Inbox')/messages", "2019-11-20T18:23:45.9356913Z");

```

## Get Subscription by Id

Using the subscriptions.getById() you can get one of the subscriptions

```TypeScript
import { graph } from "@pnp/graph";

const subscription = await graph.subscriptions.getById('subscriptionId');

```
## Delete a Subscription

Using the subscriptions.getById().delete() you can remove one of the Subscriptions

```TypeScript
import { graph } from "@pnp/graph";

const delSubscription = await graph.subscription.getById('subscriptionId').delete();

```

## Update a Subscription

Using the subscriptions.getById().update() you can update one of the Subscriptions

```TypeScript
import { graph } from "@pnp/graph";

const updSubscription = await graph.subscriptions.getById('subscriptionId').update({changeType: "created,updated,deleted" });

```

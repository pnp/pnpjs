# @pnp/graph/groups

Groups are collections of users and other principals who share access to resources in Microsoft services or in your app. All group-related operations in Microsoft Graph require administrator consent.

Note: Groups can only be created through work or school accounts. Personal Microsoft accounts don't support groups.

You can learn more about Microsoft Graph Groups by reading the [Official Microsoft Graph Documentation](https://docs.microsoft.com/en-us/graph/api/resources/groups-overview).

## IGroup, IGroups

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

|Scenario|Import Statement|
|--|--|
|Selective 1|import { graph } from "@pnp/graph";<br />import {Group, GroupType, Groups, IGroup, IGroupAddResult, IGroups} from "@pnp/graph/groups";|
|Selective 2|import { graph } from "@pnp/graph";<br />import "@pnp/graph/groups";|
|Preset: All|import { graph, Group, GroupType, Groups, IGroup, IGroupAddResult, IGroups } from "@pnp/graph/presets/all";|

## Add a Group

Add a new group.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/groups";
import { GroupType } from '@pnp/graph/groups';

const groupAddResult = await graph.groups.add("GroupName", "Mail_NickName", GroupType.Office365);
const group = await groupAddResult.group();
```

## Delete a Group

Deletes an existing group.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/groups";

await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").delete();
```

## Update Group Properties

Updates an existing group.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/groups";

await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").update({ displayName: newName, propertyName: updatedValue});
```

## Add favorite

Add the group to the list of the current user's favorite groups. Supported for Office 365 groups only.


```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/groups";

await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").addFavorite();
```

## Remove favorite

Remove the group from the list of the current user's favorite groups. Supported for Office 365 Groups only.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/groups";

await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").removeFavorite();
```

## Reset Unseen Count

Reset the unseenCount of all the posts that the current user has not seen since their last visit. Supported for Office 365 groups only.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/groups";

await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").resetUnseenCount();
```

## Subscribe By Mail

Calling this method will enable the current user to receive email notifications for this group, about new posts, events, and files in that group. Supported for Office 365 groups only.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/groups";

await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").subscribeByMail();
```

## Unsubscribe By Mail

Calling this method will prevent the current user from receiving email notifications for this group about new posts, events, and files in that group. Supported for Office 365 groups only.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/groups";

await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").unsubscribeByMail();
```

## Get Calendar View

Get the occurrences, exceptions, and single instances of events in a calendar view defined by a time range, from the default calendar of a group.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/groups";

const startDate = new Date("2020-04-01");
const endDate = new Date("2020-03-01");

const events = graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").getCalendarView(startDate, endDate);
```

## Group Photo Operations

See [Photos](./photos.md)
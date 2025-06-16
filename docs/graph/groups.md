# @pnp/graph/groups

Groups are collections of users and other principals who share access to resources in Microsoft services or in your app. All group-related operations in Microsoft Graph require administrator consent.

Note: Groups can only be created through work or school accounts. Personal Microsoft accounts don't support groups.

You can learn more about Microsoft Graph Groups by reading the [Groups Resource Type](https://docs.microsoft.com/en-us/graph/api/resources/groups-overview).

## IGroup, IGroups

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Add a Group

Add a new group.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import { GroupType } from '@pnp/graph/groups';

const graph = graphfi(...);

const groupAddResult = await graph.groups.add("GroupName", "Mail_NickName", GroupType.Office365);
const group = await groupAddResult.group();
```

## Delete a Group

Deletes an existing group.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";

const graph = graphfi(...);

await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").delete();
```

## Update Group Properties

Updates an existing group.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";

const graph = graphfi(...);

await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").update({ displayName: newName, propertyName: updatedValue});
```

## Add favorite

Add the group to the list of the current user's favorite groups. Supported for Office 365 groups only.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";

const graph = graphfi(...);

await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").addFavorite();
```

## Remove favorite

Remove the group from the list of the current user's favorite groups. Supported for Office 365 Groups only.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";

const graph = graphfi(...);

await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").removeFavorite();
```

## Reset Unseen Count

Reset the unseenCount of all the posts that the current user has not seen since their last visit. Supported for Office 365 groups only.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";

const graph = graphfi(...);

await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").resetUnseenCount();
```

## Subscribe By Mail

Calling this method will enable the current user to receive email notifications for this group, about new posts, events, and files in that group. Supported for Office 365 groups only.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";

const graph = graphfi(...);

await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").subscribeByMail();
```

## Unsubscribe By Mail

Calling this method will prevent the current user from receiving email notifications for this group about new posts, events, and files in that group. Supported for Office 365 groups only.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";

const graph = graphfi(...);

await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").unsubscribeByMail();
```

## Get Calendar View

Get the occurrences, exceptions, and single instances of events in a calendar view defined by a time range, from the default calendar of a group.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";

const graph = graphfi(...);

const startDate = new Date("2020-04-01");
const endDate = new Date("2020-03-01");

const events = graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").getCalendarView(startDate, endDate);
```

## Get the Team Site for a Group

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/sites/group";

const graph = graphfi(...);

const teamSite = await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").sites.root();
const url = teamSite.webUrl
```

## Get groups lifecycle policies

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";

const graph = graphfi(...);

const policies = await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").groupLifecyclePolicies();
```

## Get groups transitive members

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";

const graph = graphfi(...);

const members = await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").transitiveMembers();
```

## Get groups that group is a member of

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";

const graph = graphfi(...);

const members = await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").transitiveMembersOf();
```

## Assign or remove licenses to a group, which then assigns to members of the group.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";

const graph = graphfi(...);

const assignLicenses = [
    {
      "disabledPlans": [
        "113feb6c-3fe4-4440-bddc-54d774bf0318",
        "14ab5db5-e6c4-4b20-b4bc-13e36fd2227f"
      ],
      "skuId": "b05e124f-c7cc-45a0-a6aa-8cf78c946968"
    }
]
const removeLicenses = [50dda944-99c4-4f56-a4aa-e74dde7e7e2f];
const group = await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").assignLicense(assignLicenses, removeLicenses);
```

## Renew a groups expiration

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";

const graph = graphfi(...);

await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").renew();
```

## Validate the groups display name or mail nickname comply with policies

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";

const graph = graphfi(...);

const validationProps = {
    /**
     * The display name of the group to validate
     */
    displayName?: string;
    /**
     * The mail nickname of the group to validate
     */
    mailNickname?: string;
    /**
    * The ID (GUID) of the user on whose behalf the request is made
    */
    onBehalfOfUserId?: string;
};
await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").validateProperties(validationProps);
```

## Group Membership (Members and Owners)

See [Members](./members.md)

## Group Photo Operations

See [Photos](./photos.md)

## Group Conversation Operations

See [Conversations](./conversations.md)

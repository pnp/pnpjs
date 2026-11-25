# @pnp/graph/chats

The ability to manage chats independently from the Teams module is a capability introduced in the 5.0.0 of @pnp/graph. Through the methods described
you can add, update and delete items in Chats.

More information can be found in the official Graph documentation:

- [Chat Resource Type](https://learn.microsoft.com/en-us/graph/api/resources/chat?view=graph-rest-1.0)

## Chats

### List Chats

`graph.chats` and `graph.me.chats` list the signed in user's chats, which requires delegated permissions. With application permissions, list the chats of a specific user.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/chats";

const graph = graphfi(...);

// list the signed in user's chats
const chats = await graph.chats();
const myChats = await graph.me.chats();
// list a user's chats
const userChats = await graph.users.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').chats();
```

### Get Chat by Id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/chats";

const graph = graphfi(...);

const chat = await graph.chats.getById('19:65723d632b384ca89c81115c281428a3@thread.v2')();
const userChat = await graph.users.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').chats.getById('19:65723d632b384ca89c81115c281428a3@thread.v2')();
```

### Create a Chat

If a one on one chat already exists between the two members, the existing chat is returned. See [Create chat](https://learn.microsoft.com/en-us/graph/api/chat-post?view=graph-rest-1.0).

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/chats";

const graph = graphfi(...);

// typed as any because the "@odata" properties are not part of the Chat type
const chat: any = {
    chatType: "oneOnOne",
    members: [
        {
            "@odata.type": "#microsoft.graph.aadUserConversationMember",
            "roles": ["owner"],
            "user@odata.bind": "https://graph.microsoft.com/v1.0/users('8b081ef6-4792-4def-b2c9-c363a1bf41d5')",
        },
        {
            "@odata.type": "#microsoft.graph.aadUserConversationMember",
            "roles": ["owner"],
            "user@odata.bind": "https://graph.microsoft.com/v1.0/users('82af01c5-f7cc-4a2e-a728-3a5df21afd9d')",
        },
    ],
};

const newChat = await graph.chats.add(chat);
```

### Update a Chat

Only the topic can be updated, and only for group chats. See [Update chat](https://learn.microsoft.com/en-us/graph/api/chat-patch?view=graph-rest-1.0).

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/chats";

const graph = graphfi(...);

await graph.chats.getById('19:65723d632b384ca89c81115c281428a3@thread.v2').update({ topic: "New topic" });
```

### Delete a Chat

With delegated permissions, only tenant admins and Teams service admins can delete a chat. See [Delete chat](https://learn.microsoft.com/en-us/graph/api/chat-delete?view=graph-rest-1.0).

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/chats";

const graph = graphfi(...);

await graph.chats.getById('19:65723d632b384ca89c81115c281428a3@thread.v2').delete();
```

### Remove All Access for a User

Requires delegated permissions, application permissions are not supported. See [Remove all access for user](https://learn.microsoft.com/en-us/graph/api/chat-removeallaccessforuser?view=graph-rest-1.0).

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/chats";
import { TeamworkUserIdentity } from "@microsoft/microsoft-graph-types";

const graph = graphfi(...);

const user = {
    "@odata.type": "microsoft.graph.teamworkUserIdentity",
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "tenantId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
} as TeamworkUserIdentity;

await graph.chats.getById('19:65723d632b384ca89c81115c281428a3@thread.v2').removeAllAccessForUser(user);
```

### Get the Chat for an Installed App

Get the chat between a user and a Teams app installed for that user.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/teams";
import "@pnp/graph/chats";

const graph = graphfi(...);

const chat = await graph.users.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').installedApps.getById('NWI2NDk4MzQtNzQxMi00Y2NlLTllNjktMTc2ZTk1YTM5NGY1IyNhNmI2MzM2NS0zMWE0LTRmNDMtOTJlYy03MTBiNzE1NTdhZjk').chat();
```

## Members

### List Chat Members

Get the members of a chat.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/chats";
import "@pnp/graph/members";

const graph = graphfi(...);

const members = await graph.chats.getById('19:65723d632b384ca89c81115c281428a3@thread.v2').members();
```

[See Members](./members.md#chat-members) to get, add and remove chat members.

## Messages

[See Messages](./messages.md)

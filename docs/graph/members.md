# @pnp/graph/members

Members are collections of users and other principals. Other API objects have membership so all membership functionality is encapsulated in one import.

## IMember, IMembers

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## List Group Members/Owners

Get the members and/or owners of a group.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/members";

const graph = graphfi(...);
const members = await graph.groups.getById({groupId}).members();
const owners = await graph.groups.getById({groupId}).owners();
```

## Add Member/Owner

Add a member/owner to a group

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/members";

const graph = graphfi(...);
const members = await graph.groups.getById({groupId}).members.add({directoryObjectId}).
const owners = await graph.groups.getById({groupId}).owners.add({directoryObjectId});

```
## Add Members to Group in bulk

Add a list of members to a group in a single call

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/members";

const graph = graphfi(...);
await graph.groups.getById({groupId}).members.addBulk(["https://graph.microsoft.com/v1.0/directoryObjects/f5ac7788-8ab1-5a62-bf9a-380aaf0f1afc","https://graph.microsoft.com/v1.0/directoryObjects/950381e3-9d63-561d-a160-20b95ae388d0"]).

```
## Remove Member/Owner

Remove a member/owner to an group

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/members";

const graph = graphfi(...);
const members = await graph.groups.getById({groupId}).members.getById({directoryObjectId}).remove().
const owners = await graph.groups.getById({groupId}).owners.getById({directoryObjectId}).remove();
```

## Chat Members

Get, add and remove the members of a [chat](./chats.md). Adding and removing members works through `graph.chats`.

### List Chat Members

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/chats";
import "@pnp/graph/members";

const graph = graphfi(...);
const members = await graph.chats.getById('19:65723d632b384ca89c81115c281428a3@thread.v2').members();
```

### Get a Chat Member

The id is the membership id, as returned when listing the members, not the user id.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/chats";
import "@pnp/graph/members";

const graph = graphfi(...);
const member = await graph.chats.getById('19:65723d632b384ca89c81115c281428a3@thread.v2').members.getById('MCMjMjQzMmI1N2ItMGFiZC00M2Ri')();
```

### Add a Chat Member

Use a role of "owner", or "guest" for an in-tenant guest. Set `visibleHistoryStartDateTime` to share the chat history from that point. See [Add member to a chat](https://learn.microsoft.com/en-us/graph/api/chat-post-members?view=graph-rest-1.0).

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/chats";
import "@pnp/graph/members";

const graph = graphfi(...);
await graph.chats.getById('19:65723d632b384ca89c81115c281428a3@thread.v2').members.add({
    "user@odata.bind": "https://graph.microsoft.com/v1.0/users/8b081ef6-4792-4def-b2c9-c363a1bf41d5",
    roles: ["owner"],
    // optional
    visibleHistoryStartDateTime: "2019-04-18T23:51:43.255Z",
});
```

### Remove a Chat Member

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/chats";
import "@pnp/graph/members";

const graph = graphfi(...);
await graph.chats.getById('19:65723d632b384ca89c81115c281428a3@thread.v2').members.getById('MCMjMjQzMmI1N2ItMGFiZC00M2Ri').remove();
```


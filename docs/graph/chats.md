# @pnp/graph/chats

The ability to manage chats independently from the Teams module is a capability introduced in the 5.0.0 of @pnp/graph. Through the methods described
you can add, update and delete items in Chats.

More information can be found in the official Graph documentation:

- [Chat Resource Type](https://learn.microsoft.com/en-us/graph/api/resources/chat?view=graph-rest-1.0)

## Chats

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/chats";

const graph = graphfi(...);

// list user chat messages
const chatMessages = await graph.users.getById('3531fzfb-f9ee-4f43-982a-6c90d8226528').chats();
// list signed in user's chats
const chatMessage = await graph.me.chats();
const chatMessage = await graph.chats();
```

### Members

## List Chat Members

Get the members of a chat.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/chats";
import "@pnp/graph/members";

const graph = graphfi(...);
const members = await graph.chats.getById({chatId}).members();
```

[See Members](./members.md)

### Messages

[See Messages](./messages.md)
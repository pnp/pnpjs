# @pnp/graph/messages

The ability to work with chat and channel messages independently from the Teams module is a capability introduced in the 5.0.0 of @pnp/graph. Through the methods described
you can read and add messages. For mail messages see [Mail Messages](./mail-messages.md).

More information can be found in the official Graph documentation:

- [Message Resource Type](https://learn.microsoft.com/en-us/graph/api/resources/chatmessage?view=graph-rest-1.0)

## Chat Messages

### List and Get Chat Messages

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/chats";
import "@pnp/graph/messages";

const graph = graphfi(...);

// list the messages in a chat
const chatMessages = await graph.chats.getById('19:65723d632b384ca89c81115c281428a3@thread.v2').messages();
// list the messages in one of the signed in user's chats
const myChatMessages = await graph.me.chats.getById('19:65723d632b384ca89c81115c281428a3@thread.v2').messages();
// list the messages in one of a user's chats
const userChatMessages = await graph.users.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').chats.getById('19:65723d632b384ca89c81115c281428a3@thread.v2').messages();
// get a chat message by id
const chatMessage = await graph.chats.getById('19:65723d632b384ca89c81115c281428a3@thread.v2').messages.getById('1616990032035')();
```

### Add a Chat Message

Application permissions can only send messages when migrating data.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/chats";
import "@pnp/graph/messages";

const graph = graphfi(...);

const message = {
    body: {
        content: "Hello World",
    },
};

const chatMessage = await graph.chats.getById('19:65723d632b384ca89c81115c281428a3@thread.v2').messages.add(message);
```

### Get all Messages from a User's Chats

These are only available on the chats of a specific user, and `getAllMessages` requires application permissions. Optionally pass "A" or "B" to choose the licensing and payment model.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/chats";
import "@pnp/graph/messages";

const graph = graphfi(...);

const allMessages = await graph.users.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').chats.getAllMessages()();
const allRetainedMessages = await graph.users.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').chats.getAllRetainedMessages()();
```

## Teams Channel Messages

### List and Get Channel Messages

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";
import "@pnp/graph/messages";

const graph = graphfi(...);

// list channel messages
const channelMessages = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').channels.getById('19:65723d632b384ca89c81115c281428a3@thread.skype').messages();
// get a channel message by id
const channelMessage = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').channels.getById('19:65723d632b384ca89c81115c281428a3@thread.skype').messages.getById('1616990032035')();
// get the replies to a channel message
const replies = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').channels.getById('19:65723d632b384ca89c81115c281428a3@thread.skype').messages.getById('1616990032035').replies();
```

### Add a Message to a Teams Channel

Application permissions can only send messages when migrating data.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";
import "@pnp/graph/messages";

const graph = graphfi(...);

const message = {
    body: {
        content: "Hello World",
    },
};

const channelMessage = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').channels.getById('19:65723d632b384ca89c81115c281428a3@thread.skype').messages.add(message);
```

### Get all Messages from all Channels of a Team

Optionally pass "A" or "B" to choose the licensing and payment model.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";
import "@pnp/graph/messages";

const graph = graphfi(...);

const allMessages = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').channels.getAllMessages()();
const allRetainedMessages = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').channels.getAllRetainedMessages()();
```

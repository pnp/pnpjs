# @pnp/graph/messages

The ability to manage messages independently from the Teams module is a capability introduced in the 5.0.0 of @pnp/graph. Through the methods described
you can add, update and delete items in Messages.

More information can be found in the official Graph documentation:

- [Message Resource Type](https://learn.microsoft.com/en-us/graph/api/resources/chatmessage?view=graph-rest-1.0)

## Messages

### Chat Messages

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";
import "@pnp/graph/messages/channels";

const graph = graphfi(...);

// list user chat messages
const chatMessages = await graph.users.getById('3531fzfb-f9ee-4f43-982a-6c90d8226528').chats.getById('cdd49e2d-8f0e-4a85-af33-f72f1056f33b').messages();
// list signed in user's chat messages
const chatMessage = await graph.me.chats.getById('cdd49e2d-8f0e-4a85-af33-f72f1056f33b').messages();
```

### Teams Channel Messages

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";
import "@pnp/graph/messages/channels";

const graph = graphfi(...);

// list channel messages
const chatMessages = await graph.teams.getById('3531fzfb-f9ee-4f43-982a-6c90d8226528').channels.getById('19:65723d632b384xa89c81115c281428a3@thread.skype').messages();
// get channel message by id
const chatMessage = await graph.teams.getById('3531fzfb-f9ee-4f43-982a-6c90d8226528').channels.getById('19:65723d632b384xa89c81115c281428a3@thread.skype').messages.getById('cdd49e2d-8f0e-4a85-af33-f72f1056f33b')();
// get channel message replies
const chatMessage = await graph.teams.getById('3531fzfb-f9ee-4f43-982a-6c90d8226528').channels.getById('19:65723d632b384xa89c81115c281428a3@thread.skype').messages.getById('cdd49e2d-8f0e-4a85-af33-f72f1056f33b').replies();
```

#### Add chat message to Teams Channel

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";
import { ChatMessage } from "@microsoft/microsoft-graph-types";

const graph = graphfi(...);

const message = {
      "body": {
        "content": "Hello World"
      }
    }
const chatMessage: ChatMessage = await graph.teams.getById('3531fzfb-f9ee-4f43-982a-6c90d8226528').channels.getById('19:65723d632b384xa89c81115c281428a3@thread.skype').messages.add(message);
```

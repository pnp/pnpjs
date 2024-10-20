# Graph Conversations

More information can be found in the official Graph documentation:

- [Conversation Resource Type](https://learn.microsoft.com/en-us/graph/api/resources/conversation?view=graph-rest-1.0)
- [Conversation Thread Resource Type](https://learn.microsoft.com/en-us/graph/api/resources/conversationthread?view=graph-rest-1.0)
- [Post Resource Type](https://learn.microsoft.com/en-us/graph/api/resources/post?view=graph-rest-1.0)

## IConversation, IConversations, IPost, IPostForwardInfo, IPosts, ISenders, IThread, IThreads

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)

## Get Group Accepted/Rejected Senders

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/conversations";

const graph = graphfi(...);

const accepted = await graph.groups.getById(groupId).acceptedSenders();
const rejected = await graph.groups.getById(groupId).rejectedSenders();
```

## Add Group Accepted/Rejected Senders

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/conversations";

const graph = graphfi(...);

const sender = "https://graph.microsoft.com/v1.0/users/user@contoso.com";
await graph.groups.getById(groupId).acceptedSenders.add(sender);
await graph.groups.getById(groupId).rejectedSenders.add(sender);
```

## Delete Group Accepted/Rejected Senders

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/conversations";

const graph = graphfi(...);

const sender = "https://graph.microsoft.com/v1.0/users/user@contoso.com";
await graph.groups.getById(groupId).acceptedSenders.remove(sender);
await graph.groups.getById(groupId).rejectedSenders.remove(sender);
```

## Get Group Conversations

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/conversations";

const graph = graphfi(...);

const c = await graph.groups.getById(groupId).conversations();
```

## Get Group Conversation by Id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/conversations";

const graph = graphfi(...);

const conversationId = "";
const c = await graph.groups.getById(groupId).conversations.getById(conversationId)();
```

## Add/Update/Delete a Group Conversation

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/conversations";
import { Conversation } from "@microsoft/microsoft-graph-types";

const graph = graphfi(...);

const conversation: Conversation = {
  topic: "My New Conversation",
  ...
};

const c = await graph.groups.getById(groupId).conversations.add(conversation);

const conversationId = "";
const update = await graph.groups.getById(groupId).conversations.getById(conversationId)
    .update({topic: "My Conversation"});
await graph.groups.getById(groupId).conversations.getById(conversationId).delete();
```

## Get Group Conversation Threads

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/conversations";
import { Conversation } from "@microsoft/microsoft-graph-types";

const graph = graphfi(...);

const groupId = "";
const conversationId = "";
const t = await graph.groups.getById(groupId).conversations.getById(conversationId).threads();
```

## Get Group Conversation Thread by Id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/conversations";

const graph = graphfi(...);

const conversationId = "";
const threadId = "";
const c = await graph.groups.getById(groupId).conversations.getById(conversationId).threads.getById(threadId)();
```

## Create/Update/Delete a Group Conversation Thread

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/conversations";
import { ConversationThread } from "@microsoft/microsoft-graph-types";

const graph = graphfi(...);

const conversationThread: ConversationThread = {
  topic: "My New Conversation",
  ...
};

const conversationId = "";
const t = await graph.groups.getById(groupId).conversations.getById(conversationId).threads.add(conversationThread);

const threadId = "";
const update = await graph.groups.getById(groupId).conversations.getById(conversationId).threads.getById(threadId)
    .update({topic: "My Conversation"});
await graph.groups.getById(groupId).conversations.getById(conversationId).threads.getById(threadId).delete();
```

## Reply to a Group Conversation Thread

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/conversations";
import { Post } from "@microsoft/microsoft-graph-types";

const graph = graphfi(...);

const post: Post = {
    body: { content: "This is a post" },
    from: {
        emailAddress: {
            address: "",
            name: "",
        },
    },
};

const conversationId = "";
const threadId = "";
const reply = await graph.groups.getById(groupId).conversations.getById(conversationId).threads.getById(threadId).reply(post);
```

## Get Group Conversation Thread Posts

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/conversations";

const graph = graphfi(...);

const groupId = "";
const conversationId = "";
const threadId = "";
const p = await graph.groups.getById(groupId).conversations.getById(conversationId).threads.getById(threadId).posts();
```

## Get Group Conversation Thread Post by Id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/conversations";

const graph = graphfi(...);

const conversationId = "";
const threadId = "";
const postId = "";
const p = await graph.groups.getById(groupId).conversations.getById(conversationId).threads.getById(threadId).posts.getById(postId)();
```

## Create/Update/Delete a Group Conversation Thread Post

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/conversations";
import { Post } from "@microsoft/microsoft-graph-types";

const graph = graphfi(...);

const post: Post = {
    body: { content: "This is a post" },
    from: {
        emailAddress: {
            address: "",
            name: "",
        },
    },
};

const conversationId = "";
const threadId = "";
const p = await graph.groups.getById(groupId).conversations.getById(conversationId).threads.getById(threadId).posts.add(post);

const postId = "";
const update = await graph.groups.getById(groupId).conversations.getById(conversationId).threads.getById(threadId).posts.getById(postId)
    .update({body: {content: "New Post Content"}});
await graph.groups.getById(groupId).conversations.getById(conversationId).threads.getById(threadId).posts.getById(postId).delete();
```

## Reply to a Group Conversation Thread Post

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/conversations";
import { Post } from "@microsoft/microsoft-graph-types";

const graph = graphfi(...);

const post: Post = {
    body: { content: "This is a post" },
    from: {
        emailAddress: {
            address: "",
            name: "",
        },
    },
};

const conversationId = "";
const threadId = "";
const reply = await graph.groups.getById(groupId).conversations.getById(conversationId).threads.getById(threadId).posts.getById(postId).reply(post);
```

## Forward a Group Conversation Thread Post

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/conversations";
import { IPostForwardInfo } from "@pnp/graph/conversations";

const graph = graphfi(...);

const postForwardInfo: IPostForwardInfo = {
    toRecipients: [
        {
            emailAddress: {
                address: "",
                name: "",
            },
        },
    ],
};

const conversationId = "";
const threadId = "";
const post = graph.groups.getById(groupId).conversations.getById(conversationId).threads.getById(threadId).posts.getById(postId);
await post.forward(postForwardInfo);
```

## Group Conversation Thread Post Attachments

See [Attachments](./attachments.md)

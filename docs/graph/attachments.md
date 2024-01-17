# Graph Attachments

More information can be found in the official Graph documentation:

- [Attachments Resource Type](https://learn.microsoft.com/en-us/graph/api/resources/attachment?view=graph-rest-1.0)

Attachments work with [Calendar Events](./calendars.md), [Mail Message](./mail-messages.md), and [Conversation Thread Posts](./conversations.md). The samples below are generic on purpose.

## IAttachment, IAttachments

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)

## Get Attachments

```TypeScript
import { graphfi } from "@pnp/graph";
// Imports required for the object you're obtaining attachments for.
import "@pnp/graph/attachments";

const graph = graphfi(...);

const event_message_post = graph.xxx;
const a = await event_message_post.attachments();
```

## Get Attachment By Id

```TypeScript
import { graphfi } from "@pnp/graph";
// Imports required for the object you're obtaining attachments for.
import "@pnp/graph/attachments";

const graph = graphfi(...);

const event_message_post = graph.xxx;
const attachmentId = "";
const a = await event_message_post.attachments.getById(attachmentId)();
```

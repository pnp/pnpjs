# Graph Mail Messages

More information can be found in the official Graph documentation:

- [Message Resource Type](https://learn.microsoft.com/en-us/graph/api/resources/message?view=graph-rest-1.0)

## IMessage, IMessages

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Get User's Messages

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail/messages";

const graph = graphfi(...);

const currentUser = graph.me;
const messages = await currentUser.messages();
```

## Get User's Messages - Delta

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail";
import {IMessageDelta} from "@pnp/graph/mail"

const graph = graphfi(...);

const currentUser = graph.me;

//get a list of messages changes (changeType is an optional parameter. See Graph docs)
const messages = await currentUser.mailFolders.getById(`{mailFolderId}`).messages.delta({changeType: "updated"})();

//You can also loop through the delta changes using the async iterator.
const messages = currentUser.mailFolders.getById(`{mailFolderId}`).messages.delta({changeType: "updated"});
for await (const m of messages) {
    // array of changes
    console.log(m);
}

```

## Create Draft Message

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail/messages";

const draftMessage: Message = {
    subject: "PnPjs Test Message",
    importance: "low",
    body: {
        contentType: "html",
        content: "This is a test message!",
    },
    toRecipients: [
        {
            emailAddress: {
                address: "AdeleV@contoso.onmicrosoft.com",
            },
        },
    ],
};


const graph = graphfi(...);
const currentUser = graph.me;
const draft = await currentUser.messages.add(m);
```

## Update Draft Message

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail/messages";

const graph = graphfi(...);
const currentUser = graph.me;
const update = await currentUser.messages.getById(draft.id).update({ subject: "New Subject" });
```

## Delete a Message

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail/messages";

const graph = graphfi(...);
const currentUser = graph.me;
await currentUser.messages.getById({id}).delete();
```

## Copy a Message

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail/messages";

const graph = graphfi(...);
const currentUser = graph.me;
const messageId = "";
const messageCopy = await currentUser.messages.getById(messageId).copy({Destination Folder Id});
```

## Move a Message

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail/messages";

const graph = graphfi(...);
const currentUser = graph.me;
const messageId = "";
const messageCopy = await currentUser.messages.getById(messageId).move({Destination Folder Id});
```

## Send Draft Message/Reply/ReplyAll

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail/messages";

const graph = graphfi(...);
const currentUser = graph.me;
const update = await currentUser.messages.getById(draft.id).send();
```

## Send Message

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail/messages";

const draftMessage: Message = {
    subject: "PnPjs Test Message",
    importance: "low",
    body: {
        contentType: "html",
        content: "This is a test message!",
    },
    toRecipients: [
        {
            emailAddress: {
                address: "AdeleV@contoso.onmicrosoft.com",
            },
        },
    ],
};


const graph = graphfi(...);
const currentUser = graph.me;
const draft = await currentUser.sendMail(m);
```

## Create Draft Reply/ReplyAll/Forward for Message

The payload for any of these methods take either no payload or one of the Options outlined in the example below.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail/messages";
import {Message} from "

//Option 1
const draftMessage1: Message = {
    subject: "PnPjs Test Message",
    importance: "low",
    body: {
        contentType: "html",
        content: "This is a test message!",
    },
    toRecipients: [
        {
            emailAddress: {
                address: "AdeleV@contoso.onmicrosoft.com",
            },
        },
    ],
};

//Option 2
const draftMessage2 = {
    comment: "This is my response"
}

const graph = graphfi(...);
const messageId = "";
const currentUser = graph.me;
const draftReply = await currentUser.messages.getById(messageId).createReply(draftMessage1);
const draftReplyAll = await currentUser.messages.getById(messageId).createReplyAll(draftMessage2);
const draftForward = await currentUser.messages.getById(messageId).createForward();
```

## Message Attachments

See [Attachments](./attachments.md)

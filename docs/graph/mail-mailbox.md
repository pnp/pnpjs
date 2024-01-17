# Graph Mailbox

More information can be found in the official Graph documentation:

- [Outlook Mailbox Settings Resource Type](https://learn.microsoft.com/en-us/graph/api/resources/mailboxsettings?view=graph-rest-1.0)
- [Manage Focused Inbox](https://learn.microsoft.com/en-us/graph/api/resources/manage-focused-inbox?view=graph-rest-1.0)

## IMailboxSettings

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Get User's Mailbox Setting

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail/mailbox";

const graph = graphfi(...);

const currentUser = graph.me;
const mailboxSettings = await currentUser.mailboxSettings();
const automaticRepliesSetting = await currentUser.mailboxSettings.automaticRepliesSetting();
const dateFormat = await currentUser.mailboxSettings.dateFormat();
const language = await currentUser.mailboxSettings.language();
const timeFormat = await currentUser.mailboxSettings.timeFormat();
const timeZone = await currentUser.mailboxSettings.timeZone();
const workingHours = await currentUser.mailboxSettings.workingHours();
const userPurpose = await currentUser.mailboxSettings.userPurpose();
```

## Get User's Focused Inbox Overrides

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail/mailbox";

const graph = graphfi(...);

const currentUser = graph.me;
const fio = await currentUser.focusedInboxOverrides();
```

## Get User's Focused Inbox Override by Id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail/mailbox";

const graph = graphfi(...);

const currentUser = graph.me;
const fio = await currentUser.focusedInboxOverrides.getById({fio id});
```

## Add Focused Inbox Override

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail/mailbox";

const graph = graphfi(...);

const override: InferenceClassificationOverride = {
        classifyAs: "focused",
        senderEmailAddress: {
            name: "Mary Smith",
            address: "msmith@contoso.com",
        },
    };

const currentUser = graph.me;
const fio = await currentUser.focusedInboxOverrides.add(override);
```

## Update Focused Inbox Override

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail/mailbox";

const graph = graphfi(...);

const currentUser = graph.me;
const fio = await currentUser.focusedInboxOverrides.update({ senderEmailAddress: { name: "marysmith@contoso.com" }});
```

## Delete Focused Inbox Override

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail/mailbox";

const graph = graphfi(...);

const currentUser = graph.me;
const fio = await currentUser.focusedInboxOverrides.getById({fio id}).delete();
```

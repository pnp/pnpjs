# Graph Mail Rules

More information can be found in the official Graph documentation:

- [Rule Resource Type](https://learn.microsoft.com/en-us/graph/api/resources/messagerule?view=graph-rest-1.0)

## IMessageRule, IMessageRules

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Get User's Message Rules for their Inbox

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail";

const graph = graphfi(...);

// This can be any folder id or Well-known folder names
const currentUserInbox = graph.me.mailFolders.getById("inbox");
const rules = await currentUserInbox.messageRules();
```

## Get a Message Rules for a User

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail";

const graph = graphfi(...);

// This can be any folder id or Well-known folder names
const currentUserInbox = graph.me.mailFolders.getById("inbox");
const rule = await currentUserInbox.messageRules.getById({ruleId})();
```

## Add a Message Rule

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail";
import { MessageRule as IMessageRuleType } from "@microsoft/microsoft-graph-types";

const graph = graphfi(...);

const draftRule: IMessageRuleType = {
        displayName: "PnPjs Test Rule",
        sequence: 2,
        isEnabled: true,
        conditions: {
            senderContains: [
                "adele",
            ],
        },
        actions: {
            forwardTo: [
                {
                    emailAddress: {
                        name: "Alex Wilbur",
                        address: "AlexW@contoso.onmicrosoft.com",
                    },
                },
            ],
            stopProcessingRules: true,
        },
    };

// This can be any folder id or Well-known folder names
const currentUserInbox = graph.me.mailFolders.getById("inbox");
const rule = await currentUserInbox.messageRules.add(draftRule);
```

## Update a Message Rule

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail";

const graph = graphfi(...);

// This can be any folder id or Well-known folder names
const currentUserInbox = graph.me.mailFolders.getById("inbox");
const newRuleName = "My Mail Rule";
const rule = await currentUserInbox.messageRules.getById({ruleId}).update({ displayName: newRuleName });
```

## Delete a Message Rule

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail";

const graph = graphfi(...);

// This can be any folder id or Well-known folder names
const currentUserInbox = graph.me.mailFolders.getById("inbox");
const rule = await currentUserInbox.messageRules.getById({ruleId}).delete();
```

# @pnp/graph/cloud-communications

The ability to retrieve information about a user's presence, including their availability and user activity.

More information can be found in the official Graph documentation:

- [Presence Type](https://docs.microsoft.com/en-us/graph/api/resources/presence?view=graph-rest-1.0)

## IPresence

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Get users presence

Gets a user's presence

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/cloud-communications";

const graph = graphfi(...);

const presenceMe = await graph.me.presence();

const presenceThem = await graph.users.getById("99999999-9999-9999-9999-999999999999").presence();

```

## Get presence for multiple users

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/cloud-communications";

const graph = graphfi(...);

const presenceList = await graph.communications.getPresencesByUserId(["99999999-9999-9999-9999-999999999999"]);

```

## Set presence for a User

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/cloud-communications";

const graph = graphfi(...);

const presenceMe = await graph.me.presence.setPresence(
    availability: "Busy",
    activity:"InACall",
    sessionId:"b8d08156-5ba4-4c5d-bee8-f2634901d491",
    expirationDuration: "PT1H"
);

const presenceThem = await graph.users.getById("99999999-9999-9999-9999-999999999999").setPresence(
    availability: "Busy",
    activity:"InACall",
    sessionId:"b8d08156-5ba4-4c5d-bee8-f2634901d491",
    expirationDuration: "PT1H"
);

```

## Clear presence for a User

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/cloud-communications";

const graph = graphfi(...);

// clear my presence
await graph.me.presence.clearPreferredPresence();

// clear user presence
await graph.users.getById("99999999-9999-9999-9999-999999999999").clearPreferredPresence();

```

## Set presence preference for a User

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/cloud-communications";

const graph = graphfi(...);

// set my preferred presence
await graph.me.presence.setPreferredPresence({
    availability:"Available",
    activity:"Available",
    expirationDuration:"PT1H"
});


// set user preferred presence
await graph.users.getById("99999999-9999-9999-9999-999999999999").presence.setPreferredPresence({
    availability:"Available",
    activity:"Available",
    expirationDuration:"PT1H"
});

```

## Clear presence preference for a User

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/cloud-communications";

const graph = graphfi(...);

// set my presence preference
await graph.me.presence.clearPreferredPresence();

// clear user presence preference
await graph.users.getById("99999999-9999-9999-9999-999999999999").clearPreferredPresence();

```
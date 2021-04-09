# @pnp/graph/cloud-communications

The ability to retrieve information about a user's presence, including their availability and user activity.

More information can be found in the official Graph documentation:

- [Presence Type](https://docs.microsoft.com/en-us/graph/api/resources/presence?view=graph-rest-1.0)

## IPresence

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

|Scenario|Import Statement|
|--|--|
|Selective 1|import { graph } from "@pnp/graph";<br />import "@pnp/graph/cloud-communications";|
|Preset: All|import { graph } from "@pnp/graph/presets/all";|

## Get users presence

Gets a list of all the contacts for the user.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/cloud-communications";

const presenceMe = await graph.me.presence();

const presenceThem = await graph.users.getById("99999999-9999-9999-9999-999999999999").presence();

```

## Get presence for multiple users

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/cloud-communications";

const presenceList = await graph.communications.getPresencesByUserId(["99999999-9999-9999-9999-999999999999"]);

```

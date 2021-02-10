# @pnp/graph/outlook

Represents the Outlook services available to a user. Currently, only interacting with categories is supported. 

You can learn more  by reading the [Official Microsoft Graph Documentation](https://docs.microsoft.com/en-us/graph/api/resources/outlookuser?view=graph-rest-1.0).

## IUsers, IUser, IPeople

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

|Scenario|Import Statement|
|--|--|
|Selective 1|import { graph } from "@pnp/graph";<br />import {Outlook, IOutlook, MasterCategories, IMasterCategories} from "@pnp/graph/outlook";|
|Selective 2|import { graph } from "@pnp/graph";<br />import "@pnp/graph/outlook";|
|Preset: All|import { graph, Outlook, IOutlook, MasterCategories, IMasterCategories } from "@pnp/graph/presets/all";|

## Current User Outlook Services

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/outlook";

const currentOutlookUser = await graph.me.outlook();
```

## Get All Categories for Current User

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/outlook";

const categories = await graph.me.outlook.masterCategories();
```

## Add Category for Current User

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/outlook";

await graph.me.outlook.masterCategories.add({
  displayName: 'Newsletters', 
  color: 'preset2'
});
```
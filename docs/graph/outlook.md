# @pnp/graph/outlook

Represents the Outlook services available to a user. Currently, only interacting with categories is supported.

You can learn more  by reading the [Official Microsoft Graph Documentation](https://docs.microsoft.com/en-us/graph/api/resources/outlookuser?view=graph-rest-1.0).

## IUsers, IUser, IPeople

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

|Scenario|Import Statement|
|--|--|
|Selective 1|import { graph } from "@pnp/graph";<br />import {Outlook, IOutlook, MasterCategories, IMasterCategories, OutlookCategory, IOutlookCategory} from "@pnp/graph/outlook";|
|Selective 2|import { graph } from "@pnp/graph";<br />import "@pnp/graph/outlook";|
|Preset: All|import { graph, Outlook, IOutlook, MasterCategories, IMasterCategories } from "@pnp/graph/presets/all";|

## Get All Categories User

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/outlook";

// Delegated permissions
const categories = await graph.me.outlook.masterCategories();
// Application permissions
const categories = await graph.users.getById('{user id}').outlook.masterCategories();
```

## Add Category User

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/outlook";

// Delegated permissions
await graph.me.outlook.masterCategories.add({
  displayName: 'Newsletters', 
  color: 'preset2'
});
// Application permissions
await graph.users.getById('{user id}').outlook.masterCategories.add({
  displayName: 'Newsletters', 
  color: 'preset2'
});
```

## Update Category

![Known Issue Banner](https://img.shields.io/badge/Known%20Issue-important.svg) Testing has shown that `displayName` cannot be updated.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/outlook";
import { OutlookCategory } from "@microsoft/microsoft-graph-types";

const categoryUpdate: OutlookCategory = {
    color: "preset5"
}

// Delegated permissions
const categories = await graph.me.outlook.masterCategories.getById('{category id}').update(categoryUpdate);
// Application permissions
const categories = await graph.users.getById('{user id}').outlook.masterCategories.getById('{category id}').update(categoryUpdate);
```

## Delete Category

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/outlook";

// Delegated permissions
const categories = await graph.me.outlook.masterCategories.getById('{category id}').delete();
// Application permissions
const categories = await graph.users.getById('{user id}').outlook.masterCategories.getById('{category id}').delete();
```

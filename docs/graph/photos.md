# @pnp/graph/photos

A profile photo of a user, group or an Outlook contact accessed from Exchange Online or Azure Active Directory (AAD). It's binary data not encoded in base-64.

You can learn more about Microsoft Graph users by reading the [Official Microsoft Graph Documentation](https://docs.microsoft.com/en-us/graph/api/resources/user?view=graph-rest-1.0).

## IPhoto

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Current User Photo

This example shows the getBlob() endpoint, there is also a getBuffer() endpoint to support node.js

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/photos";

const graph = graphfi(...);

const photoValue = await graph.me.photo.getBlob();
const url = window.URL || window.webkitURL;
const blobUrl = url.createObjectURL(photoValue);
document.getElementById("photoElement").setAttribute("src", blobUrl);
```

## Current Group Photo

This example shows the getBlob() endpoint, there is also a getBuffer() endpoint to support node.js

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/photos";

const graph = graphfi(...);

const photoValue = await graph.groups.getById("7d2b9355-0891-47d3-84c8-bf2cd9c62177").photo.getBlob();
const url = window.URL || window.webkitURL;
const blobUrl = url.createObjectURL(photoValue);
document.getElementById("photoElement").setAttribute("src", blobUrl);
```

## Set User Photo

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/photos";

const graph = graphfi(...);

const input = <HTMLInputElement>document.getElementById("thefileinput");
const file = input.files[0];
await graph.me.photo.setContent(file);
```

## Set Group Photo

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/photos";

const graph = graphfi(...);

const input = <HTMLInputElement>document.getElementById("thefileinput");
const file = input.files[0];
await graph.me.photo.setContent(file);
```

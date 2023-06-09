# @pnp/graph/shares

The shares module allows you to access shared files, or any file in the tenant using encoded file urls.

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)

## Access a Share by Id

```TS
import { graphfi } from "@pnp/graph";
import "@pnp/graph/shares";

const graph = graphfi(...);

const shareInfo = await graph.shares.getById("{shareId}")();
```

## Encode a Sharing Link

If you don't have a share id but have the absolute path to a file you can encode it into a sharing link, allowing you to access it directly using the /shares endpoint.

```TS
import { graphfi } from "@pnp/graph";
import "@pnp/graph/shares";

const graph = graphfi(...);

const shareLink: string = graph.shares.encodeSharingLink("https://{tenant}.sharepoint.com/sites/dev/Shared%20Documents/new.pptx");

const shareInfo = await graph.shares.getById(shareLink)();
```

## Access a Share's driveItem resource

You can also access the full functionality of the driveItem via a share. Find [more details on the capabilities of driveItem here](./onedrive.md).

```TS
import { graphfi } from "@pnp/graph";
import "@pnp/graph/shares";

const graph = graphfi(...);

const driveItemInfo = await graph.shares.getById("{shareId}").driveItem();
```

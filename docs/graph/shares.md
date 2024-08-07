# @pnp/graph/shares

The shares module allows you to access shared files, or any file in the tenant using encoded file urls.

More information can be found in the official Graph documentation:

- [Shares Resource Type](https://docs.microsoft.com/en-us/graph/api/shares-get?view=graph-rest-1.0)

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

You can also access the full functionality of the driveItem via a share. Find [more details on the capabilities of driveItem here](./files.md).

```TS
import { graphfi } from "@pnp/graph";
import "@pnp/graph/shares";

const graph = graphfi(...);

const driveItemInfo = await graph.shares.getById("{shareId}").driveItem();
```

## Convert sharing URL to a sharing token

To use a sharing URL with this API, your app needs to transform the URL into a sharing token.

```TS
import { graphfi } from "@pnp/graph";
import "@pnp/graph/shares";
import {IShareLinkInfo} from "@pnp/graph/shares";

const graph = graphfi(...);

// Use ShareId
const shareLinkInfo: IShareLinkInfo = {
    shareId: shareId,
    redeemSharingLink: false,
};
const sharedDriveItem = await graph.shares.useSharingLink(shareLinkInfo);

// Use Encoded Sharing Link
const shareLink: string = graph.shares.encodeSharingLink("https://{tenant}.sharepoint.com/sites/dev/Shared%20Documents/new.pptx");
const shareLinkInfo = {
    encodedSharingUrl: shareLink,
    redeemSharingLink: false
};
// default shared drive item response (id, name)
const sharedDriveItem = await graph.shares.useSharingLink(shareLinkInfo);

```

## Create Sharing Link

You can use createLink action to share a DriveItem via a sharing link.

The createLink action will create a new sharing link if the specified link type doesn't already exist for the calling application. If a sharing link of the specified type already exists for the app, the existing sharing link will be returned.

```TS
import { graphfi } from "@pnp/graph";
import "@pnp/graph/shares";
import "@pnp/graph/users";
import "@pnp/graph/files";

const graph = graphfi(...);

const sharingLinkInfo: ICreateShareLinkInfo = {
    type: "view",
    scope: "anonymous",
};
const sharingLink = await graph.users.getById({userId}).drives.getById({driveId}).getItemById({itemId}).createSharingLink(sharingLinkInfo);

```

## Grant Sharing Link Access

Grant users access to a link represented by a permission.

```TS
import { graphfi } from "@pnp/graph";
import "@pnp/graph/shares";

const graph = graphfi(...);

const shareLink: string = graph.shares.encodeSharingLink("https://{tenant}.sharepoint.com/sites/dev/Shared%20Documents/new.pptx");
const sharingLinkAccess = {
    encodedSharingUrl: shareLink,
    recipients: [{email: "user@contoso.com"}],
    roles: ["read"]
};

// 
const permissions = await graph.shares.grantSharingLinkAccess(sharingLinkAccess);

```

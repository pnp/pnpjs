# Graph Mail Folders

More information can be found in the official Graph documentation:

- [Mail Folder Resource Type](https://learn.microsoft.com/en-us/graph/api/resources/mailfolder?view=graph-rest-1.0)

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)

## Get Mail folder listing

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail";

const graph = graphfi(...);

// This can be any folder id or Well-known folder names
const currentUserInbox = await graph.me.mailFolders.getById("inbox")();

// Get folders
const folders = await graph.me.mailFolders();

// Get folders and include hidden folders
const allFolders = await graph.me.mailFolders.includeHidden();
```

## Get Specific Folder by Id or Well0know folder name

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail";

const graph = graphfi(...);

// Get folder by Well-known folder names
const currentUserInbox = await graph.me.mailFolders.getById("inbox")();

// Get folders
const folders = await graph.me.mailFolders();
// Get folder by folder id
const currentUserFolder = await graph.me.mailFolders.getById(folders[0].id)();
```

## Get Folders - Delta

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail";
import {IMailFolderDelta} from "@pnp/graph/mail"

const graph = graphfi(...);

const currentUser = graph.me;
const folders = await currentUser.mailFolders.delta();

const deltatoken = folders.deltaLink.substring(folder.deltaLink.indexOf("deltatoken=") + 11);
const deltaParameters: IMailFolderDelta = {
    "$skiptoken": null,
    "$deltatoken": deltatoken,
}
const deltaFolders = await currentUser.mailFolders.delta(deltaParameters);
```

## Add Folder or Search Folder

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail";

const graph = graphfi(...);

// Add Mail Folder
const draftFolder: IMailFolder = {
    displayName: "PnP Test Folder",
    isHidden: false,
};

const folder = await graph.users.getById(testUserName).mailFolders.add(draftFolder);

// Add Child Folder

const childFolder = await graph.users.getById(testUserName).mailFolders.getById({mailFolderId}).childFolders.add(draftFolder);

// Add Search Folder
const currentUserInbox = await graph.me.mailFolders.getById("inbox")();

const draftSearchFolder: IMailSearchFolder = {
    displayName: "PnP Test Search Folder",
    sourceFolderIds: [currentUserInbox.id],
    filterQuery: "{Your Query Goes Here}"
};

const searchFolder = await graph.users.getById(testUserName).mailFolders.getById(currentUserInbox.id).childFolders.add(draftSearchFolder);
```

## Update Folder

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail";

const graph = graphfi(...);

const folder = await graph.users.getById(testUserName).mailFolders.update({displayName: "New Display Name"});
```

## Delete Folder

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail";

const graph = graphfi(...);

await graph.users.getById(testUserName).mailFolders.getById({mailFolderId}).delete();
```

## Copy/Move Folder

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail";

const graph = graphfi(...);

const destinationFolderId = "...";
// Move folder to destination folder
await graph.users.getById(testUserName).mailFolders.getById({mailFolderId}).move(destinationFolderId);
// Copy folder to destination folder
await graph.users.getById(testUserName).mailFolders.getById({mailFolderId}).copy(destinationFolderId);
```

## Get Child Folders

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail";

const graph = graphfi(...);

await graph.users.getById(testUserName).mailFolders.getById({mailFolderId}).childFolders();
```

## Get Folder's Messages

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/mail";

const graph = graphfi(...);

await graph.users.getById(testUserName).mailFolders.getById({mailFolderId}).messages();
```

## Messages

For more information on [Messages](./mail-messages.md)

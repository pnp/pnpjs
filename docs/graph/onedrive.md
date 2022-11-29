# @pnp/graph/onedrive

The ability to manage drives and drive items in Onedrive is a capability introduced in version 1.2.4 of @pnp/graph. Through the methods described
you can manage drives and drive items in Onedrive.

## IInvitations

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Get the default drive

Using the drive you can get the default drive from Onedrive

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const drives = await graph.users.getById('user@tenant.onmicrosoft.com').drives();

const drive = await graph.me.drive();
```

## Get all of the drives

Using the drives() you can get the users available drives from Onedrive

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const drives = await graph.users.getById('user@tenant.onmicrosoft.com').drives();

const drives = await graph.me.drives();

```

## Get drive by Id

Using the drives.getById() you can get one of the available drives in Outlook

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const drive = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId')();

const drive = await graph.me.drives.getById('driveId')();

```

## Get the associated list of a drive

Using the list() you get the associated list

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const list = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').list();

const list = await graph.me.drives.getById('driveId').list();

```

## Get the recent files

Using the recent() you get the recent files

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const files = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').recent();

const files = await graph.me.drives.getById('driveId').recent();

```

## Get the files shared with me

Using the sharedWithMe() you get the files shared with the user

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const shared = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').sharedWithMe();

const shared = await graph.me.drives.getById('driveId').sharedWithMe();

// By default, sharedWithMe return items shared within your own tenant. To include items shared from external tenants include the options object.

const options: ISharingWithMeOptions = {allowExternal: true};
const shared = await graph.me.drives.getById('driveId').sharedWithMe(options);

```

## Get the following files

List the items that have been followed by the signed in user.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const files = await graph.me.drives.getById('driveId').following();

```

## Get the Root folder

Using the root() you get the root folder

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const root = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').root();

const root = await graph.me.drives.getById('driveId').root();

```

## Get the Children

Using the children() you get the children

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const rootChildren = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').root.children();

const rootChildren = await graph.me.drives.getById('driveId').root.children();

const itemChildren = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').items.getById('itemId').children();

const itemChildren = await graph.me.drives.getById('driveId').root.items.getById('itemId').children();

```

## Add Item

Using the add you can add an item

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/onedrive";
import "@pnp/graph/users";

const graph = graphfi(...);

const add1 = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').root.children.add("test.txt", "My File Content String");
const add2 = await graph.me.drives.getById('driveId').root.children.add("filename.txt", "My File Content String");
```

## Add folder

Using addFolder you can add a folder

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/onedrive";
import "@pnp/graph/users"
import { DriveItem as IDriveItem } from "@microsoft/microsoft-graph-types";

const graph = graphfi(...);

const addFolder1 = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').root.children.addFolder('New Folder');
const addFolder2 = await graph.me.drives.getById('driveId').root.children.addFolder('New Folder');

```

## Search items

Using the search() you can search for items, and optionally select properties

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

// Where searchTerm is the query text used to search for items.
// Values may be matched across several fields including filename, metadata, and file content.

const search = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').root.search(searchTerm)();

const search = await graph.me.drives.getById('driveId').root.search(searchTerm)();

```

## Get specific item in drive

Using the items.getById() you can get a specific item from the current drive

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const item = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').items.getById('itemId')();

const item = await graph.me.drives.getById('driveId').items.getById('itemId')();

```

## Get drive item contents

Using the item.getContent() you can get the content of a file.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

private _readFileAsync(file: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as ArrayBuffer);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// Where itemId is the id of the item
const fileContents: Blob = await graph.me.drive.getItemById(itemId).getContent();
const content: ArrayBuffer = await this._readFileAsync(fileContents);

// This is an example of decoding plain text from the ArrayBuffer
const decoder = new TextDecoder('utf-8');
const decodedContent = decoder.decode(content);
```

## Get thumbnails

Using the thumbnails() you get the thumbnails

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const thumbs = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').items.getById('itemId').thumbnails();

const thumbs = await graph.me.drives.getById('driveId').items.getById('itemId').thumbnails();

```

## Delete drive item

Using the delete() you delete the current item

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const thumbs = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').items.getById('itemId').delete();

const thumbs = await graph.me.drives.getById('driveId').items.getById('itemId').delete();

```

## Update drive item

Using the update() you update the current item

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const update = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').items.getById('itemId').update({name: "New Name"});

const update = await graph.me.drives.getById('driveId').items.getById('itemId').update({name: "New Name"});

```

## Move drive item

Using the move() you move the current item, and optionally update it

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

// Requires a parentReference to the new folder location
const move = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').items.getById('itemId').move({ parentReference: { id: 'itemId'}}, {name: "New Name"});

const move = await graph.me.drives.getById('driveId').items.getById('itemId').move({ parentReference: { id: 'itemId'}}, {name: "New Name"});

```

## Get the users special folders

Using the users default drive you can get special folders, including: Documents, Photos, CameraRoll, AppRoot, Music

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";
import { SpecialFolder, IDriveItem } from "@pnp/graph/onedrive";

const graph = graphfi(...);

// Get the special folder (App Root)
const driveItem: IDriveItem = await graph.me.drive.special(SpecialFolder.AppRoot)();

// Get the special folder (Documents)
const driveItem: IDriveItem = await graph.me.drive.special(SpecialFolder.Documents)();

// ETC
```

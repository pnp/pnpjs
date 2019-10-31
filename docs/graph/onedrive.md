# @pnp/graph/onedrive

The ability to manage drives and drive items in Onedrive is a capability introduced in version 1.2.4 of @pnp/graph. Through the methods described
you can manage drives and drive items in Onedrive.

## Get the default drive

Using the drive.get() you can get the default drive from Onedrive

```TypeScript
import { graph } from "@pnp/graph";

const drives = await graph.users.getById('user@tenant.onmicrosoft.com').drives.get();

const drives = await graph.me.drives.get();

```

## Get all of the drives

Using the drives.get() you can get the users available drives from Onedrive

```TypeScript
import { graph } from "@pnp/graph";

const drives = await graph.users.getById('user@tenant.onmicrosoft.com').drives.get();

const drives = await graph.me.drives.get();

```

## Get drive by Id

Using the drives.getById() you can get one of the available drives in Outlook

```TypeScript
import { graph } from "@pnp/graph";

const drive = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId');

const drive = await graph.me.drives.getById('driveId');

```

## Get the associated list of a drive

Using the list.get() you get the associated list

```TypeScript
import { graph } from "@pnp/graph";

const list = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').list.get();

const list = await graph.me.drives.getById('driveId').list.get();

```

## Get the recent files

Using the recent.get() you get the recent files

```TypeScript
import { graph } from "@pnp/graph";

const files = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').recent.get();

const files = await graph.me.drives.getById('driveId').recent.get();

```

## Get the files shared with me

Using the sharedWithMe.get() you get the files shared with the user

```TypeScript
import { graph } from "@pnp/graph";

const shared = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').sharedWithMe.get();

const shared = await graph.me.drives.getById('driveId').sharedWithMe.get();

```

## Get the Root folder

Using the root.get() you get the root folder

```TypeScript
import { graph } from "@pnp/graph";

const root = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').root.get();

const root = await graph.me.drives.getById('driveId').root.get();

```

## Get the Children

Using the children.get() you get the children

```TypeScript
import { graph } from "@pnp/graph";

const rootChildren = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').root.children.get();

const rootChildren = await graph.me.drives.getById('driveId').root.children.get();

const itemChildren = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').items.getById('itemId').children.get();

const itemChildren = await graph.me.drives.getById('driveId').root.items.getById('itemId').children.get();

```

## Add folder or item
Using the add you can add a folder or an item

```TypeScript
import { graph } from "@pnp/graph";
import { DriveItem as IDriveItem } from "@microsoft/microsoft-graph-types";

const addFolder = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').root.children.add('New Folder', <IDriveItem>{folder: {}});

const addFolder = await graph.me.drives.getById('driveId').root.children.add('New Folder', <IDriveItem>{folder: {}});

```

## Search items

Using the search.get() you can search for items, and optionally select properties

```TypeScript
import { graph } from "@pnp/graph";

const search = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId')root.search('queryText').get();

const search = await graph.me.drives.getById('driveId')root.search('queryText').get();

```

## Get specific item in drive

Using the items.getById() you can get a specific item from the current drive

```TypeScript
import { graph } from "@pnp/graph";

const item = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').items.getById('itemId');

const item = await graph.me.drives.getById('driveId').items.getById('itemId');

```

## Get thumbnails 

Using the thumbnails.get() you get the thumbnails

```TypeScript
import { graph } from "@pnp/graph";

const thumbs = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').items.getById('itemId').thumbnails.get();

const thumbs = await graph.me.drives.getById('driveId').items.getById('itemId').thumbnails.get();

```

## Delete drive item 

Using the delete() you delete the current item

```TypeScript
import { graph } from "@pnp/graph";

const thumbs = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').items.getById('itemId').delete();

const thumbs = await graph.me.drives.getById('driveId').items.getById('itemId').delete();

```

## Update drive item 

Using the update() you update the current item

```TypeScript
import { graph } from "@pnp/graph";

const update = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').items.getById('itemId').update({name: "New Name"});

const update = await graph.me.drives.getById('driveId').items.getById('itemId').update({name: "New Name"});

```

## Move drive item 

Using the move() you move the current item, and optionally update it

```TypeScript
import { graph } from "@pnp/graph";

// Requires a parentReference to the new folder location
const move = await graph.users.getById('user@tenant.onmicrosoft.com').drives.getById('driveId').items.getById('itemId').move({ parentReference: { id: 'itemId'}}, {name: "New Name"});

const move = await graph.me.drives.getById('driveId').items.getById('itemId').move({ parentReference: { id: 'itemId'}}, {name: "New Name"});

```
# @pnp/graph/onedrive

The ability to manage drives and drive items in Onedrive is a capability introduced in version 1.2.4 of @pnp/graph. Through the methods described
you can manage drives and drive items in Onedrive.

## IInvitations

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Get the default drive

Using the drive you can get the users default drive from Onedrive, or the groups or sites default document library.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/groups";
import "@pnp/graph/sites";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const otherUserDrive = await graph.users.getById("user@tenant.onmicrosoft.com").drive();

const currentUserDrive = await graph.me.drive();

const groupDrive = await graph.groups.getById("{group identifier}").drive();

const siteDrive = await graph.sites.getById("{site identifier}").drive();
```

## Get all of the drives

Using the drives() you can get the users available drives from Onedrive

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/groups";
import "@pnp/graph/sites";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const otherUserDrive = await graph.users.getById("user@tenant.onmicrosoft.com").drives();

const currentUserDrive = await graph.me.drives();

const groupDrives = await graph.groups.getById("{group identifier}").drives();

const siteDrives = await graph.sites.getById("{site identifier}").drives();

```

## Get drive by Id

Using the drives.getById() you can get one of the available drives in Outlook

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const drive = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}")();

const drive = await graph.me.drives.getById("{drive id}")();

const drive = await graph.drives.getById("{drive id}")();

```

## Get the associated list of a drive

Using the list() you get the associated list information

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const list = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").list();

const list = await graph.me.drives.getById("{drive id}").list();

```

Using the getList(), from the lists implementation, you get the associated IList object.
Form more infomration about acting on the IList object see [@pnpjs/graph/lists](./lists.md)

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";
import "@pnp/graph/lists";

const graph = graphfi(...);

const listObject: IList = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").getList();

const listOBject: IList = await graph.me.drives.getById("{drive id}").getList();

const list = await listObject();
```

## Get the recent files

Using the recent() you get the recent files

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const files = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").recent();

const files = await graph.me.drives.getById("{drive id}").recent();

```

## Get the files shared with me

Using the sharedWithMe() you get the files shared with the user

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const shared = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").sharedWithMe();

const shared = await graph.me.drives.getById("{drive id}").sharedWithMe();

// By default, sharedWithMe return items shared within your own tenant. To include items shared from external tenants include the options object.

const options: ISharingWithMeOptions = {allowExternal: true};
const shared = await graph.me.drives.getById("{drive id}").sharedWithMe(options);

```

## Get the following files

List the items that have been followed by the signed in user.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const files = await graph.me.drives.getById("{drive id}").following();

```

## Get the Root folder

Using the root() you get the root folder

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/sites";
import "@pnp/graph/groups";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const root = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").root();
const root = await graph.users.getById("user@tenant.onmicrosoft.com").drive.root();

const root = await graph.me.drives.getById("{drive id}").root();
const root = await graph.me.drive.root();

const root = await graph.sites.getById("{site id}").drives.getById("{drive id}").root();
const root = await graph.sites.getById("{site id}").drive.root();

const root = await graph.groups.getById("{site id}").drives.getById("{drive id}").root();
const root = await graph.groups.getById("{site id}").drive.root();

```

## Get the Children

Using the children() you get the children

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const rootChildren = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").root.children();

const rootChildren = await graph.me.drives.getById("{drive id}").root.children();

const itemChildren = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").items.getById("{item id}").children();

const itemChildren = await graph.me.drives.getById("{drive id}").root.items.getById("{item id}").children();

```

## Get the children by path

Using the drive.getItemsByPath() you can get the contents of a particular folder path

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const item = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getItemsByPath("MyFolder/MySubFolder")();

const item = await graph.me.drives.getItemsByPath("MyFolder/MySubFolder")();

```

## Add Item

Using the add you can add an item, for more options please user the upload method instead.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/onedrive";
import "@pnp/graph/users";
import {IDriveItemAddResult} from "@pnp/graph/onedrive";

const graph = graphfi(...);

const add1: IDriveItemAddResult = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").root.children.add("test.txt", "My File Content String");
const add2: IDriveItemAddResult = await graph.me.drives.getById("{drive id}").root.children.add("filename.txt", "My File Content String");
```

## Upload/Replace Drive Item Content

Using the .upload method you can add or update the content of an item.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/onedrive";
import "@pnp/graph/users";
import {IFileOptions, IDriveItemAddResult} from "@pnp/graph/onedrive";

const graph = graphfi(...);

// file path is only file name
const fileOptions: IFileOptions = {
    content: "This is some test content",
    filePathName: "pnpTest.txt",
    contentType: "text/plain;charset=utf-8"
}

const uDriveRoot: IDriveItemAddResult = await graph.users.getById("user@tenant.onmicrosoft.com").drive.root.upload(fileOptions);

const uFolder: IDriveItemAddResult = await graph.users.getById("user@tenant.onmicrosoft.com").drive.getItemById("{folder id}").upload(fileOptions);

const uDriveIdRoot: IDriveItemAddResult = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").root.upload(fileOptions);

// file path includes folders
const fileOptions2: IFileOptions = {
    content: "This is some test content",
    filePathName: "folderA/pnpTest.txt",
    contentType: "text/plain;charset=utf-8"
}

const uFileOptions: IDriveItemAddResult = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").root.upload(fileOptions2);
```

## Add folder

Using addFolder you can add a folder

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/onedrive";
import "@pnp/graph/users"
import {IDriveItemAddResult} from "@pnp/graph/ondrive";

const graph = graphfi(...);

const addFolder1: IDriveItemAddResult = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").root.children.addFolder('New Folder');
const addFolder2: IDriveItemAddResult = await graph.me.drives.getById("{drive id}").root.children.addFolder('New Folder');

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

const search = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").root.search(searchTerm)();

const search = await graph.me.drives.getById("{drive id}").root.search(searchTerm)();

```

## Get specific item in drive

Using the items.getById() you can get a specific item from the current drive

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const item = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").items.getById("{item id}")();

const item = await graph.me.drives.getById("{drive id}").items.getById("{item id}")();

```

## Get specific item in drive by path

Using the drive.getItemByPath() you can get a specific item from the current drive

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const item = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getItemByPath("MyFolder/MySubFolder/myFile.docx")();

const item = await graph.me.drives.getItemByPath("MyFolder/MySubFolder/myFile.docx")();

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

## Convert drive item contents

Using the item.convertContent() you can get a PDF version of the file. See [official documentation](https://learn.microsoft.com/en-us/graph/api/driveitem-get-content-format?view=graph-rest-1.0&tabs=http) for supported file types.

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
const fileContents: Blob = await graph.me.drive.getItemById(itemId).convertContent("pdf");
const content: ArrayBuffer = await this._readFileAsync(fileContents);

// Further manipulation of the array buffer will be needed based on your requriements.
```

## Get thumbnails

Using the thumbnails() you get the thumbnails

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const thumbs = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").items.getById("{item id}").thumbnails();

const thumbs = await graph.me.drives.getById("{drive id}").items.getById("{item id}").thumbnails();

```

## Delete drive item

Using the delete() you delete the current item

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const thumbs = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").items.getById("{item id}").delete();

const thumbs = await graph.me.drives.getById("{drive id}").items.getById("{item id}").delete();

```

## Update drive item metadata

Using the update() you update the current item

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

const update = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").items.getById("{item id}").update({name: "New Name"});

const update = await graph.me.drives.getById("{drive id}").items.getById("{item id}").update({name: "New Name"});

```

## Move drive item

Using the move() you move the current item, and optionally update it

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

// Requires a parentReference to the destination folder location
const moveOptions: IItemOptions = {
  parentReference: {
    id?: {parentLocationId};
    driveId?: {parentLocationDriveId}};
  };
  name?: {newName};
};

const move = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").items.getById("{item id}").move(moveOptions);

const move = await graph.me.drives.getById("{drive id}").items.getById("{item id}").move(moveOptions);

```

## Copy drive item

Using the copy() you can copy the current item to a new location, returns the path to the new location

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";

const graph = graphfi(...);

// Requires a parentReference to the destination folder location
const copyOptions: IItemOptions = {
  parentReference: {
    id?: {parentLocationId};
    driveId?: {parentLocationDriveId}};
  };
  name?: {newName};
};

const copy = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").items.getById("{item id}").copy(copyOptions);

const copy = await graph.me.drives.getById("{drive id}").items.getById("{item id}").copy(copyOptions);

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

## Get drive item preview

This action allows you to obtain a short-lived embeddable URL for an item in order to render a temporary preview.

If you want to obtain long-lived embeddable links, use the createLink API instead.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";
import { IPreviewOptions, IDriveItemPreviewInfo } from "@pnp/graph/onedrive";
import { ItemPreviewInfo } from "@microsoft/microsoft-graph-types"

const graph = graphfi(...);

const preview: ItemPreviewInfo = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").items.getById("{item id}").preview();

const preview: ItemPreviewInfo = await graph.me.drives.getById("{drive id}").items.getById("{item id}").preview();

const previewOptions: IPreviewOptions = {
    page: 1,
    zoom: 90
}

const preview2: ItemPreviewInfo = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").items.getById("{item id}").preview(previewOptions);

```

## Track Changes

Track changes in a driveItem and its children over time.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";
import { IDeltaItems } from "@pnp/graph/ondrive";

const graph = graphfi(...);

// Get the changes for the drive items from inception
const delta: IDeltaItems = await graph.me.drive.root.delta()();
const delta: IDeltaItems = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").root.delta()();

// Get the changes for the drive items from token
const delta: IDeltaItems = await graph.me.drive.root.delta("{token}")();
```

## Get Drive Item Analytics

Using the analytics() you get the ItemAnalytics for a DriveItem

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";
import { IAnalyticsOptions } from "@pnp/graph/onedrive";

const graph = graphfi(...);

// Defaults to lastSevenDays
const analytics = await graph.users.getById("user@tenant.onmicrosoft.com").drives.getById("{drive id}").items.getById("{item id}").analytics()();

const analytics = await graph.me.drives.getById("{drive id}").items.getById("{item id}").analytics()();

const analyticOptions: IAnalyticsOptions = {
    timeRange: "allTime"
};

const analyticsAllTime = await graph.me.drives.getById("{drive id}").items.getById("{item id}").analytics(analyticOptions)();
```

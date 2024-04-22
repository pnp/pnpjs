# @pnp/graph/files

The ability to manage drives and drive items in OneDrive is a capability introduced in version 1.2.4 of @pnp/graph. Through the methods described
you can manage drives and drive items in OneDrive.

More information can be found in the official Graph documentation:

- [Drives/Files Resource Type](https://learn.microsoft.com/en-us/graph/api/resources/drive?view=graph-rest-1.0)

## IInvitations

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Get the default drive

Using the drive you can get the users default drive from OneDrive, or the groups or sites default document library.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/groups";
import "@pnp/graph/sites";
import "@pnp/graph/files";

const graph = graphfi(...);

const otherUserDrive = await graph.users.getById({user id}).drive();

const currentUserDrive = await graph.me.drive();

const groupDrive = await graph.groups.getById("{group identifier}").drive();

const siteDrive = await graph.sites.getById("{site identifier}").drive();
```

## Get all of the drives

Using the drives() you can get the users available drives from OneDrive

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/groups";
import "@pnp/graph/sites";
import "@pnp/graph/files";

const graph = graphfi(...);

const otherUserDrive = await graph.users.getById({user id}).drives();

const currentUserDrive = await graph.me.drives();

const groupDrives = await graph.groups.getById("{group identifier}").drives();

const siteDrives = await graph.sites.getById("{site identifier}").drives();

```

## Get drive by Id

Using the drives.getById() you can get one of the available drives in Outlook

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/files";

const graph = graphfi(...);

const drive = await graph.users.getById({user id}).drives.getById({drive id})();

const drive = await graph.me.drives.getById({drive id})();

const drive = await graph.drives.getById({drive id})();

```

## Get the associated list of a SharePoint drive

Using the list() you get the associated list information

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/files";

const graph = graphfi(...);

const list = await graph.sites.getById("{site identifier}").getById({drive id}).list();

```

## Get the recent files

Using the recent() you get the recent files

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/files";

const graph = graphfi(...);

const files = await graph.users.getById({user id}).drives.getById({drive id}).recent();

const files = await graph.me.drives.getById({drive id}).recent();

```

## Get the files shared with me

Using the sharedWithMe() you get the files shared with the user

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/files";

const graph = graphfi(...);

const shared = await graph.users.getById({user id}).drives.getById({drive id}).sharedWithMe();

const shared = await graph.me.drives.getById({drive id}).sharedWithMe();

// By default, sharedWithMe return items shared within your own tenant. To include items shared from external tenants include the options object.

const options: ISharingWithMeOptions = {allowExternal: true};
const shared = await graph.me.drives.getById({drive id}).sharedWithMe(options);

```

## Get the drive item being followed

List the items that have been followed by the signed in user.

![Known Issue Banner](https://img.shields.io/badge/Known%20Issue-important.svg) Testing has shown that this endpoint throws a 500 Internal Server error implying a problem with Microsoft Graph.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/files";

const graph = graphfi(...);

const files = await graph.me.drives.getById({drive id}).following();

```

## Follow/Unfollow a drive item

Follow/Unfollow a drive item

![Known Issue Banner](https://img.shields.io/badge/Known%20Issue-important.svg) Testing has shown that this endpoint throws a 500 Internal Server error implying a problem with Microsoft Graph.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/files";

const graph = graphfi(...);

const driveItem = await graph.me.drives.getById({drive id}).getItemById({item id}).follow();
const driveItem = await graph.me.drives.getById({drive id}).getItemById({item id}).unfollow();

const driveItem = await graph.users.getById({user id}).drives.getById({drive id}).getItemById({item id}).follow();
const driveItem = await graph.users.getById({user id}).drives.getById({drive id}).getItemById({item id}).unfollow();
```

## Get the Root folder

Using the root() you get the root folder

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/sites";
import "@pnp/graph/groups";
import "@pnp/graph/files";

const graph = graphfi(...);

const root = await graph.users.getById({user id}).drives.getById({drive id}).root();
const root = await graph.users.getById({user id}).drive.root();

const root = await graph.me.drives.getById({drive id}).root();
const root = await graph.me.drive.root();

const root = await graph.sites.getById("{site id}").drives.getById({drive id}).root();
const root = await graph.sites.getById("{site id}").drive.root();

const root = await graph.groups.getById("{site id}").drives.getById({drive id}).root();
const root = await graph.groups.getById("{site id}").drive.root();

```

## Get the Children

Using the children() you get the children

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/files";

const graph = graphfi(...);

const rootChildren = await graph.users.getById({user id}).drives.getById({drive id}).root.children();

const rootChildren = await graph.me.drives.getById({drive id}).root.children();

const itemChildren = await graph.users.getById({user id}).drives.getById({drive id}).getItemById("{item id}").children();

const itemChildren = await graph.me.drives.getById({drive id}).root.getItemById("{item id}").children();

```

## Get the children by path

Using the drive.getItemsByPath() you can get the contents of a particular folder path

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/files";

const graph = graphfi(...);

const item = await graph.users.getById({user id}).drives.getItemsByPath("MyFolder/MySubFolder")();

const item = await graph.me.drives.getItemsByPath("MyFolder/MySubFolder")();

```

## Add Drive Item (File and Folder)

Using the add you can add an item, for more options please user the upload method instead.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/files";
import "@pnp/graph/users";
import {IDriveItemAdd} from "@pnp/graph/files";

const graph = graphfi(...);

const fileInfo: IDriveItemAdd = {
    filename: "Test File.txt",
    content: "Contents of test file",
    contentType: "text/plain",
    conflictBehavior: "replace",
    driveItem: {},
};

const folderInfo: IDriveItemAddFolder = {
    name: "Sub Folder",
    conflictBehavior: "replace",
};

const driveRootFile = await graph.users.getById({user Id}).drive.root.children.add(fileInfo);
const driveRootFolder = await graph.users.getById({user Id}).drive.root.children.addFolder(folderInfo);

const subFolderFile = await graph.users.getById({user Id}).drive.getItemById({folder id}).children.add(fileInfo);
const subFolderFile = await graph.users.getById({user Id}).drive.getItemById({folder id}).children.addFolder(folderInfo);
```

## Upload/Replace Drive Item Content

Using the .upload method you can add or update the content of an item.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/files";
import "@pnp/graph/users";
import {IFileUploadOptions} from "@pnp/graph/files";

const graph = graphfi(...);

// file path is only file name
const fileOptions: IFileUploadOptions = {
    content: "This is some test content",
    filePathName: "pnpTest.txt",
    contentType: "text/plain;charset=utf-8",
}

const driveItem = await graph.users.getById({user id}).drive.root.upload(fileOptions);
const driveItem = await graph.users.getById({user id}).drive.getItemById({folder id}).upload(fileOptions);
const driveItem = await graph.users.getById({user id}).drives.getById({drive id}).root.upload(fileOptions);

// file path includes folders
const fileOptions2: IFileOptions = {
    content: "This is some test content",
    filePathName: "folderA/pnpTest.txt",
    contentType: "text/plain;charset=utf-8"
}

const driveItem = await graph.users.getById({user id}).drives.getById({drive id}).root.upload(fileOptions2);
```

## Resumable Upload for Drive Item Content

Create an upload session to allow your app to upload files up to the maximum file size. An upload session allows your app to upload ranges of the file in sequential API requests. Upload sessions also allow the transfer to resume if a connection is dropped while the upload is in progress.

```TypeScript
import * as fs from "fs";
import { graphfi } from "@pnp/graph";
import "@pnp/graph/files";
import "@pnp/graph/users";
import {IFileUploadOptions} from "@pnp/graph/files";

const graph = graphfi(...);

const fileBuff = fs.readFileSync("C:\\MyDocs\\TestDocument.docx");
const fileUploadOptions: IResumableUploadOptions<DriveItemUploadableProperties> = {
    item: {
        name: "TestDocument2.docx",
        fileSize: fileBuff.byteLength,
    },
};

// Create the upload session
const uploadSession = await graph.users.getById(userId).drive.getItemById(driveRoot.id).createUploadSession(fileUploadOptions);
// Get the status of the upload session
const status = await uploadSession.resumableUpload.status();

// Upload the entire file to the upload session
const upload = await uploadSession.resumableUpload.upload(fileBuff.length, fileBuff);

// Upload a chunk of the file to the upload session
// Using a fragment size that doesn't divide evenly by 320 KiB results in errors committing some files.
const chunkSize = 327680;
let startFrom = 0;
while (startFrom < fileBuff.length) {
    const fileChunk = fileBuff.slice(startFrom, startFrom + chunkSize);    
    const contentLength = `bytes ${startFrom}-${startFrom + chunkSize}/${fileBuff.length}`
    const uploadChunk = await uploadSession.resumableUpload.upload(chunkSize, fileChunk, contentLength);
    startFrom += chunkSize;
}
```

## Search items

Using the search() you can search for items, and optionally select properties

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/files";

const graph = graphfi(...);

// Where searchTerm is the query text used to search for items.
// Values may be matched across several fields including filename, metadata, and file content.

const search = await graph.users.getById({user id}).drives.getById({drive id}).root.search(searchTerm)();

const search = await graph.me.drives.getById({drive id}).root.search(searchTerm)();

```

## Get specific item in drive

Using the items.getById() you can get a specific item from the current drive

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/files";

const graph = graphfi(...);

const item = await graph.users.getById({user id}).drives.getById({drive id}).getItemById("{item id}")();

const item = await graph.me.drives.getById({drive id}).getItemById("{item id}")();

```

## Get specific item in drive by path

Using the drive.getItemByPath() you can get a specific item from the current drive

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/files";

const graph = graphfi(...);

const item = await graph.users.getById({user id}).drives.getItemByPath("MyFolder/MySubFolder/myFile.docx")();

const item = await graph.me.drives.getItemByPath("MyFolder/MySubFolder/myFile.docx")();

```

## Get drive item contents

Using the item.getContent() you can get the content of a file.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/files";

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
import "@pnp/graph/files";

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
import "@pnp/graph/files";

const graph = graphfi(...);

const thumbs = await graph.users.getById({user id}).drives.getById({drive id}).getItemById("{item id}").thumbnails();

const thumbs = await graph.me.drives.getById({drive id}).getItemById("{item id}").thumbnails();

```

## Delete/Permenently Delete drive item

Using the delete() you delete the current item. Using .permanentDelete you can permenently delete the current item.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/files";

const graph = graphfi(...);

await graph.me.drives.getById({drive id}).getItemById({item id}).delete();
await graph.me.drives.getById({drive id}).getItemById({item id}).permanentDelete();
await graph.users.getById({user id}).drives.getById({drive id}).getItemById({item id}).delete();
await graph.users.getById({user id}).drives.getById({drive id}).getItemById({item id}).permanentDelete();
```

## Update drive item metadata

Using the update() you update the current item

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/files";

const graph = graphfi(...);

const update = await graph.users.getById({user id}).drives.getById({drive id}).getItemById("{item id}").update({name: "New Name"});

const update = await graph.me.drives.getById({drive id}).getItemById("{item id}").update({name: "New Name"});

```

## Move drive item

Using the move() you move the current item, and optionally update it

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/files";

const graph = graphfi(...);

// Requires a parentReference to the destination folder location
const moveOptions: IItemOptions = {
  parentReference: {
    id?: {parentLocationId};
    driveId?: {parentLocationDriveId}};
  };
  name?: {newName};
};

const move = await graph.users.getById({user id}).drives.getById({drive id}).getItemById("{item id}").move(moveOptions);

const move = await graph.me.drives.getById({drive id}).getItemById("{item id}").move(moveOptions);

```

## Copy drive item

Using the copy() you can copy the current item to a new location, returns the path to the new location

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/files";

const graph = graphfi(...);

// Requires a parentReference to the destination folder location
const copyOptions: IItemOptions = {
  parentReference: {
    id?: {parentLocationId};
    driveId?: {parentLocationDriveId}};
  };
  name?: {newName};
};

const copy = await graph.users.getById({user id}).drives.getById({drive id}).getItemById("{item id}").copy(copyOptions);

const copy = await graph.me.drives.getById({drive id}).getItemById("{item id}").copy(copyOptions);

```

## Get the users special folders

Using the users default drive you can get special folders, including: Documents, Photos, CameraRoll, AppRoot, Music

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/files";
import { SpecialFolder, IDriveItem } from "@pnp/graph/files";

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
import "@pnp/graph/files";
import { IPreviewOptions, IDriveItemPreviewInfo } from "@pnp/graph/files";
import { ItemPreviewInfo } from "@microsoft/microsoft-graph-types"

const graph = graphfi(...);

const preview: ItemPreviewInfo = await graph.users.getById({user id}).drives.getById({drive id}).getItemById("{item id}").preview();

const preview: ItemPreviewInfo = await graph.me.drives.getById({drive id}).getItemById("{item id}").preview();

const previewOptions: IPreviewOptions = {
    page: 1,
    zoom: 90
}

const preview2: ItemPreviewInfo = await graph.users.getById({user id}).drives.getById({drive id}).getItemById("{item id}").preview(previewOptions);

```

## Track Changes

Track changes in a driveItem and its children over time.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/files";

const graph = graphfi(...);

// Get the changes for the drive items from inception
const delta = await graph.me.drive.root.delta()();
const delta = await graph.users.getById({user id}).drives.getById({drive id}).root.delta()();

//You can also loop through the delta changes using the async iterator
const driveItems = graph.me.drive.root.delta();
for await (const items of driveItems) {
    // array of changes
    console.log(item);
}

```

## Get Drive Item Analytics

Using the analytics() you get the ItemAnalytics for a DriveItem

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/files";
import { IAnalyticsOptions } from "@pnp/graph/files";

const graph = graphfi(...);

// Defaults to lastSevenDays
const analytics = await graph.users.getById({user id}).drives.getById({drive id}).getItemById("{item id}").analytics()();

const analytics = await graph.me.drives.getById({drive id}).getItemById("{item id}").analytics()();

const analyticOptions: IAnalyticsOptions = {
    timeRange: "allTime"
};

const analyticsAllTime = await graph.me.drives.getById({drive id}).getItemById("{item id}").analytics(analyticOptions)();
```

For more information on:
[Sensitivity and Retention Labels (Premium Endpoint)](./files-labels.md)

## Permissions

### List/Get/Add/Update/Delete Drive Item Permissions

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/files";
import "@pnp/graph/permissions/drive-item";
import {IPermissionsInviteInfo} from "@pnp/graph/permissions/drive-item";

const graph = graphfi(...);

const newPermissions: IPermissionsInviteInfo = {
    recipients: [{email: "user@contoso.com"}],
    requireSignIn: true,
    sendInvitation: true,
    roles: ["read"]
};

// List permissions
const permissions = await graph.users.getById({user id}).drives.getById({drive id}).getItemById("{item id}").permissions();

// Add permissions
const permissions = await graph.users.getById({user id}).drives.getById({drive id}).getItemById("{item id}").addPermissions(newPermissions);

// Get permissions
const itemPermissions = await graph.users.getById({user id}).drives.getById({drive id}).getItemById("{item id}").permissions.getById(permissions.id)();

// Update permissions
const updatedPermissions = await graph.users.getById({user id}).drives.getById({drive id}).getItemById("{item id}").permissions.getById(permissions.id).update({roles: ["write"]});

// Delete permissions
await graph.users.getById({user id}).drives.getById({drive id}).getItemById("{item id}").permissions.getById(permissions.id).delete();

```

## Sharing

[Shares](./shares.md)

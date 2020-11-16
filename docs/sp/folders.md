# @pnp/sp/folders

Folders serve as a container for your files and list items.

## IFolders

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

Represents a collection of folders. SharePoint webs, lists, and list items have a collection of folders under their properties.

|Scenario|Import Statement|
|--|--|
|Selective 1|import { sp } from "@pnp/sp";<br />import "@pnp/sp/webs";<br/>import { IFolders, Folders } from "@pnp/sp/folders";|
|Selective 2|import { sp } from "@pnp/sp";<br />import "@pnp/sp/webs";<br/>import "@pnp/sp/folders";|
|Selective 3|import { sp } from "@pnp/sp";<br />import "@pnp/sp/webs";<br/>import "@pnp/sp/folders/web";|
|Selective 4|import { sp } from "@pnp/sp";<br />import "@pnp/sp/webs";<br/>import "@pnp/sp/folders/list";|
|Selective 5|import { sp } from "@pnp/sp";<br />import "@pnp/sp/webs";<br/>import "@pnp/sp/folders/list";<br/>import "@pnp/sp/folders/item";|
|Preset: All|import { sp, IFolders, Folders } from "@pnp/sp/presets/all";|

### Get folders collection for various SharePoint objects

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/lists";

// gets web's folders
const webFolders = await sp.web.folders();

// gets list's folders
const listFolders = await sp.web.lists.getByTitle("My List").rootFolder.folders();

// gets item's folders
const itemFolders = await sp.web.lists.getByTitle("My List").items.getById(1).folder.folders();
```

### add

Adds a new folder to collection of folders

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";

// creates a new folder for web with specified url
const folderAddResult = await sp.web.folders.add("folder url");
```

### getByName

Gets a folder instance from a collection by folder's name

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";

const folder = await sp.web.folders.getByName("folder name")();
```

## IFolder  

Represents an instance of a SharePoint folder.

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

|Scenario|Import Statement|
|--|--|
|Selective 1|import { sp } from "@pnp/sp";<br />import "@pnp/sp/webs";<br/>import { IFolders, Folders } from "@pnp/sp/folders";|
|Selective 2|import { sp } from "@pnp/sp";<br />import "@pnp/sp/webs";<br/>import "@pnp/sp/folders";|
|Selective 3|import { sp } from "@pnp/sp";<br />import "@pnp/sp/webs";<br/>import "@pnp/sp/folders/web";|
|Selective 4|import { sp } from "@pnp/sp";<br />import "@pnp/sp/webs";<br/>import "@pnp/sp/folders/list";|
|Selective 5|import { sp } from "@pnp/sp";<br />import "@pnp/sp/webs";<br/>import "@pnp/sp/folders/list";<br/>import "@pnp/sp/folders/item";|
|Preset: All|import { sp, IFolders, Folders } from "@pnp/sp/presets/all";|

### Get a folder object associated with different SharePoint artifacts (web, list, list item)

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import "@pnp/sp/lists";
import "@pnp/sp/items";

// web's folder
const rootFolder = await sp.web.rootFolder();

// list's folder
const listRootFolder = await sp.web.lists.getByTitle("234").rootFolder();

// item's folder
const itemFolder = await sp.web.lists.getByTitle("234").items.getById(1).folder();
```

### getItem

Gets list item associated with a folder

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";

const folderItem = await sp.web.rootFolder.folders.getByName("SiteAssets").folders.getByName("My Folder").getItem();
```

### move

It's possible to move a folder to a new destination within a site collection  

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";

// destination is a server-relative url of a new folder
const destinationUrl = `/sites/my-site/SiteAssets/new-folder`;

await sp.web.rootFolder.folders.getByName("SiteAssets").folders.getByName("My Folder").moveTo(destinationUrl);
```  

### copy

It's possible to copy a folder to a new destination within a site collection  

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";

// destination is a server-relative url of a new folder
const destinationUrl = `/sites/my-site/SiteAssets/new-folder`;

await sp.web.rootFolder.folders.getByName("SiteAssets").folders.getByName("My Folder").copyTo(destinationUrl);
```  

### move by path

It's possible to move a folder to a new destination within the same or a different site collection  

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";

// destination is a server-relative url of a new folder
const destinationUrl = `/sites/my-site/SiteAssets/new-folder`;

await sp.web.rootFolder.folders.getByName("SiteAssets").folders.getByName("My Folder").moveByPath(destinationUrl, true);
```  

### copy by path

It's possible to copy a folder to a new destination within the same or a different site collection  

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";

// destination is a server-relative url of a new folder
const destinationUrl = `/sites/my-site/SiteAssets/new-folder`;

await sp.web.rootFolder.folders.getByName("SiteAssets").folders.getByName("My Folder").copyByPath(destinationUrl, true);
```  

### delete

Deletes a folder

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";

await sp.web.rootFolder.folders.getByName("My Folder").delete();
```  

### delete with params

_Added in 2.0.9_

Deletes a folder with options

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";

await sp.web.rootFolder.folders.getByName("My Folder").deleteWithParams({
                BypassSharedLock: true,
                DeleteIfEmpty: true,
            });
```  

### recycle

Recycles a folder

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";

await sp.web.rootFolder.folders.getByName("My Folder").recycle();
```  

### serverRelativeUrl

Gets folder's server relative url

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";

const relUrl = await sp.web.rootFolder.folders.getByName("SiteAssets").serverRelativeUrl();
```  

### update

Updates folder's properties

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";

await sp.web.getFolderByServerRelativePath("Shared Documents/Folder2").update({
        "Name": "New name",
    });
```

### contentTypeOrder

Gets content type order of a folder

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";

const order = await sp.web.getFolderByServerRelativePath("Shared Documents").contentTypeOrder();
```

### folders

Gets all child folders associated with the current folder

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";

const folders = await sp.web.rootFolder.folders();
```

### files

Gets all files inside a folder

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import "@pnp/sp/files/folder";

const files = await sp.web.getFolderByServerRelativePath("Shared Documents").files();
```

### listItemAllFields

Gets this folder's list item field values

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";

const itemFields = await sp.web.getFolderByServerRelativePath("Shared Documents/My Folder").listItemAllFields();
```

### parentFolder

Gets the parent folder, if available

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";

const parentFolder = await sp.web.getFolderByServerRelativePath("Shared Documents/My Folder").parentFolder();
```

### properties

Gets this folder's properties

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";

const properties = await sp.web.getFolderByServerRelativePath("Shared Documents/Folder2").properties.get();
```

### uniqueContentTypeOrder

Gets a value that specifies the content type order.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";

const contentTypeOrder = await sp.web.getFolderByServerRelativePath("Shared Documents/Folder2").uniqueContentTypeOrder();
```

### Rename a folder

You can rename a folder by updating `FileLeafRef` property:

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";

const folder = sp.web.getFolderByServerRelativePath("Shared Documents/My Folder");

const item = await folder.getItem();
const result = await item.update({ FileLeafRef: "Folder2" });
```

### Create a folder with custom content type  

Below code creates a new folder under Document library and assigns custom folder content type to a newly created folder. Additionally it sets a field of a custom folder content type.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/lists";

const newFolderResult = await sp.web.rootFolder.folders.getByName("Shared Documents").folders.add("My New Folder");
const item = await newFolderResult.folder.listItemAllFields();

await sp.web.lists.getByTitle("Documents").items.getById(item.ID).update({
    ContentTypeId: "0x0120001E76ED75A3E3F3408811F0BF56C4CDDD",
    MyFolderField: "field value",
    Title: "My New Folder",
});
```

### addSubFolderUsingPath

_Added in 2.0.9_

You can use the addSubFolderUsingPath method to add a folder with some special chars supported

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import { IFolder } from "@pnp/sp/folders";

// add a folder to site assets
const folder: IFolder = await web.rootFolder.folders.getByName("SiteAssets").addSubFolderUsingPath("folder name");
```

### getFolderById

You can get a folder by Id from a web.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import { IFolder } from "@pnp/sp/folders";

const folder: IFolder = sp.web.getFolderById("2b281c7b-ece9-4b76-82f9-f5cf5e152ba0");
```

### getParentInfos

_Added in 2.0.12_

Gets information about folder, including details about the parent list, parent list root folder, and parent web.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";

const folder: IFolder = sp.web.getFolderById("2b281c7b-ece9-4b76-82f9-f5cf5e152ba0");
await folder.getParentInfos();
```  

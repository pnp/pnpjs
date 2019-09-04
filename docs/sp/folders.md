# @pnp/sp/folders

Folders serve as a container for your files and list items.

## IFolders

[![](https://img.shields.io/badge/Invokable-informational.svg)](../invokable.md) [![](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../selective-imports.md)

Represents a collection of folders. SharePoint web, list and list item have a collection of folders under their properties.

|Scenario|Import Statement|
|--|--|
|Selective 1|import { sp } from "@pnp/sp";<br />import "@pnp/sp/src/webs";<br/>import { IFolders, Folders } from "@pnp/sp/src/folders";|
|Selective 2|import { sp } from "@pnp/sp";<br />import "@pnp/sp/src/webs";<br/>import "@pnp/sp/src/folders";|
|Selective 3|import { sp } from "@pnp/sp";<br />import "@pnp/sp/src/webs";<br/>import "@pnp/sp/src/folders/web";|
|Selective 4|import { sp } from "@pnp/sp";<br />import "@pnp/sp/src/webs";<br/>import "@pnp/sp/src/folders/list";|
|Selective 5|import { sp } from "@pnp/sp";<br />import "@pnp/sp/src/webs";<br/>import "@pnp/sp/src/folders/list";<br/>import "@pnp/sp/src/folders/item";|
|Preset: All|import { sp, IFolders, Folders } from "@pnp/sp/presets/all";|

### Get folders collection for various SharePoint objects

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/items";
import "@pnp/sp/src/folders";
import "@pnp/sp/src/lists";

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
import "@pnp/sp/src/webs";
import "@pnp/sp/src/folders";

// creates a new folder for web with specified url
const folderAddResult = await sp.web.folders.add("folder url");
```

### getByName

Gets a folder instance from a collection by folder's name

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/folders";

const folder = await sp.web.folders.getByName("folder name")();
```

## IFolder  

Represents an instance of a SharePoint folder.

[![](https://img.shields.io/badge/Invokable-informational.svg)](../invokable.md) [![](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../selective-imports.md)  

|Scenario|Import Statement|
|--|--|
|Selective 1|import { sp } from "@pnp/sp";<br />import "@pnp/sp/src/webs";<br/>import { IFolders, Folders } from "@pnp/sp/src/folders";|
|Selective 2|import { sp } from "@pnp/sp";<br />import "@pnp/sp/src/webs";<br/>import "@pnp/sp/src/folders";|
|Selective 3|import { sp } from "@pnp/sp";<br />import "@pnp/sp/src/webs";<br/>import "@pnp/sp/src/folders/web";|
|Selective 4|import { sp } from "@pnp/sp";<br />import "@pnp/sp/src/webs";<br/>import "@pnp/sp/src/folders/list";|
|Selective 5|import { sp } from "@pnp/sp";<br />import "@pnp/sp/src/webs";<br/>import "@pnp/sp/src/folders/list";<br/>import "@pnp/sp/src/folders/item";|
|Preset: All|import { sp, IFolders, Folders } from "@pnp/sp/presets/all";|

### Get a folder object associated with different SharePoint artifacts (web, list, list item)

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/folders";
import "@pnp/sp/src/lists";
import "@pnp/sp/src/items";

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
import "@pnp/sp/src/webs";
import "@pnp/sp/src/folders";

const folderItem = await sp.web.rootFolder.folders.getByName("SiteAssets").folders.getByName("My Folder").getItem();
```

### move

It's possible to move a folder to a new destination within a site collection  

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/folders";

// destination is a server-relative url of a new folder
const destinationUrl = `sites/my-site/SiteAssets/new-folder`;

await sp.web.rootFolder.folders.getByName("SiteAssets").folders.getByName("My Folder").moveTo(destinationUrl);
```  

### recycle

Recycles a folder

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/folders";

await sp.web.rootFolder.folders.getByName("My Folder").recycle();
```  

### serverRelativeUrl

Gets folder's server relative url

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/folders";

const relUrl = await sp.web.rootFolder.folders.getByName("SiteAssets").serverRelativeUrl();
```  

### update

Updates folder's properties

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/folders";

await sp.web.getFolderByServerRelativePath("Shared Documents/Folder2").update({
        "Name": "New name",
    });
```

### contentTypeOrder

Gets content type order of a folder

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/folders";

const order = await sp.web.getFolderByServerRelativePath("Shared Documents").contentTypeOrder();
```

### folders

Gets all child folders associated with the current folder

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/folders";

const folders = await sp.web.rootFolder.folders();
```

### files

Gets all files inside a folder

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/folders";
import "@pnp/sp/src/files/folder";

const files = await sp.web.getFolderByServerRelativePath("Shared Documents").files();
```

### listItemAllFields

Gets this folder's list item field values

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/folders";

const itemFields = await sp.web.getFolderByServerRelativePath("Shared Documents/My Folder").listItemAllFields();
```

### parentFolder

Gets the parent folder, if available

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/folders";

const parentFolder = await sp.web.getFolderByServerRelativePath("Shared Documents/My Folder").parentFolder();
```

### properties

Gets this folder's properties

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/folders";

const properties = await sp.web.getFolderByServerRelativePath("Shared Documents/Folder2").properties.get();
```

### uniqueContentTypeOrder

Gets a value that specifies the content type order.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/folders";

const contentTypeOrder = await sp.web.getFolderByServerRelativePath("Shared Documents/Folder2").uniqueContentTypeOrder();
```

## sharing imports

# TODO:: link to the sharing page and document all there, no need to duplicate

### Rename a folder

You can rename a folder by updating `FileLeafRef` property:

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/folders";

const folder = sp.web.getFolderByServerRelativePath("Shared Documents/My Folder");

const item = await folder.getItem();
const result = await item.update({ FileLeafRef: "Folder2" });
```

### Create a folder with custom content type  

Below code creates a new folder under Document library and assigns custom folder content type to a newly created folder. Additionally it sets a field of a custom folder content type.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/items";
import "@pnp/sp/src/folders";
import "@pnp/sp/src/lists";

const newFolderResult = await sp.web.rootFolder.folders.getByName("Shared Documents").folders.add("My New Folder");
const item = await newFolderResult.folder.listItemAllFields();

await sp.web.lists.getByTitle("Documents").items.getById(item.ID).update({
    ContentTypeId: "0x0120001E76ED75A3E3F3408811F0BF56C4CDDD",
    MyFolderField: "field value",
    Title: "My New Folder",
});
```

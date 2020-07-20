# @pnp/sp/attachments

The ability to attach file to list items allows users to track documents outside of a document library. You can use the PnP JS Core library to work with attachments as outlined below.

|Scenario|Import Statement|
|--|--|
|Selective 1|import { sp } from "@pnp/sp";<br />import "@pnp/sp/attachments";|
|Preset: All|import { sp, IFeatures, Features } from "@pnp/sp/presets/all";|

## Get attachments

```TypeScript
import { sp } from "@pnp/sp";
import { IAttachmentInfo } from "@pnp/sp/attachments";
import { IItem } from "@pnp/sp/items/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

const item: IItem = sp.web.lists.getByTitle("MyList").items.getById(1);

// get all the attachments
const info: IAttachmentInfo[] = await item.attachmentFiles();

// get a single file by file name
const info2: IAttachmentInfo = await item.attachmentFiles.getByName("file.txt")();

// select specific properties using odata operators and use Pick to type the result
const info3: Pick<IAttachmentInfo, "ServerRelativeUrl">[] = await item.attachmentFiles.select("ServerRelativeUrl")();
```

## Add an Attachment

You can add an attachment to a list item using the add method. This method takes either a string, Blob, or ArrayBuffer.

```TypeScript
import { sp } from "@pnp/sp";
import { IItem } from "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

const item: IItem = sp.web.lists.getByTitle("MyList").items.getById(1);

await item.attachmentFiles.add("file2.txt", "Here is my content");
```

## Add Multiple

This method allows you to pass an array of AttachmentFileInfo plain objects that will be added one at a time as attachments. Essentially automating the promise chaining.

```TypeScript
import { sp } from "@pnp/sp";
import { IList } from "@pnp/sp/lists";
import { IAttachmentFileInfo } from "@pnp/sp/attachments";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

const list: IList = sp.web.lists.getByTitle("MyList");

let fileInfos: IAttachmentFileInfo[] = [];

fileInfos.push({
    name: "My file name 1",
    content: "string, blob, or array"
});

fileInfos.push({
    name: "My file name 2",
    content: "string, blob, or array"
});

await list.items.getById(2).attachmentFiles.addMultiple(fileInfos);
```

## Delete Multiple

```TypeScript
import { sp } from "@pnp/sp";
import { IList } from "./@pnp/sp/lists/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

const list: IList = sp.web.lists.getByTitle("MyList");

await list.items.getById(2).attachmentFiles.deleteMultiple("1.txt", "2.txt");
```

## Read Attachment Content

You can read the content of an attachment as a string, Blob, ArrayBuffer, or json using the methods supplied.

```TypeScript
import { sp } from "@pnp/sp";
import { IItem } from "@pnp/sp/items/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

const item: IItem = sp.web.lists.getByTitle("MyList").items.getById(1);

const text = await item.attachmentFiles.getByName("file.txt").getText();

// use this in the browser, does not work in nodejs
const blob = await item.attachmentFiles.getByName("file.mp4").getBlob();

// use this in nodejs
const buffer = await item.attachmentFiles.getByName("file.mp4").getBuffer();

// file must be valid json
const json = await item.attachmentFiles.getByName("file.json").getJSON();
```

## Update Attachment Content

You can also update the content of an attachment. This API is limited compared to the full file API - so if you need to upload large files consider using a document library.

```TypeScript
import { sp } from "@pnp/sp";
import { IItem } from "@pnp/sp/items/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

const item: IItem = sp.web.lists.getByTitle("MyList").items.getById(1);

await item.attachmentFiles.getByName("file2.txt").setContent("My new content!!!");
```

## Delete Attachment

```TypeScript
import { sp } from "@pnp/sp";
import { IItem } from "@pnp/sp/items/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

const item: IItem = sp.web.lists.getByTitle("MyList").items.getById(1);

await item.attachmentFiles.getByName("file2.txt").delete();
```

## Recycle Attachment

Delete the attachment and send it to recycle bin

```TypeScript
import { sp } from "@pnp/sp";
import { IItem } from "@pnp/sp/items/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

const item: IItem = sp.web.lists.getByTitle("MyList").items.getById(1);

await item.attachmentFiles.getByName("file2.txt").recycle();
```

## Recycle Multiple Attachments

Delete multiple attachments and send them to recycle bin

```TypeScript
import { sp } from "@pnp/sp";
import { IList } from "@pnp/sp/lists/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

const list: IList = sp.web.lists.getByTitle("MyList");

await list.items.getById(2).attachmentFiles.recycleMultiple("1.txt","2.txt");
```

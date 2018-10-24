# @pnp/sp/attachments

The ability to attach file to list items allows users to track documents outside of a document library. You can use the PnP JS Core library to work with attachments as outlined below.

## Get attachments

```TypeScript
import { sp } from "@pnp/sp";

let item = sp.web.lists.getByTitle("MyList").items.getById(1);

// get all the attachments
item.attachmentFiles.get().then(v => {

    console.log(v);
});

// get a single file by file name
item.attachmentFiles.getByName("file.txt").get().then(v => {

    console.log(v);
});

// select specific properties using odata operators
item.attachmentFiles.select("ServerRelativeUrl").get().then(v => {

    console.log(v);
});
```

## Add an Attachment

You can add an attachment to a list item using the add method. This method takes either a string, Blob, or ArrayBuffer.

```TypeScript
import { sp } from "@pnp/sp";

let item = sp.web.lists.getByTitle("MyList").items.getById(1);

item.attachmentFiles.add("file2.txt", "Here is my content").then(v => {

    console.log(v);
});
```

## Add Multiple

This method allows you to pass an array of AttachmentFileInfo plain objects that will be added one at a time as attachments. Essentially automating the promise chaining.

```TypeScript
const list = sp.web.lists.getByTitle("MyList");

var fileInfos: AttachmentFileInfo[] = [];

fileInfos.push({
    name: "My file name 1",
    content: "string, blob, or array"
});

fileInfos.push({
    name: "My file name 2",
    content: "string, blob, or array"
});

list.items.getById(2).attachmentFiles.addMultiple(fileInfos).then(r => {

    console.log(r);
});
```

## Delete Multiple

```TypeScript
const list = sp.web.lists.getByTitle("MyList");

list.items.getById(2).attachmentFiles.deleteMultiple("1.txt","2.txt").then(r => {
    console.log(r);
});
```

## Read Attachment Content

You can read the content of an attachment as a string, Blob, ArrayBuffer, or json using the methods supplied.

```TypeScript
import { sp } from "@pnp/sp";

let item = sp.web.lists.getByTitle("MyList").items.getById(1);

item.attachmentFiles.getByName("file.txt").getText().then(v => {

    console.log(v);
});

// use this in the browser, does not work in nodejs
item.attachmentFiles.getByName("file.mp4").getBlob().then(v => {

    console.log(v);
});

// use this in nodejs
item.attachmentFiles.getByName("file.mp4").getBuffer().then(v => {

    console.log(v);
});

// file must be valid json
item.attachmentFiles.getByName("file.json").getJSON().then(v => {

    console.log(v);
});
```

## Update Attachment Content

You can also update the content of an attachment. This API is limited compared to the full file API - so if you need to upload large files consider using a document library.

```TypeScript
import { sp } from "@pnp/sp";

let item = sp.web.lists.getByTitle("MyList").items.getById(1);

item.attachmentFiles.getByName("file2.txt").setContent("My new content!!!").then(v => {

    console.log(v);
});
```

## Delete Attachment

```TypeScript
import { sp } from "@pnp/sp";

let item = sp.web.lists.getByTitle("MyList").items.getById(1);

item.attachmentFiles.getByName("file2.txt").delete().then(v => {

    console.log(v);
});
```

## Recycle Attachment

Added in _1.2.4_

Delete the attachment and send it to recycle bin

```TypeScript
import { sp } from "@pnp/sp";

let item = sp.web.lists.getByTitle("MyList").items.getById(1);

item.attachmentFiles.getByName("file2.txt").recycle().then(v => {

    console.log(v);
});
```

## Recycle Multiple Attachments

Added in _1.2.4_

Delete multiple attachments and send them to recycle bin
```TypeScript

import { sp } from "@pnp/sp";

const list = sp.web.lists.getByTitle("MyList");

list.items.getById(2).attachmentFiles.recycleMultiple("1.txt","2.txt").then(r => {
    console.log(r);
});
```
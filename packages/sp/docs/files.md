# @pnp/sp/files

One of the more challenging tasks on the client side is working with SharePoint files, especially if they are large files. We have added some methods to the library to help and their use is outlined below.

## Reading Files

Reading files from the client using REST is covered in the below examples. The important thing to remember is choosing which format you want the file in so you can appropriately process it. You can retrieve a file as Blob, Buffer, JSON, or Text. If you have a special requirement you could also write your [own parser](../../odata/docs/parsers.md).

```typescript
import { sp } from "@pnp/sp";

sp.web.getFileByServerRelativeUrl("/sites/dev/documents/file.avi").getBlob().then((blob: Blob) => {});

sp.web.getFileByServerRelativeUrl("/sites/dev/documents/file.avi").getBuffer().then((buffer: ArrayBuffer) => {});

sp.web.getFileByServerRelativeUrl("/sites/dev/documents/file.json").getJSON().then((json: any) => {});

sp.web.getFileByServerRelativeUrl("/sites/dev/documents/file.txt").getText().then((text: string) => {});

// all of these also work from a file object no matter how you access it
sp.web.getFolderByServerRelativeUrl("/sites/dev/documents").files.getByName("file.txt").getText().then((text: string) => {});
```

## Adding Files

Likewise you can add files using one of two methods, add or addChunked. The second is appropriate for larger files, generally larger than 10 MB but this may differ based on your bandwidth/latency so you can adjust the code to use the chunked method. The below example shows getting the file object from an input and uploading it to SharePoint, choosing the upload method based on file size.

```typescript
declare var require: (s: string) => any;

import { ConsoleListener, Web, Logger, LogLevel, ODataRaw } from "@pnp/sp";
import { auth } from "./auth";
let $ = require("jquery");

let siteUrl = "https://mytenant.sharepoint.com/sites/dev";

// comment this out for non-node execution
// auth(siteUrl);

Logger.subscribe(new ConsoleListener());
Logger.activeLogLevel = LogLevel.Verbose;

let web = new Web(siteUrl);

$(() => {
    $("#testingdiv").append("<button id='thebuttontodoit'>Do It</button>");

    $("#thebuttontodoit").on('click', (e) => {

        e.preventDefault();

        let input = <HTMLInputElement>document.getElementById("thefileinput");
        let file = input.files[0];

        // you can adjust this number to control what size files are uploaded in chunks
        if (file.size <= 10485760) {

            // small upload
            web.getFolderByServerRelativeUrl("/sites/dev/Shared%20Documents/test/").files.add(file.name, file, true).then(_ => Logger.write("done"));
        } else {

            // large upload
            web.getFolderByServerRelativeUrl("/sites/dev/Shared%20Documents/test/").files.addChunked(file.name, file, data => {

                Logger.log({ data: data, level: LogLevel.Verbose, message: "progress" });

            }, true).then(_ => Logger.write("done!"));
        }
    });
});
```
### Setting Associated Item Values
You can also update the file properties of a newly uploaded file using code similar to the below snippet:

```TypeScript
import { sp } from "@pnp/sp";

sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared%20Documents/test/").files.add(file.name, file, true).then(f => {
    
    f.file.getItem().then(item => {

        item.update({
            Title: "A Title",
            OtherField: "My Other Value"
        });
    });
});
```

## Update File Content

You can of course use similar methods to update existing files as shown below:

```typescript
import { sp } from "@pnp/sp";

sp.web.getFileByServerRelativeUrl("/sites/dev/documents/test.txt").setContent("New string content for the file.");

sp.web.getFileByServerRelativeUrl("/sites/dev/documents/test.mp4").setContentChunked(file);
```
## Check in, Check out, and Approve & Deny

The library provides helper methods for checking in, checking out, and approving files. Examples of these methods are shown below.

### Check In

Check in takes two optional arguments, comment and check in type.

```TypeScript
import { sp, CheckinType } from "@pnp/sp";

// default options with empty comment and CheckinType.Major
sp.web.getFileByServerRelativeUrl("/sites/dev/shared documents/file.txt").checkin().then(_ => {

    console.log("File checked in!");
});

// supply a comment (< 1024 chars) and using default check in type CheckinType.Major
sp.web.getFileByServerRelativeUrl("/sites/dev/shared documents/file.txt").checkin("A comment").then(_ => {

    console.log("File checked in!");
});

// Supply both comment and check in type
sp.web.getFileByServerRelativeUrl("/sites/dev/shared documents/file.txt").checkin("A comment", CheckinType.Overwrite).then(_ => {

    console.log("File checked in!");
});
```

### Check Out

Check out takes no arguments.

```TypeScript
import { sp } from "@pnp/sp";

sp.web.getFileByServerRelativeUrl("/sites/dev/shared documents/file.txt").checkout().then(_ => {

    console.log("File checked out!");
});
```

### Approve and Deny

You can also approve or deny files in libraries that use approval. Approve takes a single required argument of comment, the comment is optional for deny.

```TypeScript
import { sp } from "@pnp/sp";

sp.web.getFileByServerRelativeUrl("/sites/dev/shared documents/file.txt").approve("Approval Comment").then(_ => {

    console.log("File approved!");
});

// deny with no comment
sp.web.getFileByServerRelativeUrl("/sites/dev/shared documents/file.txt").deny().then(_ => {

    console.log("File denied!");
});

// deny with a supplied comment.
sp.web.getFileByServerRelativeUrl("/sites/dev/shared documents/file.txt").deny("Deny comment").then(_ => {

    console.log("File denied!");
});
```

## Publish and Unpublish

You can both publish and unpublish a file using the library. Both methods take an optional comment argument.

```TypeScript
import { sp } from "@pnp/sp";
// publish with no comment
sp.web.getFileByServerRelativeUrl("/sites/dev/shared documents/file.txt").publish().then(_ => {

    console.log("File published!");
});

// publish with a supplied comment.
sp.web.getFileByServerRelativeUrl("/sites/dev/shared documents/file.txt").publish("Publish comment").then(_ => {

    console.log("File published!");
});

// unpublish with no comment
sp.web.getFileByServerRelativeUrl("/sites/dev/shared documents/file.txt").unpublish().then(_ => {

    console.log("File unpublished!");
});

// unpublish with a supplied comment.
sp.web.getFileByServerRelativeUrl("/sites/dev/shared documents/file.txt").unpublish("Unpublish comment").then(_ => {

    console.log("File unpublished!");
});
```

## Advanced Upload Options

Both the addChunked and setContentChunked methods support options beyond just supplying the file content.

### progress function

A method that is called each time a chunk is uploaded and provides enough information to report progress or update a progress bar easily. The method has the signature:

`(data: ChunkedFileUploadProgressData) => void`

The data interface is:

```typescript
export interface ChunkedFileUploadProgressData {
    stage: "starting" | "continue" | "finishing";
    blockNumber: number;
    totalBlocks: number;
    chunkSize: number;
    currentPointer: number;
    fileSize: number;
}
```

### chunkSize

This property controls the size of the individual chunks and is defaulted to 10485760 bytes (10 MB). You can adjust this based on your bandwidth needs - especially if writing code for mobile uploads or you are seeing frequent timeouts.

## getItem

This method allows you to get the item associated with this file. You can optionally specify one or more select fields. The result will be merged with a new Item instance so you will have both the returned property values and chaining ability in a single object.

```TypeScript
import { sp } from "@pnp/sp";

sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").getItem().then(item => {

    console.log(item);
});

sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").getItem("Title", "Modified").then(item => {

    console.log(item);
});

sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").getItem().then(item => {

    // you can also chain directly off this item instance
    item.getCurrentUserEffectivePermissions().then(perms => {

        console.log(perms);
    });
});
```

You can also supply a generic typing parameter and the resulting type will be a union type of Item and the generic type parameter. This allows you to have proper intellisense and type checking.

```TypeScript
import { sp } from "@pnp/sp";
// also supports typing the objects so your type will be a union type
sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").getItem<{ Id: number, Title: string }>("Id", "Title").then(item => {

    // You get intellisense and proper typing of the returned object
    console.log(`Id: ${item.Id} -- ${item.Title}`);

    // You can also chain directly off this item instance
    item.getCurrentUserEffectivePermissions().then(perms => {

        console.log(perms);
    });
});

# @pnp/sp/files

One of the more challenging tasks on the client side is working with SharePoint files, especially if they are large files. We have added some methods to the library to help and their use is outlined below.

## Reading Files

Reading files from the client using REST is covered in the below examples. The important thing to remember is choosing which format you want the file in so you can appropriately process it. You can retrieve a file as Blob, Buffer, JSON, or Text. If you have a special requirement you could also write your [own parser](../queryable/parsers.md).

```typescript
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";

const sp = spfi("{tenant url}").using(SPFx(this.context));

const blob: Blob = await sp.web.getFileByServerRelativePath("/sites/dev/documents/file.avi").getBlob();

const buffer: ArrayBuffer = await sp.web.getFileByServerRelativePath("/sites/dev/documents/file.avi").getBuffer();

const json: any = await sp.web.getFileByServerRelativePath("/sites/dev/documents/file.json").getJSON();

const text: string = await sp.web.getFileByServerRelativePath("/sites/dev/documents/file.txt").getText();

// all of these also work from a file object no matter how you access it
const text2: string = await sp.web.getFolderByServerRelativePath("/sites/dev/documents").files.getByUrl("file.txt").getText();
```

### getFileByUrl

This method supports opening files from sharing links or absolute urls. The file must reside in the site from which you are trying to open the file.

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files/web";

const sp = spfi("{tenant url}").using(SPFx(this.context));

const url = "{absolute file url OR sharing url}";

// file is an IFile and supports all the file operations
const file = sp.web.getFileByUrl(url);

// for example
const fileContent = await file.getText();
```

## Adding Files

Likewise you can add files using one of two methods, addUsingPath or addChunked. AddChunked is appropriate for larger files, generally larger than 10 MB but this may differ based on your bandwidth/latency so you can adjust the code to use the chunked method. The below example shows getting the file object from an input and uploading it to SharePoint, choosing the upload method based on file size.

The addUsingPath method, supports the percent or pound characters in file names.

```typescript
declare var require: (s: string) => any;

import { ConsoleListener, Logger, LogLevel } from "@pnp/logging";
import { spfi } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import { auth } from "./auth";
let $ = require("jquery"); // <-- used here for illustration

let siteUrl = "https://mytenant.sharepoint.com/sites/dev";

// comment this out for non-node execution
// auth(siteUrl);

Logger.subscribe(new ConsoleListener());
Logger.activeLogLevel = LogLevel.Verbose;

let web = Web(siteUrl);


$(() => {
    $("#testingdiv").append("<button id='thebuttontodoit'>Do It</button>");

    $("#thebuttontodoit").on('click', async (e) => {

        e.preventDefault();

        let input = <HTMLInputElement>document.getElementById("thefileinput");
        let file = input.files[0];

        // you can adjust this number to control what size files are uploaded in chunks
        if (file.size <= 10485760) {

            // small upload
            await web.getFolderByServerRelativePath("Shared Documents").files.addUsingPath(file.name, file, {Overwrite: true});
            Logger.write("done");
        } else {

            // large upload
            await web.getFolderByServerRelativePath("Shared Documents").files.addChunked("filename%#%.txt", file, data => {

                Logger.log({ data: data, level: LogLevel.Verbose, message: "progress" });

            }, true);
            Logger.write("done!")
        }
    });
});
```

### Adding a file using Nodejs Streams

If you are working in nodejs you can also add a file using a stream. This example makes a copy of a file using streams.

```TypeScript
// triggers auto-application of extensions, in this case to add getStream
import { spfi } from "@pnp/sp";
import "@pnp/nodejs";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/files";
import { createReadStream } from 'fs';
import { SPDefault } from "@pnp/nodejs";
import { ThrowErrors } from "@pnp/queryable";

// get a stream of an existing file
const stream = createReadStream("c:/temp/file.txt");

// now add the stream as a new file, remember to set the content-length header
const sp = spfi("{tenant url}").using(SPDefault({
    baseUrl: 'https://{tenant}.sharepoint.com/sites/dev',
    msal: {
        config: config,
        scopes: [ 'https://{tenant}.sharepoint.com/.default' ]
    }
})).using(ThrowErrors());

const fr = await sp.web.lists.getByTitle("Documents").rootFolder.files.addChunked( "new.txt", stream, undefined, true );
```

### Setting Associated Item Values

You can also update the file properties of a newly uploaded file using code similar to the below snippet:

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";

const sp = spfi("{tenant url}").using(SPFx(this.context));
const file = await sp.web.getFolderByServerRelativePath("/sites/dev/Shared%20Documents/test/").files.addUsingPath("file.name", "content", {Overwrite: true});
const item = await file.file.getItem();
await item.update({
  Title: "A Title",
  OtherField: "My Other Value"
});
```

## Update File Content

You can of course use similar methods to update existing files as shown below. This overwrites the existing content in the file.

```typescript
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";

const sp = spfi("{tenant url}").using(SPFx(this.context));
await sp.web.getFileByServerRelativePath("/sites/dev/documents/test.txt").setContent("New string content for the file.");

await sp.web.getFileByServerRelativePath("/sites/dev/documents/test.mp4").setContentChunked(file);
```

## Check in, Check out, and Approve & Deny

The library provides helper methods for checking in, checking out, and approving files. Examples of these methods are shown below.

### Check In

Check in takes two optional arguments, comment and check in type.

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import { CheckinType } from "@pnp/sp/files";
import "@pnp/sp/webs";
import "@pnp/sp/files";

const sp = spfi("{tenant url}").using(SPFx(this.context));

// default options with empty comment and CheckinType.Major
await sp.web.getFileByServerRelativePath("/sites/dev/shared documents/file.txt").checkin();
console.log("File checked in!");

// supply a comment (< 1024 chars) and using default check in type CheckinType.Major
await sp.web.getFileByServerRelativePath("/sites/dev/shared documents/file.txt").checkin("A comment");
console.log("File checked in!");

// Supply both comment and check in type
await sp.web.getFileByServerRelativePath("/sites/dev/shared documents/file.txt").checkin("A comment", CheckinType.Overwrite);
console.log("File checked in!");
```

### Check Out

Check out takes no arguments.

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";

const sp = spfi("{tenant url}").using(SPFx(this.context));

sp.web.getFileByServerRelativePath("/sites/dev/shared documents/file.txt").checkout();
console.log("File checked out!");
```

### Approve and Deny

You can also approve or deny files in libraries that use approval. Approve takes a single required argument of comment, the comment is optional for deny.

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";

const sp = spfi("{tenant url}").using(SPFx(this.context));

await sp.web.getFileByServerRelativePath("/sites/dev/shared documents/file.txt").approve("Approval Comment");
console.log("File approved!");

// deny with no comment
await sp.web.getFileByServerRelativePath("/sites/dev/shared documents/file.txt").deny();
console.log("File denied!");

// deny with a supplied comment.
await sp.web.getFileByServerRelativePath("/sites/dev/shared documents/file.txt").deny("Deny comment");
console.log("File denied!");
```

## Publish and Unpublish

You can both publish and unpublish a file using the library. Both methods take an optional comment argument.

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";

const sp = spfi("{tenant url}").using(SPFx(this.context));

// publish with no comment
await sp.web.getFileByServerRelativePath("/sites/dev/shared documents/file.txt").publish();
console.log("File published!");

// publish with a supplied comment.
await sp.web.getFileByServerRelativePath("/sites/dev/shared documents/file.txt").publish("Publish comment");
console.log("File published!");

// unpublish with no comment
await sp.web.getFileByServerRelativePath("/sites/dev/shared documents/file.txt").unpublish();
console.log("File unpublished!");

// unpublish with a supplied comment.
await sp.web.getFileByServerRelativePath("/sites/dev/shared documents/file.txt").unpublish("Unpublish comment");
console.log("File unpublished!");
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
import { spFI, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/security";

const sp = spfi("{tenant url}").using(SPFx(this.context));

const item = await sp.web.getFileByServerRelativePath("/sites/dev/Shared Documents/test.txt").getItem();
console.log(item);

const item2 = await sp.web.getFileByServerRelativePath("/sites/dev/Shared Documents/test.txt").getItem("Title", "Modified");
console.log(item2);

// you can also chain directly off this item instance
const perms = await item.getCurrentUserEffectivePermissions();
console.log(perms);
```

You can also supply a generic typing parameter and the resulting type will be a union type of Item and the generic type parameter. This allows you to have proper intellisense and type checking.

```TypeScript
import { spFI, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/items";
import "@pnp/sp/security";

const sp = spfi("{tenant url}").using(SPFx(this.context));

// also supports typing the objects so your type will be a union type
const item = await sp.web.getFileByServerRelativePath("/sites/dev/Shared Documents/test.txt").getItem<{ Id: number, Title: string }>("Id", "Title");

// You get intellisense and proper typing of the returned object
console.log(`Id: ${item.Id} -- ${item.Title}`);

// You can also chain directly off this item instance
const perms = await item.getCurrentUserEffectivePermissions();
console.log(perms);
```

### move

It's possible to move a file to a new destination within a site collection  

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";

const sp = spfi("{tenant url}").using(SPFx(this.context));

// destination is a server-relative url of a new file
const destinationUrl = `/sites/dev/SiteAssets/new-file.docx`;

await sp.web.getFileByServerRelativePath("/sites/dev/Shared Documents/test.docx").moveByPath(destinationUrl, false, true);
```  

### copy

It's possible to copy a file to a new destination within a site collection  

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";

const sp = spfi("{tenant url}").using(SPFx(this.context));

// destination is a server-relative url of a new file
const destinationUrl = `/sites/dev/SiteAssets/new-file.docx`;

await sp.web.getFileByServerRelativePath("/sites/dev/Shared Documents/test.docx").copyTo(destinationUrl, false);
```

### copy by path

It's possible to copy a file to a new destination within the same or a different site collection  

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";

const sp = spfi("{tenant url}").using(SPFx(this.context));

// destination is a server-relative url of a new file
const destinationUrl = `/sites/dev2/SiteAssets/new-file.docx`;

await sp.web.getFileByServerRelativePath("/sites/dev/Shared Documents/test.docx").copyByPath(destinationUrl, false, true);
```

### getFileById

You can get a file by Id from a web.

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import { IFile } from "@pnp/sp/files";

const sp = spfi("{tenant url}").using(SPFx(this.context));

const file: IFile = sp.web.getFileById("2b281c7b-ece9-4b76-82f9-f5cf5e152ba0");
```

### delete

Deletes a file

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";

const sp = spfi("{tenant url}").using(SPFx(this.context));
await sp.web.getFolderByServerRelativePath("{folder relative path}").files.getByUrl("filename.txt").delete();
```

### delete with params

Deletes a file with options

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";

const sp = spfi("{tenant url}").using(SPFx(this.context));
await sp.web.getFolderByServerRelativePath("{folder relative path}").files.getByUrl("filename.txt").deleteWithParams({
    BypassSharedLock: true,
});
```

### exists

Checks to see if a file exists

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";

const sp = spfi("{tenant url}").using(SPFx(this.context));
const exists = await sp.web.getFolderByServerRelativePath("{folder relative path}").files.getByUrl("name.txt").exists();
```

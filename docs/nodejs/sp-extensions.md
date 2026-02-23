# @pnp/nodejs - sp extensions

By importing anything from the @pnp/nodejs library you automatically get nodejs specific extension methods added into the sp fluent api.

## IFile.getStream

Allows you to read a response body as a nodejs PassThrough stream.

```TypeScript
// by importing the the library the node specific extensions are automatically applied
import { SPDefault } from "@pnp/nodejs";
import { spfi } from "@pnp/sp";

const sp = spfi("https://something.com").using(SPDefault({
    // config
}));

// get the stream
const streamResult: SPNS.IResponseBodyStream = await sp.web.getFileByServerRelativeUrl("/sites/dev/file.txt").getStream();

// see if we have a known length
console.log(streamResult.knownLength);

// read the stream
// this is a very basic example - you can do tons more with streams in node
const txt = await new Promise<string>((resolve) => {
    let data = "";
    stream.body.on("data", (chunk) => data += chunk);
    stream.body.on("end", () => resolve(data));
});
```

## IFiles.addChunked

```TypeScript
import { SPDefault } from "@pnp/nodejs";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs/index.js";
import "@pnp/sp/folders/web.js";
import "@pnp/sp/folders/list.js";
import "@pnp/sp/files/web.js";
import "@pnp/sp/files/folder.js";
import * as fs from "fs";

const sp = spfi("https://something.com").using(SPDefault({
    // config
}));

// NOTE: you must supply the highWaterMark to determine the block size for stream uploads
const stream = fs.createReadStream("{file path}", { highWaterMark: 10485760 });
const files = sp.web.defaultDocumentLibrary.rootFolder.files;

// passing the chunkSize parameter has no affect when using a stream, use the highWaterMark as shown above when creating the stream
await files.addChunked(name, stream, null, true);
```

## IFile.setStreamContentChunked

```TypeScript
import { SPDefault } from "@pnp/nodejs";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs/index.js";
import "@pnp/sp/folders/web.js";
import "@pnp/sp/folders/list.js";
import "@pnp/sp/files/web.js";
import "@pnp/sp/files/folder.js";
import * as fs from "fs";

const sp = spfi("https://something.com").using(SPDefault({
    // config
}));

// NOTE: you must supply the highWaterMark to determine the block size for stream uploads
const stream = fs.createReadStream("{file path}", { highWaterMark: 10485760 });
const file = sp.web.defaultDocumentLibrary.rootFolder.files..getByName("file-name.txt");

await file.setStreamContentChunked(stream);
```

## Explicit import

If you don't need to import anything from the library, but would like to include the extensions just import the library as shown.

```TypeScript
import "@pnp/nodejs";

// get the stream
const streamResult = await sp.web.getFileByServerRelativeUrl("/sites/dev/file.txt").getStream();
```

## Accessing SP Extension Namespace

There are classes and interfaces included in extension modules, which you can access through a namespace, "SPNS".

```TypeScript
import { SPNS } from "@pnp/nodejs-commonjs";

const parser = new SPNS.StreamParser();
```

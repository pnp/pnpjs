# @pnp/nodejs - sp extensions

By importing anything from the @pnp/nodejs library you automatically get nodejs specific extension methods added into the sp fluent api. This article describes them.

> These examples use the *-commonjs version of the libraries as they target node, you can [read more about the differences](../nodejs-support.md).


## IFile.getStream

Allows you to read a response body as a nodejs PassThrough stream.

```TypeScript
// by importing the the library the node specific extensions are automatically applied
import { SPFetchClient, SPNS } from "@pnp/nodejs-commonjs";
import { sp } from "@pnp/sp-commonjs";

sp.setup({
    sp: {
        fetchClientFactory: () => {
            return new SPFetchClient("{url}", "{id}", "{secret}");
        },
    },
});

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

## Explicit import

If you don't need to import anything from the library, but would like to include the extensions just import the library as shown.

```TypeScript
import "@pnp/nodejs-commonjs";

// get the stream
const streamResult = await sp.web.getFileByServerRelativeUrl("/sites/dev/file.txt").getStream();
```

## Accessing SP Extension Namespace

There are classes and interfaces included in extension modules, which you can access through a namespace, "SPNS".

```TypeScript
import { SPNS } from "@pnp/nodejs-commonjs";

const parser = new SPNS.StreamParser();
```

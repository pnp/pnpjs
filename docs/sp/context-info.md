# @pnp/sp/ - context-info

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

Starting with 3.8.0 we've moved context information to its own sub-module. You can now import `context-info` and use it on any SPQueryable derived object to understand the context. Some examples are below.

## IContextInfo

The information returned by the method is defined by the IContextInfo interface.

```TS
export interface IContextInfo {
    FormDigestTimeoutSeconds: number;
    FormDigestValue: number;
    LibraryVersion: string;
    SiteFullUrl: string;
    SupportedSchemaVersions: string[];
    WebFullUrl: string;
}
```

## Get Context for a web

```TS
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/context-info";

const sp = spfi(...);

const info = await sp.web.getContextInfo();
```

## Get Context from lists

This pattern works as well for any SPQueryable derived object, allowing you to gain context no matter with which fluent objects you are working.

```TS
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/context-info";

const sp = spfi(...);

const info = await sp.web.lists.getContextInfo();
```

## Get Context from URL

Often you will have an absolute URL to a file or path and would like to create an IWeb or IFile. You can use the [fileFromPath](./files.md#fileFromPath) or [folderFromPath](./folders.md#folderFromPath) to get an IFile/IFolder, or you can use `getContextInfo` to create a new web within the context of the file path.

```TS
import { spfi } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/context-info";

const sp = spfi(...);

// supply an absolute path to get associated context info, this works across site collections
const { WebFullUrl } = await sp.web.getContextInfo("https://tenant.sharepoint.com/sites/dev/shared documents/file.docx");

// create a new web pointing to the web where the file is stored
const web = Web([sp.web, decodeURI(WebFullUrl)]);

const webInfo = await web();
```

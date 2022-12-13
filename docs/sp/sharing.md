# @pnp/sp/sharing

> **_Note: This API is still considered "beta" meaning it may change and some behaviors may differ across tenants by version. It is also supported only in SharePoint Online._**

One of the newer abilities in SharePoint is the ability to share webs, files, or folders with both internal and external folks. It is important to remember that these settings are managed at the tenant level and ? override anything you may supply as an argument to these methods. If you receive an _InvalidOperationException_ when using these methods please check your tenant sharing settings to ensure sharing is not blocked before ?submitting an issue.

## Imports

In previous versions of this library the sharing methods were part of the inheritance stack for SharePointQueryable objects. Starting with v2 this is no longer the case and they are now selectively importable. There are four objects within the SharePoint hierarchy that support sharing: Item, File, Folder, and Web. You can import the sharing methods for all of them, or for individual objects.

### Import All

To import and attach the sharing methods to all four of the sharable types include all of the sharing sub module:

```TypeScript
import "@pnp/sp/sharing";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import { spfi } from "@pnp/sp";

const sp = spfi(...);

const user = await sp.web.siteUsers.getByEmail("user@site.com")();
const r = await sp.web.shareWith(user.LoginName);
```

### Selective Import

Import only the web's sharing methods into the library

```TypeScript
import "@pnp/sp/sharing/web";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import { spfi } from "@pnp/sp";

const sp = spfi(...);

const user = await sp.web.siteUsers.getByEmail("user@site.com")();
const r = await sp.web.shareWith(user.LoginName);
```

## getShareLink

**Applies to: Item, Folder, File**

Creates a sharing link for the given resource with an optional expiration.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/sharing";
import { SharingLinkKind, IShareLinkResponse } from "@pnp/sp/sharing";
import { dateAdd } from "@pnp/core";

const sp = spfi(...);

const result = await sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/folder1").getShareLink(SharingLinkKind.AnonymousView);

console.log(JSON.stringify(result, null, 2));


const result2 = await sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/folder1").getShareLink(SharingLinkKind.AnonymousView, dateAdd(new Date(), "day", 5));

console.log(JSON.stringify(result2, null, 2));
```

## shareWith

**Applies to: Item, Folder, File, Web**

Shares the given resource with the specified permissions (View or Edit) and optionally sends an email to the users. You can supply a single string for the `loginnames` parameter or an array of `loginnames`. The folder method takes an optional parameter "shareEverything" which determines if the shared permissions are pushed down to all items in the folder, even those with unique permissions.

![Batching Not Supported Banner](https://img.shields.io/badge/Batching%20Not%20Supported-important.svg)

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/sharing";
import "@pnp/sp/folders/web";
import "@pnp/sp/files/web";
import { ISharingResult, SharingRole } from "@pnp/sp/sharing";

const sp = spfi(...);

const result = await sp.web.shareWith("i:0#.f|membership|user@site.com");

console.log(JSON.stringify(result, null, 2));

// Share and allow editing
const result2 = await sp.web.shareWith("i:0#.f|membership|user@site.com", SharingRole.Edit);

console.log(JSON.stringify(result2, null, 2));


// share folder
const result3 = await sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/folder1").shareWith("i:0#.f|membership|user@site.com");

// Share folder with edit permissions, and provide params for requireSignin and propagateAcl (apply to all children)
await sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").shareWith("i:0#.f|membership|user@site.com", SharingRole.Edit, true, true);

// Share a file
await sp.web.getFileByServerRelativeUrl("/sites/dev/Shared Documents/test.txt").shareWith("i:0#.f|membership|user@site.com");

// Share a file with edit permissions
await sp.web.getFileByServerRelativeUrl("/sites/dev/Shared Documents/test.txt").shareWith("i:0#.f|membership|user@site.com", SharingRole.Edit);
```

## shareObject & shareObjectRaw

**Applies to: Web**

Allows you to share any shareable object in a web by providing the appropriate parameters. These two methods differ in that shareObject will try and fix up your query based on the supplied parameters where shareObjectRaw will send your supplied json object directly to the server. The later method is provided for the greatest amount of flexibility.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/sharing";
import { ISharingResult, SharingRole } from "@pnp/sp/sharing";

const sp = spfi(...);

// Share an object in this web
const result = await sp.web.shareObject("https://mysite.sharepoint.com/sites/dev/Docs/test.txt", "i:0#.f|membership|user@site.com", SharingRole.View);

// Share an object with all settings available
await sp.web.shareObjectRaw({
    url: "https://mysite.sharepoint.com/sites/dev/Docs/test.txt",
    peoplePickerInput: [{ Key: "i:0#.f|membership|user@site.com" }],
    roleValue: "role: 1973741327",
    groupId: 0,
    propagateAcl: false,
    sendEmail: true,
    includeAnonymousLinkInEmail: false,
    emailSubject: "subject",
    emailBody: "body",
    useSimplifiedRoles: true,
});
```

## unshareObject

**Applies to: Web**

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/sharing";
import { ISharingResult } from "@pnp/sp/sharing";

const sp = spfi(...);

const result = await sp.web.unshareObject("https://mysite.sharepoint.com/sites/dev/Docs/test.txt");
```

## checkSharingPermissions

**Applies to: Item, Folder, File**

Checks Permissions on the list of Users and returns back role the users have on the Item.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/sharing/folders";
import "@pnp/sp/folders/web";
import { SharingEntityPermission } from "@pnp/sp/sharing";

const sp = spfi(...);

// check the sharing permissions for a folder
const perms = await sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").checkSharingPermissions([{ alias: "i:0#.f|membership|user@site.com" }]);
```

## getSharingInformation

**Applies to: Item, Folder, File**

Get Sharing Information.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/sharing";
import "@pnp/sp/folders";
import { ISharingInformation } from "@pnp/sp/sharing";

const sp = spfi(...);

// Get the sharing information for a folder
const info = await sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").getSharingInformation();

// get sharing informaiton with a request object
const info2 = await sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").getSharingInformation({
    maxPrincipalsToReturn: 10,
    populateInheritedLinks: true,
});

// get sharing informaiton using select and expand, NOTE expand comes first in the API signature
const info3 = await sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").getSharingInformation({}, ["permissionsInformation"], ["permissionsInformation","anyoneLinkTrackUsers"]);
```

## getObjectSharingSettings

**Applies to: Item, Folder, File**

Gets the sharing settings

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/sharing";
import "@pnp/sp/folders";
import { IObjectSharingSettings } from "@pnp/sp/sharing";

const sp = spfi(...);

// Gets the sharing object settings
const settings: IObjectSharingSettings = await sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").getObjectSharingSettings();
```

## unshare

**Applies to: Item, Folder, File**

Unshares a given resource

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/sharing";
import "@pnp/sp/folders";
import { ISharingResult } from "@pnp/sp/sharing";

const sp = spfi(...);

const result: ISharingResult = await sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").unshare();
```

## deleteSharingLinkByKind

**Applies to: Item, Folder, File**

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/sharing";
import "@pnp/sp/folders";
import { ISharingResult, SharingLinkKind } from "@pnp/sp/sharing";

const sp = spfi(...);

const result: ISharingResult = await sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").deleteSharingLinkByKind(SharingLinkKind.AnonymousEdit);
```

## unshareLink

**Applies to: Item, Folder, File**

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/sharing";
import "@pnp/sp/folders";
import { SharingLinkKind } from "@pnp/sp/sharing";

const sp = spfi(...);

await sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").unshareLink(SharingLinkKind.AnonymousEdit);

// specify the sharing link id if available
await sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").unshareLink(SharingLinkKind.AnonymousEdit, "12345");
```

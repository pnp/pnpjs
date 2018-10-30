# @pnp/sp/sharing

**_Note: This API is still considered "beta" meaning it may change and some behaviors may differ across tenants by version. It is also supported only in SharePoint Online._**

One of the newer abilities in SharePoint is the ability to share webs, files, or folders with both internal and external folks. It is important to remember that these settings are managed at the tenant level and override anything you may supply as an argument to these methods. If you receive an _InvalidOperationException_ when using these methods please check your tenant sharing settings to ensure sharing is not blocked before submitting an issue.

## getShareLink

**Applies to: Item, Folder, File**

Creates a sharing link for the given resource with an optional expiration.

```TypeScript
import { sp , SharingLinkKind, ShareLinkResponse } from "@pnp/sp";
import { dateAdd } from "@pnp/common";

sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/folder1").getShareLink(SharingLinkKind.AnonymousView).then(((result: ShareLinkResponse) => {

    console.log(result);
}).catch(e => {
    console.error(e);
});

sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/folder1").getShareLink(SharingLinkKind.AnonymousView, dateAdd(new Date(), "day", 5)).then((result: ShareLinkResponse) => {
    console.log(result);
}).catch(e => {
    console.error(e);
});
```

## shareWith

**Applies to: Item, Folder, File, Web**

Shares the given resource with the specified permissions (View or Edit) and optionally sends an email to the users. You can supply a single string for the loginnames parameter or an array of loginnames. The folder method takes an optional parameter "shareEverything" which determines if the shared permissions are pushed down to all items in the folder, even those with unique permissions.

```TypeScript
import { sp , SharingResult, SharingRole } from "@pnp/sp";

sp.web.shareWith("i:0#.f|membership|user@site.com").then((result: SharingResult) => {

    console.log(result);
}).catch(e => {
    console.error(e);
});

sp.web.shareWith("i:0#.f|membership|user@site.com", SharingRole.Edit).then((result: SharingResult) => {

    console.log(result);
}).catch(e => {
    console.error(e);
});

sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/folder1").shareWith("i:0#.f|membership|user@site.com").then((result: SharingResult) => {

    console.log(result);
}).catch(e => {
    console.error(e);
});

sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").shareWith("i:0#.f|membership|user@site.com", SharingRole.Edit, true, true).then((result: SharingResult) => {

    console.log(result);
}).catch(e => {
    console.error(e);
});

sp.web.getFileByServerRelativeUrl("/sites/dev/Shared Documents/test.txt").shareWith("i:0#.f|membership|user@site.com").then((result: SharingResult) => {

    console.log(result);
}).catch(e => {
    console.error(e);
});

sp.web.getFileByServerRelativeUrl("/sites/dev/Shared Documents/test.txt").shareWith("i:0#.f|membership|user@site.com", SharingRole.Edit).then((result: SharingResult) => {

    console.log(result);
}).catch(e => {
    console.error(e);
});
```

## shareObject & shareObjectRaw

**Applies to: Web**

Allows you to share any shareable object in a web by providing the appropriate parameters. These two methods differ in that shareObject will try and fix up your query based on the supplied parameters where shareObjectRaw will send your supplied json object directly to the server. The later method is provided for the greatest amount of flexibility.

```TypeScript
import { sp , SharingResult, SharingRole } from "@pnp/sp";

sp.web.shareObject("https://mysite.sharepoint.com/sites/dev/Docs/test.txt", "i:0#.f|membership|user@site.com", SharingRole.View).then((result: SharingResult) => {

    console.log(result);
}).catch(e => {
    console.error(e);
});

sp.web.shareObjectRaw({
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
import { sp , SharingResult } from "@pnp/sp";

sp.web.unshareObject("https://mysite.sharepoint.com/sites/dev/Docs/test.txt").then((result: SharingResult) => {

    console.log(result);
}).catch(e => {
    console.error(e);
});
```

## checkSharingPermissions

**Applies to: Item, Folder, File**

Checks Permissions on the list of Users and returns back role the users have on the Item.

```TypeScript
import { sp , SharingEntityPermission } from "@pnp/sp";

sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").checkSharingPermissions([{ alias: "i:0#.f|membership|user@site.com" }]).then((result: SharingEntityPermission[]) => {

    console.log(result);
}).catch(e => {
    console.error(e);
});
```

## getSharingInformation

**Applies to: Item, Folder, File**

Get Sharing Information.

```TypeScript
import { sp , SharingInformation } from "@pnp/sp";

sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").getSharingInformation().then((result: SharingInformation) => {
    console.log(result);
}).catch(e => {
    console.error(e);
});
```

## getObjectSharingSettings

**Applies to: Item, Folder, File**

Gets the sharing settings

```TypeScript
import { sp , ObjectSharingSettings } from "@pnp/sp";

sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").getObjectSharingSettings().then((result: ObjectSharingSettings) => {

    console.log(result);
}).catch(e => {
    console.error(e);
});
```

## unshare

**Applies to: Item, Folder, File**

Unshares a given resource

```TypeScript
import { sp , SharingResult } from "@pnp/sp";

sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").unshare().then((result: SharingResult) => {

    console.log(result);
}).catch(e => {
    console.error(e);
});
```

## deleteSharingLinkByKind

**Applies to: Item, Folder, File**

```TypeScript
import { sp , SharingLinkKind, SharingResult } from "@pnp/sp";

sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").deleteSharingLinkByKind(SharingLinkKind.AnonymousEdit).then((result: SharingResult) => {

    console.log(result);
}).catch(e => {
    console.error(e);
});
```

## unshareLink

**Applies to: Item, Folder, File**

```TypeScript
import { sp , SharingLinkKind } from "@pnp/sp";

sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").unshareLink(SharingLinkKind.AnonymousEdit).then(_ => {

    console.log("done");
}).catch(e => {
    console.error(e);
});

sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/test").unshareLink(SharingLinkKind.AnonymousEdit, "12345").then(_ => {

    console.log("done");
}).catch(e => {
    console.error(e);
});
```

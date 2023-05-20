# @pnp/sp/webs

Webs are one of the fundamental entry points when working with SharePoint. Webs serve as a container for lists, features, sub-webs, and all of the entity types.

## IWebs

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

### Add Web

Using the library you can add a web to another web's collection of subwebs. The simplest usage requires only a title and url. This will result in a team site with all of the default settings. You can also provide other settings such as description, template, language, and inherit permissions.

```TypeScript
import { spfi } from "@pnp/sp";
import { IWebAddResult } from "@pnp/sp/webs";

const sp = spfi(...);

const result = await sp.web.webs.add("title", "subweb1");

// show the response from the server when adding the web
console.log(result.data);

// we can immediately operate on the new web
result.web.select("Title")().then((w: IWebInfo)  => {

    // show our title
    console.log(w.Title);
});
```

```TypeScript
import { spfi } from "@pnp/sp";
import { IWebAddResult } from "@pnp/sp/webs";

const sp = spfi(...);

// create a German language wiki site with title, url, description, which does not inherit permissions
sp.web.webs.add("wiki", "subweb2", "a wiki web", "WIKI#0", 1031, false).then((w: IWebAddResult) => {

  // ...
});
```

## IWeb

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

### Access a Web

There are several ways to access a web instance, each of these methods is equivalent in that you will have an IWeb instance to work with. All of the examples below use a variable named "web" which represents an IWeb instance - regardless of how it was initially accessed.

**Access the web from the imported "spfi" object using selective import:**

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi(...);

const r = await sp.web();
```

**Access the web from the imported "spfi" object using the 'all' preset**

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/presets/all";

const sp = spfi(...);

const r = await sp.web();
```

**Access the web using any SPQueryable as a base**

In this scenario you might be deep in your code without access to the original start of the fluid chain (i.e. the instance produced from spfi). You can pass any queryable to the Web or Site factory and get back a valid IWeb instance. In this case all of the observers registered to the supplied instance will be referenced by the IWeb, and the url will be rebased to ensure a valid path.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi(...);

// we have a ref to the IItems instance
const items = await sp.web.lists.getByTitle("Generic").items;

// we create a new IWeb instance using the items as a base
const web = Web(items);

// gets the web info
const webInfo = await web();

// get a reference to a different list
const list = web.lists.getByTitle("DifferentList");
```

**Access a web using the Web factory method**

There are several ways to use the `Web` factory directly and have some special considerations unique to creating `IWeb` instances from `Web`. The easiest is to supply the absolute URL of the web you wish to target, as seen in the first example below. When supplying a path parameter to `Web` you need to include the `_api/web` part in the appropriate location as the library can't from strings determine how to append the path. Example 2 below shows a wrong usage of the Web factory as we cannot determine how the path part should be appended. Examples 3 and 4 show how to include the `_api/web` part for both subwebs or queries within the given web.

> When in doubt, supply the absolute url to the web as the first parameter as shown in example 1 below

```TypeScript
import { spfi } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";

// creates a web:
// - whose root is "https://tenant.sharepoint.com/sites/myweb"
// - whose request path is "https://tenant.sharepoint.com/sites/myweb/_api/web"
// - has no registered observers
const web1 = Web("https://tenant.sharepoint.com/sites/myweb");

// creates a web that will not work due to missing the _api/web portion
// this is because we don't know that the extra path should come before/after the _api/web portion
// - whose root is "https://tenant.sharepoint.com/sites/myweb/some sub path"
// - whose request path is "https://tenant.sharepoint.com/sites/myweb/some sub path"
// - has no registered observers
const web2-WRONG = Web("https://tenant.sharepoint.com/sites/myweb", "some sub path");

// creates a web:
// - whose root is "https://tenant.sharepoint.com/sites/myweb/some sub path"
// - whose request path is "https://tenant.sharepoint.com/sites/myweb/some sub web/_api/web"
// including the _api/web ensures the path you are providing is correct and can be parsed by the library
// - has no registered observers
const web3 = Web("https://tenant.sharepoint.com/sites/myweb", "some sub web/_api/web");

// creates a web that actually points to the lists endpoint:
// - whose root is "https://tenant.sharepoint.com/sites/myweb/"
// - whose request path is "https://tenant.sharepoint.com/sites/myweb/_api/web/lists"
// including the _api/web ensures the path you are providing is correct and can be parsed by the library
// - has no registered observers
const web4 = Web("https://tenant.sharepoint.com/sites/myweb", "_api/web/lists");
```

The above examples show you how to use the constructor to create the base url for the `Web` although none of them are usable as is until you add observers. You can do so by either adding them explicitly with a using...

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";

const web1 = Web("https://tenant.sharepoint.com/sites/myweb").using(SPFx(this.context));
```

or by copying them from another SPQueryable instance...

```TypeScript
import { spfi } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/webs";

const sp = spfi(...);
//sp.web is of type SPQueryable; using tuple pattern pass SPQueryable and the web's url
const web = Web([sp.web, "https://tenant.sharepoint.com/sites/otherweb"]);
```

### webs

Access the child [webs collection](#Webs%20Collection) of this web

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi(...);

const web = sp.web;
const webs = await web.webs();
```

### Get A Web's properties

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi(...);

// basic get of the webs properties
const props = await sp.web();

// use odata operators to get specific fields
const props2 = await sp.web.select("Title")();

// type the result to match what you are requesting
const props3 = await sp.web.select("Title")<{ Title: string }>();
```

### getParentWeb

Get the data and IWeb instance for the parent web for the given web instance

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi(...);
const web = web.getParentWeb();
```

### getSubwebsFilteredForCurrentUser

Returns a collection of objects that contain metadata about subsites of the current site in which the current user is a member.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi(...);

const web = sp.web;
const subWebs = web.getSubwebsFilteredForCurrentUser()();

// apply odata operations to the collection
const subWebs2 = await sp.web.getSubwebsFilteredForCurrentUser().select("Title", "Language").orderBy("Created", true)();
```

> Note: getSubwebsFilteredForCurrentUser returns [IWebInfosData](#IWebInfosData) which is a subset of all the available fields on IWebInfo.

### allProperties

Allows access to the web's all properties collection. This is readonly in REST.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi(...);

const web = sp.web;
const props = await web.allProperties();

// select certain props
const props2 = await web.allProperties.select("prop1", "prop2")();
```

### webinfos

Gets a collection of WebInfos for this web's subwebs

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi(...);
const web = sp.web;

const infos = await web.webinfos();

// or select certain fields
const infos2 = await web.webinfos.select("Title", "Description")();

// or filter
const infos3 = await web.webinfos.filter("Title eq 'MyWebTitle'")();

// or both
const infos4 = await web.webinfos.select("Title", "Description").filter("Title eq 'MyWebTitle'")();

// get the top 4 ordered by Title
const infos5 = await web.webinfos.top(4).orderBy("Title")();
```

> Note: webinfos returns [IWebInfosData](#IWebInfosData) which is a subset of all the available fields on IWebInfo.

### update

Updates this web instance with the supplied properties

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi(...);
const web = sp.web;
// update the web's title and description
const result = await web.update({
    Title: "New Title",
    Description: "My new description",
});

// a project implementation could wrap the update to provide type information for your expected fields:

interface IWebUpdateProps {
    Title: string;
    Description: string;
}

function updateWeb(props: IWebUpdateProps): Promise<void> {
    web.update(props);
}
```

### Delete a Web

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi(...);
const web = sp.web;

await web.delete();
```

### applyTheme

Applies the theme specified by the contents of each of the files specified in the arguments to the site

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import { combine } from "@pnp/core";

const sp = spfi("https://{tenant}.sharepoint.com/sites/dev/subweb").using(SPFx(this.context));
const web = sp.web;

// the urls to the color and font need to both be from the catalog at the root
// these urls can be constants or calculated from existing urls
const colorUrl =  combine("/", "sites/dev", "_catalogs/theme/15/palette011.spcolor");
// this gives us the same result
const fontUrl = "/sites/dev/_catalogs/theme/15/fontscheme007.spfont";

// apply the font and color, no background image, and don't share this theme
await web.applyTheme(colorUrl, fontUrl, "", false);
```

### applyWebTemplate & availableWebTemplates

Applies the specified site definition or site template to the Web site that has no template applied to it. This is seldom used outside provisioning scenarios.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi(...);
const web = sp.web;
const templates = (await web.availableWebTemplates().select("Name")<{ Name: string }[]>()).filter(t => /ENTERWIKI#0/i.test(t.Name));

// apply the wiki template
const template = templates.length > 0 ? templates[0].Name : "STS#0";

await web.applyWebTemplate(template);
```

### getChanges

Returns the collection of changes from the change log that have occurred within the web, based on the specified query.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi(...);
const web = sp.web;
// get the web changes including add, update, and delete
const changes = await web.getChanges({
        Add: true,
        ChangeTokenEnd: undefined,
        ChangeTokenStart: undefined,
        DeleteObject: true,
        Update: true,
        Web: true,
    });
```

### mapToIcon

Returns the name of the image file for the icon that is used to represent the specified file

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import { combine } from "@pnp/core";

const iconFileName = await web.mapToIcon("test.docx");
// iconPath === "icdocx.png"
// which you can need to map to a real url
const iconFullPath = `https://{tenant}.sharepoint.com/sites/dev/_layouts/images/${iconFileName}`;

// OR dynamically
const sp = spfi(...);
const webData = await sp.web.select("Url")();
const iconFullPath2 = combine(webData.Url, "_layouts", "images", iconFileName);

// OR within SPFx using the context
const iconFullPath3 = combine(this.context.pageContext.web.absoluteUrl, "_layouts", "images", iconFileName);

// You can also set size
// 16x16 pixels = 0, 32x32 pixels = 1
const icon32FileName = await web.mapToIcon("test.docx", 1);
```

### storage entities

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/appcatalog";
import { IStorageEntity } from "@pnp/sp/webs";

// needs to be unique, GUIDs are great
const key = "my-storage-key";

const sp = spfi(...);

// read an existing entity
const entity: IStorageEntity = await sp.web.getStorageEntity(key);

// setStorageEntity and removeStorageEntity must be called in the context of the tenant app catalog site
// you can get the tenant app catalog using the getTenantAppCatalogWeb
const tenantAppCatalogWeb = await sp.getTenantAppCatalogWeb();

tenantAppCatalogWeb.setStorageEntity(key, "new value");

// set other properties
tenantAppCatalogWeb.setStorageEntity(key, "another value", "description", "comments");

const entity2: IStorageEntity = await sp.web.getStorageEntity(key);
/*
entity2 === {
    Value: "another value",
    Comment: "comments";
    Description: "description",
};
*/

// you can also remove a storage entity
await tenantAppCatalogWeb.removeStorageEntity(key);
```

### getAppCatalog

Returns this web as an IAppCatalog instance or creates a new IAppCatalog instance from the provided url.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import { IApp } from "@pnp/sp/appcatalog";

const sp = spfi(...);

const appWeb = sp.web.appcatalog;
const app: IApp = appWeb.getAppById("{your app id}");
// appWeb url === web url
```

## client-side-pages

You can create and load clientside page instances directly from a web. More details on [working with clientside pages](clientside-pages.md) are available in the dedicated article.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/clientside-pages/web";

const sp = spfi(...);

// simplest add a page example
const page = await sp.web.addClientsidePage("mypage1");

// simplest load a page example
const page = await sp.web.loadClientsidePage("/sites/dev/sitepages/mypage3.aspx");
```

### contentTypes

Allows access to the collection of content types in this web.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/content-types/web";

const sp = spfi(...);

const cts = await sp.web.contentTypes();

// you can also select fields and use other odata operators
const cts2 = await sp.web.contentTypes.select("Name")();
```

### features

Allows access to the collection of content types in this web.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/features/web";

const sp = spfi(...);

const features = await sp.web.features();
```

### fields

Allows access to the collection of fields in this web.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/fields/web";

const sp = spfi(...);
const fields = await sp.web.fields();
```

### getFileByServerRelativePath

Gets a file by server relative url if your file name contains # and % characters

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files/web";
import { IFile } from "@pnp/sp/files/types";

const sp = spfi(...);
const file: IFile = web.getFileByServerRelativePath("/sites/dev/library/my # file%.docx");
```

### folders

Gets the collection of folders in this web

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders/web";

const sp = spfi(...);

const folders = await sp.web.folders();

// you can also filter and select as with any collection
const folders2 = await sp.web.folders.select("ServerRelativeUrl", "TimeLastModified").filter("ItemCount gt 0")();

// or get the most recently modified folder
const folders2 = await sp.web.folders.orderBy("TimeLastModified").top(1)();
```

### rootFolder

Gets the root folder of the web

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders/web";

const sp = spfi(...);

const folder = await sp.web.rootFolder();
```

### getFolderByServerRelativePath

Gets a folder by server relative url if your folder name contains # and % characters

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders/web";
import { IFolder } from "@pnp/sp/folders";

const sp = spfi(...);

const folder: IFolder = web.getFolderByServerRelativePath("/sites/dev/library/my # folder%/");
```

### hubSiteData

Gets hub site data for the current web

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/hubsites/web";

const sp = spfi(...);
// get the data and force a refresh
const data = await sp.web.hubSiteData(true);
```

### syncHubSiteTheme

Applies theme updates from the parent hub site collection

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/hubsites/web";

const sp = spfi(...);
await sp.web.syncHubSiteTheme();
```

### lists

Gets the collection of all lists that are contained in the Web site

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import { ILists } from "@pnp/sp/lists";

const sp = spfi(...);
const lists: ILists = sp.web.lists;

// you can always order the lists and select properties
const data = await lists.select("Title").orderBy("Title")();

// and use other odata operators as well
const data2 = await sp.web.lists.top(3).orderBy("LastItemModifiedDate")();
```

### siteUserInfoList

Gets the UserInfo list of the site collection that contains the Web site

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import { IList } from "@pnp/sp/lists";

const sp = spfi(...);
const list: IList = sp.web.siteUserInfoList;

const data = await list();

// or chain off that list to get additional details
const items = await list.items.top(2)();
```

### defaultDocumentLibrary

Get a reference to the default document library of a web

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import { IList } from "@pnp/sp/lists/web";

const sp = spfi(...);
const list: IList = sp.web.defaultDocumentLibrary;
```

### customListTemplates

Gets the collection of all list definitions and list templates that are available

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import { IList } from "@pnp/sp/lists";

const sp = spfi(...);
const templates = await sp.web.customListTemplates();

// odata operators chain off the collection as expected
const templates2 = await sp.web.customListTemplates.select("Title")();
```

### getList

Gets a list by server relative url (list's root folder)

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import { IList } from "@pnp/sp/lists/web";

const sp = spfi(...);
const list: IList = sp.web.getList("/sites/dev/lists/test");

const listData = await list();
```

### getCatalog

Returns the list gallery on the site

Name | Value
--- | ---
WebTemplateCatalog | 111
WebPartCatalog | 113
ListTemplateCatalog | 114
MasterPageCatalog | 116
SolutionCatalog | 121
ThemeCatalog | 123
DesignCatalog | 124
AppDataCatalog | 125

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import { IList } from "@pnp/sp/lists";

const sp = spfi(...);
const templateCatalog: IList = await sp.web.getCatalog(111);

const themeCatalog: IList = await sp.web.getCatalog(123);
```

### navigation

Gets a navigation object that represents navigation on the Web site, including the Quick Launch area and the top navigation bar

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/navigation/web";
import { INavigation } from "@pnp/sp/navigation";

const sp = spfi(...);
const nav: INavigation = sp.web.navigation;
```

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/navigation/web";
import { IRegionalSettings } from "@pnp/sp/navigation";

const sp = spfi(...);
const settings: IRegionalSettings = sp.web.regionalSettings;

const settingsData = await settings();
```

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/related-items/web";
import { IRelatedItemManager, IRelatedItem } from "@pnp/sp/related-items";

const sp = spfi(...);
const manager: IRelatedItemManager = sp.web.relatedItems;

const data: IRelatedItem[] = await manager.getRelatedItems("{list name}", 4);
```

## security imports

Please see information around the available security methods in the [security article](security.md).

## sharing imports

Please see information around the available sharing methods in the [sharing article](sharing.md).

### siteGroups

The site groups

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-groups/web";

const sp = spfi(...);
const groups = await sp.web.siteGroups();

const groups2 = await sp.web.siteGroups.top(2)();
```

### associatedOwnerGroup

The web's owner group

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-groups/web";

const sp = spfi(...);

const group = await sp.web.associatedOwnerGroup();

const users = await sp.web.associatedOwnerGroup.users();
```

### associatedMemberGroup

The web's member group

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-groups/web";

const sp = spfi(...);

const group = await sp.web.associatedMemberGroup();

const users = await sp.web.associatedMemberGroup.users();
```

### associatedVisitorGroup

The web's visitor group

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-groups/web";

const sp = spfi(...);

const group = await sp.web.associatedVisitorGroup();

const users = await sp.web.associatedVisitorGroup.users();
```

### createDefaultAssociatedGroups

Creates the default associated groups (Members, Owners, Visitors) and gives them the default permissions on the site. The target site must have unique permissions and no associated members / owners / visitors groups

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-groups/web";

const sp = spfi(...);

await sp.web.createDefaultAssociatedGroups("Contoso", "{first owner login}");

// copy the role assignments
await sp.web.createDefaultAssociatedGroups("Contoso", "{first owner login}", true);

// don't clear sub assignments
await sp.web.createDefaultAssociatedGroups("Contoso", "{first owner login}", false, false);

// specify secondary owner, don't copy permissions, clear sub scopes
await sp.web.createDefaultAssociatedGroups("Contoso", "{first owner login}", false, true, "{second owner login}");
```

### siteUsers

The site users

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";

const sp = spfi(...);

const users = await sp.web.siteUsers();

const users2 = await sp.web.siteUsers.top(5)();

const users3 = await sp.web.siteUsers.filter(`startswith(LoginName, '${encodeURIComponent("i:0#.f|m")}')`)();
```

### currentUser

Information on the current user

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";

const sp = spfi(...);

const user = await sp.web.currentUser();

// check the login name of the current user
const user2 = await sp.web.currentUser.select("LoginName")();
```

### ensureUser

Checks whether the specified login name belongs to a valid user in the web. If the user doesn't exist, adds the user to the web

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import { IWebEnsureUserResult } from "@pnp/sp/site-users/";

const sp = spfi(...);

const result: IWebEnsureUserResult = await sp.web.ensureUser("i:0#.f|membership|user@domain.onmicrosoft.com");
```

### getUserById

Returns the user corresponding to the specified member identifier for the current web

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import { ISiteUser } from "@pnp/sp/site-users/";

const sp = spfi(...);

const user: ISiteUser = sp.web.getUserById(23);

const userData = await user();

const userData2 = await user.select("LoginName")();
```

## userCustomActions

Gets a newly refreshed collection of the SPWeb's SPUserCustomActionCollection

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/user-custom-actions/web";
import { IUserCustomActions } from "@pnp/sp/user-custom-actions";

const sp = spfi(...);

const actions: IUserCustomActions = sp.web.userCustomActions;

const actionsData = await actions();
```

## IWebInfosData

Some web operations return a subset of web information defined by the IWebInfosData interface, shown below. In those cases only these fields are available for select, orderby, and other odata operations.

```TypeScript
interface IWebInfosData {
    Configuration: number;
    Created: string;
    Description: string;
    Id: string;
    Language: number;
    LastItemModifiedDate: string;
    LastItemUserModifiedDate: string;
    ServerRelativeUrl: string;
    Title: string;
    WebTemplate: string;
    WebTemplateId: number;
}
```

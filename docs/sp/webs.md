# @pnp/sp/webs

Webs are one of the fundamental entry points when working with SharePoint. Webs serve as a container for lists, features, sub-webs, and all of the entity types.

## IWebs

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

|Scenario|Import Statement|
|--|--|
|Selective 1|import { sp } from "@pnp/sp";<br />import { Webs, IWebs } from "@pnp/sp/webs";|
|Selective 2|import { sp } from "@pnp/sp";<br />import "@pnp/sp/webs";|
|Preset: All|import { sp, Webs, IWebs } from "@pnp/sp/presets/all";|
|Preset: Core|import { sp, Webs, IWebs } from "@pnp/sp/presets/core";|

### Add Web

Using the library you can add a web to another web's collection of subwebs. The simplest usage requires only a title and url. This will result in a team site with all of the default settings. You can also provide other settings such as description, template, language, and inherit permissions.

```TypeScript
import { sp } from "@pnp/sp";
import { IWebAddResult } from "@pnp/sp/webs";

const result = await sp.web.webs.add("title", "subweb1");

// show the response from the server when adding the web
console.log(result.data);

// we can immediately operate on the new web
result.web.select("Title").get().then((w: IWebAddResult)  => {

    // show our title
    console.log(w.Title);
});
```

```TypeScript
import { sp } from "@pnp/sp";
import { IWebAddResult } from "@pnp/sp/webs";

// create a German language wiki site with title, url, description, which does not inherit permissions
sp.web.webs.add("wiki", "subweb2", "a wiki web", "WIKI#0", 1031, false).then((w: IWebAddResult) => {

  // ...
});
```

## IWeb

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

|Scenario|Import Statement|
|--|--|
|Selective 1|import { sp } from "@pnp/sp";<br />import { Web, IWeb } from "@pnp/sp/webs";|
|Selective 2|import { sp } from "@pnp/sp";<br />import "@pnp/sp/webs";|
|Preset: All|import { sp, Web, IWeb } from "@pnp/sp/presets/all";|
|Preset: Core|import { sp, Web, IWeb } from "@pnp/sp/presets/core";|

### Access a Web

There are several ways to access a web instance, each of these methods is equivalent in that you will have an IWeb instance to work with. All of the examples below use a variable named "web" which represents an IWeb instance - regardless of how it was initially accessed.

**Access the web from the imported "sp" object using selective import:**

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";

const r = await sp.web();
```

**Access the web from the imported "sp" using the 'all' preset**

```TypeScript
import { sp } from "@pnp/sp/presets/all";

const r = await sp.web();
```

**Access the web from the imported "sp" using the 'core' preset**

```TypeScript
import { sp } from "@pnp/sp/presets/core";

const r = await sp.web();
```

**Create a web instance using the factory function**

```TypeScript
import { Web } from "@pnp/sp/webs";

const web = Web("https://something.sharepoint.com/sites/dev");
const r = await web();
```

### webs

Access the child [webs collection](#Webs%20Collection) of this web

```TypeScript
const webs = web.webs();
```

### Get A Web's properties

```TypeScript
// basic get of the webs properties
const props = await web();

// use odata operators to get specific fields
const props2 = await web.select("Title")();

// type the result to match what you are requesting
const props3 = await web.select("Title")<{ Title: string }>();
```

### getParentWeb

Get the data and IWeb instance for the parent web for the given web instance

```TypeScript
import { IOpenWebByIdResult } from "@pnp/sp/sites";
const web: IOpenWebByIdResult = web.getParentWeb();
```

### getSubwebsFilteredForCurrentUser

Returns a collection of objects that contain metadata about subsites of the current site in which the current user is a member.

```TypeScript
const subWebs = await web.getSubwebsFilteredForCurrentUser().get();
```

### allProperties

Allows access to the web's all properties collection. This is readonly in REST.

```TypeScript
const props = await web.allProperties();

// select certain props
const props2 = await web.allProperties.select("prop1", "prop2")();
```

### webinfos

Gets a collection of WebInfos for this web's subwebs

```TypeScript
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

### update

Updates this web instance with the supplied properties

```TypeScript

// update the web's title and description
const result = await web.update({
    Title: "New Title",
    Description: "My new description",
});

// a project implementation could wrap the update to provide type information for your expected fields:
import { IWebUpdateResult } from "@pnp/sp/webs";

interface IWebUpdateProps {
    Title: string;
    Description: string;
}

function updateWeb(props: IWebUpdateProps): Promise<IWebUpdateResult> {
    web.update(props);
}
```

### Delete a Web

```TypeScript
await web.delete();
```

### applyTheme

Applies the theme specified by the contents of each of the files specified in the arguments to the site

```TypeScript
import { combine } from "@pnp/common";

// we are going to apply the theme to this sub web as an example
const web = Web("https://{tenant}.sharepoint.com/sites/dev/subweb");

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
const templates = (await web.availableWebTemplates().select("Name")<{ Name: string }[]>()).filter(t => /ENTERWIKI#0/i.test(t.Name));

// apply the wiki template
const template = templates.length > 0 ? templates[0].Name : "STS#0";

await web.applyWebTemplate(template);
```

### getChanges

Returns the collection of changes from the change log that have occurred within the web, based on the specified query.

```TypeScript
// get the web changes including add, update, and delete
const changes = await web.getChanges({
        Add: true,
        ChangeTokenEnd: null,
        ChangeTokenStart: null,
        DeleteObject: true,
        Update: true,
        Web: true,
    });
```

### mapToIcon

Returns the name of the image file for the icon that is used to represent the specified file

```TypeScript
import { combine } from "@pnp/common";

const iconFileName = await web.mapToIcon("test.docx");
// iconPath === "icdocx.png"
// which you can need to map to a real url
const iconFullPath = `https://{tenant}.sharepoint.com/sites/dev/_layouts/images/${iconFileName}`;

// OR dynamically
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
import { sp } from "@pnp/sp";
import "@pnp/sp/appcatalog";
import { IStorageEntity } from "@pnp/sp/webs";

// needs to be unique, GUIDs are great
const key = "my-storage-key";

// read an existing entity
const entity: IStorageEntity = await web.getStorageEntity(key);

// setStorageEntity and removeStorageEntity must be called in the context of the tenant app catalog site
// you can get the tenant app catalog using the getTenantAppCatalogWeb
const tenantAppCatalogWeb = await sp.getTenantAppCatalogWeb();

tenantAppCatalogWeb.setStorageEntity(key, "new value");

// set other properties
tenantAppCatalogWeb.setStorageEntity(key, "another value", "description", "comments");

const entity2: IStorageEntity = await web.getStorageEntity(key);
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

## appcatalog imports

|Scenario|Import Statement|
|--|--|
|Selective 1|import "@pnp/sp/appcatalog";|
|Selective 2|import "@pnp/sp/appcatalog/web";|
|Preset: All|import { sp } from "@pnp/sp/presets/all";|

### getAppCatalog

Returns this web as an IAppCatalog instance or creates a new IAppCatalog instance from the provided url.

```TypeScript
import { IApp } from "@pnp/sp/appcatalog";

const appWeb = web.getAppCatalog();
// appWeb url === web url

const app: IApp = appWeb.getAppById("{your app id}");

const appWeb2 = web.getAppCatalog("https://tenant.sharepoing.com/sites/someappcatalog");
// appWeb2 url === "https://tenant.sharepoing.com/sites/someappcatalog"
```

## client-side-pages imports

|Scenario|Import Statement|
|--|--|
|Selective 1|import "@pnp/sp/client-side-pages";|
|Selective 2|import "@pnp/sp/client-side-pages/web";|
|Preset: All|import { sp, Web, IWeb } from "@pnp/sp/presets/all";|

You can create and load clientside page instances directly from a web. More details on [working with clientside pages](clientside-pages.md) are available in the dedicated article.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/clientside-pages/web";

// simplest add a page example
const page = await sp.web.addClientsidePage("mypage1");

// simplest load a page example
const page = await sp.web.loadClientsidePage("/sites/dev/sitepages/mypage3.aspx");
```


## content-type imports

|Scenario|Import Statement|
|--|--|
|Selective 1|import "@pnp/sp/content-types";|
|Selective 2|import "@pnp/sp/content-types/web";|
|Preset: All|import { sp } from "@pnp/sp/presets/all";|

### contentTypes

Allows access to the collection of content types in this web.

```TypeScript
const cts = await web.contentTypes();

// you can also select fields and use other odata operators
const cts2 = await web.contentTypes.select("Name")();
```

## features imports

|Scenario|Import Statement|
|--|--|
|Selective 1|import "@pnp/sp/features";|
|Selective 2|import "@pnp/sp/features/web";|
|Preset: All|import { sp } from "@pnp/sp/presets/all";|

### features

Allows access to the collection of content types in this web.

```TypeScript
const features = await web.features();
```

## fields imports

|Scenario|Import Statement|
|--|--|
|Selective 1|import "@pnp/sp/fields";|
|Selective 2|import "@pnp/sp/fields/web";|
|Preset: All|import { sp } from "@pnp/sp/presets/all";|

### fields

Allows access to the collection of fields in this web.

```TypeScript
const fields = await web.fields();
```

## files imports

|Scenario|Import Statement|
|--|--|
|Selective 1|import "@pnp/sp/files";|
|Selective 2|import "@pnp/sp/files/web";|
|Preset: All|import { sp } from "@pnp/sp/presets/all";|

### getFileByServerRelativeUrl

Gets a file by server relative url

```TypeScript
import { IFile } from "@pnp/sp/files";

const file: IFile = web.getFileByServerRelativeUrl("/sites/dev/library/myfile.docx");
```

### getFileByServerRelativePath

Gets a file by server relative url if your file name contains # and % characters

```TypeScript
import { IFile } from "@pnp/sp/files";

const file: IFile = web.getFileByServerRelativePath("/sites/dev/library/my # file%.docx");
```

## folders imports

|Scenario|Import Statement|
|--|--|
|Selective 1|import "@pnp/sp/folders";|
|Selective 2|import "@pnp/sp/folders/web";|
|Preset: All|import { sp } from "@pnp/sp/presets/all";|

### folders

Gets the collection of folders in this web

```TypeScript
const folders = await web.folders();

// you can also filter and select as with any collection
const folders2 = await web.folders.select("ServerRelativeUrl", "TimeLastModified").filter("ItemCount gt 0")();

// or get the most recently modified folder
const folders2 = await web.folders.orderBy("TimeLastModified").top(1)();
```

### rootFolder

Gets the root folder of the web

```TypeScript
const folder = await web.rootFolder();
```

### getFolderByServerRelativeUrl

Gets a folder by server relative url

```TypeScript
import { IFolder } from "@pnp/sp/folders";

const folder: IFolder = web.getFolderByServerRelativeUrl("/sites/dev/library");
```

### getFolderByServerRelativePath

Gets a folder by server relative url if your folder name contains # and % characters

```TypeScript
import { IFolder } from "@pnp/sp/folders";

const folder: IFolder = web.getFolderByServerRelativePath("/sites/dev/library/my # folder%/");
```

## hubsites imports

|Scenario|Import Statement|
|--|--|
|Selective 1|import "@pnp/sp/hubsites";|
|Selective 2|import "@pnp/sp/hubsites/web";|
|Preset: All|import { sp } from "@pnp/sp/presets/all";|

### hubSiteData

Gets hub site data for the current web

```TypeScript
import { IHubSiteWebData } from "@pnp/sp/hubsites";

// get the data and force a refresh
const data: IHubSiteWebData = await web.hubSiteData(true);
```

### syncHubSiteTheme

Applies theme updates from the parent hub site collection

```TypeScript
await web.syncHubSiteTheme();
```

## lists imports

Scenario|Import Statement
--|--
Selective 1|import "@pnp/sp/lists";
Selective 2|import "@pnp/sp/lists/web";
Preset: All|import { sp } from "@pnp/sp/presets/all";
Preset: Core|import { sp } from "@pnp/sp/presets/core";

### lists

Gets the collection of all lists that are contained in the Web site

```TypeScript
import { ILists } from "@pnp/sp/lists";

const lists: ILists = web.lists;

// you can always order the lists and select properties
const data = await lists.select("Title").orderBy("Title")();

// and use other odata operators as well
const data2 = await web.lists.top(3).orderBy("LastItemModifiedDate")();
```

### siteUserInfoList

Gets the UserInfo list of the site collection that contains the Web site

```TypeScript
import { IList } from "@pnp/sp/lists";

const list: IList = web.siteUserInfoList;

const data = await list();

// or chain off that list to get additional details
const items = await list.items.top(2)();
```

### defaultDocumentLibrary

Get a reference the default documents library of a web

```TypeScript
import { IList } from "@pnp/sp/lists";

const list: IList = web.defaultDocumentLibrary;
```

### customListTemplates

Gets the collection of all list definitions and list templates that are available

```TypeScript
import { IList } from "@pnp/sp/lists";

const templates = await web.customListTemplates();

// odata operators chain off the collection as expected
const templates2 = await web.customListTemplates.select("Title")();
```

### getList

Gets a list by server relative url (list's root folder)

```TypeScript
import { IList } from "@pnp/sp/lists";

const list: IList = web.getList("/sites/dev/lists/test");

const listData = list();
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
import { IList } from "@pnp/sp/lists";

const templateCatalog: IList = await web.getCatalog(111);

const themeCatalog: IList = await web.getCatalog(123);
```

## navigation imports

Scenario|Import Statement
--|--
Selective 1|import "@pnp/sp/navigation";
Selective 2|import "@pnp/sp/navigation/web";
Preset: All|import { sp } from "@pnp/sp/presets/all";

### navigation

Gets a navigation object that represents navigation on the Web site, including the Quick Launch area and the top navigation bar

```TypeScript
import { INavigation } from "@pnp/sp/navigation";

const nav: INavigation = web.navigation;

const navData = await nav();
```

## regional-settings imports

Scenario|Import Statement
--|--
Selective 1|import "@pnp/sp/regional-settings";
Selective 2|import "@pnp/sp/regional-settings/web";
Preset: All|import { sp } from "@pnp/sp/presets/all";

```TypeScript
import { IRegionalSettings } from "@pnp/sp/navigation";

const settings: IRegionalSettings = web.regionalSettings;

const settingsData = await settings();
```

## related-items imports

Scenario|Import Statement
--|--
Selective 1|import "@pnp/sp/related-items";
Selective 2|import "@pnp/sp/related-items/web";
Preset: All|import { sp } from "@pnp/sp/presets/all";

```TypeScript
import { IRelatedItemManager, IRelatedItem } from "@pnp/sp/related-items";

const manager: IRelatedItemManager = web.relatedItems;

const data: IRelatedItem[] = await manager.getRelatedItems("{list name}", 4);
```

## security imports

Please see information around the available security methods in the [security article](security.md).

## sharing imports

Please see information around the available sharing methods in the [sharing article](sharing.md).

## site-groups imports

Scenario|Import Statement
--|--
Selective 1|import "@pnp/sp/site-groups";
Selective 2|import "@pnp/sp/site-groups/web";
Preset: All|import { sp } from "@pnp/sp/presets/all";

### siteGroups

The site groups

```TypeScript
const groups = await web.siteGroups();

const groups2 = await web.siteGroups.top(2)();
```

### associatedOwnerGroup

The web's owner group

```TypeScript
const group = await web.associatedOwnerGroup();

const users = await web.associatedOwnerGroup.users();
```

### associatedMemberGroup

The web's member group

```TypeScript
const group = await web.associatedMemberGroup();

const users = await web.associatedMemberGroup.users();
```

### associatedVisitorGroup

The web's visitor group

```TypeScript
const group = await web.associatedVisitorGroup();

const users = await web.associatedVisitorGroup.users();
```

### createDefaultAssociatedGroups

Creates the default associated groups (Members, Owners, Visitors) and gives them the default permissions on the site. The target site must have unique permissions and no associated members / owners / visitors groups

```TypeScript
await web.createDefaultAssociatedGroups("Contoso", "{first owner login}");

// copy the role assignments
await web.createDefaultAssociatedGroups("Contoso", "{first owner login}", true);

// don't clear sub assignments
await web.createDefaultAssociatedGroups("Contoso", "{first owner login}", false, false);

// specify secondary owner, don't copy permissions, clear sub scopes
await web.createDefaultAssociatedGroups("Contoso", "{first owner login}", false, true, "{second owner login}");
```

## site-users imports

Scenario|Import Statement
--|--
Selective 1|import "@pnp/sp/site-users";
Selective 2|import "@pnp/sp/site-users/web";
Preset: All|import { sp } from "@pnp/sp/presets/all";

### siteUsers

The site users

```TypeScript
const users = await web.siteUsers();

const users2 = await web.siteUsers.top(5)();

const users3 = await web.siteUsers.filter(`startswith(LoginName, '${encodeURIComponent("i:0#.f|m")}')`)();
```

### currentUser

Information on the current user

```TypeScript
const user = await web.currentUser();

// check the login name of the current user
const user2 = await web.currentUser.select("LoginName")();
```

### ensureUser

Checks whether the specified login name belongs to a valid user in the web. If the user doesn't exist, adds the user to the web

```TypeScript
import { IWebEnsureUserResult } from "@pnp/sp/site-users/";

const result: IWebEnsureUserResult = await web.ensureUser("i:0#.f|membership|user@domain.onmicrosoft.com");
```

### getUserById

Returns the user corresponding to the specified member identifier for the current web

```TypeScript
import { ISiteUser } from "@pnp/sp/site-users/";

const user: ISiteUser = web.getUserById(23);

const userData = await user();

const userData2 = await user.select("LoginName")();
```

## user-custom-actions imports

Scenario|Import Statement
--|--
Selective 1|import "@pnp/sp/user-custom-actions";
Selective 2|import "@pnp/sp/user-custom-actions/web";
Preset: All|import { sp } from "@pnp/sp/presets/all";

## userCustomActions

Gets a newly refreshed collection of the SPWeb's SPUserCustomActionCollection

```TypeScript
import { IUserCustomActions } from "@pnp/sp/user-custom-actions";

const actions: IUserCustomActions = web.userCustomActions;

const actionsData = await actions();
```

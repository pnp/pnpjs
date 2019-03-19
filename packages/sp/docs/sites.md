# @pnp/sp/site - Site properties

Site collection are one of the fundamental entry points while working with SharePoint. Sites serve as container for webs, lists, features and other entity types.

## Get context information for the current site collection

Using the library, you can get the context information of the current site collection

```Typescript

import { sp } from "@pnp/sp";

sp.site.getContextInfo().then(d =>{
       console.log(d.FormDigestValue); 
});

```

## Get document libraries of a web

Using the library, you can get a list of the document libraries present in the a given web.

**Note:** Works only in SharePoint online

```Typescript
import { sp } from "@pnp/sp";

sp.site.getDocumentLibraries("https://tenant.sharepoint.com/sites/test/subsite").then((d:DocumentLibraryInformation[]) => {
    // iterate over the array of doc lib
});

```

## Open Web By Id

Because this method is a POST request you can chain off it directly. You will get back the full web properties in the data property of the return object. You can also chain directly off the returned Web instance on the web property.

```TypeScript
sp.site.openWebById("111ca453-90f5-482e-a381-cee1ff383c9e").then(w => {

    //we got all the data from the web as well
    console.log(w.data);

    // we can chain
    w.web.select("Title").get().then(w2 => {
        // ...
    });
});
```

## Get site collection url from page

Using the library, you can get the site collection url by providing a page url

```TypeScript

import { sp } from "@pnp/sp";

sp.site.getWebUrlFromPageUrl("https://tenant.sharepoint.com/sites/test/Pages/test.aspx").then(d => {
        console.log(d);
});

```


## Join a hub site

Added in _1.2.4_

**Note:** Works only in SharePoint online

Join the current site collection to a hub site collection

```TypeScript

import { sp, Site } from "@pnp/sp";

var site = new Site("https://tenant.sharepoint.com/sites/HubSite/");

var hubSiteID = "";

site.select("ID").get().then(d => {
    // get ID of the hub site collection
    hubSiteID = d.Id;
    
    // associate the current site collection the hub site collection
    sp.site.joinHubSite(hubSiteID).then(d => {
        console.log(d);
    });

});

```

## Disassociate the current site collection from a hub site collection

Added in _1.2.4_

**Note:** Works only in SharePoint online

```TypeScript

import { sp } from "@pnp/sp";

sp.site.joinHubSite("00000000-0000-0000-0000-000000000000").then(d => {
    console.log(d);
});

```

## Register a hub site

Added in _1.2.4_

**Note:** Works only in SharePoint online

Registers the current site collection as a hub site collection

```TypeScript

import { sp } from "@pnp/sp";

sp.site.registerHubSite().then(d => {
    console.log(d);
});

```

## Un-Register a hub site

Added in _1.2.4_

**Note:** Works only in SharePoint online

Un-Registers the current site collection as a hub site collection

```TypeScript

import { sp } from "@pnp/sp";

sp.site.unRegisterHubSite().then(d => {
    console.log(d);
});

```

## Create a modern communication site

Added in _1.2.6_

**Note:** Works only in SharePoint online

Creates a modern communication site.

| Property | Type | Required | Description |
| ---- | ---- | ---- | ---- |
| Title | string | yes | The title of the site to create. |
| lcid | number | yes | The default language to use for the site. |
| shareByEmailEnabled | boolean | yes | If set to true, it will enable sharing files via Email. By default it is set to false |
| url | string | yes | The fully qualified URL (e.g. https://yourtenant.sharepoint.com/sites/mysitecollection) of the site. |
| description | string | no | The description of the communication site. |
| classification | string | no | The Site classification to use. For instance 'Contoso Classified'. See https://www.youtube.com/watch?v=E-8Z2ggHcS0 for more information
| siteDesignId | string | no | The Guid of the site design to be used. 
||||You can use the below default OOTB GUIDs: 
||||Topic: null
||||                               Showcase: 6142d2a0-63a5-4ba0-aede-d9fefca2c767
||||                               Blank: f6cc5403-0d63-442e-96c0-285923709ffc 
||||
| hubSiteId | string | no | The Guid of the already existing Hub site

```TypeScript

import { sp } from "@pnp/sp";

sp.site.createCommunicationSite(
            "Title",
            1033,
            true,
            "https://tenant.sharepoint.com/sites/commSite",
            "Description",
            "HBI",
            "f6cc5403-0d63-442e-96c0-285923709ffc",
            "a00ec589-ea9f-4dba-a34e-67e78d41e509").then(d => {
                console.log(d);
            });

```

## Create a modern team site

Added in _1.2.6_

**Note:** Works only in SharePoint online. It wont work with App only tokens

Creates a modern team site backed by O365 group.

| Property | Type | Required | Description |
| ---- | ---- | ---- | ---- |
| displayName | string | yes | The title/displayName of the site to be created. |
| alias | string | yes | Alias of the underlying Office 365 Group. |
| isPublic | boolean | yes | Defines whether the Office 365 Group will be public (default), or private. |
| lcid | number | yes | The language to use for the site. If not specified will default to English (1033). |
| description | string | no | The description of the modern team site. |
| classification | string | no | The Site classification to use. For instance 'Contoso Classified'. See https://www.youtube.com/watch?v=E-8Z2ggHcS0 for more information
| owners | string array (string[]) | no | The Owners of the site to be created
| hubSiteId | string | no | The Guid of the already existing Hub site

```TypeScript

import { sp } from "@pnp/sp";

sp.site.createModernTeamSite(
        "displayName",
        "alias",
        true,
        1033,
        "description",
        "HBI",
        ["user1@tenant.onmicrosoft.com","user2@tenant.onmicrosoft.com","user3@tenant.onmicrosoft.com"],
        "a00ec589-ea9f-4dba-a34e-67e78d41e509")
        .then(d => {
            console.log(d);
        });

```
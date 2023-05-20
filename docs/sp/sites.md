# @pnp/sp/site - Site properties

Site collection are one of the fundamental entry points while working with SharePoint. Sites serve as container for webs, lists, features and other entity types.

## Get context information for the current site collection

Using the library, you can get the context information of the current site collection

```Typescript
import { spfi } from "@pnp/sp";
import "@pnp/sp/sites";
import { IContextInfo } from "@pnp/sp/sites";

const sp = spfi(...);

const oContext: IContextInfo = await sp.site.getContextInfo();
console.log(oContext.FormDigestValue);
```

## Get document libraries of a web

Using the library, you can get a list of the document libraries present in the a given web.

**Note:** Works only in SharePoint online

```Typescript
import { spfi } from "@pnp/sp";
import "@pnp/sp/sites";
import { IDocumentLibraryInformation } from "@pnp/sp/sites";

const sp = spfi(...);

const docLibs: IDocumentLibraryInformation[] = await sp.site.getDocumentLibraries("https://tenant.sharepoint.com/sites/test/subsite");

//we got the array of document library information
docLibs.forEach((docLib: IDocumentLibraryInformation) => {
    // do something with each library
});
```

## Open Web By Id

Because this method is a POST request you can chain off it directly. You will get back the full web properties in the data property of the return object. You can also chain directly off the returned Web instance on the web property.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/sites";

const sp = spfi(...);

const w = await sp.site.openWebById("111ca453-90f5-482e-a381-cee1ff383c9e");

//we got all the data from the web as well
console.log(w.data);

// we can chain
const w2 = await w.web.select("Title")();
```

## Get absolute web url from page url

Using the library, you can get the absolute web url by providing a page url

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/sites";

const sp = spfi(...);

const d: string = await sp.site.getWebUrlFromPageUrl("https://tenant.sharepoint.com/sites/test/Pages/test.aspx");

console.log(d); //https://tenant.sharepoint.com/sites/test
```

## Access the root web

There are two methods to access the root web. The first, using the rootWeb property, is best for directly accessing information about that web. If you want to chain multiple operations off of the web, better to use the getRootWeb method that will ensure the web instance is created using its own Url vs. "_api/sites/rootweb" which does not work for all operations.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/sites";

const sp = spfi(...);

// use for rootweb information access
const rootwebData = await sp.site.rootWeb();

// use for chaining
const rootweb = await sp.site.getRootWeb();
const listData = await rootWeb.lists.getByTitle("MyList")();
```

## Create a modern communication site

**Note:** Works only in SharePoint online

Creates a modern communication site.

| Property | Type | Required | Description |
| ---- | ---- | ---- | ---- |
| Title | string | yes | The title of the site to create. |
| lcid | number | yes | The default language to use for the site. |
| shareByEmailEnabled | boolean | yes | If set to true, it will enable sharing files via Email. By default it is set to false |
| url | string | yes | The fully qualified URL (e.g. `https://yourtenant.sharepoint.com/sites/mysitecollection`) of the site. |
| description | string | no | The description of the communication site. |
| classification | string | no | The Site classification to use. For instance "Contoso Classified". See [https://www.youtube.com/watch?v=E-8Z2ggHcS0](https://www.youtube.com/watch?v=E-8Z2ggHcS0) for more information
| siteDesignId | string | no | The Guid of the site design to be used.
||||You can use the below default OOTB GUIDs:
||||Topic: null
||||                               Showcase: 6142d2a0-63a5-4ba0-aede-d9fefca2c767
||||                               Blank: f6cc5403-0d63-442e-96c0-285923709ffc
| hubSiteId | string | no | The Guid of the already existing Hub site
| Owner| string | no | Required when using app-only context. Owner principal name e.g. user@tenant.onmicrosoft.com
|

```TypeScript

import { spfi } from "@pnp/sp";
import "@pnp/sp/sites";

const sp = spfi(...);

const result = await sp.site.createCommunicationSite(
            "Title",
            1033,
            true,
            "https://tenant.sharepoint.com/sites/commSite",
            "Description",
            "HBI",
            "f6cc5403-0d63-442e-96c0-285923709ffc",
            "a00ec589-ea9f-4dba-a34e-67e78d41e509",
            "user@TENANT.onmicrosoft.com");

```

### Create from Props

You may need to supply additional parameters such as WebTemplate, to do so please use the `createCommunicationSiteFromProps` method.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/sites";

const sp = spfi(...);

// in this case you supply a single struct deinfing the creation props
const result = await sp.site.createCommunicationSiteFromProps({
  Owner: "patrick@three18studios.com",
  Title: "A Test Site",
  Url: "https://{tenant}.sharepoint.com/sites/commsite2",
  WebTemplate: "STS#3",
});
```

## Create a modern team site

**Note:** Works only in SharePoint online. It wont work with App only tokens

Creates a modern team site backed by O365 group.

| Property | Type | Required | Description |
| ---- | ---- | ---- | ---- |
| displayName | string | yes | The title/displayName of the site to be created. |
| alias | string | yes | Alias of the underlying Office 365 Group. |
| isPublic | boolean | yes | Defines whether the Office 365 Group will be public (default), or private. |
| lcid | number | yes | The language to use for the site. If not specified will default to English (1033). |
| description | string | no | The description of the modern team site. |
| classification | string | no | The Site classification to use. For instance "Contoso Classified". See [https://www.youtube.com/watch?v=E-8Z2ggHcS0](https://www.youtube.com/watch?v=E-8Z2ggHcS0) for more information
| owners | string array (string[]) | no | The Owners of the site to be created
|hubSiteId|string| no | The Guid of the already existing Hub site
| siteDesignId | string | no | The Guid of the site design to be used.
||||You can use the below default OOTB GUIDs:
||||Topic: null
||||                               Showcase: 6142d2a0-63a5-4ba0-aede-d9fefca2c767
||||                               Blank: f6cc5403-0d63-442e-96c0-285923709ffc

```TypeScript

import { spfi } from "@pnp/sp";
import "@pnp/sp/sites";

const sp = spfi(...);

const result = await sp.site.createModernTeamSite(
        "displayName",
        "alias",
        true,
        1033,
        "description",
        "HBI",
        ["user1@tenant.onmicrosoft.com","user2@tenant.onmicrosoft.com","user3@tenant.onmicrosoft.com"],
        "a00ec589-ea9f-4dba-a34e-67e78d41e509",
        "f6cc5403-0d63-442e-96c0-285923709ffc"
        );

console.log(d);
```

### Create from Props

You may need to supply additional parameters, to do so please use the `createModernTeamSiteFromProps` method.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/sites";

const sp = spfi(...);

// in this case you supply a single struct deinfing the creation props
const result = await sp.site.createModernTeamSiteFromProps({
  alias: "JenniferGarner",
  displayName: "A Test Site",
  owners: ["patrick@three18studios.com"],
});
```

## Delete a site collection

Using the library, you can delete a specific site collection

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/sites";
import { Site } from "@pnp/sp/sites";

const sp = spfi(...);

// Delete the current site
await sp.site.delete();

// Specify which site to delete
const siteUrl = "https://tenant.sharepoint.com/sites/subsite";
const site2 = Site(siteUrl);
await site2.delete();
```

## Check if a Site Collection Exists

Using the library, you can check if a specific site collection exist or not on your tenant

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/sites";

const sp = spfi(...);

// Specify which site to verify
const siteUrl = "https://tenant.sharepoint.com/sites/subsite";
const exists = await sp.site.exists(siteUrl);
console.log(exists);
```

## Set the site logo

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/sites";
import {ISiteLogoProperties, SiteLogoAspect, SiteLogoType} from "@pnp/sp/sites";

const sp = spfi(...);

//set the web's site logo
const logoProperties: ISiteLogoProperties = {
    relativeLogoUrl: "/sites/mySite/SiteAssets/site_logo.png", 
    aspect: SiteLogoAspect.Rectangular, 
    type: SiteLogoType.WebLogo
};
await sp.site.setSiteLogo(logoProperties);
```

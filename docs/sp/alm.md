# @pnp/sp/appcatalog

The ALM api allows you to manage app installations both in the tenant app catalog and individual site app catalogs. Some of the methods are still in beta and as such may change in the future. This article outlines how to call this api using @pnp/sp. Remember all these actions are bound by permissions so it is likely most users will not have the rights to perform these ALM actions.

## Understanding the App Catalog Hierarchy

Before you begin provisioning applications it is important to understand the relationship between a local web catalog and the tenant app catalog. Some of the methods described below only work within the context of the tenant app catalog web, such as adding an app to the catalog and the app actions retract, remove, and deploy. You can install, uninstall, and upgrade an app in any web. [Read more in the official documentation](https://docs.microsoft.com/en-us/sharepoint/dev/apis/alm-api-for-spfx-add-ins).

## Referencing an App Catalog

There are several ways using @pnp/sp to get a reference to an app catalog. These methods are to provide you the greatest amount of flexibility in gaining access to the app catalog. Ultimately each method produces an AppCatalog instance differentiated only by the web to which it points.

### Get tenant app catalog

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/appcatalog";
import "@pnp/sp/webs";

const sp = spfi(...);

// get the current context web's app catalog
// this will be the site collection app catalog
const availableApps = await sp.tenantAppcatalog();
```

### Get site collection AppCatalog

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/appcatalog";
import "@pnp/sp/webs";

const sp = spfi(...);

// get the current context web's app catalog
const availableApps = await sp.web.appcatalog();
```

### Get site collection AppCatalog by URL

If you know the url of the site collection whose app catalog you want you can use the following code. First you need to use one of the [methods to access a web](https://pnp.github.io/pnpjs/sp/webs/#access-a-web). Once you have the web instance you can call the `.appcatalog` property on that web instance.

> If a given site collection does not have an app catalog trying to access it will throw an error.

```TypeScript
import { spfi } from "@pnp/sp";
import { Web } from '@pnp/sp/webs';

const sp = spfi(...);
const web = Web([sp.web, "https://mytenant.sharepoint.com/sites/mysite"]);
const catalog = await web.appcatalog();
```

The following examples make use of a variable "catalog" which is assumed to represent an AppCatalog instance obtained using one of the above methods, supporting code is omitted for brevity.

## List Available Apps

The AppCatalog is itself a queryable collection so you can query this object directly to get a list of available apps. Also, the odata operators work on the catalog to sort, filter, and select.

```TypeScript
// get available apps
await catalog();

// get available apps selecting two fields
await catalog.select("Title", "Deployed")();
```

## Add an App

This action must be performed in the context of the tenant app catalog

![Batching Not Supported Banner](https://img.shields.io/badge/Batching%20Not%20Supported-important.svg)

```TypeScript
// this represents the file bytes of the app package file
const blob = new Blob();

// there is an optional third argument to control overwriting existing files
const r = await catalog.add("myapp.app", blob);

// this is at its core a file add operation so you have access to the response data as well
// as a File instance representing the created file
console.log(JSON.stringify(r.data, null, 4));

// all file operations are available
const nameData = await r.file.select("Name")();
```

## Get an App

You can get the details of a single app by GUID id. This is also the branch point to perform specific app actions

```TypeScript
const app = await catalog.getAppById("5137dff1-0b79-4ebc-8af4-ca01f7bd393c")();
```

## Perform app actions

Remember: retract, deploy, and remove only work in the context of the tenant app catalog web. All of these methods return void and you can monitor success by wrapping the call in a try/catch block.

```TypeScript
const myAppId = "5137dff1-0b79-4ebc-8af4-ca01f7bd393c";

// deploy
await catalog.getAppById(myAppId).deploy();

// retract
await catalog.getAppById(myAppId).retract();

// install
await catalog.getAppById(myAppId).install();

// uninstall
await catalog.getAppById(myAppId).uninstall();

// upgrade
await catalog.getAppById(myAppId).upgrade();

// remove
await catalog.getAppById(myAppId).remove();

```

## Synchronize a solution/app to the Microsoft Teams App Catalog

By default this REST call requires the SharePoint item id of the app, not the app id. PnPjs will try to fetch the SharePoint item id by default. You can still use this the second parameter __useSharePointItemId__ to pass your own item id in the first parameter __id__.

```TypeScript
// Using the app id
await catalog.syncSolutionToTeams("5137dff1-0b79-4ebc-8af4-ca01f7bd393c");

// Using the SharePoint apps item id
await catalog.syncSolutionToTeams("123", true);
```

## Notes

* The app catalog is just a document library under the hood, so you can also perform non-ALM actions on the library if needed. But you should be aware of possible side-effects to the ALM life-cycle when doing so.

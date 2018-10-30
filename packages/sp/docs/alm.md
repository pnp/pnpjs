# @pnp/sp/appcatalog

The ALM api allows you to manage app installations both in the tenant app catalog and individual site app catalogs. Some of the methods are still in beta and as such may change in the future. This article outlines how to call this api using @pnp/sp. Remember all these actions are bound by permissions so it is likely most users will not have the rights to perform these ALM actions.

### Understanding the App Catalog Heirarchy

Before you begin provisioning applications it is important to understand the relationship between a local web catalog and the tenant app catalog. Some of the methods described below only work within the context of the tenant app catalog web, such as adding an app to the catalog and the app actions retract, remove, and deploy. You can install, uninstall, and upgrade an app in any web. [Read more in the official documentation](https://docs.microsoft.com/en-us/sharepoint/dev/apis/alm-api-for-spfx-add-ins).

## Reference an App Catalog

There are several ways using @pnp/sp to get a reference to an app catalog. These methods are to provide you the greatest amount of flexibility in gaining access to the app catalog. Ultimately each method produces an AppCatalog instance differentiated only by the web to which it points.

```TypeScript
import { sp } from "@pnp/sp";
// get the curren't context web's app catalog
const catalog = sp.web.getAppCatalog();

// you can also chain off the app catalog
pnp.sp.web.getAppCatalog().get().then(console.log);
```

```TypeScript
import { sp } from "@pnp/sp";
// you can get the tenant app catalog (or any app catalog) by passing in a url

// get the tenant app catalog
const tenantCatalog = sp.web.getAppCatalog("https://mytenant.sharepoint.com/sites/appcatalog");

// get a different app catalog
const catalog = sp.web.getAppCatalog("https://mytenant.sharepoint.com/sites/anothersite");
```

```TypeScript
// alternatively you can create a new app catalog instance directly by importing the AppCatalog class
import { AppCatalog } from "@pnp/sp";

const catalog = new AppCatalog("https://mytenant.sharepoint.com/sites/dev");
```

```TypeScript
// and finally you can combine use of the Web and AppCatalog classes to create an AppCatalog instance from an existing Web
import { Web, AppCatalog } from "@pnp/sp";

const web = new Web("https://mytenant.sharepoint.com/sites/dev");
const catalog = new AppCatalog(web);
```

The following examples make use of a variable "catalog" which is assumed to represent an AppCatalog instance obtained using one of the above methods, supporting code is omitted for brevity.

## List Available Apps

The AppCatalog is itself a queryable collection so you can query this object directly to get a list of available apps. Also, the odata operators work on the catalog to sort, filter, and select.

```TypeScript
// get available apps
catalog.get().then(console.log);

// get available apps selecting two fields
catalog.select("Title", "Deployed").get().then(console.log);
```

## Add an App

This action must be performed in the context of the tenant app catalog

```TypeScript
// this represents the file bytes of the app package file
const blob = new Blob();

// there is an optional third argument to control overwriting existing files
catalog.add("myapp.app", blob).then(r => {

    // this is at its core a file add operation so you have access to the response data as well
    // as a File isntance representing the created file

    console.log(JSON.stringify(r.data, null, 4));

    // all file operations are available
    r.file.select("Name").get().then(console.log);
});
```

## Get an App

You can get the details of a single app by GUID id. This is also the branch point to perform specific app actions

```TypeScript
catalog.getAppById("5137dff1-0b79-4ebc-8af4-ca01f7bd393c").get().then(console.log);
```

## Perform app actions

Remember: retract, deploy, and remove only work in the context of the tenant app catalog web. All of these methods return void and you can monitor success using then and catch.

```TypeScript

// deploy
catalog.getAppById("5137dff1-0b79-4ebc-8af4-ca01f7bd393c").deploy().then(console.log).catch(console.error);

// retract
catalog.getAppById("5137dff1-0b79-4ebc-8af4-ca01f7bd393c").retract().then(console.log).catch(console.error);

// install
catalog.getAppById("5137dff1-0b79-4ebc-8af4-ca01f7bd393c").install().then(console.log).catch(console.error);

// uninstall
catalog.getAppById("5137dff1-0b79-4ebc-8af4-ca01f7bd393c").uninstall().then(console.log).catch(console.error);

// upgrade
catalog.getAppById("5137dff1-0b79-4ebc-8af4-ca01f7bd393c").upgrade().then(console.log).catch(console.error);

// remove
catalog.getAppById("5137dff1-0b79-4ebc-8af4-ca01f7bd393c").remove().then(console.log).catch(console.error);

```


## Notes

* The app catalog is just a document library under the hood, so you can also perform non-ALM actions on the library if needed. But you should be aware of possible side-effects to the ALM life-cycle when doing so.

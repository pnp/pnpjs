# sp-admin

The `@pnp/sp-admin` library enables you to call the static SharePoint admin API's:

- `_api/Microsoft.Online.SharePoint.TenantManagement.Office365Tenant`
- `_api/Microsoft.Online.SharePoint.TenantAdministration.SiteProperties`
- `_api/Microsoft.Online.SharePoint.TenantAdministration.Tenant`

These APIs typically require an elevated level of permissions and should not be relied upon in general user facing solutions. Before using this library please understand the impact of what you are doing as you are updating settings at the tenant level for all users. 

!!! warning
    These APIs are officially not documented which means there is no SLA provided by Microsoft. Furthermore, they can be updated without notification.

## Use

To use the library you first install the package:

```CMD
npm install @pnp/sp-admin --save
```

Then import the package into your solution, it will attach a node to the sp fluent interface using selective imports.

```TS
import "@pnp/sp-admin";
```

## Basic Example

In this example we get all of the web templates' information.

```TS
import { spfi } from "@pnp/sp";
import "@pnp/sp-admin";

const sp = spfi(...);

// note the "admin" node now available
const templates = await sp.admin.tenant.getSPOTenantAllWebTemplates();
```

## tenant

The `tenant` node represents calls to the `_api/Microsoft.Online.SharePoint.TenantAdministration.Tenant` api.

> When calling the `tenant` endpoint you must target the -admin site as shown here. If you do not you will get only errors.

```TS
import { spfi } from "@pnp/sp";
import "@pnp/sp-admin";

const sp = spfi("https://{tenant}-admin.sharepoint.com");

// The MSAL scope will be: "https://{tenant}-admin.sharepoint.com/.default"

// default props
const defaultProps = await sp.admin.tenant();

// all props
const allProps = await sp.admin.tenant.select("*")();

// select specific props
const selectedProps = await sp.admin.tenant.select("AllowEditing", "DefaultContentCenterSite")();

// call method
const templates = await sp.admin.tenant.getSPOTenantAllWebTemplates();
```

## office365Tenant

The `office365Tenant` node represents calls to the `_api/Microsoft.Online.SharePoint.TenantManagement.Office365Tenant` end point and is accessible from any site url.

```TS
import { spfi } from "@pnp/sp";
import "@pnp/sp-admin";

const sp = spfi(...);

// default props
const defaultProps = await sp.admin.office365Tenant();

// all props
const allProps = await sp.admin.office365Tenant.select("*")();

// selected props
const selectedProps = await sp.admin.office365Tenant.select("AllowEditing", "DefaultContentCenterSite")();

// call method
const externalUsers = await sp.admin.office365Tenant.getExternalUsers();
```

## siteProperties

The `siteProperties` node is primarily for accessing detailed properties about a site and tenant.

```TS
import { spfi } from "@pnp/sp";
import "@pnp/sp-admin";

const sp = spfi(...);

// default props
const defaultProps = await sp.admin.siteProperties();

// all props
const allProps = await sp.admin.siteProperties.select("*")();

// selected props
const selectedProps = await sp.admin.siteProperties.select("LockState")();

// call method
await sp.admin.siteProperties.clearSharingLockDown("https://tenant.sharepoint.com/sites/site1");
```

> For more information on the methods available and how to use them, please review the code comments in the source.

## call

All those nodes support a `call` method to easily allow calling methods not explictly added to the library. If there is a method you use often that would be a good candidate to add, please open an issue or submit a PR. The call method is meant to help unblock folks before methods are added.

This sample shows using call to invoke the "AddTenantCdnOrigin" method of office365Tenant. While we already support for this method, it helps to show the relationship between `call` and an existing method.

```TS
import { spfi } from "@pnp/sp";
import { SPOTenantCdnType } from '@pnp/sp-admin';

const sp = spfi(...);

// call AddTenantCdnOrigin
await sp.admin.office365Tenant.call<void>("AddTenantCdnOrigin", {
    "cdnType": SPOTenantCdnType.Public,
    "originUrl": "*/clientsideassets"
});

const spTenant = spfi("https://{tenant}-admin.sharepoint.com");

// call GetSiteSubscriptionId which takes no args
const id = await spTenant.admin.tenant.call<string>("GetSiteSubscriptionId");
```

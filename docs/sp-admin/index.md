# sp-admin

The `@pnp/sp-admin` library enables you to call the static SharePoint admin API's located at `_api/Microsoft.Online.SharePoint.TenantManagement.Office365Tenant`, `_api/Microsoft.Online.SharePoint.TenantAdministration.SiteProperties`, and `_api/Microsoft.Online.SharePoint.TenantAdministration.Tenant`. These APIs typically require an elevated level of permissions and should not be relied upon in general user facing solutions. Before using this library please understand the impact of what you are doing as you are updating settings at the tenant level for all users.

## Use

To use the library you first need to install the package:

```CMD
npm install @pnp/sp-admin --save
```

Then import the package into your solution, it will attach a node to the existing sp fluent interface.

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
const templates = await spTenant.admin.tenant.getSPOTenantAllWebTemplates();
```

## tenant

The `tenant` node represents calls to the `_api/Microsoft.Online.SharePoint.TenantAdministration.Tenant` api.

When calling the `tenant` endpoint you must target the -admin site as shown here. If you do not you will get only errors back.

```TS
import { spfi } from "@pnp/sp";
import "@pnp/sp-admin";

const sp = spfi("https://{tenant}-admin.sharepoint.com");

// The MSAL scope will be: "https://{tenant}-admin.sharepoint.com/.default"

// get props
const allProps = await spTenant.admin.tenant();

// select specific props to return
const selectedProps = await spTenant.admin.tenant.select("AllowEditing", "DefaultContentCenterSite")();

// call a method
const templates = await spTenant.admin.tenant.getSPOTenantAllWebTemplates();
```

## office365Tenant

The `office365Tenant` node represents calls to the `_api/Microsoft.Online.SharePoint.TenantManagement.Office365Tenant` end point and is accessible from any site url.

```TS
import { spfi } from "@pnp/sp";
import "@pnp/sp-admin";

const sp = spfi(...);

const allProps = await spTenant.admin.office365Tenant();
```



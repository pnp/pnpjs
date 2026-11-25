# sp-admin

The `@pnp/sp-admin` library enables you to call the static SharePoint admin API's:

- `_api/Microsoft.Online.SharePoint.TenantManagement.Office365Tenant`
- `_api/Microsoft.Online.SharePoint.TenantAdministration.SiteProperties`
- `_api/Microsoft.Online.SharePoint.TenantAdministration.Tenant`
- `_api/SiteRenameJobs`

These APIs typically require an elevated level of permissions and should not be relied upon in general user facing solutions. Before using this library please understand the impact of what you are doing as you are updating settings at the tenant level for all users. Also keep in mind these endpoints do not support application permissions, therefore you will need to get a user token for delegated access, ergo they cannot be used unattended.

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

const spAdmin = spfi("https://{tenant}-admin.sharepoint.com");

// The MSAL scope will be: "https://{tenant}-admin.sharepoint.com/.default"

// default props
const defaultProps = await spAdmin.admin.tenant();

// all props
const allProps = await spAdmin.admin.tenant.select("*")();

// select specific props
const selectedProps = await spAdmin.admin.tenant.select("AllowEditing", "DefaultContentCenterSite")();

// call method
const templates = await spAdmin.admin.tenant.getSPOTenantAllWebTemplates();

// get site properties by url
const props = await spAdmin.admin.tenant.getSitePropertiesByUrl("https://contoso.sharepoint.com/sites/dev", true);

// set site properties by id -- GUID of SharePoint site (not root web)
await spAdmin.admin.tenant.setSitePropertiesById("{siteId}", {LockedState: "ReadOnly"});
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

## siteRenameJobs

The `siteRenameJobs` node represents calls to the `_api/SiteRenameJobs` api, used to change the address of a site.

> When calling the `siteRenameJobs` endpoint you must target the -admin site.

!!! warning
    Adding a job renames a real site. The site is read-only while the job runs.

```TS
import { spfi } from "@pnp/sp";
import "@pnp/sp-admin";
import { SiteRenameOptions } from "@pnp/sp-admin";

const spAdmin = spfi("https://{tenant}-admin.sharepoint.com");

const sourceUrl = "https://{tenant}.sharepoint.com/sites/old";

// queue a rename job
const job = await spAdmin.admin.siteRenameJobs.add({
    SourceSiteUrl: sourceUrl,
    TargetSiteUrl: "https://{tenant}.sharepoint.com/sites/new",
    // optional
    TargetSiteTitle: "New Title",
    Option: SiteRenameOptions.SuppressMarketplaceAppCheck,
});

// get the rename jobs for a site, using the source url
const jobs = await spAdmin.admin.siteRenameJobs.getJobsBySiteUrl(sourceUrl);
```

### Option

Use `Option` to change how the rename job runs. These values come from Microsoft's PowerShell cmdlet and haven't been tested through this library. If one of them doesn't work, please open an issue.

| Value | Number | Effect |
| --- | --- | --- |
| `None` | 0 | The default |
| `ValidationOnly` | 2 | Validate only |
| `SuppressMarketplaceAppCheck` | 8 | Skip the marketplace app check |
| `SuppressWorkflow2013Check` | 16 | Skip the 2013 workflow check |
| `SuppressBcsCheck` | 128 | Skip the BCS check |
| `SuppressAllWarnings` | -2147483648 | Suppress all warnings |

!!! warning
    Confirm `ValidationOnly` on a test site before relying on it to leave a site unchanged.

```TS
import { spfi } from "@pnp/sp";
import "@pnp/sp-admin";
import { SiteRenameOptions } from "@pnp/sp-admin";

const spAdmin = spfi("https://{tenant}-admin.sharepoint.com");

await spAdmin.admin.siteRenameJobs.add({
    SourceSiteUrl: "https://{tenant}.sharepoint.com/sites/old",
    TargetSiteUrl: "https://{tenant}.sharepoint.com/sites/new",
    // combine values with a bitwise OR
    Option: SiteRenameOptions.SuppressMarketplaceAppCheck | SiteRenameOptions.SuppressWorkflow2013Check,
});
```

### SkipGestures

Use `SkipGestures` to skip steps SharePoint otherwise runs as part of a rename. Only `Redirect` has been confirmed to work. The other values are untested, and the descriptions below are presumed from their names. If one of them doesn't work, please open an issue.

| Value | Skips | Confirmed |
| --- | --- | --- |
| `Redirect` | Creating the redirect at the old url | Yes |
| `MRU` | Updating "most recently used" file links to the new url | No |
| `Flow` | Updating Power Automate flows that point at the site | No |
| `PowerApps` | Notifying Power Apps of the new url | No |
| `PWA` | Project Web App handling | No |
| `Scheduling` | Unknown | No |

!!! warning
    Without a redirect, anything still pointing at the old url will break.

```TS
import { spfi } from "@pnp/sp";
import "@pnp/sp-admin";
import { SiteRenameSkipGestures } from "@pnp/sp-admin";

const spAdmin = spfi("https://{tenant}-admin.sharepoint.com");

await spAdmin.admin.siteRenameJobs.add({
    SourceSiteUrl: "https://{tenant}.sharepoint.com/sites/old",
    TargetSiteUrl: "https://{tenant}.sharepoint.com/sites/new",
    SkipGestures: [SiteRenameSkipGestures.Redirect],
});
```

You can supply more than one value, they are sent to the service as a comma separated string. Sending multiple values is also unconfirmed.

## call

All those nodes support a `call` method to easily allow calling methods not explicitly added to the library. If there is a method you use often that would be a good candidate to add, please open an issue or submit a PR. The call method is meant to help unblock folks before methods are added.

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

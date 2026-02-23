# @pnp/sp/site-designs

You can create site designs to provide reusable lists, themes, layouts, pages, or custom actions so that your users can quickly build new SharePoint sites with the features they need.
Check out [SharePoint site design and site script overview](https://docs.microsoft.com/en-us/sharepoint/dev/declarative-customization/site-design-overview) for more information.

## Site Designs

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)

## Create a new site design

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/site-designs";

const sp = spfi(...);

// WebTemplate: 64 Team site template, 68 Communication site template
const siteDesign = await sp.siteDesigns.createSiteDesign({
    SiteScriptIds: ["884ed56b-1aab-4653-95cf-4be0bfa5ef0a"],
    Title: "SiteDesign001",
    WebTemplate: "64",
});

console.log(siteDesign.Title);
```

## Applying a site design to a site

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/site-designs";

const sp = spfi(...);

// Limited to 30 actions in a site script, but runs synchronously
await sp.siteDesigns.applySiteDesign("75b9d8fe-4381-45d9-88c6-b03f483ae6a8","https://contoso.sharepoint.com/sites/teamsite-pnpjs001");

// Better use the following method for 300 actions in a site script
const task = await sp.web.addSiteDesignTask("75b9d8fe-4381-45d9-88c6-b03f483ae6a8");
```

## Retrieval

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/site-designs";

const sp = spfi(...);

// Retrieving all site designs
const allSiteDesigns = await sp.siteDesigns.getSiteDesigns();
console.log(`Total site designs: ${allSiteDesigns.length}`);

// Retrieving a single site design by Id
const siteDesign = await sp.siteDesigns.getSiteDesignMetadata("75b9d8fe-4381-45d9-88c6-b03f483ae6a8");
console.log(siteDesign.Title);
```

## Update and delete

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/site-designs";

const sp = spfi(...);

// Update
const updatedSiteDesign = await sp.siteDesigns.updateSiteDesign({ Id: "75b9d8fe-4381-45d9-88c6-b03f483ae6a8", Title: "SiteDesignUpdatedTitle001" });

// Delete
await sp.siteDesigns.deleteSiteDesign("75b9d8fe-4381-45d9-88c6-b03f483ae6a8");
```

## Setting Rights/Permissions

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/site-designs";

const sp = spfi(...);

// Get
const rights = await sp.siteDesigns.getSiteDesignRights("75b9d8fe-4381-45d9-88c6-b03f483ae6a8");
console.log(rights.length > 0 ? rights[0].PrincipalName : "");

// Grant
await sp.siteDesigns.grantSiteDesignRights("75b9d8fe-4381-45d9-88c6-b03f483ae6a8", ["user@contoso.onmicrosoft.com"]);

// Revoke
await sp.siteDesigns.revokeSiteDesignRights("75b9d8fe-4381-45d9-88c6-b03f483ae6a8", ["user@contoso.onmicrosoft.com"]);

// Reset all view rights
const rights = await sp.siteDesigns.getSiteDesignRights("75b9d8fe-4381-45d9-88c6-b03f483ae6a8");
await sp.siteDesigns.revokeSiteDesignRights("75b9d8fe-4381-45d9-88c6-b03f483ae6a8", rights.map(u => u.PrincipalName));
```

## Get a history of site designs that have run on a web

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/site-designs";

const sp = spfi(...);

const runs = await sp.web.getSiteDesignRuns();
const runs2 = await sp.siteDesigns.getSiteDesignRun("https://TENANT.sharepoint.com/sites/mysite");

// Get runs specific to a site design
const runs3 = await sp.web.getSiteDesignRuns("75b9d8fe-4381-45d9-88c6-b03f483ae6a8");
const runs4 = await sp.siteDesigns.getSiteDesignRun("https://TENANT.sharepoint.com/sites/mysite", "75b9d8fe-4381-45d9-88c6-b03f483ae6a8");

// For more information about the site script actions
const runStatus = await sp.web.getSiteDesignRunStatus(runs[0].ID);
const runStatus2 = await sp.siteDesigns.getSiteDesignRunStatus("https://TENANT.sharepoint.com/sites/mysite", runs[0].ID);

```

# @pnp/sp/sitedesigns

You can create site designs to provide reusable lists, themes, layouts, pages, or custom actions so that your users can quickly build new SharePoint sites with the features they need.
Check out [SharePoint site design and site script overview](https://docs.microsoft.com/en-us/sharepoint/dev/declarative-customization/site-design-overview) for more information.

# Site Designs

## Create a new site design
```TypeScript
import { sp } from "@pnp/sp";

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
import { sp } from "@pnp/sp";

// Limited to 30 actions in a site script, but runs synchronously
await sp.siteDesigns.applySiteDesign("75b9d8fe-4381-45d9-88c6-b03f483ae6a8","https://contoso.sharepoint.com/sites/teamsite-pnpjs001");

// Better use the following method for 300 actions in a site script
const task = await sp.web.addSiteDesignTask("75b9d8fe-4381-45d9-88c6-b03f483ae6a8");
```

## Retrieval
```TypeScript
import { sp } from "@pnp/sp";

// Retrieving all site designs
const allSiteDesigns = await sp.siteDesigns.getSiteDesigns();
console.log(`Total site designs: ${allSiteDesigns.length}`);

// Retrieving a single site design by Id
const siteDesign = await sp.siteDesigns.getSiteDesignMetadata("75b9d8fe-4381-45d9-88c6-b03f483ae6a8");
console.log(siteDesign.Title);
```

## Update and delete
```TypeScript
import { sp } from "@pnp/sp";

// Update
const updatedSiteDesign = await sp.siteDesigns.updateSiteDesign({ Id: "75b9d8fe-4381-45d9-88c6-b03f483ae6a8", Title: "SiteDesignUpdatedTitle001" });

// Delete
await sp.siteDesigns.deleteSiteDesign("75b9d8fe-4381-45d9-88c6-b03f483ae6a8");
```

## Setting Rights/Permissions
```TypeScript
import { sp } from "@pnp/sp";

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
import { sp } from "@pnp/sp";

const runs = await sp.web.getSiteDesignRuns();
const runs2 = await sp.siteDesigns.getSiteDesignRun("https://TENANT.sharepoint.com/sites/mysite");

// Get runs specific to a site design
const runs3 = await sp.web.getSiteDesignRuns("75b9d8fe-4381-45d9-88c6-b03f483ae6a8");
const runs4 = await sp.siteDesigns.getSiteDesignRun("https://TENANT.sharepoint.com/sites/mysite", "75b9d8fe-4381-45d9-88c6-b03f483ae6a8");

// For more information about the site script actions
const runStatus = await sp.web.getSiteDesignRunStatus(runs[0].ID);
const runStatus2 = await sp.siteDesigns.getSiteDesignRunStatus("https://TENANT.sharepoint.com/sites/mysite", runs[0].ID);

```

# Site Scripts

## Create a new site script
```TypeScript
import { sp } from "@pnp/sp";

const sitescriptContent = {
    "$schema": "schema.json",
    "actions": [
        {
            "themeName": "Theme Name 123",
            "verb": "applyTheme",
        },
    ],
    "bindata": {},
    "version": 1,
};

const siteScript = await sp.siteScripts.createSiteScript("Title", "description", sitescriptContent);
    
console.log(siteScript.Title);
```

## Retrieval
```TypeScript
import { sp } from "@pnp/sp";

// Retrieving all site scripts
const allSiteScripts = await sp.siteScripts.getSiteScripts();
console.log(allSiteScripts.length > 0 ? allSiteScripts[0].Title : "");

// Retrieving a single site script by Id
const siteScript = await sp.siteScripts.getSiteScriptMetadata("884ed56b-1aab-4653-95cf-4be0bfa5ef0a");
console.log(siteScript.Title);
```

## Update and delete
```TypeScript
import { sp } from "@pnp/sp";

// Update
const updatedSiteScript = await sp.siteScripts.updateSiteScript({ Id: "884ed56b-1aab-4653-95cf-4be0bfa5ef0a", Title: "New Title" });
console.log(updatedSiteScript.Title);

// Delete
await sp.siteScripts.deleteSiteScript("884ed56b-1aab-4653-95cf-4be0bfa5ef0a");
```

## Get site script from a list
```TypeScript
import { sp } from "@pnp/sp";

// Using the absolute URL of the list
const ss = await sp.siteScripts.getSiteScriptFromList("https://TENANT.sharepoint.com/Lists/mylist");

// Using the PnPjs web object to fetch the site script from a specific list
const ss2 = await sp.web.lists.getByTitle("mylist").getSiteScript();
```

## Get site script from a web
```TypeScript
import { sp } from "@pnp/sp";

const extractInfo = {
    IncludeBranding: true,
    IncludeLinksToExportedItems: true,
    IncludeRegionalSettings: true,
    IncludeSiteExternalSharingCapability: true,
    IncludeTheme: true,
    IncludedLists: ["Lists/MyList"]
};

const ss = await sp.siteScripts.getSiteScriptFromWeb("https://TENANT.sharepoint.com/sites/mysite", extractInfo);

// Using the PnPjs web object to fetch the site script from a specific web
const ss2 = await sp.web.getSiteScript(extractInfo);
```


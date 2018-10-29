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

await sp.siteDesigns.applySiteDesign("75b9d8fe-4381-45d9-88c6-b03f483ae6a8","https://contoso.sharepoint.com/sites/teamsite-pnpjs001");
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
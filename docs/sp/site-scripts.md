# @pnp/sp/site-scripts

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)

## Create a new site script

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/site-scripts";

const sp = spfi(...);

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
import { spfi } from "@pnp/sp";
import "@pnp/sp/site-scripts";

const sp = spfi(...);

// Retrieving all site scripts
const allSiteScripts = await sp.siteScripts.getSiteScripts();
console.log(allSiteScripts.length > 0 ? allSiteScripts[0].Title : "");

// Retrieving a single site script by Id
const siteScript = await sp.siteScripts.getSiteScriptMetadata("884ed56b-1aab-4653-95cf-4be0bfa5ef0a");
console.log(siteScript.Title);
```

## Update and delete

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/site-scripts";

const sp = spfi(...);

// Update
const updatedSiteScript = await sp.siteScripts.updateSiteScript({ Id: "884ed56b-1aab-4653-95cf-4be0bfa5ef0a", Title: "New Title" });
console.log(updatedSiteScript.Title);

// Delete
await sp.siteScripts.deleteSiteScript("884ed56b-1aab-4653-95cf-4be0bfa5ef0a");
```

## Get site script from a list

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/site-scripts";

const sp = spfi(...);

// Using the absolute URL of the list
const ss = await sp.siteScripts.getSiteScriptFromList("https://TENANT.sharepoint.com/Lists/mylist");

// Using the PnPjs web object to fetch the site script from a specific list
const ss2 = await sp.web.lists.getByTitle("mylist").getSiteScript();
```

## Get site script from a web

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/site-scripts";

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

## Execute Site Script Action

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/site-scripts";

const sp = spfi(...);

const siteScript = "your site script action...";

const ss = await sp.siteScripts.executeSiteScriptAction(siteScript);
```

### Execute site script for a specific web

```TypeScript
import { spfi } from "@pnp/sp";
import { SiteScripts } "@pnp/sp/site-scripts";

const siteScript = "your site script action...";

const scriptService = SiteScripts("https://absolute/url/to/web");

const ss = await scriptService.executeSiteScriptAction(siteScript);
```

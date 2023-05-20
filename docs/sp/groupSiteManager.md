
## @pnp/sp/groupsitemanager

The `@pnp/sp/groupsitemanager` package represents calls to `_api/groupsitemanager` endpoint and is accessible from any site url.

```TS
import { spfi } from "@pnp/sp";
import "@pnp/sp/groupsitemanager";

const sp = spfi(...);

// call method to check if the current user can create Microsoft 365 groups
const isUserAllowed = await sp.groupSiteManager.canUserCreateGroup();

// call method to delete a group-connected site
await sp.groupSiteManager.delete("https://contoso.sharepoint.com/sites/hrteam");

//call method to gets labels configured for the tenant
const orgLabels = await sp.groupSiteManager.getAllOrgLabels(0);

//call method to get information regarding site groupification configuration for the current site context
const groupCreationContext = await sp.groupSiteManager.getGroupCreationContext();

//call method to get information regarding site groupification configuration for the current site context
const siteData = await sp.groupSiteManager.getGroupSiteConversionData();

// call method to get teams membership for a user
const userTeams = await sp.groupSiteManager.getUserTeamConnectedMemberGroups("meganb@contoso.onmicrosoft.com");

// call method to get shared channel memberhsip for user
const sharedChannels = await sp.groupSiteManager.getUserSharedChannelMemberGroups("meganb@contoso.onmicrosoft.com");

//call method to get valid site url from Alias
const siteUrl = await sp.groupSiteManager.getValidSiteUrlFromAlias("contoso");

//call method to check if teamify prompt is hidden
const isTeamifyPromptHidden = await sp.groupSiteManager.isTeamifyPromptHidden("https://contoso.sharepoint.com/sites/hrteam");
```

> For more information on the methods available and how to use them, please review the code comments in the source.

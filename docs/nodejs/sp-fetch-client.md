# @pnp/nodejs/spfetchclient

The SPFetchClient is used to authentication to SharePoint as a provider hosted add-in using a client and secret in nodejs. Remember it is not a good practice to expose client ids and secrets on the client and use of this class is intended for nodejs exclusively.

See: [How to register a legacy SharePoint application](../authentication/sp-app-registration.md)

```TypeScript
import { SPFetchClient } from "@pnp/nodejs";
import { sp } from "@pnp/sp/presets/all";

sp.setup({
    sp: {
        fetchClientFactory: () => {
            return new SPFetchClient("{site url}", "{client id}", "{client secret}");
        },
    },
});

// execute a library request as normal
const w = await sp.web.get();

console.log(JSON.stringify(w, null, 4));
```

## Set Authentication Environment

For some areas such as Germany, China, and US Gov clouds you need to specify a different authentication url to the service. This is done by specifying the correct SPOAuthEnv enumeration to the SPFetchClient constructor. The options are listed below. If you are not sure which option to specify the default is likely OK.

- SPO : (default) for all *.sharepoint.com urls
- China: for China hosted cloud
- Germany: for Germany local cloud
- USDef: USA Defense cloud
- USGov: USA Government cloud

```TypeScript
import { sp } from "@pnp/sp/presets/all";
import { SPFetchClient, SPOAuthEnv } from "@pnp/nodejs";

sp.setup({
    sp: {
        fetchClientFactory: () => {
            return new SPFetchClient("{site url}", "{client id}", "{client secret}", SPOAuthEnv.China);
        },
    },
});
```

## Set Realm

In some cases automatically resolving the realm may not work. In this case you can set the realm parameter in the SPFetchClient constructor. You can determine the correct value for the realm by navigating to `https://{site name}-admin.sharepoint.com/_layouts/15/TA_AllAppPrincipals.aspx` and copying the GUID value that appears after the "@" - this is the realm id.

```TypeScript
import { sp } from "@pnp/sp/presets/all";
import { SPFetchClient, SPOAuthEnv } from "@pnp/nodejs";

sp.setup({
    sp: {
        fetchClientFactory: () => {
            return new SPFetchClient("{site url}", "{client id}", "{client secret}", SPOAuthEnv.SPO, "{realm}");
        },
    },
});
```

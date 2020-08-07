# msaljsclient - MSAL Client for PnPjs

The MSAL client is a thin wrapper around the [MSAL library](https://github.com/AzureAD/microsoft-authentication-library-for-js) adapting it for use with PnPjs's request pipeline.

## Install

You need to install the MSAL client before using it. This is in addition to installing the other PnPjs libraries you require.

`npm install @pnp/msaljsclient --save`

## Configure

The PnP client is a very thin wrapper around the MSAL library and you can supply any of the arguments supported. These are described in the [MSAL docs](https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-core/modules/_configuration_.html).

The basic configuration values you need (at least from our testing) are client id, authority, and redirectUri. The other options are settable but not required. This article is not intended to be an exhaustive discussion of all the MSAL configuration possibilities, please see the official docs to understand all of the available options.

The second parameter when configuring the PnP client is the list of scope you are seeking to use. These must be configured and properly granted within AAD and you can request one or more scopes as needed for the current scenario.

## Use in SPFx

### Calling SharePoint via MSAL

> When calling the SharePoint REST API we must use only a special scope "https://{tenant}.sharepoint.com/.default"

```TypeScript
import { MsalClientSetup  } from "@pnp/msaljsclient";
import { sp } from "@pnp/sp/presets/all";

sp.setup({
    sp: {
        fetchClientFactory: MsalClientSetup({
            auth: {
                authority: "https://login.microsoftonline.com/mytentant.onmicrosoft.com",
                clientId: "00000000-0000-0000-0000-000000000000",
                redirectUri: "https://mytentant.sharepoint.com/sites/dev/SitePages/test.aspx",
            },
        }, ["https://mytentant.sharepoint.com/.default"]),
    },
});

const r = await sp.web();
```

### Calling Graph via MSAL

> When calling the graph API you must specify the scopes you need and ensure they are configured in AAD

```TypeScript
import { MsalClientSetup } from "@pnp/msaljsclient";
import { graph } from "@pnp/graph/presets/all";

graph.setup({
    graph: {
        fetchClientFactory: MsalClientSetup({
            auth: {
                authority: "https://login.microsoftonline.com/tenant.onmicrosoft.com",
                clientId: "00000000-0000-0000-0000-000000000000",
                redirectUri: "https://tenant.sharepoint.com/sites/dev/SitePages/test.aspx",
            },
        }, ["Group.Read.All"]),
    },
});

const r = await graph.groups();
```

## Use in Single Page Applications

You can also use the PnPjs MSAL client within your SPA applications. Please [review the various settings](https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-core/modules/_configuration_.html) to ensure you are configuring MSAL as needed for your application

```TypeScript
import { MsalClientSetup } from "@pnp/msaljsclient";
import { graph } from "@pnp/graph/presets/all";

graph.setup({
    graph: {
        fetchClientFactory: MsalClientSetup({
            auth: {
                authority: "https://login.microsoftonline.com/tenant.onmicrosoft.com",
                clientId: "00000000-0000-0000-0000-000000000000",
                redirectUri: "https://myapp.com/login.aspx",
            },
        }, ["Group.Read.All"]),
    },
});

const r = await graph.groups();
```

## Get a Token

You can also use the client to get a token if you need a token for use outside the PnPjs libraries

```TypeScript
import { MsalClient } from "@pnp/msaljsclient";

// note we do not provide scopes here as the second parameter. We certainly could and will get a token
// based on those scopes by making a call to getToken() without a param.
const client = new MsalClient({
    auth: {
        authority: "https://login.microsoftonline.com/{tenant}.onmicrosoft.com",
        clientId: "00000000-0000-0000-0000-000000000000",
        redirectUri: "https://{tenant}.sharepoint.com/sites/dev/SitePages/webpacktest.aspx",
    },
});

const token = await client.getToken(["Group.Read.All"]);

const token2 = await client.getToken(["Files.Read"]);
```



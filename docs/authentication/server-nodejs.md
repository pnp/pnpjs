# Authentication in Nodejs

## SharePoint App Registration

Within the PnPjs testing framework we make use of SharePoint App Registration. This uses the `SPFetchClient` client from the nodejs package. This client works based on the [original SharePoint App Registration model](https://docs.microsoft.com/en-us/sharepoint/dev/solution-guidance/security-apponly-azureacs) making use of a client and secret granted permissions through AppInv.aspx. This method works and at the time of writing has no published end date.

See: [details on how to register a legacy SharePoint application](./sp-app-registration.md).

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
```


## MSAL

We do not currently have support for MSAL in node. At the time of writing this article the [@Azure/msal-node](https://www.npmjs.com/package/@azure/msal-node) package is in alpha and we have chosen to wait until it is more stable before taking that dependecy.


## ADAL

The AdalFetchClient class depends on the [adal-node](https://www.npmjs.com/package/adal-node) package to authenticate against Azure AD. The example below
outlines usage with the @pnp/graph library, though it would work in any case where an Azure AD Bearer token is expected.

See: [More details on the node client](../nodejs/adal-fetch-client.md)

```TypeScript
import { AdalFetchClient } from "@pnp/nodejs";
import { graph } from "@pnp/graph/presets/all";

// setup the client using graph setup function
graph.setup({
    graph: {
        fetchClientFactory: () => {
            return new AdalFetchClient("{tenant}", "{app id}", "{app secret}");
        },
    },
});

// execute a library request as normal
const g = await graph.groups.get();

console.log(JSON.stringify(g, null, 4));
```

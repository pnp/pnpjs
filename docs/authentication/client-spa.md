# Authentication in Single Page Application

If you are writing a single page application deployed outside SharePoint it is recommended to use the MSAL client. You can find further details on the settings in the [MSAL docs](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-overview). You will need to ensure that you grant the permissions required to the application you are trying to use.

```TypeScript
import { MsalClientSetup  } from "@pnp/msaljsclient";
import { graph } from "@pnp/graph/presets/all";

graph.setup({
    graph: {
        fetchClientFactory: MsalClientSetup({
            auth: {
                authority: "https://login.microsoftonline.com/common",
                clientId: "00000000-0000-0000-0000-000000000000",
                redirectUri: "{your redirect uri}",
            },
            cache: {
                cacheLocation: "sessionStorage",
            },
        }, ["email", "Files.Read.All", "User.Read.All"]),
    },
});

const data = await graph.me();
```

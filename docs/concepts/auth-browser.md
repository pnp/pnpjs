# Authentication in a custom browser based application

We support MSAL for both browser and nodejs by providing a thin wrapper around the official libraries. We won't document the fully possible MSAL configuration, but any parameters supplied are passed through to the underlying implementation. To use the browser MSAL package you'll need to install the @pnp/msaljsclient package which is deployed as a standalone due to the large MSAL dependency.

`npm install @pnp/msaljsclient --save`

At this time we're using version 1.x of the `msal` library which uses Implicit Flow. For more informaiton on the msal library please see the [AzureAD/microsoft-authentication-library-for-js](https://github.com/AzureAD/microsoft-authentication-library-for-js#readme).

Each of the following samples reference a MSAL configuration that utilizes an Azure AD App Registration, these are samples that show the typings for those objects:

```TypeScript
import { Configuration, AuthenticationParameters } from "msal";

const configuration: Configuration = {
  auth: {
    authority: "https://login.microsoftonline.com/{tenant Id}/",
    clientId: "{AAD Application Id/Client Id}"
  }
};

const authParams: AuthenticationParameters = {
  scopes: ["https://graph.microsoft.com/.default"] 
};
```

## MSAL + Browser

```TypeScript
import { spfi, SPBrowser } from "@pnp/sp";
import { graphfi, GraphBrowser } from "@pnp/graph";
import { MSAL } from "@pnp/msaljsclient";
import "@pnp/sp/webs";
import "@pnp/graph/users";

const sp = spfi("https://tenant.sharepoint.com/sites/dev").using(SPBrowser(), MSAL(configuration, authParams));

// within a webpart, application customizer, or adaptive card extension where the context object is available
const graph = graphfi().using(GraphBrowser(), MSAL(configuration, authParams));

const webData = await sp.web();
const meData = await graph.me();
```

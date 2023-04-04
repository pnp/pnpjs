# Authentication in SharePoint Framework

When building in SharePoint Framework you only need to provide the context to either sp or graph to ensure proper authentication. This will use the default [SharePoint AAD application](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/use-aadhttpclient) to manage scopes. If you would prefer to use a different AAD application please see the MSAL section below.

## SPFx + SharePoint

```TypeScript
import { SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";

// within a webpart, application customizer, or adaptive card extension where the context object is available
const sp = spfi().using(SPFx(this.context));

const webData = await sp.web();
```

## SPFx + Graph

```TypeScript
import { SPFx, graphfi } from "@pnp/graph";
import "@pnp/graph/users";

// within a webpart, application customizer, or adaptive card extension where the context object is available
const graph = graphfi().using(SPFx(this.context));

const meData = await graph.me();
```

## SPFx + Authentication Token

When using the SPFx behavior, authentication is handled by a cookie stored on the users client. In very specific instances some of the SharePoint methods will require a token. We have added a custom behavior to support that called `SPFxToken`. This will require that you add the appropriate application role to the SharePoint Framework's `package-solution.json` -> webApiPermissionRequests section where you will [define the resource and scope for the request](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/use-aadhttpclient#request-permissions-to-an-azure-ad-application).

Here's an example of how you would build an instance of the SPFI that would include an Bearer Token in the header. Be advised if you use this instance to make calls to SharePoint endpoints that you have not specifically authorized they will fail.

```TypeScript
import { spfi, SPFxToken, SPFx } from "@pnp/sp";

const sp = spfi().using(SPFx(context), SPFxToken(context));
```

## MSAL + SPFx

We support MSAL for both browser and nodejs by providing a thin wrapper around the official libraries. We won't document the fully possible MSAL configuration, but any parameters supplied are passed through to the underlying implementation. To use the browser MSAL package you'll need to install the @pnp/msaljsclient package which is deployed as a standalone due to the large MSAL dependency.

`npm install @pnp/msaljsclient --save`

At this time we're using version 1.x of the `msal` library which uses Implicit Flow. For more informaiton on the msal library please see the [AzureAD/microsoft-authentication-library-for-js](https://github.com/AzureAD/microsoft-authentication-library-for-js#readme).

Each of the following samples reference a MSAL configuration that utilizes an Azure AD App Registration, these are samples that show the typings for those objects:

```TypeScript
import { SPFx as graphSPFx, graphfi } from "@pnp/graph";
import { SPFx as spSPFx, spfi } from "@pnp/sp";
import { MSAL } from "@pnp/msaljsclient";
import { Configuration, AuthenticationParameters } from "msal";
import "@pnp/graph/users";
import "@pnp/sp/webs";

const configuration: Configuration = {
  auth: {
    authority: "https://login.microsoftonline.com/{tenant Id}/",
    clientId: "{AAD Application Id/Client Id}"
  }
};

const authParams: AuthenticationParameters = {
  scopes: ["https://graph.microsoft.com/.default"] 
};

// within a webpart, application customizer, or adaptive card extension where the context object is available
const graph = graphfi().using(graphSPFx(this.context), MSAL(configuration, authParams));
const sp = spfi().using(spSPFx(this.context), MSAL(configuration, authParams));

const meData = await graph.me();
const webData = await sp.web();
```

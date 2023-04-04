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

```TypeScript
import { spfi, SPBrowser } from "@pnp/sp";
import { MSAL } from "@pnp/msaljsclient";
import "@pnp/sp/webs";

const sp = spfi("https://tenant.sharepoint.com/sites/dev").using(SPBrowser(), MSAL(configuration, authParams));

const webData = await sp.web();
```

## MSAL + SPFx + Graph

```TypeScript
import { SPFx, graphfi } from "@pnp/graph";
import { MSAL } from "@pnp/msaljsclient";
import "@pnp/graph/users";

// within a webpart, application customizer, or adaptive card extension where the context object is available
const graph = graphfi().using(SPFx(this.context), MSAL(configuration, authParams));

const meData = await graph.me();
```

# Authentication

One of the more challenging aspects of web development is ensuring you are properly authenticated to access the resources you need. This section is designed to guide you through connecting to the resources you need using the appropriate methods.

The new [queryable](../queryable/queryable.md) pattern exposes a dedicated [auth moment](../queryable/queryable.md#auth). That moment expects observers with the signature:

```TypeScript
async function(url, init) {

  // logic to apply authentication to the request

    return [url, init];
}
```

If you want to handle authentication yourself, you can follow this example as a general pattern. You can then wrap your authentication in a [behavior](../core/behaviors.md) for easy reuse.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi().using({behaviors});
const web = sp.web;

// we will use custom auth on this web
web.on.auth(async function(url, init) {

    // some code to get a token
    const token = getToken();

    // set the Authorization header in the init (this init is what is passed directly to the fetch call)
    init.headers["Authorization"] = `Bearer ${token}`;

    return [url, init];
});
```

Of course we don't want you to _need_ to write your own authentication so we provide functionality to cover the key scenarios.

## SharePoint Framework

When building in SharePoint Framework you only need to provide the context to either sp or graph to ensure proper authentication. This will use the default [SharePoint AAD application](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/use-aadhttpclient) to manage scopes. If you would prefer to use a different AAD application please see the MSAL section below.

### SPFx + SharePoint

```TypeScript
import { SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";

// within a webpart, application customizer, or adaptive card extension where the context object is available
const sp = spfi().using(SPFx(this.context));

const webData = await sp.web();
```

### SPFx + Graph

```TypeScript
import { SPFx, graphfi } from "@pnp/graph";
import "@pnp/graph/users";

// within a webpart, application customizer, or adaptive card extension where the context object is available
const graph = graphfi().using(SPFx(this.context));

const meData = await graph.me();
```

## MSAL in Browser

We support MSAL for both browser and nodejs by providing a thin wrapper around the official libraries. We won't document the fully possible MSAL configuration, but any parameters supplied are passed through to the underlying implementation. To use the browser MSAL package you'll need to install the @pnp/msaljsclient package which is deployed as a standalone due to the large MSAL dependency.

`npm install @pnp/msaljsclient --save`

### MSAL + SPFx

```TypeScript
import { spfi, SPBrowser } from "@pnp/sp";
import { MSAL } from "@pnp/msaljsclient";
import "@pnp/sp/webs";

const sp = spfi("https://tenant.sharepoint.com/sites/dev").using(SPBrowser(), MSAL(configuration, authParams));

const webData = await sp.web();
```

### MSAL + SP + Browser

```TypeScript
import { spfi, SPBrowser } from "@pnp/sp";
import { MSAL } from "@pnp/msaljsclient";
import "@pnp/sp/webs";

const sp = spfi("https://tenant.sharepoint.com/sites/dev").using(SPBrowser(), MSAL(configuration, authParams));

const webData = await sp.web();
```

### MSAL + SPFx + Graph

```TypeScript
import { SPFx, graphfi } from "@pnp/graph";
import { MSAL } from "@pnp/msaljsclient";
import "@pnp/graph/users";

// within a webpart, application customizer, or adaptive card extension where the context object is available
const graph = graphfi().using(SPFx(this.context), MSAL(configuration, authParams));

const meData = await graph.me();
```

### MSAL + Graph + Browser

```TypeScript
import { GraphBrowser, graphfi } from "@pnp/graph";
import { MSAL } from "@pnp/msaljsclient";
import "@pnp/graph/users";

// within a webpart, application customizer, or adaptive card extension where the context object is available
const graph = graphfi().using(GraphBrowser(), MSAL(configuration, authParams));

const meData = await graph.me();
```

## MSAL Nodejs

For nodejs we support MSAL through the [msal-node](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/README.md) library. Again we provide a thing wrapper to allow it to work within our request flow.

### MSAL + SP + Nodejs

The SPDefault exported by the nodejs library include MSAL and takes the parameters directly.

```TypeScript
import { SPDefault } from "@pnp/nodejs";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi("https://318studios.sharepoint.com/sites/dev").using(SPDefault({
            msal: {
                config,
                scopes,
            },
        }));

const webData = await sp.web();
```

### MSAL + Graph + Nodejs

The GraphDefault exported by the nodejs library include MSAL and takes the parameters directly.

```TypeScript
import { GraphDefault } from "@pnp/nodejs";
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";

const graph = graphfi().using(GraphDefault({
            msal: {
                config,
                scopes,
            },
        }));

const meData = await graph.me();
```

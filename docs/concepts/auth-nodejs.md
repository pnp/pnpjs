# Authentication in NodeJS

We support MSAL for both browser and nodejs and Azure Identity for nodejs by providing a thin wrapper around the official libraries. We won't document the fully possible configurations, but any parameters supplied are passed through to the underlying implementation.

Depending on which package you want to use you will need to install an additional package from the library because of the large dependencies.

We support MSAL through the [msal-node](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/README.md) library which is included by the @pnp/nodejs package.

For the Azure Identity package:

`npm install @pnp/azidjsclient --save`

We support Azure Identity through the [@azure/identity](https://github.com/Azure/azure-sdk-for-js/blob/main/documentation/using-azure-identity.md) library which simplifies the authentication process and makes it easy to integrate Azure Identity authentication in your solution.

## MSAL + NodeJS

The SPDefault and GraphDefault exported by the nodejs library include MSAL and takes the parameters directly.

The following samples reference a MSAL configuration that utilizes an Azure AD App Registration, these are samples that show the typings for those objects:

```TypeScript
import { SPDefault, GraphDefault } from "@pnp/nodejs";
import { spfi } from "@pnp/sp";
import { graphfi } from "@pnp/graph";
import { Configuration, AuthenticationParameters } from "msal";
import "@pnp/graph/users";
import "@pnp/sp/webs";

const configuration: Configuration = {
  auth: {
    authority: "https://login.microsoftonline.com/{tenant Id}/",
    clientId: "{AAD Application Id/Client Id}"
  }
};

const sp = spfi("{site url}").using(SPDefault({
    msal: {
        config: configuration,
        scopes: ["https://{tenant}.sharepoint.com/.default"],
    },
}));

const graph = graphfi().using(GraphDefault({
    msal: {
        config: configuration,
        scopes: ["https://graph.microsoft.com/.default"],
    },
}));

const webData = await sp.web();
const meData = await graph.me();
```

## Use Nodejs MSAL behavior directly

It is also possible to use the MSAL behavior directly if you are composing your own strategies.

```TypeScript
import { SPDefault, GraphDefault, MSAL } from "@pnp/nodejs";

const sp = spfi("{site url}").using(SPDefault(), MSAL({
  config: configuration,
  scopes: ["https://{tenant}.sharepoint.com/.default"],
}));

const graph = graphfi().using(GraphDefault(), MSAL({
  config: configuration,
  scopes: ["https://graph.microsoft.com/.default"],
}));

```

## Azure Identity + NodeJS

The following sample shows how to pass the credential object to the AzureIdentity behavior including scopes.

```TypeScript
import { DefaultAzureCredential } from "@azure/identity";
import { spfi } from "@pnp/sp";
import { graphfi } from "@pnp/sp";
import { SPDefault, GraphDefault } from "@pnp/nodejs";
import { AzureIdentity } from "@pnp/azidjsclient";
import "@pnp/sp/webs";
import "@pnp/graph/users";

// We're using DefaultAzureCredential but the credential can be any valid `Credential Type`
const credential = new DefaultAzureCredential();

const sp = spfi("https://{tenant}.sharepoint.com/sites/dev").using(
    SPDefault(),
    AzureIdentity(credential, [`https://${tenant}.sharepoint.com/.default`], null)
);

const graph = graphfi().using(
    GraphDefault(),
    AzureIdentity(credential, ["https://graph.microsoft.com/.default"], null)
);

const webData = await sp.web();
const meData = await graph.me();
```

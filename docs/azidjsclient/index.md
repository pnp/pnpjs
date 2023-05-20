# @pnp/azidjsclient

This library provides a thin wrapper around the [@azure/identity](https://github.com/Azure/azure-sdk-for-js) library to make it easy to integrate Azure Identity authentication in your solution.

You will first need to install the package:

`npm install @pnp/azidjsclient --save`

The following example shows how to configure the SPFI or GraphFI object using this behavior.

```TypeScript
import { DefaultAzureCredential } from "@azure/identity";
import { spfi } from "@pnp/sp";
import { graphfi } from "@pnp/sp";
import { SPDefault, GraphDefault } from "@pnp/nodejs";
import { AzureIdentity } from "@pnp/azidjsclient";
import "@pnp/sp/webs";
import "@pnp/graph/me";

const credential = new DefaultAzureCredential();

const sp = spfi("https://tenant.sharepoint.com/sites/dev").using(
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

Please see more scenarios in the [authentication article](../concepts/authentication.md).

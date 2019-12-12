# @pnp/nodejs/adalfetchclient

The AdalFetchClient class depends on the adal-node package to authenticate against Azure AD. The example below
outlines usage with the @pnp/sp library, though it would work in any case where an Azure AD Bearer token is expected.

```TypeScript
import { AdalFetchClient } from "@pnp/nodejs";
import { sp } from "@pnp/sp/presets/all";

// setup the client using sp setup function
sp.setup({
    sp: {
        fetchClientFactory: () => {
            return new AdalFetchClient("{tenant}", "{app id}", "{app secret}");
        },
    },
});

// execute a library request as normal
const g = await sp.web.get();

console.log(JSON.stringify(g, null, 4));
```

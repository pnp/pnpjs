# @pnp/nodejs/adalfetchclient

The AdalFetchClient class depends on the adal-node package to authenticate against Azure AD. The example below
outlines usage with the @pnp/graph library, though it would work in any case where an Azure AD Bearer token is expected.

```TypeScript
import { AdalFetchClient } from "@pnp/nodejs";
import { graph } from "@pnp/graph";

// setup the client using graph setup function
graph.setup({
    graph: {
        fetchClientFactory: () => {
            return new AdalFetchClient("{tenant}", "{app id}", "{app secret}");
        },
    },
});

// execute a library request as normal
graph.groups.get().then(g => {

    console.log(JSON.stringify(g, null, 4));

}).catch(e => {

    console.error(e);
});
```
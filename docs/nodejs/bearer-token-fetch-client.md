# @pnp/nodejs/BearerTokenFetchClient

The BearerTokenFetchClient class allows you to easily specify your own Bearer tokens to be used in the requests. How you derive the token is up to you.

```TypeScript
import { BearerTokenFetchClient } from "@pnp/nodejs";
import { graph } from "@pnp/graph";

// setup the client using graph setup function
graph.setup({
    graph: {
        fetchClientFactory: () => {
            return new BearerTokenFetchClient("{Bearer Token}");
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
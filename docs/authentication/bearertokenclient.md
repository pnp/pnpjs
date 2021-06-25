# @pnp/core/BearerTokenFetchClient

The BearerTokenFetchClient takes a single parameter representing an access token and uses it to make the requests.

> The disadvantage to this approach is not knowing to where the request will be sent, which in some cases is fine. An alternative is the [LambdaFetchClient](./lambdaclient.md)

## Static

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/users";
import { BearerTokenFetchClient } from "@pnp/core";
import { myTokenFactory } from "./my-auth.js";

graph.setup({
    graph: {
        fetchClientFactory: () => {

            // note this method is not async, so your logic here cannot await.
            // Please see the LambdaFetchClient if you have a need for async support.
            const token = myTokenFactory();
            return new BearerTokenFetchClient(token);
        },
    },
});
```

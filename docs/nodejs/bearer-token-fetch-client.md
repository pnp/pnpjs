# @pnp/nodejs/BearerTokenFetchClient

The BearerTokenFetchClient class allows you to easily specify your own Bearer tokens to be used in the requests. How you derive the token is up to you.

```TypeScript
import { BearerTokenFetchClient } from "@pnp/nodejs";
import { sp } from "@pnp/sp/presets/all";

// setup the client using sp setup function
sp.setup({
    sp: {
        fetchClientFactory: () => {
            return new BearerTokenFetchClient("{Bearer Token}");
        },
    },
});

// execute a library request as normal
const g = await sp.web.get();

console.log(JSON.stringify(g, null, 4));
```

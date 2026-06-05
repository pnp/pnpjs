# Authentication

One of the more challenging aspects of web development is ensuring you are properly authenticated to access the resources you need. This section is designed to guide you through connecting to the resources you need using the appropriate methods.

We provide multiple ways to authenticate based on the scenario you're developing for, see one of these more detailed guides:

- [Authentication in SharePoint Framework](./auth-spfx.md)
- [Authentication in a custom browser based application (Outside Microsoft 365)](./auth-browser.md)
- [Authentication in NodeJS](./auth-nodejs.md)

If you have more specific authentication requirements you can always build your own by using the new [queryable](../queryable/queryable.md) pattern which exposes a dedicated [auth moment](../queryable/queryable.md#auth). That moment expects observers with the signature:

```TypeScript
async function(url, init) {

  // logic to apply authentication to the request

    return [url, init];
}
```

You can follow this example as a general pattern to build your own custom authentication model. You can then wrap your authentication in a [behavior](../core/behaviors.md) for easy reuse.

```TypeScript
import { spfi, SPBrowser } from "@pnp/sp";
import "@pnp/sp/webs";

// Use custom auth when built-in behaviors don't meet your needs
// For example, integrating with a custom identity provider
const sp = spfi("https://tenant.sharepoint.com").using(SPBrowser());
const web = sp.web;

// Add custom authentication to this web instance
web.on.auth(async function(url, init) {

    // Replace with your actual token acquisition logic
    const token = await myCustomAuthProvider.getAccessToken();

    // set the Authorization header in the init (this init is what is passed directly to the fetch call)
    init.headers = init.headers || {};
    init.headers["Authorization"] = `Bearer ${token}`;

    return [url, init];
});
```

# @pnp/sp-addinhelpers/sprestaddin

This class extends the sp export from @pnp/sp and adds in the methods required to make cross domain calls

```TypeScript
// note we are getting the sp variable from this library, it extends the sp export from @pnp/sp to add the required helper methods
import { sp, SPRequestExecutorClient } from "@pnp/sp-addinhelpers";

// this only needs to be done once within your application
sp.setup({
    sp: {
        fetchClientFactory: () => {
            return new SPRequestExecutorClient();
        }
    }
});

// now we need to use the crossDomainWeb method to make our requests to the host web
const addInWenUrl = "{The add-in web url, likely from the query string}";
const hostWebUrl = "{The host web url, likely from the query string}";

// make requests into the host web via the SP.RequestExecutor
sp.crossDomainWeb(addInWenUrl, hostWebUrl).get().then(w => {
    console.log(JSON.stringify(w, null, 4));
});
```

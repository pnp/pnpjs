# @pnp/sp-addinhelpers/sprequestexecutorclient

The SPRequestExecutorClient is an implementation of the HttpClientImpl interface that facilitates requests to SharePoint from an add-in. It relies on
the SharePoint SP product libraries being present to allow use of the SP.RequestExecutor to make the request.

## Setup

To use the client you need to set it using the fetch client factory using the setup  method as shown below. This is only required when working within a
SharePoint add-in web.

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

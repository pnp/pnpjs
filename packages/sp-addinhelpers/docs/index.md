# @pnp/sp-addinhelpers

[![npm version](https://badge.fury.io/js/%40pnp%2Fsp-addinhelpers.svg)](https://badge.fury.io/js/%40pnp%2Fsp-addinhelpers)

This module contains classes to allow use of the libraries within a SharePoint add-in.

## Getting Started

Install the library and all dependencies,

`npm install @pnp/logging @pnp/common @pnp/odata @pnp/sp @pnp/sp-addinhelpers --save`

Now you can make requests to the host web from your add-in using the crossDomainWeb method.

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

#Libary Topics

* [SPRequestExecutorClient](sp-request-executor-client.md)
* [SPRestAddIn](sp-rest-addin.md)

## UML
![Graphical UML diagram](../../documentation/img/pnpjs-sp-addinhelpers-uml.svg)

Graphical UML diagram of @pnp/sp-addinhelpers. Right-click the diagram and open in new tab if it is too small.

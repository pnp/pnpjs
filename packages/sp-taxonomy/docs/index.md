# @pnp/sp-taxonomy

[![npm version](https://badge.fury.io/js/%40pnp%2Fsp-taxonomy.svg)](https://badge.fury.io/js/%40pnp%2Fsp-taxonomy)

This module provides a fluent interface for working with the SharePoint term store. It does not rely on SP.taxonomy.js or other dependencies outside the @pnp scope. It is designed to function in a similar manner and present a similar feel to the other data retrieval libraries. It works by calling the "/\_vti_bin/client.svc/ProcessQuery" endpoint.

## Getting Started

You will need to install the @pnp/sp-taxonomy package as well as the packages it requires to run.

`npm install @pnp/logging @pnp/common @pnp/odata @pnp/sp @pnp/sp-taxonomy @pnp/sp-clientsvc --save`

## Root Object

All fluent taxonomy operations originate from the Taxonomy object. You can access it in several ways.

### Import existing instance

This method will grab an existing instance of the Taxonomy class and allow you to immediately chain additional methods.

```TypeScript
import { taxonomy } from "@pnp/sp-taxonomy";

await taxonomy.termStores.get();
```

### Import class and create instance

You can also import the Taxonomy class and create a new instance. This useful in those cases where you want to work with taxonomy in another web than the current web.

```TypeScript
import { Session } from "@pnp/sp-taxonomy";

const taxonomy = new Session("https://mytenant.sharepoint.com/sites/dev");

await taxonomy.termStores.get();
```

## Setup

Because the sp-taxonomy library uses the same @pnp/odata request pipeline as the other libraries you can call the setup method with the same options used for the @pnp/sp library. The setup method is provided as shorthand and avoids the need to import anything from @pnp/sp if you do not need to. A call to this setup method is equivilent to calling the sp.setup method and the configuration is shared between the libraries within your application.

In the below example all requests for the @pnp/sp-taxonomy library _and_ the @pnp/sp library will be routed through the specified SPFetchClient. Sharing the configuration like this handles the most common scenario of working on the same web easily. You can set other values here as well such as baseUrl and they will be respected by both libraries.

```TypeScript
import { taxonomy } from "@pnp/sp-taxonomy";
import { SPFetchClient } from "@pnp/nodejs";

// example for setting up the node client using setup method
// we also set a custom header, as an example
taxonomy.setup({
    sp: {
        fetchClientFactory: () => {
            return new SPFetchClient("{url}", "{client id}", "{client secret}");
        },
        headers: {
            "X-Custom-Header": "A Great Value",
        },
    },
});
```

## Library Topics

* [Term Stores](term-stores.md)
* [Term Groups](term-groups.md)
* [Term Sets](term-sets.md)
* [Terms](terms.md)
* [Labels](labels.md)

## UML
![Graphical UML diagram](../../documentation/img/pnpjs-sp-taxonomy-uml.svg)

Graphical UML diagram of @pnp/sp-taxonomy. Right-click the diagram and open in new tab if it is too small.

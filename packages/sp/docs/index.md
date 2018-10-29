# @pnp/sp

[![npm version](https://badge.fury.io/js/%40pnp%2Fsp.svg)](https://badge.fury.io/js/%40pnp%2Fsp)

This package contains the fluent api used to call the SharePoint rest services.

## Getting Started

Install the library and required dependencies

`npm install @pnp/logging @pnp/common @pnp/odata @pnp/sp --save`

Import the library into your application and access the root sp object

```TypeScript
import { sp } from "@pnp/sp";

(function main() {

    // here we will load the current web's title
    sp.web.select("Title").get().then(w => {

        console.log(`Web Title: ${w.Title}`);
    });
})()
```

## Getting Started: SharePoint Framework

Install the library and required dependencies

`npm install @pnp/logging @pnp/common @pnp/odata @pnp/sp --save`

Import the library into your application, update OnInit, and access the root sp object in render

```TypeScript
import { sp } from "@pnp/sp";

// ...

public onInit(): Promise<void> {

  return super.onInit().then(_ => {

    // other init code may be present

    sp.setup({
      spfxContext: this.context
    });
  });
}

// ...

public render(): void {

    // A simple loading message
    this.domElement.innerHTML = `Loading...`;

    sp.web.select("Title").get().then(w => {

        this.domElement.innerHTML = `Web Title: ${w.Title}`;
    });
}
```

## Getting Started: Nodejs

Install the library and required dependencies

`npm install @pnp/logging @pnp/common @pnp/odata @pnp/sp @pnp/nodejs --save`

Import the library into your application, setup the node client, make a request

```TypeScript
import { sp } from "@pnp/sp";
import { SPFetchClient } from "@pnp/nodejs";

// do this once per page load
sp.setup({
    sp: {
        fetchClientFactory: () => {
            return new SPFetchClient("{your site url}", "{your client id}", "{your client secret}");
        },
    },
});

// now make any calls you need using the configured client
sp.web.select("Title").get().then(w => {

    console.log(`Web Title: ${w.Title}`);
});
```

## Library Topics

* [Alias Parameters](alias-parameters.md)
* [ALM api](alm.md)
* [Attachments](attachments.md)
* [Client-side Pages](client-side-pages.md)
* [Features](features.md)
* [Fields](fields.md)
* [Files](files.md)
* [List Items](items.md)
* [Navigation Service](navigation-service.md)
* [Permissions](permissions.md)
* [Related Items](related-items.md)
* [Search](search.md)
* [Sharing](sharing.md)
* [Site Designs](sitedesigns.md)
* [Social](social.md)
* [SP.Utilities.Utility](sp-utilities-utility.md)
* [Tenant Properties](tenant-properties.md)
* [Views](views.md)
* [Webs](webs.md)
* [Comments and Likes](comments-likes.md)

## UML
![Graphical UML diagram](../../documentation/img/pnpjs-sp-uml.svg)

Graphical UML diagram of @pnp/sp. Right-click the diagram and open in new tab if it is too small.

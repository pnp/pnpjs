# @pnp/sp

[![npm version](https://badge.fury.io/js/%40pnp%2Fsp.svg)](https://badge.fury.io/js/%40pnp%2Fsp)

This package contains the fluent api used to call the SharePoint rest services.

## Getting Started

Install the library and required dependencies

`npm install @pnp/sp --save`

Import the library into your application and access the root sp object

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";

(function main() {

    // here we will load the current web's title
    const w = await sp.web.select("Title")();
    console.log(`Web Title: ${w.Title}`);
)()
```

## Getting Started: SharePoint Framework

Install the library and required dependencies

`npm install @pnp/sp --save`

Import the library into your application, update OnInit, and access the root sp object in render

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";

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

    const w = await sp.web.select("Title")();
    this.domElement.innerHTML = `Web Title: ${w.Title}`;
}
```

## Getting Started: Nodejs

Install the library and required dependencies

`npm install @pnp/sp @pnp/nodejs --save`

Import the library into your application, setup the node client, make a request

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
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

const w = await sp.web.select("Title")();
console.log(`Web Title: ${w.Title}`);

```

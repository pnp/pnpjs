# @pnp/sp

[![npm version](https://badge.fury.io/js/%40pnp%2Fsp.svg)](https://badge.fury.io/js/%40pnp%2Fsp)

This package contains the fluent api used to call the SharePoint rest services.

## Getting Started

Install the library and required dependencies

`npm install @pnp/sp --save`

Import the library into your application and access the root sp object

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";

(function main() {
  // here we setup the root sp object with the sharepoint context which will be used to load the current web's title
  const sp = spfi("{tenant url}").using(SPFx(this.context));
  const w = await sp.web.select("Title")();
  console.log(`Web Title: ${w.Title}`);
)()
```

## Getting Started: SharePoint Framework

Install the library and required dependencies

`npm install @pnp/sp --save`

Import the library into your application, and access the sp object in render

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";

// ...

public render(): void {
  // A simple loading message
  this.domElement.innerHTML = `Loading...`;

  const sp = spfi().using(SPFx(this.context));
  const w = await sp.web.select("Title")();

this.domElement.innerHTML = `Web Title: ${w.Title}`;
}
```

## Getting Started: Nodejs

Install the library and required dependencies

`npm install @pnp/sp @pnp/nodejs --save`

Import the library into your application, setup the node client, make a request

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import { GraphDefault, SPDefault } from "@pnp/nodejs";
import {ThrowErrors} from "@pnp/queryable";
import "@pnp/sp/webs";

const buffer = readFileSync("c:/temp/key.pem");

// we create the config to use with the node clients
const config:any = {
  auth: {
    authority: "https://login.microsoftonline.com/{my tenant}/",
    clientId: "{application (client) id}",
    clientCertificate: {
      thumbprint: "{certificate thumbprint, displayed in AAD}",
      privateKey: buffer.toString(),
    },
  },
};

const sp = spfi().using(SPDefault({
  baseUrl: siteUrl,
  msal: {
    config: config,
    scopes: [ 'https://{tenant}.sharepoint.com/.default' ]
  }
})).using(ThrowErrors());

// now make any calls you need using the configured client
const w = await sp.web.select("Title")();
console.log(`Web Title: ${w.Title}`);
```

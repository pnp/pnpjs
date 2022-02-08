# Getting Started

This library is geared towards folks working with TypeScript but will work equally well for JavaScript projects. To get started you need to install the libraries you need via npm. Many of the packages have a peer dependency to other packages with the @pnp namespace meaning you may need to install more than one package. All packages are released together eliminating version confusion - all packages will depend on packages with the same version number.

If you need to support older browsers please revert to version 2 of the library and see related documentation on [polyfills](./v2/concepts/polyfill/index.html) for required functionality.

## Install

First you will need to install those libraries you want to use in your application. Here we will install the most frequently used packages. `@pnp/sp` to access the SharePoint REST API and `@pnp/graph` to access some of the Microsoft Graph API. This step applies to any environment or project.

`npm install @pnp/sp @pnp/graph --save`

Next we can import and use the functionality within our application. Below is a very simple example, please see the individual package documentation for more details and examples.

```TypeScript
import { getRandomString } from "@pnp/core";

(function() {

  // get and log a random string
  console.log(getRandomString(20));

})()
```

## Getting Started with SharePoint Framework

The @pnp/sp and @pnp/graph libraries are designed to work seamlessly within SharePoint Framework projects with a small amount of upfront configuration. If you are running in 2016 or 2019 on-premises you will need to use [version 2](./v2/SPFx-on-premises/index.html) of the library. If you are targeting SharePoint online you will need to take the additional steps outlined below based on the version of the SharePoint Framework you are targeting.

//TODO:: Add additonal SPFx configuration steps based on SPFx Version

Because SharePoint Framework provides a local context to each component we need to set that context within the library. This allows us to determine request urls as well as use the SPFx HttpGraphClient within @pnp/graph. To establish context within the library you will need to use the SharePoint or Graph Factory Interface depending on which set of APIs you want to utilize. For SharePoint you will use the `spfi` interface and for the Microsoft Graph you will use the `graphfi` interface whic are both in the main export of the corresponding package. Examples of both methods are shown below.

Depending on how you architect your solution establishing context is done where you want to make calls to the API. The examples demonstrate doing so in the onInit method as a local variable but this could also be done to a private variable or passed into a service.

### Using @pnp/sp `spfi` factory interface

```TypeScript
import { spfi, SPFx } from "@pnp/sp";

// ...

protected async onInit(): Promise<void> {

  await super.onInit();
  const sp = spfi().using(SPFx(this.context));

}

// ...

```

### Using @pnp/graph `graphfi` factory interface

```TypeScript
import { graphfi, SPFx } from "@pnp/graph";

// ...

protected async onInit(): Promise<void> {

  await super.onInit();
  const graph = graphfi().using(SPFx(this.context));

}

// ...

```

### Establish context within an SPFx service

Because you do not have full access to the context object within a service you need to setup things a little differently. If you do not need AAD tokens you can leave that part out and specify just the pageContext (Option 2).

```TypeScript
import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
import { AadTokenProviderFactory } from "@microsoft/sp-http";
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";

export interface ISampleService {
  getLists(): Promise<any[]>;
}

export class SampleService {

  public static readonly serviceKey: ServiceKey<ISampleService> = ServiceKey.create<ISampleService>('SPFx:SampleService', SampleService);
  private _sp: SPFI;

  constructor(serviceScope: ServiceScope) {

    serviceScope.whenFinished(() => {

      const pageContext = serviceScope.consume(PageContext.serviceKey);
      const tokenProviderFactory = serviceScope.consume(AadTokenProviderFactory.serviceKey);

      //Option 1 - with AADTokenProvider
      this._sp = spfi().using(SPFx({
        spfxContext: {
        aadTokenProviderFactory: tokenProviderFactory,
        pageContext: pageContext,
        }
      }));

      //Option 2 - without AADTokenProvider
      this._sp = spfi().using(SPFx(pageContext));

    });
  }

  public getLists(): Promise<any[]> {
    return this._sp.web.lists();
  }
}
```

## Getting started with NodeJS

### Using @pnp/sp `spfi` factory interface

> Please see the [main article on how we support node versions](./nodejs-support.md) that require commonjs modules.

The first step is to install the packages that will be needed. You can read more about what each package does starting on the [packages](packages.md) page.

```cmd
npm i @pnp/sp @pnp/nodejs
```

Once these are installed you need to import them into your project, to communicate with SharePoint from node we'll need the following imports:

```TypeScript

import { SPDefault } from "@pnp/nodejs";
import "@pnp/sp/webs";
import { readFileSync } from 'fs';
import { Configuration } from "@azure/msal-node";

function() {
    // configure your node options (only once in your application)
    const buffer = readFileSync("c:/temp/key.pem");

    const config: Configuration = {
      auth: {
        authority: "https://login.microsoftonline.com/{tenant id or common}/",
        clientId: "{application (client) id}",
        clientCertificate: {
        thumbprint: "{certificate thumbprint, displayed in AAD}",
        privateKey: buffer.toString(),
        },
      },
    };

    const sp = spfi().using(SPDefault({
      baseUrl: 'https://{my tenant}.sharepoint.com/sites/dev/',
      msal: {
        config: config,
        scopes: [ 'https://{my tenant}.sharepoint.com/.default' ]
      }
    }));

    // make a call to SharePoint and log it in the console
    const w = await sp.web.select("Title", "Description")();
    console.log(JSON.stringify(w, null, 4));
}();
```

### Using @pnp/graph `graphfi` factory interface

Similar to the above you can also make calls to the Microsoft Graph API from node using the libraries. Again we start with installing the required resources. You can see [./debug/launch/graph.ts](https://github.com/pnp/pnpjs/blob/main/debug/launch/graph.ts) for a live example.

```cmd
npm i @pnp/graph @pnp/nodejs
```

Now we need to import what we'll need to call graph

```TypeScript
import { graphfi } from "@pnp/graph";
import { GraphDefault } from "@pnp/nodejs";
import "@pnp/graph/users";

function() {
    const graph = graphfi().using(GraphDefault({
      baseUrl: 'https://graph.microsoft.com',
      msal: {
        config: config,
        scopes: [ 'https://graph.microsoft.com/.default' ]
      }
    }));
    // make a call to Graph and get all the groups
    const userInfo = await graph.users.top(1)();
    console.log(JSON.stringify(userInfo, null, 4));
}();
```

## Single Page Application Context

In some cases you may be working in a client-side application that doesn't have context to the SharePoint site. In that case you will need to utilize the MSAL Client, you can get the details on creating that connection in this [article](./authentication/msaljsclient.md).

## Selective Imports

This library has a lot of functionality and you may not need all of it. For that reason, we support selective imports which allow you to only import the parts of the sp or graph library you need, which reduces your overall solution bundle size - and enables [treeshaking](https://github.com/rollup/rollup#tree-shaking).

You can read more about [selective imports](./concepts/selective-imports.md).

## Error Handling

This [article](./concepts/error-handling.md) describes the most common types of errors generated by the library. It provides context on the error object, and ways to handle the errors. As always you should tailor your error handling to what your application needs. These are ideas that can be applied to many different patterns.

## Extending the Library

Because of the way the fluent library is designed by definition it's extendible. That means that if you want to build your own custom functions that extend the features of the library this can be done fairly simply. To get more information about creating your own custom extensions check out [extending the library](./contributing/extending-the-library.md) article.

## Connect to a different Web

The new factory function allows you to create a connection to a different web maintaining the same setup as your existing interface. You have two options, either to  'AssignFrom' or 'CopyFrom' the base timeline's observers. The below example utilizes 'AssignFrom' but the method would be the same regadless of which route you choose. For more information on these behaviors see [Core/Behaviors](./core/behaviors.md).

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import { AssignFrom } from "@pnp/core";
import "@pnp/sp/webs";

//Connection to the current context's Web
const sp = spfi().using(SPFx(this.context));

// Option 1: Create a new instance of Queryable
const spWebB = spfi({Other Web URL}).using(SPDefault(this.context));

// Option 2: Copy/Assign a new instance of Queryable using the existing
const spWebB = spfi({Other Web URL}).using(AssignFrom(sp.web));

// Option 3: Create a new instance of Queryable using other credentials?
const spWebB = spfi({Other Web URL}).using(SPDefault(this.context));

```

## Next Steps

For more complicated authentication scnearios please [review the article describing all of the available authentication methods](./authentication/index.md).

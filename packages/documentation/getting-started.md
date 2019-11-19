# Getting Started

These libraries are geared towards folks working with TypeScript but will work equally well for JavaScript projects. To get started you need to install
the libraries you need via npm. Many of the packages have a peer dependency to other packages with the @pnp namespace meaning you may need to install
more than one package. All packages are released together eliminating version confusion - all packages will depend on packages with the same version number.

If you need to support older browsers please review the article on [polyfills](polyfill.md) for required functionality.

## Install

First you will need to install those libraries you want to use in your application. Here we will install the most frequently used packages. This step applies to any 
environment or project.

`npm install @pnp/logging @pnp/common @pnp/odata @pnp/sp @pnp/graph --save`

Next we can import and use the functionality within our application. The below is a very simple example, please see the individual package documentation
for more details.

```TypeScript
import { getRandomString } from "@pnp/common";

(function() {

  // get and log a random string
  console.log(getRandomString(20));

})()
```

## Getting Started with SharePoint Framework

The @pnp/sp and @pnp/graph libraries are designed to work seamlessly within SharePoint Framework projects with a small amount of upfront configuration. If you are running in 2016 on-premises please [read this note](SPFx-On-Premesis-2016.md) on a workaround for the included TypeScript version. If you are targetting SharePoint online you do not need to take any additional steps.

### Establish Context

Because SharePoint Framework provides a local context to each component we need to set that context within the library. This allows us to determine request
urls as well as use the SPFx HttpGraphClient within @pnp/graph. There are two ways to provide the spfx context to the library. Either through the setup method
imported from @pnp/common or using the setup method on either the @pnp/sp or @pnp/graph main export. All three are shown below and are equivalent, meaning if
you are already importing the sp variable from @pnp/sp or the graph variable from @pnp/graph you should use their setup method to reduce imports. 

The setup is always done in the onInit method to ensure it runs before your other lifecycle code. You can also set any other settings at this time.

#### Using @pnp/common setup

```TypeScript
import { setup as pnpSetup } from "@pnp/common";

// ...

public onInit(): Promise<void> {

  return super.onInit().then(_ => {

    // other init code may be present

    pnpSetup({
      spfxContext: this.context
    });
  });
}

// ...

```

#### Using @pnp/sp setup

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

```

#### Using @pnp/graph setup

```TypeScript
import { graph } from "@pnp/graph";

// ...

public onInit(): Promise<void> {

  return super.onInit().then(_ => {

    // other init code may be present

    graph.setup({
      spfxContext: this.context
    });
  });
}

// ...

```

#### Establish Context with an SPFx Service

Because you do not have access to the full context object within a service you need to setup things slightly differently. This works for the sp library, but not the graph library as we don't have access to the AAD token provider from the full context.

```TypeScript
import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
import { AadTokenProviderFactory } from "@microsoft/sp-http";
import { sp } from "@pnp/sp";

export interface ISampleService {
  getLists(): Promise<any[]>;
}

export class SampleService {

  public static readonly serviceKey: ServiceKey<ISampleService> = ServiceKey.create<ISampleService>('SPFx:SampleService', SampleService);

  constructor(serviceScope: ServiceScope) {

    serviceScope.whenFinished(() => {

      const pageContext = serviceScope.consume(PageContext.serviceKey);
      const tokenProviderFactory = serviceScope.consume(AadTokenProviderFactory.serviceKey);

      // we need to "spoof" the context object with the parts we need for PnPjs
      sp.setup({
        spfxContext: {
          aadTokenProviderFactory: tokenProviderFactory,
          pageContext: pageContext,
        }
      });

      // This approach also works if you do not require AAD tokens
      // you don't need to do both
      // sp.setup({
      //   sp : {
      //     baseUrl : pageContext.web.absoluteUrl
      //   }
      // });
    });
  }
  public getLists(): Promise<any[]> {
    return sp.web.lists.get();
  }
}
```

## Connect to SharePoint from Node

Because peer dependencies are not installed automatically you will need to list out each package to install. Don't worry if you forget one you will get a message
on the command line that a peer dependency is missing. Let's for example look at installing the required libraries to connect to SharePoint from nodejs. You can see
[./debug/launch/sp.ts](https://github.com/pnp/pnpjs/blob/master/debug/launch/sp.ts) for a live example.

```
npm i @pnp/logging @pnp/common @pnp/odata @pnp/sp @pnp/nodejs
```

This will install the logging, common, odata, sp, and nodejs packages. You can read more about what each package does starting on the [packages](packages.md) page.
Once these are installed you need to import them into your project, to communicate with SharePoint from node we'll need the following imports:

```TypeScript
import { sp } from "@pnp/sp";
import { SPFetchClient } from "@pnp/nodejs";
```

Once you have imported the necessary resources you can update your code to setup the node fetch client as well as make a call to SharePoint.

```TypeScript
// configure your node options (only once in your application)
sp.setup({
    sp: {
        fetchClientFactory: () => {
            return new SPFetchClient("{site url}", "{client id}", "{client secret}");
        },
    },
});

// make a call to SharePoint and log it in the console
sp.web.select("Title", "Description").get().then(w => {
    console.log(JSON.stringify(w, null, 4));
});
```

## Connect to Microsoft Graph From Node

Similar to the above you can also make calls to the Graph api from node using the libraries. Again we start with installing the required resources. You can see
[./debug/launch/graph.ts](https://github.com/pnp/pnpjs/blob/master/debug/launch/graph.ts) for a live example.

```
npm i @pnp/logging @pnp/common @pnp/odata @pnp/graph @pnp/nodejs
```

Now we need to import what we'll need to call graph

```TypeScript
import { graph } from "@pnp/graph";
import { AdalFetchClient } from "@pnp/nodejs";
```

Now we can make our graph calls after setting up the Adal client. Note you'll need to setup an AzureAD App registration with the necessary permissions.

```TypeScript
graph.setup({
    graph: {
        fetchClientFactory: () => {
            return new AdalFetchClient("{mytenant}.onmicrosoft.com", "{application id}", "{application secret}");
        },
    },
});

// make a call to Graph and get all the groups
graph.v1.groups.get().then(g => {
    console.log(JSON.stringify(g, null, 4));
});
```

## Getting Started outside SharePoint Framework

In some cases you may be working in a way such that we cannot determine the base url for the web. In this scenario you have two options.

### Set baseUrl through setup:

Here we are setting the baseUrl via the sp.setup method. We are also setting the headers to use verbose mode, something you may have to do when
working against unpatched versions of SharePoint 2013 as [discussed here](https://blogs.msdn.microsoft.com/patrickrodgers/2016/06/13/pnp-jscore-1-0-1/).
This is optional for 2016 or SharePoint Online.

```TypeScript
import { sp } from "@pnp/sp";

sp.setup({
  sp: {
    headers: {
      Accept: "application/json;odata=verbose",
    },
    baseUrl: "{Absolute SharePoint Web URL}"
  },
});

const w = await sp.web.get();
```

### Create Web instances directly

Using this method you create the web directly with the url you want to use as the base.

```TypeScript
import { Web } from "@pnp/sp";

const web = new Web("{Absolute SharePoint Web URL}");
const w = await web.get();
```

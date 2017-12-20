# Getting Started

These libraries are geared towards folks working with TypeScript but will work equally well for JavaScript projects. To get started you need to install
the libraries you need via npm. Many of the packages have a peer dependency to other packages with the @pnp namespace meaning you may need to install
more than one package. All packages are released together eliminating version confusion - all packages will depend on packages with the same version number.

## Connect to SharePoint from Node

Because peer dependencies are not installed automatically you will need to list out each package to install. Don't worry if you forget one you will get a message
on the command line that a peer dependency is missing. Let's for example look at installing the required libraries to connect to SharePoint from nodejs.

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

Similar to the above you can also make calls to the Graph api from node using the libraries. Again we start with installing the required resources.

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




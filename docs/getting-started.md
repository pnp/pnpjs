# Getting Started

This library is geared towards folks working with TypeScript but will work equally well for JavaScript projects. To get started you need to install the libraries you need via npm. Many of the packages have a peer dependency to other packages with the @pnp namespace meaning you may need to install more than one package. All packages are released together eliminating version confusion - all packages will depend on packages with the same version number.

If you need to support older browsers, SharePoint on-premisis servers, or older versions of the SharePoint Framework, please revert to [version 2](./v2/SPFx-on-premises/index.html) of the library and see related documentation on [polyfills](./v2/concepts/polyfill/index.html) for required functionality.

## Minimal Requirements

    - NodeJs: >= 14
    - TypeScript: 4.x
    - Node Modules Supported: ESM Only

## Install

First you will need to install those libraries you want to use in your application. Here we will install the most frequently used packages. `@pnp/sp` to access the SharePoint REST API and `@pnp/graph` to access some of the Microsoft Graph API. This step applies to any environment or project.

`npm install @pnp/sp @pnp/graph --save`

Next we can import and use the functionality within our application. Below is a very simple example, please see the individual package documentation for more details and examples.

```ts
import { getRandomString } from "@pnp/core";

(function() {

    // get and log a random string
    console.log(getRandomString(20));

})()
```

## Getting Started with SharePoint Framework

The @pnp/sp and @pnp/graph libraries are designed to work seamlessly within SharePoint Framework projects with a small amount of upfront configuration. If you are running in 2016 or 2019 on-premises you will need to use [version 2](./v2/SPFx-on-premises/index.html) of the library. If you are targeting SharePoint online you will need to take the additional steps outlined below based on the version of the SharePoint Framework you are targeting.

We've created two Getting Started samples. The first uses the more traditional React Component classes and can be found in the [react-pnp-js-sample](https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-pnp-js-sample) project, utilizing SPFx 1.15.2 and PnPjs V3, it showcases some of the more dramatic changes to the library. There is also a companion video series on YouTube if you prefer to see things done through that medium here's a link to the playlist for the 5 part series:

[Getting started with PnPjs 3.0: 5-part series](https://youtube.com/playlist?list=PLR9nK3mnD-OWvmtj9TKE6tM7ZrUosV_vB)

In addition, we have converted the sample project from React Component to React Hooks. This version can be found in [react-pnp-js-hooks](https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-pnp-js-hooks). This sample will help those struggling to establish context correctly while using the hooks conventions.

The SharePoint Framework supports different versions of TypeScript natively and as of 1.14 release still doesn't natively support TypeScript 4.x. Sadly, this means that to use Version 3 of PnPjs you will need to take a few additional configuration steps to get them to work together.

### SPFx Version 1.15.0 & later

No additional steps required

### SPFx Version 1.12.1 => 1.14.0

1. Update the [rush stack](https://rushstack.io/) compiler to 4.2. This is covered in this [great article by Elio](https://www.eliostruyf.com/define-the-typescript-version-you-want-to-use-in-sharepoint-framework/), but the steps are listed below.
    - Uninstall existing rush stack compiler (replace the ? with the version that is currently referenced in your package.json):
      `npm uninstall @microsoft/rush-stack-compiler-3.?`
    - Install 4.2 version:
      `npm i @microsoft/rush-stack-compiler-4.2`
    - Update tsconfig.json to extend the 4.2 config:
      `"extends": "./node_modules/@microsoft/rush-stack-compiler-4.2/includes/tsconfig-web.json"`

1. Replace the contents of the gulpfile.js with:
    >Note: The only change is the addition of the line to disable tslint.

    ```js
    'use strict';

    const build = require('@microsoft/sp-build-web');

    build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

    var getTasks = build.rig.getTasks;
    build.rig.getTasks = function () {
        var result = getTasks.call(build.rig);

        result.set('serve', result.get('serve-deprecated'));

        return result;
    };

    // ********* ADDED *******
    // disable tslint
    build.tslintCmd.enabled = false;
    // ********* ADDED *******

    build.initialize(require('gulp'));
    ```

### SPFx Version 1.11.0 & earlier

At this time there is no documented method to use version 3.x with SPFx versions earlier than 1.12.1. We recommend that you fall back to using [version 2](./v2/SPFx-on-premises/index.html) of the library or update your SPFx version.

### Imports and usage

Because SharePoint Framework provides a local context to each component we need to set that context within the library. This allows us to determine request urls as well as use the SPFx HttpGraphClient within @pnp/graph. To establish context within the library you will need to use the SharePoint or Graph Factory Interface depending on which set of APIs you want to utilize. For SharePoint you will use the `spfi` interface and for the Microsoft Graph you will use the `graphfi` interface whic are both in the main export of the corresponding package. Examples of both methods are shown below.

Depending on how you architect your solution establishing context is done where you want to make calls to the API. The examples demonstrate doing so in the onInit method as a local variable but this could also be done to a private variable or passed into a service.

>Note if you are going to use both the @pnp/sp and @pnp/graph packages in SPFx you will need to alias the SPFx behavior import, please see the [section](#using-both-pnpsp-and-pnpgraph-in-spfx) below for more details.

### Using @pnp/sp `spfi` factory interface in SPFx

```TypeScript
import { spfi, SPFx } from "@pnp/sp";

// ...

protected async onInit(): Promise<void> {

    await super.onInit();
    const sp = spfi().using(SPFx(this.context));
    
}

// ...

```

### Using @pnp/graph `graphfi` factory interface in SPFx

```TypeScript
import { graphfi, SPFx } from "@pnp/graph";

// ...

protected async onInit(): Promise<void> {

    await super.onInit();
    const graph = graphfi().using(SPFx(this.context));

}

// ...

```

### Using both @pnp/sp and @pnp/graph in SPFx

```TypeScript

import { spfi, SPFx as spSPFx } from "@pnp/sp";
import { graphfi, SPFx as graphSPFx} from "@pnp/graph";

// ...

protected async onInit(): Promise<void> {

    await super.onInit();
    const sp = spfi().using(spSPFx(this.context));
    const graph = graphfi().using(graphSPFx(this.context));

}

// ...

```

## Project Config/Services Setup

Please see the [documentation](./concepts/project-preset.md) on setting up a config file or a services for more information about establishing and instance of the spfi or graphfi interfaces that can be reused. It is a common mistake with users of V3 that they try and create the interface in event handlers which causes issues.

## Getting started with NodeJS

> Due to the way in which Node resolves ESM modules when you use selective imports in node you must include the `index.js` part of the path. Meaning an import like `import "@pnp/sp/webs"` in examples must be `import "@pnp/sp/webs/index.js"`. Root level imports such as `import { spfi } from "@pnp/sp"` remain correct. The samples in this section demonstrate this for their selective imports.

### Importing NodeJS support

> Note that the NodeJS integration relies on code in the module `@pnp/nodejs`. It is therefore required that you import this near the beginning of your program, using simply
>
> ```js
> import "@pnp/nodejs";
> ```

### Authentication

To call the SharePoint APIs via MSAL you are required to use certificate authentication with your application. Fully covering certificates is outside the scope of these docs, but the following commands were used with openssl to create testing certs for the sample code below.

```cmd
mkdir \temp
cd \temp
openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365 -passout pass:HereIsMySuperPass -subj '/C=US/ST=Washington/L=Seattle'
openssl rsa -in keytmp.pem -out key.pem -passin pass:HereIsMySuperPass
```

> Using the above code you end up with three files, "cert.pem", "key.pem", and "keytmp.pem". The "cert.pem" file is uploaded to your AAD application registration. The "key.pem" is read as the private key for the configuration.

### Using @pnp/sp `spfi` factory interface in NodeJS

> Version 3 of this library only supports ESModules. If you still require commonjs modules please check out [version 2](./v2/SPFx-on-premises/index.html).

The first step is to install the packages that will be needed. You can read more about what each package does starting on the [packages](packages.md) page.

```cmd
npm i @pnp/sp @pnp/nodejs
```

Once these are installed you need to import them into your project, to communicate with SharePoint from node we'll need the following imports:

```TypeScript

import { SPDefault } from "@pnp/nodejs";
import "@pnp/sp/webs/index.js";
import { readFileSync } from 'fs';
import { Configuration } from "@azure/msal-node";

function() {
    // configure your node options (only once in your application)
    const buffer = readFileSync("c:/temp/key.pem");

    const config: Configuration = {
        auth: {
            authority: "https://login.microsoftonline.com/{tenant id or common}/",
            clientId: "{application (client) i}",
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

### Using @pnp/graph `graphfi` factory interface in NodeJS

Similar to the above you can also make calls to the Microsoft Graph API from node using the libraries. Again we start with installing the required resources. You can see [./debug/launch/graph.ts](https://github.com/pnp/pnpjs/blob/main/debug/launch/graph.ts) for a live example.

```cmd
npm i @pnp/graph @pnp/nodejs
```

Now we need to import what we'll need to call graph

```TypeScript
import { graphfi } from "@pnp/graph";
import { GraphDefault } from "@pnp/nodejs";
import "@pnp/graph/users/index.js";

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

### Node project using TypeScript producing commonjs modules

For TypeScript projects which output commonjs but need to import esm modules you will need to take a few additional steps to use the pnp esm modules. This is true of any esm module with a project structured in this way, not specific to PnP's implementation. It is very possible there are other configurations that make this work, but these steps worked in our testing. We have also provided [a basic sample](https://github.com/pnp/pnpjs/tree/version-3/samples/nodejs-commonjs) showing this setup.

You must install TypeScript @next or you will get errors using node12 module resolution. This may change but is the current behavior when we did our testing.

`npm install -D typescript@next`

The tsconfig file for your project should have the `"module": "CommonJS"` and `"moduleResolution": "node12",` settings in addition to whatever else you need.

_tsconfig.json_

```JSON
{
    "compilerOptions": {
        "module": "CommonJS",
        "moduleResolution": "node12"
}
```

You must then import the esm dependencies using the async import pattern. This works as expected with our selective imports, and vscode will pick up the intellisense as expected.

_index.ts_

```TypeScript
import { settings } from "./settings.js";

// this is a simple example as async await is not supported with commonjs output
// at the root.
setTimeout(async () => {

    const { spfi } = await import("@pnp/sp");
    const { SPDefault } = await import("@pnp/nodejs");
    await import("@pnp/sp/webs/index.js");

    const sp = spfi().using(SPDefault({
        baseUrl: settings.testing.sp.url,
        msal: {
            config: settings.testing.sp.msal.init,
            scopes: settings.testing.sp.msal.scopes
        }
    }));
    
    // make a call to SharePoint and log it in the console
    const w = await sp.web.select("Title", "Description")();
    console.log(JSON.stringify(w, null, 4));

}, 0);
```

Finally, when launching node you need to include the `` flag with a setting of 'node'.

`node --experimental-specifier-resolution=node dist/index.js`

> Read more in the releated [TypeScript Issue](https://github.com/microsoft/TypeScript/issues/43329), [TS pull request Adding the functionality](https://github.com/microsoft/TypeScript/pull/45884), and the [TS Docs](https://www.typescriptlang.org/tsconfig#moduleResolution).

## Single Page Application Context

In some cases you may be working in a client-side application that doesn't have context to the SharePoint site. In that case you will need to utilize the MSAL Client, you can get the details on creating that connection in this [article](./concepts/authentication.md#MSAL-in-Browser).

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
const sp = spfi(...);

// Option 1: Create a new instance of Queryable
const spWebB = spfi({Other Web URL}).using(SPFx(this.context));

// Option 2: Copy/Assign a new instance of Queryable using the existing
const spWebB = spfi({Other Web URL}).using(AssignFrom(sp.web));

// Option 3: Create a new instance of Queryable using other credentials?
const spWebB = spfi({Other Web URL}).using(SPFx(this.context));

// Option 4: Create new Web instance by using copying SPQuerable and new pointing to new web url (e.g. https://contoso.sharepoint.com/sites/Web2)
const web = Web([sp.web, {Other Web URL}]);
```

## Next Steps

For more complicated authentication scnearios please [review the article describing all of the available authentication methods](./concepts/authentication.md).

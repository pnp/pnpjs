# Transition Guide

These libraries are based on the [sp-pnp-js](https://github.com/SharePoint/PnP-JS-Core) library and our goal was to make transition as easy as possible. The most
obvious difference is the splitting of the library into multiple packages. We have however created a rollup library to help folks make the move - though our 
recommendation is to switch to the separate packages. This article outlines transitioning your existing projects from sp-pnp-js to the new libraries, please provide
feedback on how we can improve out guidance.

## Installing @pnp libraries

With the separation of the packages we needed a way to indicate how they are related, while making things easy for folks to track and update and we have used peer
dependencies between the packages to do this. With each release we will release all packages so that the version numbers move in lock-step, making it easy to ensure
you are working with compatible versions. One thing to keep in mind with peer dependencies is that they are not automatically installed. The advantage is you
will only have one copy of each library in your project.

Installing peer dependencies is easy, you can specify each of the packages in a single line, here we are installing everything required to use the @pnp/sp package.

```
npm i @pnp/logging @pnp/common @pnp/odata @pnp/sp
```

If you do not install all of the peer dependencies you will get a message specifying which ones are missing along with the version expected.

## Import Simplification

With the separation of packages we have also simplified the imports, and allowed you more control over what you are importing. Compare these two examples showing
the same set of imports, but one is done via sp-pnp-js and the other using the @pnp libraries.

### From sp-pnp-js
```TypeScript
import pnp, {
  Web,
  Util,
  Logger,
  FunctionListener,
  LogLevel,
} from "sp-pnp-js";
```

### From @pnp libraries
```TypeScript
import {
  Logger,
  LogLevel,
  FunctionListener
} from "@pnp/logging";

import * as Util from "@pnp/common";

import {
  sp,
  Web
} from "@pnp/sp";
```

In the above example the "sp" import replaces "pnp" and is the root of your method chains. Once we have updated our imports we have a few small code changes to make,
depending on how you have used the library in your applications. Watch this short video discussing the most common updates:

<iframe width="560" height="315" src="https://www.youtube.com/embed/oAZX2_DFVjY?rel=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## Updated settings file format

If you are doing local debugging or testing you have likely created a settings.js from the supplied settings.example.js. Please note the format of that file has changed,
the new format is shown below.

```JavaScript
var settings = {

    spsave: {
        username: "develina.devsson@mydevtenant.onmicrosoft.com",
        password: "pass@word1",
        siteUrl: "https://mydevtenant.sharepoint.com/"
    },
    testing: {
        enableWebTests: true,
        sp: {
            id: "{ client id }",
            secret: "{ client secret }",
            url: "{ site collection url }",
            notificationUrl: "{ notification url }",
        },
        graph: {
            tenant: "{tenant.onmicrosoft.com}",
            id: "{your app id}",
            secret: "{your secret}"
        },
    }
}
```

## HttpClient Renamed

If you used HttpClient from sp-pnp-js it was renamed to SPHttpClient. A transition to @pnp/sp assumes replacement of:

```TypeScript
import { HttpClient } from 'sp-pnp-js';
```

to the following import statement:

```TypeScript
import { SPHttpClient } from '@pnp/sp';
```

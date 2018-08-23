# Deployment

There are two recommended ways to consume the library in a production deployment: bundle the code into your solution (such as with webpack), or reference the code from a CDN. These methods are outlined here but this is not meant to be an exhaustive guide on all the ways to package and deploy solutions.

## Bundle

If you have installed the library via NPM into your application solution bundlers such as webpack can bundle the PnPjs libraries along with your solution. This can make deployment easier, but will increase the size of your application by the size of the included libraries. The PnPjs libraries are setup to support tree shaking which can help with the bundle size.

## CDN

If you have public internet access you can reference the library from cdnjs which maintains copies of all versions. This is ideal as you do not need to host the file yourself, and it is easy to update to a newer release by updating the URL in your solution. Below lists all of the library locations within cdnjs, you will need to ensure you have the full url to the file you need, such as: "https://cdnjs.cloudflare.com/ajax/libs/pnp-common/1.1.1/common.es5.umd.min.js". To use the libraries with a script tag in a page it is recommended to use the *.es5.umd.min.js versions. This will add a global pnp value with each library added as pnp.{lib name} such as pnp.sp, pnp.common, etc.

- [https://cdnjs.com/libraries/pnp-common](https://cdnjs.com/libraries/pnp-common)
- [https://cdnjs.com/libraries/pnp-config-store](https://cdnjs.com/libraries/pnp-config-store)
- [https://cdnjs.com/libraries/pnp-graph](https://cdnjs.com/libraries/pnp-graph)
- [https://cdnjs.com/libraries/pnp-logging](https://cdnjs.com/libraries/pnp-logging)
- [https://cdnjs.com/libraries/pnp-odata](https://cdnjs.com/libraries/pnp-odata)
- [https://cdnjs.com/libraries/pnp-pnpjs](https://cdnjs.com/libraries/pnp-pnpjs)
- [https://cdnjs.com/libraries/pnp-sp](https://cdnjs.com/libraries/pnp-sp)
- [https://cdnjs.com/libraries/pnp-sp-addinhelpers](https://cdnjs.com/libraries/pnp-sp-addinhelpers)
- [https://cdnjs.com/libraries/pnp-sp-clientsvc](https://cdnjs.com/libraries/pnp-sp-clientsvc)
- [https://cdnjs.com/libraries/pnp-sp-taxonomy](https://cdnjs.com/libraries/pnp-sp-taxonomy)

### CDN and SPFx

If you are developing in SPFx and install and import the PnPjs libraries the default behavior will be to bundle the library into your solution. You have a couple of choices on how best to work with CDNs and SPFx. Because SPFx doesn't currently respect peer dependencies it is easier to reference the pnpjs rollup package for your project. In this case you would install the package, reference it in your code, and update your config.js file externals as follows:

#### Install

`npm install @pnp/pnpjs --save`

#### In Code

```TypeScript
import { sp } from "@pnp/pnpjs";

sp.web.lists.getByTitle("BigList").get().then(r => {

    this.domElement.innerHTML += r.Title;
});
```

#### config.js

```JSON
  "externals": {
    "@pnp/pnpjs": {
      "path": "https://cdnjs.cloudflare.com/ajax/libs/pnp-pnpjs/1.1.4/pnpjs.es5.umd.bundle.min.js",
      "globalName": "pnp"
    }
  },
```

-----

You can still work with the individual packages from the cdn, but you have a bit more work to do. First you install the modules you plan to use, update the config with the longer JSON below, and you'll need to add some blind require statements into your code. These are needed because peer dependencies are not processed so you have to "trigger" the SPFx manifest creator to include those packages.

#### Install

`npm install @pnp/logging @pnp/common @pnp/odata @pnp/sp --save`

#### In Code

```TypeScript
// blind require statements

import { sp } from "@pnp/sp";

sp.web.lists.getByTitle("BigList").get().then(r => {

    this.domElement.innerHTML += r.Title;
});
```

#### config.js
```JSON
"externals": {
  "pnp.sp": {
    "path": "https://cdnjs.cloudflare.com/ajax/libs/pnp-sp/1.1.5/sp.es5.umd.min.js",
    "globalName": "pnp.sp",
    "globalDependencies": [
      "pnp.logging",
      "pnp.common",
      "pnp.odata",
      "tslib"
    ]
  },
  "pnp.odata": {
    "path": "https://cdnjs.cloudflare.com/ajax/libs/pnp-odata/1.1.5/odata.es5.umd.min.js",
    "globalName": "pnp.odata",
    "globalDependencies": [
      "pnp.common",
      "pnp.logging",
      "tslib"
    ]
  },
  "pnp.common": {
    "path": "https://cdnjs.cloudflare.com/ajax/libs/pnp-common/1.1.5/common.es5.umd.min.js",
    "globalName": "pnp.common",
    "globalDependencies": [
      "pnp.logging",
      "tslib",
      "adal-angular"
    ]
  },
  "pnp.logging": {
    "path": "https://cdnjs.cloudflare.com/ajax/libs/pnp-logging/1.1.5/logging.es5.umd.min.js",
    "globalName": "pnp.logging"
  },
  "tslib": {
    "path": "https://cdnjs.cloudflare.com/ajax/libs/tslib/1.9.3/tslib.min.js",
    "globalName": "tslib"
  },
  "adal-angular": {
    "path": "https://secure.aadcdn.microsoftonline-p.com/lib/1.0.17/js/adal-angular.min.js",
    "globalName": "angular"
  }
},
```









You may need to add additional lines following the pattern if you are using other libraries - you do not need to include lines for libraries you are not using. Find [more detail specific to SPFx here](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/basics/add-an-external-library#load-a-script-from-a-cdn).

```JSON
externals: {
    "@pnp/logging": "https://cdnjs.cloudflare.com/ajax/libs/pnp-logging/1.1.1/logging.es5.umd.min.js",
    "@pnp/common": "https://cdnjs.cloudflare.com/ajax/libs/pnp-common/1.1.1/common.es5.umd.min.js",
    "@pnp/odata": "https://cdnjs.cloudflare.com/ajax/libs/pnp-odata/1.1.1/odata.es5.umd.min.js",
    "@pnp/sp": "https://cdnjs.cloudflare.com/ajax/libs/pnp-sp/1.1.1/sp.es5.umd.min.js"
}
```

Don't forget to update the version number in the url to match the version you want to use. This will stop the library from being bundled directly into the solution and instead use the copy from the CDN. When a new version of the PnPjs libraries are released and you are ready to update just update this url in your SPFX project's config.js file.







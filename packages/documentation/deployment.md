# Deployment

There are two recommended ways to consume the library in a production deployment: bundle the code into your solution (such as with webpack), or reference the code from a CDN. These methods are outlined here but this is not meant to be an exhaustive guide on all the ways to package and deploy solutions.

## Bundle

If you have installed the library via NPM into your application solution bundlers such as webpack can bundle the PnPjs libraries along with your solution. This can make deployment easier, but will increase the size of your application by the size of the included libraries. The PnPjs libraries are setup to support tree shaking which can help with the bundle size.

## CDN

If you have public internet access you can reference the library from [cdnjs](https://cdnjs.com) or [unpkg](https://unpkg.com) which maintains copies of all versions. This is ideal as you do not need to host the file yourself, and it is easy to update to a newer release by updating the URL in your solution. Below lists all of the library locations within cdnjs, you will need to ensure you have the full url to the file you need, such as: "https://cdnjs.cloudflare.com/ajax/libs/pnp-common/1.1.1/common.es5.umd.min.js". To use the libraries with a script tag in a page it is recommended to use the *.es5.umd.min.js versions. This will add a global pnp value with each library added as pnp.{lib name} such as pnp.sp, pnp.common, etc.

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

#### config.json

```JSON
  "externals": {
    "@pnp/pnpjs": {
      "path": "https://cdnjs.cloudflare.com/ajax/libs/pnp-pnpjs/1.1.4/pnpjs.es5.umd.bundle.min.js",
      "globalName": "pnp"
    }
  },
```

-----

You _can_ still work with the individual packages from a cdn, but you have a bit more work to do. First install the modules you need, update the config with the JSON externals below, and add some blind require statements into your code. These are needed because peer dependencies are not processed by SPFx so you have to "trigger" the SPFx manifest creator to include those packages.

> Note this approach requires using version 1.1.5 (specifically beta 1.1.5-2) or later of the libraries as we had make a few updates to how things are packaged to make this a little easier.

#### Install

`npm install @pnp/logging @pnp/common @pnp/odata @pnp/sp --save`

#### In Code

```TypeScript
// blind require statements
require("tslib");
require("@pnp/logging");
require("@pnp/common");
require("@pnp/odata");
import { sp } from "@pnp/sp";

sp.web.lists.getByTitle("BigList").get().then(r => {

    this.domElement.innerHTML += r.Title;
});
```

#### config.json
```JSON
"externals": {
  "@pnp/sp": {
    "path": "https://unpkg.com/@pnp/sp@1.1.5-2/dist/sp.es5.umd.min.js",
    "globalName": "pnp.sp",
    "globalDependencies": [
      "@pnp/logging",
      "@pnp/common",
      "@pnp/odata",
      "tslib"
    ]
  },
  "@pnp/odata": {
    "path": "https://unpkg.com/@pnp/odata@1.1.5-2/dist/odata.es5.umd.min.js",
    "globalName": "pnp.odata",
    "globalDependencies": [
      "@pnp/common",
      "@pnp/logging",
      "tslib"
    ]
  },
  "@pnp/common": {
    "path": "https://unpkg.com/@pnp/common@1.1.5-2/dist/common.es5.umd.bundle.min.js",
    "globalName": "pnp.common"     
  },
  "@pnp/logging": {
    "path": "https://unpkg.com/@pnp/logging@1.1.5-2/dist/logging.es5.umd.min.js",
    "globalName": "pnp.logging",
    "globalDependencies": [
      "tslib"
    ]
  },
  "tslib": {
    "path": "https://cdnjs.cloudflare.com/ajax/libs/tslib/1.9.3/tslib.min.js",
    "globalName": "tslib"
  }
}
```

Don't forget to update the version number in the url to match the version you want to use. This will stop the library from being bundled directly into the solution and instead use the copy from the CDN. When a new version of the PnPjs libraries are released and you are ready to update just update this url in your SPFX project's config.js file.







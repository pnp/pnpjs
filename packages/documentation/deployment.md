# Deployment

There are two recommended ways to consume the library in a production deployment: bundle the code into your solution (such as with webpack), or reference the code from a CDN. These methods are outlined here but this is not meant to be an exhaustive guide on all the ways to package and deploy solutions.

## Bundle

If you have installed the library via NPM into your application solution bundlers such as webpack can bundle the PnPjs libraries along with your solution. This can make deployment easier, but will increase the size of your application by the size of the included libraries. The PnPjs libraries are setup to support tree shaking which can help with the bundle size.

## CDN

If you have public internet access you can reference the library from cdnjs which maintains copies of all versions. This is ideal as you do not need to host the file yourself, and it is easy to update to a newer release by updating the URL in your solution. Below lists all of the library locations within cdnjs, you will need to ensure you have the full url to the file you need, such as: "https://cdnjs.cloudflare.com/ajax/libs/pnp-common/1.1.1/common.es5.umd.min.js".

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

If you are developing in SPFx and install and import the PnPjs libraries the default behavior will be to bundle the library into your solution. If you are able it is recommended to reference the library as an external by updating the SPFx config/config.js to include these lines in the externals section. You may need to add additional lines following the pattern if you are using other libraries - you do not need to include lines for libraries you are not using. Find [more detail specific to SPFx here](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/basics/add-an-external-library#load-a-script-from-a-cdn).

```
externals: {
    "@pnp/logging": "https://cdnjs.cloudflare.com/ajax/libs/pnp-logging/1.1.1/logging.es5.umd.min.js",
    "@pnp/common": "https://cdnjs.cloudflare.com/ajax/libs/pnp-common/1.1.1/common.es5.umd.min.js",
    "@pnp/odata": "https://cdnjs.cloudflare.com/ajax/libs/pnp-odata/1.1.1/odata.es5.umd.min.js",
    "@pnp/sp": "https://cdnjs.cloudflare.com/ajax/libs/pnp-sp/1.1.1/sp.es5.umd.min.js"
}
```

Don't forget to update the version number in the url to match the version you want to use. This will stop the library from being bundled directly into the solution and instead use the copy from the CDN. When a new version of the PnPjs libraries are released and you are ready to update just update this url in your SPFX project's config.js file.







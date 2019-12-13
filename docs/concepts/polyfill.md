# Polyfills

These libraries may make use of some features not found in older browsers, mainly fetch, Map, and Proxy. This primarily affects Internet Explorer 11, which requires that we provide this missing functionality. There are several ways to include this missing functionality.

## IE 11 Polyfill package

We created a package you can use to include the needed functionality without having to determine what polyfills are required. Also, this package is independent of the other @pnp/* packages and does not need to be updated monthly unless we introduce additional polyfills and publish a new version. This package is only needed if you need to support IE 11.

### Install

`npm install --save @pnp/polyfill-ie11`

### Use

```TypeScript
import "@pnp/polyfill-ie11";
import { sp } from "@pnp/sp";

sp.web.lists.getByTitle("BigList").items.filter(`ID gt 6000`).get().then(r => {
  this.domElement.innerHTML += r.map(l => `${l.Title}<br />`);
});
```

### SearchQueryBuilder

Because the latest version of SearchQueryBuilder uses Proxy internally you can fall back on the older version for IE 11 as shown below.

```TypeScript
import "@pnp/polyfill-ie11";
import { SearchQueryBuilder } from "@pnp/polyfill-ie11/dist/searchquerybuilder";
import { sp, ISearchQueryBuilder } from "@pnp/sp";

// works in IE11 and other browsers
const builder: ISearchQueryBuilder = SearchQueryBuilder().text("test");

sp.search(builder).then(r => {
  this.domElement.innerHTML = JSON.stringify(r);
});
```

## Polyfill Service

If acceptable to your design and security requirements you can use a service to provide missing functionality. This loads scripts from a service outside of your and our
control, so please ensure you understand any associated risks.

To use this option you need to wrap the code in a function, here called "stuffisloaded". Then you need to add another script tag as shown below that will load what you need from the polyfill service. Note the parameter "callback" takes our function name.

```HTML
<script src="https://cdnjs.cloudflare.com/ajax/libs/pnp-pnpjs/1.2.1/pnpjs.es5.umd.bundle.min.js" type="text/javascript"></script>
<script>
// this function will be executed once the polyfill is loaded.
function stuffisloaded() {

  pnp.sp.web.select("Title").get()
    .then(function(data){
      document.getElementById("main").innerText=data.Title;
  })   
  .catch(function(err){  
    document.getElementById("main").innerText=err;
  });
}
</script>
<!-- This script tag loads the required polyfills from the service -->
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?callback=stuffisloaded&features=es6,fetch,Map&flags=always,gated"></script>
```

## Module Loader

If you are using a module loader you need to load the following two files as well. You can do this form a CDN or your style library.

1. Download the **es6-promises** polyfill from https://github.com/stefanpenner/es6-promise and upload it to your style library.
2. Download the **fetch** polyfill from https://github.com/github/fetch and upload it to your style library.
2. Download the **corejs** polyfill from https://github.com/zloirock/core-js and upload it to your style library.
3. Update your module loader to set these files as dependencies before the pnp library is opened.

One issue you still may see is that you get errors that certain libraries are undefined when you try to run your code. This is because your code is running before
these libraries are loaded. You need to ensure that all dependencies are loaded **before** making use of the pnp libraries.

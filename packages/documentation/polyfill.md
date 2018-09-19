# Polyfills

These libraries may make use of some features not found in older browsers, mainly fetch, Map, and Proxy. This primarily affects Internet Explorer, which requires that we provide this missing functionality. There are several ways to include this missing functionality.

## Statement on IE 11

Starting with version 1.2.0 we no longer explictly support IE 11. This wasn't done to be malicious but rather we wanted take advantage of some newer features available in JavaScript, namely Proxy and Map. Proxy allows for some interesting patterns, especially when it comes to building a fluent API. Some of that work can be seen in the [SearchQueryBuilder](https://github.com/pnp/pnpjs/blob/dev/packages/sp/src/search.ts#L102) code and we are exploring other applications. The move to Map from our custom Dictionary was to shrink the code base as well as gain some performance from the OOTB optimizations.

We have since heard that this has caused some folks pain in updating to this version of the libarary. We should have communicated the change better, but it is a change we are going to stick with. 

### Limitations

The following functionality does not work in IE 11:

- @pnp/sp : SearchQueryBuilder class used to build fluent queries, search continues to work as before.
  - This is because no pollyfill is available for Proxy [stackoverflow thread](https://stackoverflow.com/questions/45285992/es6-proxy-polyfill-for-ie11)

### Require Polyfill

- Promise
- Fetch
- Array Iterator
- Array From
- Map

## SharePoint Framework

As [suggested in this issue](https://github.com/pnp/pnpjs/issues/237#issuecomment-421059737) the following polyfills should fix any IE 11 related issues:

```TypeScript
import "core-js/modules/es6.promise"
import "core-js/modules/es6.array.iterator.js"
import "core-js/modules/es6.array.from.js"
import "whatwg-fetch"
import "es6-map/implement"
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

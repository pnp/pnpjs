# Polyfills

These libraries may make use of some features not found in older browsers. This primarily affects Internet Explorer 11, which requires that we provide this missing functionality.

> If you are supporting IE11 [enable IE11 mode](./ie11-mode.md).

## IE 11 Polyfill package

We created a package you try and help provide this missing functionality. This package is independent of the other @pnp/* packages and does not need to be updated monthly unless we introduce additional polyfills and publish a new version. This package is only needed if you are required to support IE 11.

### Install

`npm install @pnp/polyfill-ie11 --save`

### Use

```TypeScript
import "@pnp/polyfill-ie11";
import { sp } from "@pnp/sp/presets/all";

sp.web.lists.getByTitle("BigList").items.filter(`ID gt 6000`).get().then(r => {
  this.domElement.innerHTML += r.map(l => `${l.Title}<br />`);
});
```

### Selective Use

Starting with version 2.0.2 you can selectively include the polyfills from the package. Depending on your needs it may make sense in your application to use the underlying libraries directly. We have added an [expanded statement on our polyfills](#general-statement-on-polyfills).

```TypeScript
// individually include polyfills as needed to match your requirements
import "@pnp/polyfill-ie11/dist/fetch";
import "@pnp/polyfill-ie11/dist/fill";
import "@pnp/polyfill-ie11/dist/from";
import "@pnp/polyfill-ie11/dist/iterator";
import "@pnp/polyfill-ie11/dist/map";
import "@pnp/polyfill-ie11/dist/promise";
import "@pnp/polyfill-ie11/dist/reflect";
import "@pnp/polyfill-ie11/dist/symbol";


// works in IE11 and other browsers
sp.web.lists.getByTitle("BigList").items.filter(`ID gt 6000`).get().then(r => {
  this.domElement.innerHTML += r.map(l => `${l.Title}<br />`);
});
```

### SearchQueryBuilder

Because the latest version of SearchQueryBuilder uses Proxy internally you can fall back on the older version as shown below.

```TypeScript
import "@pnp/polyfill-ie11";
import { SearchQueryBuilder } from "@pnp/polyfill-ie11/dist/searchquerybuilder";
import { sp, ISearchQueryBuilder } from "@pnp/sp/presets/all";

// works in IE11 and other browsers
const builder: ISearchQueryBuilder = SearchQueryBuilder().text("test");

sp.search(builder).then(r => {
  this.domElement.innerHTML = JSON.stringify(r);
});
```

## General Statement on Polyfills

Internet Explorer 11 (IE11) has been an enterprise standard browser for many years. Given the complexity in changing technical platforms in many organizations, it is no surprise standardization on this out-of-date browser continues. Unfortunately, for those organizations, the Internet has moved on and many - if not all - SaaS platforms are embracing modern standards and no longer supporting the legacy IE11 browser. Even Microsoft states in their official documentation that Microsoft 365 is best experienced with a modern browser. They have even gone so far to build the latest version of Microsoft Edge based on Chromium (Edge Chromium), with an "Internet Explorer mode" allowing organizations to load legacy sites which require IE automatically.
 
PnPjs is now "modern" as well, and by that we mean we have moved to using capabilities of current browsers and JavaScript which are not present in IE11. We understand as a developer your ability to require an organization to switch browsers is unrealistic. We want to do everything we can to support you, but it is up to you to ensure your application is properly supported in IE11.
 
There are many polyfills available, depending on the platform you're running on, the frameworks you are using, and the libraries you consume. Although the majority of PnPjs users build for SharePoint Online, a significant number build for earlier versions of the platform as well as for their own node-based solutions or websites. Unfortunately, there is no way our polyfill library can support all these scenarios.
 
What we intended with the @pnp/polyfill-ie11 package was to provide a comprehensive group of all the polyfills that would be needed based on the complete PnPjs library. We are finding when we aggregate our polyfills with the polyfills provided in the SharePoint page and from other sources, things don't always work well. We cannot solve this for your specific situations except by providing you transparency into the polyfills which we know are necessary for our packages. You may need to adjust what polyfills your application uses based on the other libraries you are using.
 
To that end, we want to provide the list of polyfills we recommend here - along with the associated packages – with the goal of helping you to work out what combination of polyfills might work with your code. Also, if you haven't reviewed it yet, please check out the information on [IE11 Mode](./ie11-mode.md) for how to configure IE11 mode in the sp.setup as well as what limitations doing so will have on your usage of PnPjs.

|imports|
|---|
|import "core-js/stable/array/from";|
|import "core-js/stable/array/fill";|
|import "core-js/stable/array/iterator";|
|import "core-js/stable/promise";|
|import "core-js/stable/reflect";|
|import "es6-map/implement";|
|import "core-js/stable/symbol";|
|import "whatwg-fetch";|

The following NPM packages are what we use to do the above indicated imports
|package|
|---|
|[core-js](https://www.npmjs.com/package/core-js)|
|[es6-map](https://www.npmjs.com/package/es6-map)|
|[whatwg-fetch](https://www.npmjs.com/package/whatwg-fetch)|

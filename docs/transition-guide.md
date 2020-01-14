# Transition Guide

We have worked to make moving from @pnp library 1.* to 2.* as painless as possible, however there are some changes to how things work. The below guide we have provided an overview of what it takes to transition between the libraries. If we missed something, please let us know in the issues list so we can update the guide. Thanks!

## Installing @pnp libraries

In version 1.* the libraries were setup as peer dependencies of each other requiring you to install each of them separately. We continue to believe this correctly describes the relationship, but recognize that basically nothing in the world accounts for peer dependencies. So we have updated the libraries to be dependencies. This makes it easier to install into your projects as you only need to install a single library:

```
npm i --save @pnp/sp
```

## Selective Imports

Another big change in v2 is the ability to selectively import the pieces you need from the libraries. This allows you to have smaller bundles and works well with tree-shaking. It does require you to have more import statements, which can potentially be a bit confusing at first. The selective imports apply to the sp and graph libraries.

To help explain let's take the example of the Web object. In v1 Web includes a reference to pretty much everything else in the entire sp library. Meaning that if you use web (and you pretty much have to) you hold a ref to all the other pieces (like Fields, Lists, ContentTypes) even if you aren't using them. Because of that tree shaking can't do anything to reduce the bundle size because it "thinks" you are using them simply because they have been imported. To solve this in v2 the Web object no longer contains references to anything, it is a bare object with a few methods. If you look at the source you will see that, for example, there is no longer a "lists" property. These properties and methods are now added through selectively importing the functionality you need:

### Selectively Import Web lists functionality

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
// this imports the functionality for lists associated only with web
import "@pnp/sp/lists/web";

const r = await sp.web.lists();
```

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
// this imports all the functionality for lists
import "@pnp/sp/lists";

const r = await sp.web.lists();
```

Each of the docs pages shows the selective import paths for each sub-module (lists, items, etc.).

### Presets

In addition to the ability to selectively import functionality you can import presets. This allows you to import an entire set of functionality in a single line. At launch the sp library will support two presets "all" and "core" with the graph library supporting "all". **Using the "all" preset will match the functionality of v1.** This can save you time in transitioning your projects so you can update to selective imports later. For new projects we recommend using the selective imports from day 1.

To update your V1 projects to V2 you can replace all instances of "@pnp/sp" with "@pnp/sp/presets/all" and things should work as before (though some class names or other things may have changed, please review the change log and the rest of this guide).

```TypeScript
// V1 way of doing things:
import {
    sp,
    ClientSideWebpart,
    ClientSideWebpartPropertyTypes,
} from "@pnp/sp";

// V2 way with selective imports
import { sp } from "@pnp/sp";
import { ClientSideWebpart, ClientSideWebpartPropertyTypes } from "@pnp/sp/clientside-pages";

// V2 way with preset "all"
import { sp, ClientSideWebpart, ClientSideWebpartPropertyTypes } from "@pnp/sp/presets/all";
```

## Invokable Objects

Another new feature is the addition of invokable objects. Previously where you used "get()" to invoke a request you can now leave it off. We have left the .get method in place so everyone's code wasn't broken immediately upon transitioning.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";

// old way (still works)
const r1 = sp.web.get();

// invokable
const r2 = sp.web();
```

The benefit is that objects can now support default actions that are not "get" but might be "post". And you save typing a few extra characters. This still work the same as with select or any of the other odata methods:

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";

// invokable
const r = sp.web.select("Title", "Url")();
```

## Factory Functions & Interfaces

Another change in the library is in the structure of exports. We are no longer exporting the objects themselves, rather we are only exposing factory functions and interfaces. This allows us to decouple what developers use from our internal implementation. For folks using the fluent chain starting with sp you shouldn't need to update your code. If you are using any of the v1 classes directly you should just need to remove the "new" keyword and update the import path. The factory functions signature matches the constructor signature of the v1 objects.

```TypeScript
// v1
import { Web } from "@pnp/sp";

const web: Web = new Web("some absolute url");

const r1 = web.get();

// v2
import { Web, IWeb } from "@pnp/sp/webs";

const web: IWeb = Web("some absolute url");

const r2 = web();
```

## Extension Methods

Another new capability in v2 is the ability to extend objects and factories. This allows you to easily add methods or properties on a per-object basis. Please see the [full article on extension methods](odata/extensions.md) describing this great new capability.

## CDN publishing

Starting with v2 we will no longer create bundles for each of the packages. Historically these are not commonly used, don't work perfectly for everyone (there are a lot of ways to bundle things), and another piece we need to maintain. Instead we encourage folks to create their [own bundles](concepts/custom-bundle.md), optimized for their particular scenario. This will result in smaller overall bundle size and allow folks to bundle things to match their scenario. Please [review the article on creating your custom bundles](concepts/custom-bundle.md) to see how to tailor bundles to your needs.

The PnPjs bundle will remain, though it is designed only for backwards compatibility and we strongly recommend creating your own bundles, or directly importing the libraries into your projects using selective imports.

## Drop client-svc and sp-taxonomy libraries

These libraries were created to allow folks to access and manage SharePoint taxonomy and manage metadata. Given that there is upcoming support for taxonomy via a supported REST API we will drop these two libraries. If working with taxonomy remains a core requirement of your application and we do not yet have support for the new apis, please remain on v1 for the time being.

## Changelog

Please review the [CHANGELOG](https://github.com/pnp/pnpjs/blob/dev-v2/CHANGELOG.md) for details on all library changes.

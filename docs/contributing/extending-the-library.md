# Extending PnPjs

> This article is targeted at people wishing to extend PnPjs itself, usually by adding a method or property.

At the most basic level PnPjs is a set of libraries used to build and execute a web request and handle the response from that request. Conceptually each object in the fluent chain serves as input when creating the next object in the chain. This is how configuration, url, query, and other values are passed along. To get a sense for what this looks like see the code below. This is taken from inside the [webs submodule](https://github.com/pnp/pnpjs/blob/version-2/packages/sp/webs/types.ts#L77) and shows how the "webs" property is added to the web class.

```TypeScript
// TypeScript property, returning an interface
public get webs(): IWebs {
    // using the Webs factory function and providing "this" as the first parameter
    return Webs(this);
}
```

## Understanding Factory Functions

PnPjs v3 is designed to only expose interfaces and factory functions. Let's look at the Webs factory function, used above as an example. All factory functions in sp and graph have a similar form.

```TypeScript
// create a constant which is a function of type ISPInvokableFactory having the name Webs
// this is bound by the generic type param to return an IWebs instance
// and it will use the _Webs concrete class to form the internal type of the invocable
export const Webs = spInvokableFactory<IWebs>(_Webs);
```

The ISPInvokableFactory type looks like:

```TypeScript
export type ISPInvokableFactory<R = any> = (baseUrl: string | ISharePointQueryable, path?: string) => R;
```

And the matching graph type:

```TypeScript
<R>(f: any): (baseUrl: string | IGraphQueryable, path?: string) => R
```

The general idea of a factory function is that it takes two parameters. The first is either a string or Queryable derivative which forms base for the new object. The second is the next part of the url. In some cases (like the webs property example above) you will note there is no second parameter. Some classes are decorated with defaultPath, which automatically fills the second param. Don't worry too much right now about the deep internals of the library, let's instead focus on some concrete examples.

```TypeScript
import { SPFx } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";

// create a web from an absolute url
const web = Web("https://tenant.sharepoint.com").using(SPFx(this.context));

// as an example, create a new web using the first as a base
// targets: https://tenant.sharepoint.com/sites/dev
const web2 = Web(web, "sites/dev");

// or you can add any path components you want, here as an example we access the current user property
const cu = Web(web, "currentuser");
const currentUserInfo = cu();
```

Now hey you might say - you can't create a request to current user using the Web factory. Well you can, since everything is just based on urls under the covers the actual factory names don't mean anything other than they have the appropriate properties and method hung off them. This is brought up as you will see in many cases objects being used to create queries _within_ methods and properties that don't match their "type". It is an important concept when working with the library to always remember we are just building strings.

## Class structure

Internally to the library we have a bit of complexity to make the whole invocable proxy architecture work and provide the typings folks expect. Here is an example implementation with extra comments explaining what is happening. You don't need to understand the entire stack to [add a property](#add-a-property) or [method](#add-a-method)

```TypeScript
/*
The concrete class implementation. This is never exported or shown directly
to consumers of the library. It is wrapped by the Proxy we do expose.

It extends the _SharePointQueryableInstance class for which there is a matching
_SharePointQueryableCollection. The generic parameter defines the return type
of a get operation and the invoked result.

Classes can have methods and properties as normal. This one has a single property as a simple example
*/
export class _HubSite extends _SharePointQueryableInstance<IHubSiteInfo> {

    /**
     * Gets the ISite instance associated with this hub site
     */
    // the tag decorator is used to provide some additional telemetry on what methods are
    // being called.
    @tag("hs.getSite")
    public async getSite(): Promise<ISite> {

        // we execute a request using this instance, selecting the SiteUrl property, and invoking it immediately and awaiting the result
        const d = await this.select("SiteUrl")();

        // we then return a new ISite instance created from the Site factory using the returned SiteUrl property as the baseUrl
        return Site(d.SiteUrl);
    }
}

/*
This defines the interface we export and expose to consumers.
In most cases this extends the concrete object but may add or remove some methods/properties
in special cases
*/
export interface IHubSite extends _HubSite { }

/*
This defines the HubSite factory function as discussed above
binding the spInvokableFactory to a generic param of IHubSite and a param of _HubSite.

This is understood to mean that HubSite is a factory function that returns a types of IHubSite
which the spInvokableFactory will create using _HubSite as the concrete underlying type.
*/
export const HubSite = spInvokableFactory<IHubSite>(_HubSite);
```

## Add a Property

In most cases you won't need to create the class, interface, or factory - you just want to add a property or method. An example of this is sp.web.lists. web is a property of sp and lists is a property of web. You can have a look at those classes as examples. Let's have a look at the fields on the _View class.

```TypeScript
export class _View extends _SharePointQueryableInstance<IViewInfo> {

    // ... other code removed
 
    // add the property, and provide a return type
    // return types should be interfaces
    public get fields(): IViewFields {
        // we use the ViewFields factory function supplying "this" as the first parameter
        // this will create a url like ".../fields/viewfields" due to the defaultPath decorator
        // on the _ViewFields class. This is equivalent to: ViewFields(this, "viewfields")
        return ViewFields(this);
    }

    // ... other code removed
}
```

> There are many examples throughout the library that follow this pattern.

## Add a Method

Adding a method is just like adding a property with the key difference that a method usually _does_ something like make a web request or act like a property but take parameters. Let's look at the _Items getById method:

```TypeScript
@defaultPath("items")
export class _Items extends _SharePointQueryableCollection {

    /**
    * Gets an Item by id
    *
    * @param id The integer id of the item to retrieve
    */
    // we declare a method and set the return type to an interface
    public getById(id: number): IItem {
        // here we use the tag helper to add some telemetry to our request
        // we create a new IItem using the factory and appending the id value to the end
        // this gives us a valid url path to a single item .../items/getById(2)
        // we can then use the returned IItem to extend our chain or execute a request
        return tag.configure(Item(this).concat(`(${id})`), "is.getById");
    }

    // ... other code removed
}
```

### Web Request Method

A second example is a method that performs a request. Here we use the _Item recycle method as an example:

```TypeScript
/**
 * Moves the list item to the Recycle Bin and returns the identifier of the new Recycle Bin item.
 */
// we use the tag decorator to add telemetry
@tag("i.recycle")
// we return a promise
public recycle(): Promise<string> {
    // we use the spPost method to post the request created by cloning our current instance IItem using
    // the Item factory and adding the path "recycle" to the end. Url will look like .../items/getById(2)/recycle
    return spPost<string>(Item(this, "recycle"));
}
```

## Augment Using Selective Imports

To understand is how to extend functionality within the selective imports structures look at [list.ts](https://github.com/pnp/pnpjs/blob/main/packages/sp/items/list.ts) file in the items submodule. Here you can see the code below, with extra comments to explain what is happening. Again, you will see this pattern repeated throughout the library so there are many examples available.

```TypeScript
// import the addProp helper
import { addProp } from "@pnp/queryable";
// import the _List concrete class from the types module (not the index!)
import { _List } from "../lists/types";
// import the interface and factory we are going to add to the List
import { Items, IItems } from "./types";

// This module declaration fixes up the types, allowing .items to appear in intellisense
// when you import "@pnp/sp/items/list";
declare module "../lists/types" {
    // we need to extend the concrete type
    interface _List {
        readonly items: IItems;
    }
    // we need to extend the interface
    // this may not be strictly necessary as the IList interface extends _List so it
    // should pick up the same additions, but we have seen in some cases this does seem
    // to be required. So we include it for safety as it will all be removed during
    // transpilation we don't need to care about the extra code
    interface IList {
        readonly items: IItems;
    }
}

// finally we add the property to the _List class
// this method call says add a property to _List named "items" and that property returns a result using the Items factory
// The factory will be called with "this" when the property is accessed. If needed there is a fourth parameter to append additional path
// information to the property url
addProp(_List, "items", Items);
```

## General Rules for Extending PnPjs

- Only expose interfaces to consumers
- Use the factory functions except in very special cases
- Look for other properties and methods as examples
- Simple is always preferable, but not always possible - use your best judgement
- If you find yourself writing a ton of code to solve a problem you think should be easy, ask
- If you find yourself deep within the core classes or odata library trying to make a change, ask - changes to the core classes are rarely needed

## Next Steps

Now that you have extended the library you need to [write a test](./debug-tests.md) to cover it!

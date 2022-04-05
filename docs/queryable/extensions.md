# Extensions

Extending is the concept of overriding or adding functionality into an object or environment without altering the underlying class instances. This can be useful for debugging, testing, or injecting custom functionality. Extensions work with any [invokable](../concepts/invokable.md) and allow you to control any behavior of the library with extensions.

## Types of Extensions

There are two types of Extensions available as well as three methods for registration. You can register any type of extension with any of the registration options.

### Function Extensions

The first type is a simple function with a signature:

```TypeScript
(op: "apply" | "get" | "has" | "set", target: T, ...rest: any[]): void
```

This function is passed the current operation as the first argument, currently one of "apply", "get", "has", or "set". The second argument is the target instance upon which the operation is being invoked. The remaining parameters vary by the operation being performed, but will match their respective ProxyHandler method signatures.

### Named Extensions

Named extensions are designed to add or replace a single property or method, though you can register multiple using the same object. These extensions are defined by using an object which has the property/methods you want to override described. Registering named extensions globally will override that operation to all invokables.

```TypeScript
import { extendFactory } from "@pnp/queryable";
import { sp, List, Lists, IWeb, ILists, List, IList, Web } from "@pnp/sp/presets/all";
import { escapeQueryStrValue } from "@pnp/sp/utils/escapeQueryStrValue";

// create a plain object with the props and methods we want to add/change
const myExtensions = {
    // override the lists property
    get lists(this: IWeb): ILists {
        // we will always order our lists by title and select just the Title for ALL calls (just as an example)
        return Lists(this).orderBy("Title").select("Title");
    },
    // override the getByTitle method
    getByTitle: function (this: ILists, title: string): IList {
        // in our example our list has moved, so we rewrite the request on the fly
        if (title === "List1") {
            return List(this, `getByTitle('List2')`);
        } else {
            // you can't at this point call the "base" method as you will end up in loop within the proxy
            // so you need to ensure you patch/include any original functionality you need
            return List(this, `getByTitle('${escapeQueryStrValue(title)}')`);
        }
    },
};

// register all the named Extensions
extendFactory(Web, myExtensions);

// this will use our extension to ensure the lists are ordered
const lists = await sp.web.lists();

console.log(JSON.stringify(lists, null, 2));

// we will get the items from List1 but within the extension it is rewritten as List2
const items = await sp.web.lists.getByTitle("List1").items();

console.log(JSON.stringify(items.length, null, 2));
```

### ProxyHandler Extensions

You can also register a partial ProxyHandler implementation as an extension. You can implement one or more of the ProxyHandler methods as needed. Here we implement the same override of getByTitle globally. This is the most complicated method of creating an extension and assumes an understanding of how ProxyHandlers work.

```TypeScript
import { extendFactory } from "@pnp/queryable";
import { sp, Lists, IWeb, ILists, Web } from "@pnp/sp/presets/all";
import { escapeQueryStrValue } from "@pnp/sp/utils/escapeSingleQuote";

const myExtensions = {
    get: (target, p: string | number | symbol, _receiver: any) => {
        switch (p) {
            case "getByTitle":
                return (title: string) => {

                    // in our example our list has moved, so we rewrite the request on the fly
                    if (title === "LookupList") {
                        return List(target, `getByTitle('OrderByList')`);
                    } else {
                        // you can't at this point call the "base" method as you will end up in loop within the proxy
                        // so you need to ensure you patch/include any original functionality you need
                        return List(target, `getByTitle('${escapeQueryStrValue(title)}')`);
                    }
                };
        }
    },
};

extendFactory(Web, myExtensions);

const lists = sp.web.lists;
const items = await lists.getByTitle("LookupList").items();

console.log(JSON.stringify(items.length, null, 2));
```

## Registering Extensions

You can register Extensions on an invocable factory or on a per-object basis, and you can register a single extension or an array of Extensions.

### Factory Registration

The pattern you will likely find most useful is the ability to extend an invocable factory. This will apply your extensions to all instances created with that factory, meaning all IWebs or ILists will have the extension methods. The example below shows how to add a property to IWeb as well as a method to IList.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import { IWeb, Web } from "@pnp/sp/webs";
import { ILists, Lists } from "@pnp/sp/lists";
import { extendFactory } from "@pnp/queryable";
import { sp } from "@pnp/sp";

const sp = spfi().using(...);

// sets up the types correctly when importing across your application
declare module "@pnp/sp/webs/types" {

    // we need to extend the interface
    interface IWeb {
        orderedLists: ILists;
    }
}

// sets up the types correctly when importing across your application
declare module "@pnp/sp/lists/types" {

    // we need to extend the interface
    interface ILists {
        getOrderedListsQuery: (this: ILists) => ILists;
    }
}

extendFactory(Web, {
    // add an ordered lists property
    get orderedLists(this: IWeb): ILists {
        return this.lists.getOrderedListsQuery();
    },
});

extendFactory(Lists, {
    // add an ordered lists property
    getOrderedListsQuery(this: ILists): ILists {
        return this.top(10).orderBy("Title").select("Title");
    },
});

// regardless of how we access the web and lists collections our extensions remain with all new instance based on
const web = Web([sp.web, "https://tenant.sharepoint.com/sites/dev/"]);
const lists1 = await web.orderedLists();
console.log(JSON.stringify(lists1, null, 2));

const lists2 = await Web([sp.web, "https://tenant.sharepoint.com/sites/dev/"]).orderedLists();
console.log(JSON.stringify(lists2, null, 2));

const lists3 = await sp.web.orderedLists();
console.log(JSON.stringify(lists3, null, 2));
```

### Instance Registration

You can also register Extensions on a single object instance, which is often the preferred approach as it will have less of a performance impact across your whole application. This is useful for debugging, overriding methods/properties, or controlling the behavior of specific object instances.

> Extensions are not transferred to child objects in a fluent chain, be sure you are extending the instance you think you are.

Here we show the same override operation of getByTitle on the lists collection, but safely only overriding the single instance.

``` TypeScript
import { extendObj } from "@pnp/queryable";
import { sp, List, ILists } from "@pnp/sp/presets/all";

const myExtensions = {
    getByTitle: function (this: ILists, title: string) {
        // in our example our list has moved, so we rewrite the request on the fly
        if (title === "List1") {
            return List(this, "getByTitle('List2')");
        } else {
            // you can't at this point call the "base" method as you will end up in loop within the proxy
            // so you need to ensure you patch/include any original functionality you need
            return List(this, `getByTitle('${escapeQueryStrValue(title)}')`);
        }
    },
};

const lists =  extendObj(sp.web.lists, myExtensions);
const items = await lists.getByTitle("LookupList").items();

console.log(JSON.stringify(items.length, null, 2));
```

## Enable & Disable Extensions and Clear Global Extensions

Extensions are automatically enabled when you set an extension through any of the above outlined methods. You can disable and enable extensions on demand if needed.

```TypeScript
import { enableExtensions, disableExtensions, clearGlobalExtensions } from "@pnp/queryable";

// disable Extensions
disableExtensions();

// enable Extensions
enableExtensions();
```

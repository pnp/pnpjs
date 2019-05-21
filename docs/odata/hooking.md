# Hooking

_introduced in 2.0.0_

Hooking is the concept of being able to override or add functionality into an object or environment without altering the underlying class instances. This can be useful for debugging, testing, or injecting some custom functionality. Hooks work with any [invokable](../concepts/invokable.md). You can control just about any behavior of the library with hooks.

> Hooks do not work in ie11 compatability mode. This is by design.

## Types of Hooks

There are three types of hooks available as well as two methods for registration. You can register any type of hook with either of the registration options.

### Function Hooks

The first type is a simple function with a signature:

```TypeScript
(op: string, target: T, ...rest: any[]): void
```

This function is passed the current operation as the first argument, currently one of "apply", "get", "has", or "set". The second argument is the target instance upon which the operation is being invoked. The remaining parameters vary by the operation being performed, but will match their respective ProxyHandler calls.

### Named Hooks

Named hooks are designed to replace a single property or method, though you can register multiple using the same object. These hooks are defined by using an object which has the property/methods you want to override described. Registering named hooks global will override that operation for all invokables. Generally these are best used on a per-object basis.

```TypeScript
import { hook } from "@pnp/odata";
import { sp, Lists, IWeb, ILists } from "@pnp/sp/presets/all";
import { escapeQueryStrValue } from "@pnp/sp/src/utils/escapeSingleQuote";

const myHooks = {
    // override the lists property globally
    get lists(this: IWeb): ILists {
        // we will always order our lists by title and select just the Title for ALL calls (just as an example)
        return Lists(this).orderBy("Title").select("Title");
    },
    // override the getByTitle method globally (NOTE: this will also override and break any other method named getByTitle such as views.getByTitle)
    // this is done here as an example. Better to do this type of hook on a per-object basis.
    getByTitle: function (this: ILists, title: string) {
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

// register all the named hooks
hook(myHooks);

// this will use our hook to ensure the lists are ordered
const lists = await sp.web.lists();

console.log(JSON.stringify(lists, null, 2));

// we will get the items from List1 but within the hook it is rewritten as List2
const items = await sp.web.lists.getByTitle("List1").items();

console.log(JSON.stringify(items.length, null, 2));
```

### ProxyHandler Hooks

You can also register a partial ProxyHandler implementation as a hook. You can implement one or more of the ProxyHandler methods as needed. Here we implement the same override of getByTitle globally. This is the most advanced method of creating a hook and assumes an understanding of how ProxyHandlers work.

```TypeScript
import { hook } from "@pnp/odata";
import { sp, Lists, IWeb, ILists } from "@pnp/sp/presets/all";
import { escapeQueryStrValue } from "@pnp/sp/src/utils/escapeSingleQuote";

const myHooks = {
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

hook(myHooks);

const lists = sp.web.lists;
const items = await lists.getByTitle("LookupList").items();

console.log(JSON.stringify(items.length, null, 2));
```

## Registering Hooks

You can register hooks either globally, on an invokable factory, or on a per-object basis, and you can register a single hook or an array of hooks.

### Global Registration

Globally registering a hook allows you to inject functionality into every invokable that is instantiated within your application. It is important to remember that processing hooks are done on ALL property access or method invocation operations - so global hooks should be used sparingly.

```TypeScript
import { hook } from "@pnp/odata";

// we can add a logging method to very verbosly track what things are called in our application
hook((op: string, _target: any, ...rest: any[]): void => {
        switch (op) {
            case "has":
            case "apply":
            case "get":
            case "set":
                Logger.write(`${op} ::> ${rest[0]}`, LogLevel.Info);
                break;
            default:
                Logger.write(`${op} ::> ()`, LogLevel.Info);
        }
});
```

### Factory Registration

Another pattern you will find useful is the ability to hook an invokable factory. This will apply your hooks to all instances created with that factory, meaning all IWeb's or ILists's will have the extended methods. The example below shows how to add a property to IWeb as well as a method to IList.

```TypeScript
import "@pnp/sp/src/webs";
import "@pnp/sp/src/lists/web";
import { IWeb, Web } from "@pnp/sp/src/webs";
import { ILists, Lists } from "@pnp/sp/src/lists";
import { hookFactory } from "@pnp/odata";
import { sp } from "@pnp/sp";

// declaring the module here sets up the types correctly when importing across your application
declare module "@pnp/sp/src/webs" {

    // we need to extend the interface
    interface IWeb {
        orderedLists: ILists;
    }

    // // and need to let TS know that method does exist where it is needed
    // interface _Web {
    //     orderedLists: ILists;
    // }
}

// declaring the module here sets up the types correctly when importing across your application
declare module "@pnp/sp/src/lists" {

    // we need to extend the interface
    interface ILists {
        getOrderedListsQuery: (this: ILists) => ILists;
    }

    // // and need to let TS know that method does exist where it is needed
    // interface _ILists {
    //     orderedLists: ILists;
    // }
}

hookFactory(Web, {
    // add an ordered lists property
    get orderedLists(this: IWeb): ILists {
        return this.lists.getOrderedListsQuery();
    },
});

hookFactory(Lists, {
    // add an ordered lists property
    getOrderedListsQuery(this: ILists): ILists {
        return this.top(10).orderBy("Title").select("Title");
    },
});

// regardless of how we access the web and lists collections our hook remains with each new instance based on
// hooking the factory methods for each
const web = Web("https://318studios.sharepoint.com/sites/dev/");
const lists1 = await web.orderedLists();
console.log(JSON.stringify(lists1, null, 2));

const lists2 = await Web("https://318studios.sharepoint.com/sites/dev/").orderedLists();
console.log(JSON.stringify(lists2, null, 2));

const lists3 = await sp.web.orderedLists();
console.log(JSON.stringify(lists3, null, 2));
```

### Instance Registration

You can also register hooks on a single object instance, which is often the preferred approach as it will have less of a performance impact across your whole application. This is useful for debugging, overriding methods/properties, or controlling the behavior of specific object instances.

> Hooks are not transferred to child objects in a fluent chain, be sure you are hooking the instance you think you are.

Here we show the same override operation of getByTitle on the lists collection, but safely only overriding the single instance.

``` TypeScript
import { hookObj } from "@pnp/odata";
import { sp, List, ILists } from "@pnp/sp/presets/all";

const myHooks = {
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

const lists =  hookObj(sp.web.lists, myHooks);
const items = await lists.getByTitle("LookupList").items();

console.log(JSON.stringify(items.length, null, 2));
```

## Clear Hooks

You can also clear any globally registered hooks as shown. This can he helpful if you have a verbose debugging module and want to disable it once you are done troubleshooting. To clear instance hooks simply create a new instance of the object without calling the hookObj method.

```TypeScript
import { clearHooks } from "@pnp/odata";

clearHooks();
```

## Enable and Disable Hooks

Hooks are automatically enabled when you set the a hook through any of the outlined methods. You can disable and enable hooks on demand if needed using two exported functions. You likely won't need these but they are provided to provide explicit control over the usage of hooks.

```TypeScript
import { enableHooks, disableHooks } from "@pnp/odata";

// disable hooks
disableHooks();

// enable hooks
enableHooks();
```

## Order of Operations

It is important to understand the order in which hooks are executed and when a value is returned. Instance hooks are always called first, followed by global hooks - in both cases they are called in the order they were registered. This allows you to perhaps have some global functionality while maintaining the ability to override it again at the instance level. IF a hook returns a value other than `undefined` that value is returned and no other hooks are processed.

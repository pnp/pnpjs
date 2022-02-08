# @pnp/core : observers

Observers are used to implement all of the functionality within a [Timeline's](./timeline.md) [moments](./moments.md). Each moment defines the signature of observers you can register, and calling the observers is orchestrated by the implementation of the moment. A few facts about observers:

- All observers are functions
- The "this" of an observer is always the Timeline implementation that emitted the moment
- Do not handle non-recoverable errors in observers, let them throw and they will be handled by the library appropriately and routed to the `error` moment.

> For details on implementing observers for Queryable, [please see this article](../queryable/queryable.md).

## Observer Inheritance

Timelines created from other timelines (i.e. how sp and graph libraries work) inherit all of the observers from the parent. Observers added to the parent will apply for all children.

When you make a change to the set of observers through any of the subscription methods outlined below that inheritance is broken. Meaning changes to the parent will no longer apply to that child, and changes to a child never affect a parent. This applies to ALL moments on change of ANY moment, there is no per-moment inheritance concept.

```TypeScript
const sp = new spfi().using(...lots of behaviors);

// web is current inheriting all observers from "sp"
const web = sp.web;

// at this point web no longer inherits from "sp" and has its own observers
// but still includes everything that was registered in sp before this call
web.on.log(...);

// web2 inherits from sp as each invocation of .web creates a fresh IWeb instance
const web2 = sp.web;

// list inherits from web's observers and will contain the extra `log` observer added above
const list = web.lists.getById("");

// this new behavior will apply to web2 and any subsequent objects created from sp
sp.using(AnotherBehavior());

// web will again inherit from sp through web2, the extra log handler is gone
// list now ALSO is reinheriting from sp as it was pointing to web
web.using(AssignFrom(web2));
// see below for more information on AssignFrom
```

## Obserever Subscriptions

All timeline moments are exposed through the `on` property with three options for subscription.

### Append

This is the default, and adds your observer to the end of the array of subscribed observers.

```TypeScript
obj.on.log(function(this: Queryable, message: string, level: number) {
    if (level > 1) {
        console.log(message);
    }
});
```

### Prepend

Using prepend will place your observer as the first item in the array of subscribed observers. There is no gaurantee it will always remain first, other code can also use prepend.

```TypeScript
obj.on.log.prepend(function(this: Queryable, message: string, level: number) {
    if (level > 1) {
        console.log(message);
    }
});
```

### Replace

Replace will remove all other subscribed observers from a moment and add the supplied observer as the only one in the array of subscribed observers.

```TypeScript
obj.on.log.replace(function(this: Queryable, message: string, level: number) {
    if (level > 1) {
        console.log(message);
    }
});
```

### ToArray

The ToArray method creates a cloned copy of the array of registered observers for a given moment. Note that because it is a clone changes to the returned array do not affect the registered observers.

```TypeScript
const arr = obj.on.log.toArray();
```

### Clear

This clears ALL observers for a given moment, returning true if any observers were removed, and false if no changes were made.

```TypeScript
const didChange = obj.on.log.clear();
```

## Special Behaviors

The core library includes two special behaviors used to help manage observer inheritance. The best case is to manage inheritance using the methods described above, but these provide quick shorthand to help in certain scenarios. These are [AssignFrom](./behaviors.md#assignfrom) and [CopyFrom](./behaviors.md#copyfrom).

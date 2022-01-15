# @pnp/core : moments

Moments are the name we use to describe the steps executed during a timeline lifecycle. They are defined on a plain object by a series of functions with the general form:

```TypeScript
// the first argument is the set of observers subscribed to the given moment
// the rest of the args vary by an interaction between moment and observer types and represent the args passed when emit is called for a given moment
function (observers: any[], ...args: any[]): any;
```

Let's have a look at one of the included moment factory functions, which define how the moment interacts with its registered observers, and use it to understand a bit more on how things work. In this example we'll look at the broadcast moment, used to mimic a classic event where no return value is tracked, we just want to emit an event to all the subscribed observers.

```TypeScript
// the broadcast factory function, returning the actual moment implementation function
// The type T is used by the typings of Timeline to described the arguments passed in emit
export function broadcast<T extends ObserverAction>(): (observers: T[], ...args: any[]) => void {

    // this is the actual moment implementation, called each time a given moment occurs in the timeline
    return function (observers: T[], ...args: any[]): void {

        // we make a local ref of the observers
        const obs = [...observers];

        // we loop through sending the args to each observer
        for (let i = 0; i < obs.length; i++) {

            // note that within every moment and observer "this" will be the current timeline object
            Reflect.apply(obs[i], this, args);
        }
    };
}
```

Let's use `broadcast` in a couple examples to show how it works. You can also review the [timeline](./timeline.md) article for a fuller example.

```TypeScript
// our first type determines the type of the observers that will be regsitered to the moment "first"
type Broadcast1ObserverType = (this: Timeline<any>, message: string) => void;

// our second type determines the type of the observers that will be regsitered to the moment "second"
type Broadcast2ObserverType = (this: Timeline<any>, value: number, value2: number) => void;

const moments = {
    first: broadcast<Broadcast1ObserverType>(),
    second: broadcast<Broadcast2ObserverType>(),
} as const;
```

Now that we have defined two moments we can update our Timeline implementing class to emit each as we desire, as covered in the [timeline](./timeline.md) article. Let's focus on the relationship between the moment definition and the typings inherited by `on` and `emit` in Timeline.

Because we want observers of a given moment to understand what arguments they will get the typings of Timeline are setup to use the type defining the moment's observer across all operations. For example, using our moment "first" from above. Each moment can be subscribed by zero or more observers.

```TypeScript
// our observer function matches the type of Broadcast1ObserverType and the intellisense will reflect that.
// If you want to change the signature you need only do so in the type Broadcast1ObserverType and the change will update the on and emit typings as well
// here we want to reference "this" inside our observer function (preferred)
obj.on.first(function (this: Timeline<any>, message: string) {
    // we use "this", which will be the current timeline and the default log method to emit a logging event
    this.log(message, 0);
});

// we don't need to reference "this" so we use arrow notation
obj.on.first((message: string) => {
    console.log(message);
});
```

Similarily for `second` our observers would match Broadcast2Observer.

```TypeScript
obj.on.second(function (this: Timeline<any>, value: number, value2: number) {
    // we use "this", which will be the current timeline and the default log method to emit a logging event
    this.log(`got value1: ${value} value2: ${value2}`, 0);
});

obj.on.second((value: number, value2: number) => {
    console.log(`got value1: ${value} value2: ${value2}`);
});
```

## Existing Moment Factories

You a already familiar with `broadcast` which passes the emited args to all subscribed observers, this section lists the existing built in moment factories:

### broadcast

Creates a moment that passes the emited args to all subscribed observers. Takes a single type parameter defining the observer signature and always returns void. Is not async.

```TypeScript
import { broadcast } from "@pnp/core";

// can have any method signature you want that returns void, "this" will always be set
type BroadcastObserver = (this: Timeline<any>, message: string) => void;

const moments = {
    example: broadcast<BroadcastObserver>(),
} as const;

obj.on.example(function (this: Timeline<any>, message: string) {
    this.log(message, 0);
});

obj.emit.example("Hello");
```

### asyncReduce

Creates a moment that executes each observer asynchronously, awaiting the result and passes the returned arguments as the arguments to the next observer. This is very much like the redux pattern taking the arguments as the state which each observer may modify then returning a new state.

```TypeScript
import { asyncReduce } from "@pnp/core";

// can have any method signature you want, so long as it is async and returns a tuple matching in order the arguments, "this" will always be set
type AsyncReduceObserver = (this: Timeline<any>, arg1: string, arg2: number) => Promise<[string, number]>;

const moments = {
    example: asyncReduce<AsyncReduceObserver>(),
} as const;

obj.on.example(async function (this: Timeline<any>, arg1: string, arg2: number) {

    this.log(message, 0);

    // we can manipulate the values
    arg2++;

    // always return a tuple of the passed arguments, possibly modified
    return [arg1, arg2];
});

obj.emit.example("Hello", 42);
```

### request

Creates a moment where the first registered observer is used to asynchronously execute a request, returning a single result. If no result is returned (undefined) no further action is taken and the result will be undefined (i.e. additional observers are not used).

This is used by us to execute web requets, but would also serve to represent any async request such as a database read, file read, or provisioning step.

```TypeScript
import { request } from "@pnp/core";

// can have any method signature you want, "this" will always be set
type RequestObserver = (this: Timeline<any>, arg1: string, arg2: number) => Promise<string>;

const moments = {
    example: request<RequestObserver>(),
} as const;

obj.on.example(async function (this: Timeline<any>, arg1: string, arg2: number) {

    this.log(`Sending request: ${arg1}`, 0);

    // request expects a single value result
    return `result value ${arg2}`;
});

obj.emit.example("Hello", 42);
```

## Additional Examples

### waitall

Perhaps you have a situation where you would like to wait until all of the subscribed observers for a given moment complete, but they can run async in parallel.

```TypeScript
export function waitall<T extends ObserverFunction>(): (observers: T[], ...args: any[]) => Promise<void> {

    // this is the actual moment implementation, called each time a given moment occurs in the timeline
    return function (observers: T[], ...args: any[]): void {

        // we make a local ref of the observers
        const obs = [...observers];

        const promises = [];

        // we loop through sending the args to each observer
        for (let i = 0; i < obs.length; i++) {

            // note that within every moment and observer "this" will be the current timeline object
            promises.push(Reflect.apply(obs[i], this, args));
        }

        return Promise.all(promises).then(() => void(0));
    };
}
```

### first

Perhaps you would instead like to only get the result of the first observer to return.

```TypeScript
export function first<T extends ObserverFunction>(): (observers: T[], ...args: any[]) => Promise<any> {

    // this is the actual moment implementation, called each time a given moment occurs in the timeline
    return function (observers: T[], ...args: any[]): void {

        // we make a local ref of the observers
        const obs = [...observers];

        const promises = [];

        // we loop through sending the args to each observer
        for (let i = 0; i < obs.length; i++) {

            // note that within every moment and observer "this" will be the current timeline object
            promises.push(Reflect.apply(obs[i], this, args));
        }

        return Promise.race(promises);
    };
}
```

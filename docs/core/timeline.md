# @pnp/core : timeline

Timeline provides base functionality for ochestrating async operations. A timeline defines a set of [moments](./moments.md) to which observers can be registered. The model is event like but each moment's implementation can be unique and options beyond "broadcast" are possible. The easiest way to understand Timeline is to walk through implementing a simple one below. You also review [Queryable](../queryable/queryable.md) to see how we use Timeline internally to the library.

## Create a Timeline

Implementing a timeline involves several steps, each explained below.

1. Define Moments
2. Implement concrete Timeline class

### Define Moments

A timeline is made up of a set of moments which are themselves defined by a plain object with one or more properties, each of which is a function. You can use predefined [moments](./moments.md), or create your own to meet your exact requirements. Below we define two moments within the `MyMoments` object, first and second. These names are entirely your choice and the order moments are defined in the plain object carries no meaning.

The `first` moment uses a pre-defined moment implementation `asyncReduce`. This moment allows you to define a state based on the arguments of the observer function, in this case `FirstObserver`. `asyncReduce` takes those arguments, does some processing, and returns a promise resolving an array matching the input arguments in order and type with optionally changed values. Those values become the arguments to the next observer registered to that moment.

```TypeScript
import { asyncReduce, ObserverAction, Timeline } from "@pnp/core";

// the first observer is a function taking a number and async returning a number in an array
export type FirstObserver = (this: any, counter: number) => Promise<[number]>;

// the second observer is a function taking a number and returning void
export type SecondObserver = (this: any, result: number) => void;

export function report<T extends ObserverAction>(): (observers: T[], ...args: any[]) => void {

    return function (observers: T[], ...args: any[]): void {

        const obs = [...observers];

        // for this 
        if (obs.length > 0) {
             Reflect.apply(obs[0], this, args);
        }
    };
}

const MyMoments = {
    first: asyncReduce<FirstObserver>(),
    second: report<SecondObserver>(),
} as const;
```












Timeline - intro, what is it conceptually

describe the parts -> timeline, moments definition, observers

show custom timeline
- moments def
- execute impl

- show observer registration

- show behavior registering multiple observers

- link to batching docs and code as an example of a complex behavior
- link to other behaviors to show what's what






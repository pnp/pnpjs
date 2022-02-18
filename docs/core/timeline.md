# @pnp/core : timeline

Timeline provides base functionality for ochestrating async operations. A timeline defines a set of [moments](./moments.md) to which observers can be registered. [Observers](./observers.md) are functions that can act independently or together during a moment in the timeline. The model is event-like but each moment's implementation can be unique in how it interacts with the registered observers. Keep reading under [Define Moments](#define-moments) to understand more about what a moment is and how to create one.

![Timeline Architecture](../img/TimelineArchitecture.jpg)

The easiest way to understand Timeline is to walk through implementing a simple one below. You also review [Queryable](../queryable/queryable.md) to see how we use Timeline internally to the library.

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
// all asyncReduce observers must follow this pattern of returning async a tuple matching the args
export type FirstObserver = (this: any, counter: number) => Promise<[number]>;

// the second observer is a function taking a number and returning void
export type SecondObserver = (this: any, result: number) => void;

// this is a custom moment definition as an example.
export function report<T extends ObserverAction>(): (observers: T[], ...args: any[]) => void {

    return function (observers: T[], ...args: any[]): void {

        const obs = [...observers];

        // for this 
        if (obs.length > 0) {
             Reflect.apply(obs[0], this, args);
        }
    };
}

// this plain object defines the moments which will be available in our timeline
// the property name "first" and "second" will be the moment names, used when we make calls such as instance.on.first and instance.on.second
const TestingMoments = {
    first: asyncReduce<FirstObserver>(),
    second: report<SecondObserver>(),
} as const;
// note as well the use of as const, this allows TypeScript to properly resolve all the complex typings and not treat the plain object as "any"
```

### Subclass Timeline

After defining our moments we need to subclass Timeline to define how those moments emit through the lifecycle of the Timeline. Timeline has a single abstract method "execute" you must implement. You will also need to provide a way for callers to trigger the protected "start" method.

```TypeScript
// our implementation of timeline, note we use `typeof TestingMoments` and ALSO pass the testing moments object to super() in the constructor
class TestTimeline extends Timeline<typeof TestingMoments> {

    // we create two unique refs for our implementation we will use
    // to resolve the execute promise
    private InternalResolveEvent = Symbol.for("Resolve");
    private InternalRejectEvent = Symbol.for("Reject");

    constructor() {
        // we need to pass the moments to the base Timeline
        super(TestingMoments);
    }

    // we implement the execute the method to define when, in what order, and how our moments are called. This give you full control within the Timeline framework
    // to determine your implementation's behavior
    protected async execute(init?: any): Promise<any> {

        // we can always emit log to any subscribers
        this.log("Starting", 0);

        // set our timeline to start in the next tick
        setTimeout(async () => {

            try {

                // we emit our "first" event
                let [value] = await this.emit.first(init);

                // we emit our "second" event
                [value] = await this.emit.second(value);

                // we reolve the execute promise with the final value
                this.emit[this.InternalResolveEvent](value);

            } catch (e) {

                // we emit our reject event
                this.emit[this.InternalRejectEvent](e);
                // we emit error to any subscribed observers
                this.error(e);
            }
        }, 0);

        // return a promise which we will resolve/reject during the timeline lifecycle
        return new Promise((resolve, reject) => {
            this.on[this.InternalResolveEvent].replace(resolve);
            this.on[this.InternalRejectEvent].replace(reject);
        });
    }

    // provide a method to trigger our timeline, this could be protected or called directly by the user, your choice
    public go(startValue = 0): Promise<number> {
        
        // here we take a starting number
        return this.start(startValue);
    }
}
```

### Using your Timeline

```TypeScript
import { TestTimeline } from "./file.js";

const tl = new TestTimeline();

// register observer
tl.on.first(async (n) => [++n]);

// register observer
tl.on.second(async (n) => [++n]);

// h === 2
const h = await tl.go(0);

// h === 7
const h2 = await tl.go(5);
```

## Understanding the Timline Lifecycle

Now that you implemented a simple timeline let's take a minute to understand the lifecycle of a timeline execution. There are four moments always defined for every timeline: init, dispose, log, and error. Of these init and dispose are used within the lifecycle, while log and error are used as you need.

### Timeline Lifecycle

- .on.init (always)
- your moments as defined in execute, in our example:
  - .on.first
  - .on.second
- .on.dispose (always)

As well the moments log and error exist on every Timeline derived class and can occur at any point during the lifecycle.

## Observer Inheritance

Let's say that you want to contruct a system whereby you can create Timeline based instances from other Timeline based instances - which is what [Queryable](../queryable/queryable.md) does. Imagine we have a class with a pseudo-signature like:

```TypeScript
class ExampleTimeline extends Timeline<typeof SomeMoments> {

    // we create two unique refs for our implementation we will use
    // to resolve the execute promise
    private InternalResolveEvent = Symbol.for("Resolve");
    private InternalRejectEvent = Symbol.for("Reject");

    constructor(base: ATimeline) {

        // we need to pass the moments to the base Timeline
        super(TestingMoments, base.observers);
    }

    //...
}
```

We can then use it like:

```TypeScript
const tl1 = new ExampleTimeline();
tl1.on.first(async (n) => [++n]);
tl1.on.second(async (n) => [++n]);

// at this point tl2's observer collection is a pointer to the same collection as tl1
const tl2 = new ExampleTimeline(tl1);

// we add a second observer to first, it is applied to BOTH tl1 and tl2
tl1.on.first(async (n) => [++n]);

// BUT when we modify tl2's observers, either by adding or clearing a moment it begins to track its own collection
tl2.on.first(async (n) => [++n]);
```

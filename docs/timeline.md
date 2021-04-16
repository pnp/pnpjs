# Needs to be moved to appropriate section

# Timeline

Version 3 introduces the idea of Timeline, an abstract class combining ideas from EventEmitter, observables, and express middleware. A Timeline represents a set of subscribable "moments" that are expected to happen in order, with the behavior of a given moment being configurable.

Let's look at an example to help understand what is being discussed. This example shows creating a subclass of Timeline, defining some moments, and starting our timeline.

```TypeScript
import { Timeline, Moments, broadcast } from "@pnp/queryable";

// We define some moments. Moments are defined by a plain object comprised of a set of keys and moment implementation functions
// moment implementation functions can be fully custom or you can use predefined implementations. For this example we are using the most basic
// type, broadcast - this will broadcast the supplied arguments to every subscribed listener
const moments = {
    event1: broadcast(),
    event2: broadcast(),
} as const; // note the use of as const here, this lets TypeScript do better typing for us later

// Next we create a class using those moments, an extension of the Timline abstract class accepting a set of moments
class OrderedEmitter extends Timeline<typeof moments> {
    constructor() {
        super(moments);
    }

    public async run(...args: any[]): Promise<void> {

        // each timeline needs to define how it runs and has full freedom to do so. The base class
        // is just there to control typings and plumbing for subscribe and emit
        // in our base example we will take the moments in order and emit the args passed to "run"
        this.emit.event1(...args);

        this.emit.event2(...args);
    }
}

// Next we create an instance of our OrderedEmitter, combined with our moments
const emitter = new OrderedEmitter(moments);

// And then we subscribe an observer to each moment. Note each one has no typings currently on the args.
emitter.on.event1((...args: any[]) => {
    console.log(`event1 - args: ${args.join(", ")}`);
});

emitter.on.event2((...args: any[]) => {
    console.log(`event2 - args: ${args.join(", ")}`);
});

// absolutely no typing on the args, pass whatever we want
await emitter.run("hello", "world", 42);

// output
// > event1 - args: hello, world, 42
// > event2 - args: hello, world, 42
```


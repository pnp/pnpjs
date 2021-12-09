# @pnp/core : behaviors

While you can always register observers to any Timeline's moments using the `obj.on.moment` syntax, to make things easier we have included the ability to create behaviors. Behaviors define one or more observer registrations abstracted into a single registration. To differentiate behaviors are applied with the `.using` method. The power of behaviors is they are composable so a behavior can apply other behaviors.

## Basic Example

Let's create a behavior that will register two observers to a Timeline. We'll use error and log since they exist on all Timelines. In this example let's imagine we need to include some special secret into every lifecycle for logging to work. And we also want a company wide method to track errors. So we roll our own behavior.

```TypeScript
import { Timeline, TimelinePipe } from "@pnp/core";
import { MySpecialLoggingFunction } from "../mylogging.js";

// top level function allows binding of values within the closure
export function MyBehavior(specialSecret: string): TimelinePipe {

    return (instance: Timeline<any>) => {

        instance.on.log(function (message: string, severity: number) {

            MySpecialLoggingFunction(message, severity, specialSecret);
        });

        instance.on.error(function (err: string | Error) {

            MySpecialLoggingFunction(typeof err === "string" ? err : err.toString(), severity, specialSecret);
        });

        return instance;
    };
}

obj.using(MyBehavior("HereIsMySuperSecretValue"));
```

[](#assignfrom)

## Core Behaviors

Please also see available behaviors in [@pnp/queryable]("../../../queryable/behaviors.md), [@pnp/sp]("../../../sp/behaviors.md), and [@pnp/graph]("../../../graph/behaviors.md)

### AssignFrom

This behavior creates a ref to the supplied Timeline implementation's observers and resets the inheriting flag. This means that changes to the parent, here being the supplied Timeline, will begin affecting the target to which this behavior is applied.

```TypeScript
import { AssignFrom } from "@pnp/core";

// target will now hold a reference to the observers contained in source
// changes to the subscribed observers in source will apply to target
target.using(AssignFrom(source));

// you can always apply additional behaviors or register directly on the events
target.using(SomeOtherBehavior());

target.on.log(console.log);
```

### CopyFrom

Similar to AssignFrom, this method creates a copy of all the observers on the source and applies them to the target. This can be done either as a `replace` or `append` operation using the second parameter. The default is "append".

- "replace" will first clear each source moment's registered observers then apply each in source-order via the `on` operation.
- "append" will apply each source moment's registered observers in source-order via the `on` operation

```TypeScript
import { CopyFrom } from "@pnp/core";

// target will have the observers assigned from source, but no reference to source. Changes to source's registered observers will not affect target.
// any previously registered observers in target are maintained as the default behavior is to append
target.using(CopyFrom(source));

// target will have the observers assigned from source, but no reference to source. Changes to source's registered observers will not affect target.
// any previously registered observers in target are removed
target.using(CopyFrom(source, "replace"));

// you can always apply additional behaviors or register directly on the events
target.using(SomeOtherBehavior());

target.on.log(console.log);
```

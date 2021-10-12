import { CopyFrom, TimelinePipe } from "@pnp/core";
import { Queryable } from "../queryable.js";

/**
 * Behavior that will copy all the observers in the source queryable and apply it to the incoming instance
 *
 * @param source The source instance from which we will copy the observers
 * @param behavior replace = observers are cleared before adding, append preserves any observers already present
 * @param keepData If true any subscribed data members are removed (Default: false)
 */
export function CopyFromQueryable(source: Queryable, behavior: "replace" | "append" = "append", keepData = false): TimelinePipe<Queryable> {

    const coreFrom = CopyFrom(source, behavior);

    return (instance: Queryable) => {

        instance = <Queryable>coreFrom(instance);

        if (!keepData) {
            instance.on.data.clear();
        }

        return instance;
    };
}

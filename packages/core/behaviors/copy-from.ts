import { Timeline, TimelinePipe } from "../timeline.js";
import { isFunc, objectDefinedNotNull } from "../util.js";
import { cloneObserverCollection } from "../timeline.js";

/**
 * Behavior that will copy all the observers in the source timeline and apply it to the incoming instance
 *
 * @param source The source instance from which we will copy the observers
 * @param behavior replace = observers are cleared before adding, append preserves any observers already present
 * @param filter If provided filters the moments from which the observers are copied. It should return true for each moment to include.
 * @returns The mutated this
 */
export function CopyFrom(source: Timeline<any>, behavior: "replace" | "append" = "append", filter?: (moment: string) => boolean): TimelinePipe {

    return (instance: Timeline<any>) => {

        return Reflect.apply(copyObservers, instance, [source, behavior, filter]);
    };
}

/**
 * Function with implied this allows us to access protected members
 *
 * @param this The timeline whose observers we will copy
 * @param source The source instance from which we will copy the observers
 * @param behavior replace = observers are cleared before adding, append preserves any observers already present
 * @returns The mutated this
 */
function copyObservers(this: Timeline<any>, source: Timeline<any>, behavior: "replace" | "append", filter?: (moment: string) => boolean): Timeline<any> {

    if (!objectDefinedNotNull(source) || !objectDefinedNotNull(source.observers)) {
        return this;
    }

    if (!isFunc(filter)) {
        filter = () => true;
    }

    const clonedSource = cloneObserverCollection(source.observers);

    const keys = Object.keys(clonedSource).filter(filter);

    for (let i = 0; i < keys.length; i++) {

        const key = keys[i];
        const on = this.on[key];

        if (behavior === "replace") {
            on.clear();
        }

        const momentObservers = clonedSource[key];

        momentObservers.forEach(v => on(v));
    }

    return this;
}

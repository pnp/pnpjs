import { Timeline, ObserverCollection, TimelinePipe } from "../timeline.js";
import { objectDefinedNotNull } from "../util.js";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloneDeep = require("lodash.clonedeep");

/**
 * Behavior that will copy all the observers in the source timeline and apply it to the incoming instance
 *
 * @param source The source instance from which we will copy the observers
 * @param behavior replace = observers are cleared before adding, append preserves any observers already present
 * @returns The mutated this
 */
export function CopyFrom(source: Timeline<any>, behavior: "replace" | "append" = "append"): TimelinePipe {

    return (instance: Timeline<any>) => {

        return Reflect.apply(copyObservers, instance, [source, behavior]);
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
function copyObservers(this: Timeline<any>, source: Timeline<any>, behavior: "replace" | "append"): Timeline<any> {

    if (!objectDefinedNotNull(source) || !objectDefinedNotNull(source.observers)) {
        return this;
    }

    const clonedSource: ObserverCollection = cloneDeep(source.observers);

    const keys = Object.keys(clonedSource);

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

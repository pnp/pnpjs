import { Timeline, TimelinePipe } from "@pnp/core";

/**
 * Behavior that will assign a ref to the source's observers and reset the instance's inheriting flag
 *
 * @param source The source instance from which we will assign the observers
 */
export function AssignFrom(source: Timeline<any>): TimelinePipe {

    return (instance: Timeline<any>) => {

        (<any>instance).observers = (<any>source).observers;
        (<any>instance)._inheritingObservers = true;

        return instance;
    };
}

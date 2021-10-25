import { TimelinePipe } from "@pnp/core";
import { Queryable } from "../queryable.js";

/**
 * Behavior that will cause a timeout in the request after the specified milliseconds
 *
 * @param timeout Either the number of milliseconds to set a timeout, or a caller supplied AbortSignal reference
 */
export function Timeout(timeout: number | AbortSignal): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        if (typeof timeout === "number") {
            const controller = new AbortController();
            setTimeout(controller.abort, timeout);
            timeout = controller.signal;
        }

        instance.on.pre(async (url, init, result) => {

            init.signal = <AbortSignal>timeout;

            return [url, init, result];
        });

        return instance;
    };
}

import { TimelinePipe } from "@pnp/core";
import { Queryable } from "../queryable.js";

/**
 * Behavior that will cause a timeout in the request after the specified milliseconds
 *
 * @param timeout Either the number of milliseconds to set a timeout, or a caller supplied AbortSignal reference
 */
export function Timeout(timeout: number): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.on.pre(async (url, init, result) => {

            const controller = new AbortController();
            init.signal = controller.signal;
            setTimeout(controller.abort, timeout);

            return [url, init, result];
        });

        return instance;
    };
}

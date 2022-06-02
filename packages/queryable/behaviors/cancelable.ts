import { TimelinePipe } from "@pnp/core";
import { Queryable } from "../queryable.js";

export const CancelMoment = Symbol.for("CancelMoment");

export type CancelablePromise<T = any> = Promise<T> & { cancel(): void };

export function Cancelable(): TimelinePipe<Queryable> {

    if (!AbortController) {
        throw Error("The current environment appears to not support AbortController, please include a suitable polyfill.");
    }

    return (instance: Queryable) => {

        let signal: AbortSignal;

        instance.on.init(function (this: Queryable) {

            // this event will run before pre in the lifecycle, so signal should be properly set
            this.on[this.InternalPromiseCreationEvent]((promise: Promise<any>) => {

                const controller = new AbortController();

                signal = controller.signal;

                (<CancelablePromise>promise).cancel = () => {
                    controller.abort();
                };

                return [promise];
            });
        });

        instance.on.pre(async function (this: Queryable, url, init, result) {

            // if they have included their own signal then we are stuck
            // they should avoid using Cancelable and supplying their own signal
            if (signal && !init.signal) {
                init.signal = signal;
            }

            init.signal.addEventListener("abort", (ev) => {
                this.emit[CancelMoment](ev);
            });

            return [url, init, result];
        });

        return instance;
    };
}

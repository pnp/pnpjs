import { TimelinePipe } from "../../core/timeline.js";
import { Queryable } from "../queryable.js";

export function ThrowErrors(): TimelinePipe {

    return (instance: Queryable) => {

        instance.on.pre(async function (this: Queryable, url, init, result) {

            this.on.error((err) => {
                throw err;
            });

            return [url, init, result];
        });

        return instance;
    };
}

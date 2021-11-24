import { TimelinePipe } from "../../core/timeline.js";
import { Queryable } from "../queryable.js";

export function ThrowErrors(): TimelinePipe {

    return (instance: Queryable) => {

        instance.on.error((err) => {
            throw err;
        });

        // instance.on.pre(async function (this: Queryable, url, init, result) {



        //     return [url, init, result];
        // });

        return instance;
    };
}

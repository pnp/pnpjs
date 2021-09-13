import { From_JulieHatesThisName, TimelinePipe } from "@pnp/core";
import { Queryable } from "../queryable.js";

export function FromQueryable(source: Queryable, behavior: "replace" | "append" = "append", keepData = false): TimelinePipe<Queryable> {

    const coreFrom = From_JulieHatesThisName(source, behavior);

    return (instance: Queryable) => {

        instance = <Queryable>coreFrom(instance);

        if (!keepData) {
            instance.on.data.clear();
        }

        return instance;
    };
}

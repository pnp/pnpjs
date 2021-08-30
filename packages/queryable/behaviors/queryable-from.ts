import { From_JulieHatesThisName, TimelinePipe } from "@pnp/core";
import { Queryable2 } from "../queryable-2.js";

export function FromQueryable(source: Queryable2, behavior: "replace" | "append" = "append", keepData = false): TimelinePipe<Queryable2> {

    const coreFrom = From_JulieHatesThisName(source, behavior);

    return (instance: Queryable2) => {

        instance = <Queryable2>coreFrom(instance);

        if (!keepData) {
            instance.on.data.clear();
        }

        return instance;
    };
}

import { From_JulieHatesThisName } from "@pnp/core";
import { Queryable2 } from "../queryable-2.js";

export function FromQueryable(source: Queryable2, behavior: "replace" | "append" = "append", keepData = false): (instance: Queryable2) => Queryable2 {

    const coreFrom = From_JulieHatesThisName(source, behavior);

    return (instance: Queryable2) => {

        instance = <Queryable2>coreFrom(instance);

        if (!keepData) {
            instance.clear.data();
        }

        return instance;
    };
}

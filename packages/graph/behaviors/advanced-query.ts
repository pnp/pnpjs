import { TimelinePipe } from "@pnp/core";
import { Queryable } from "@pnp/queryable";
import { ConsistencyLevel } from "@pnp/graph";

export function AdvancedQuery(): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.using(ConsistencyLevel());
        instance.query.set("$count", "true");

        return instance;
    };
}

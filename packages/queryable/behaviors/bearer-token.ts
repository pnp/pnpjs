import { TimelinePipe } from "@pnp/core";
import { Queryable } from "../queryable.js";
import { InjectHeaders } from "./inject-headers.js";

export function BearerToken(token: string): TimelinePipe {

    return (instance: Queryable) => {

        instance.using(InjectHeaders({
            "Authorization": `Bearer ${token}`,
        }));

        return instance;
    };
}

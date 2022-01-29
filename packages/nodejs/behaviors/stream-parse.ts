import { TimelinePipe } from "@pnp/core";
import { parseBinderWithErrorCheck, Queryable } from "@pnp/queryable";

export function StreamParse(): TimelinePipe<Queryable> {

    return parseBinderWithErrorCheck(async r => ({ body: r.body, knownLength: parseInt(r?.headers?.get("content-length") || "-1", 10) }));
}

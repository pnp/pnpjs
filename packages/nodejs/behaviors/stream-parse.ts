import { TimelinePipe } from "@pnp/core";
import { parseBinderWithErrorCheck, Queryable2 } from "@pnp/queryable";

export function StreamParse(): TimelinePipe<Queryable2> {

    return parseBinderWithErrorCheck(async r => ({ body: r.body, knownLength: parseInt(r.headers.get("content-length"), 10) }));
}

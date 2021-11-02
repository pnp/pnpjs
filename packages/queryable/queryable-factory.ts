import { IQueryableInternal, QueryableInit } from "./queryable.js";

export function queryableFactory<InstanceType extends IQueryableInternal>(
    constructor: { new(init: QueryableInit, path?: string): InstanceType },
): (init: QueryableInit, path?: string) => InstanceType {

    return (init: QueryableInit, path?: string) => {

        // provides a point where we can potentially intercept any queryable being created
        return new constructor(init, path);
    };
}

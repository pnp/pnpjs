import { IQueryableInternal, QueryableInit } from "./queryable.js";

export function queryableFactory<InstanceType extends IQueryableInternal>(
    constructor: { new(init: QueryableInit, path?: string): InstanceType },
): (init: QueryableInit, path?: string) => InstanceType {

    return (init: QueryableInit, path?: string) => {

        // construct the concrete instance
        const instance = new constructor(init, path);

        // we emit the construct event from the factory because we need all of the decorators and constructors
        // to have fully finished before we emit, which is now true. We type the instance to any to get around
        // the protected nature of emit
        (<any>instance).emit.construct(init, path);

        return instance;
    };
}

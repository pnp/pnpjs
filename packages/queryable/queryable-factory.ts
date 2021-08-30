import { IQueryable2 } from "./queryable.js";

export function queryableFactory<InstanceType extends IQueryable2>(
    constructor: { new(init: IQueryable2<any> | string, path?: string): InstanceType },
): (init: IQueryable2<any> | string, path?: string) => InstanceType {

    return (init: IQueryable2<any> | string, path?: string) => {

        // provides a point where we can potentially intercept any queryable being created
        return new constructor(init, path);
    };
}

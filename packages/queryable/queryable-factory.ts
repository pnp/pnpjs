import { IQueryableInternal } from "./queryable.js";

export function queryableFactory<InstanceType extends IQueryableInternal>(
    constructor: { new(init: IQueryableInternal<any> | string, path?: string): InstanceType },
): (init: IQueryableInternal<any> | string, path?: string) => InstanceType {

    return (init: IQueryableInternal<any> | string, path?: string) => {

        // provides a point where we can potentially intercept any queryable being created
        return new constructor(init, path);
    };
}

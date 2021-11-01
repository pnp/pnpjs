import { IQueryableInternal } from "./queryable.js";

export function queryableFactory<InstanceType extends IQueryableInternal>(
    constructor: { new(init: string | IQueryableInternal<any> | [IQueryableInternal<any>, string], path?: string): InstanceType },
): (init: string | IQueryableInternal<any> | [IQueryableInternal<any>, string], path?: string) => InstanceType {

    return (init: string | IQueryableInternal<any> | [IQueryableInternal<any>, string], path?: string) => {

        // provides a point where we can potentially intercept any queryable being created
        return new constructor(init, path);
    };
}

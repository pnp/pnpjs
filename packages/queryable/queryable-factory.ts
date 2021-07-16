import { IQueryable2 } from "./queryable-2.js";

export function queryableFactory<InstanceType extends IQueryable2>(

    constructor: { new(init: IQueryable2<any> | string, path?: string): InstanceType },

): (init: IQueryable2<any> | string, path?: string) => InstanceType {

    return (init: IQueryable2<any> | string, path?: string) => {

        return new constructor(init, path);
    };
}

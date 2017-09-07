import { GraphQueryable } from "./graphqueryable";
import { Groups } from "./groups";
// import { Me } from "./me";

/**
 * Root object wrapping v1 functionality for MS Graph
 *
 */
export class V1 extends GraphQueryable {

    /**
     * Creates a new instance of the V1 class
     *
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     * @param path Optional additional path
     */
    constructor(baseUrl: string | GraphQueryable, path = "v1.0") {
        super(baseUrl, path);
    }

    public get groups(): Groups {
        return new Groups(this);
    }

    // public get me(): Me {
    //     return new Me(this);
    // }
}

import { GraphQueryable } from "./graphqueryable";
import { Groups } from "./groups";

/**
 * Root object wrapping beta functionality for MS Graph
 *
 */
export class Beta extends GraphQueryable {

    /**
     * Creates a new instance of the Beta class
     *
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     * @param path Optional additional path
     */
    constructor(baseUrl: string | GraphQueryable, path = "beta") {
        super(baseUrl, path);
    }

    public get groups(): Groups {
        return new Groups(this);
    }
}

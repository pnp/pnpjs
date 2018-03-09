import { GraphQueryable, GraphQueryableInstance } from "./graphqueryable";
import { OneNote } from "./onenote";

export class Me extends GraphQueryableInstance {

    constructor(baseUrl: string | GraphQueryable, path = "me") {
        super(baseUrl, path);
    }

    /**
    * The onenote associated with me
    */
    public get onenote(): OneNote {
        return new OneNote(this, "onenote");
    }
}

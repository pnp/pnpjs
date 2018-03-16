import { GraphQueryable, GraphQueryableInstance } from "./graphqueryable";
import { OneNote, OneNoteMethods } from "./onenote";

export class Me extends GraphQueryableInstance {

    constructor(baseUrl: string | GraphQueryable, path = "me") {
        super(baseUrl, path);
    }

    /**
    * The onenote associated with me
    */
    public get onenote(): OneNoteMethods {
        return new OneNote(this);
    }
}

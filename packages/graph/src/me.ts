import { GraphQueryable, GraphQueryableInstance } from "./graphqueryable";
import { OneNote, OneNoteMethods } from "./onenote";
import { Contacts, ContactFolders } from "./contacts";

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

    /**
    * The Contacts associated with the user
    */
    public get contacts(): Contacts {
        return new Contacts(this);
    }

    /**
     * The Contact Folders associated with the user
     */
    public get contactFolders(): ContactFolders {
        return new ContactFolders(this);
    }

}

import { GraphQueryableInstance, defaultPath } from "./graphqueryable";
import { OneNote, OneNoteMethods } from "./onenote";
import { Contacts, ContactFolders } from "./contacts";
import { Drive, Drives } from "./onedrive";
import { Tasks } from "./planner";

@defaultPath("me")
export class Me extends GraphQueryableInstance {

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

    /**
  * The default Drive associated with the user
  */
    public get drive(): Drive {
        return new Drive(this);
    }

    /**
    * The Drives the user has available
    */
    public get drives(): Drives {
        return new Drives(this);
    }

    /**
    * The Tasks the user has available
    */
    public get tasks(): Tasks {
        return new Tasks(this, "planner/tasks");
    }

}

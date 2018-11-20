import { TypedHash, jsS } from "@pnp/common";
import { GraphQueryableInstance, GraphQueryableCollection, defaultPath } from "./graphqueryable";
import { Contacts, ContactFolders } from "./contacts";
import { OneNote, OneNoteMethods } from "./onenote";
import { Drive, Drives } from "./onedrive";
import { Tasks } from "./planner";
import { Teams } from "./teams";



/**
 * Describes a collection of Users objects
 *
 */
@defaultPath("users")
export class Users extends GraphQueryableCollection {
    /**
     * Gets a user from the collection using the specified id
     * 
     * @param id Id of the user to get from this collection
     */
    public getById(id: string): User {
        return new User(this, id);
    }
}

/**
 * Represents a user entity
 */
export class User extends GraphQueryableInstance {
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

    public get joinedTeams(): Teams {
        return new Teams(this, "joinedTeams");
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

    /**
     * Updates this user
     * 
     * @param properties Properties used to update this user
     */
    public update(properties: TypedHash<any>): Promise<void> {

        return this.patchCore({
            body: jsS(properties),
        });
    }

    /**
     * Deletes this user
     */
    public delete(): Promise<void> {
        return this.deleteCore();
    }
}

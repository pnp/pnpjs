import { TypedHash, jsS } from "@pnp/common";
import { GraphQueryableInstance, GraphQueryableCollection, defaultPath } from "./graphqueryable";
import { Contacts, ContactFolders } from "./contacts";
import { OneNote, OneNoteMethods } from "./onenote";
import { Drive, Drives } from "./onedrive";
import { Tasks } from "./planner";
import { Teams } from "./teams";
import {
    User as IUser,
    Message as IMessage,
} from "@microsoft/microsoft-graph-types";
import { Messages, MailboxSettings, MailFolders } from "./messages";

/**
 * Describes a collection of Users objects
 *
 */
@defaultPath("users")
export class Users extends GraphQueryableCollection<IUser[]> {
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
export class User extends GraphQueryableInstance<IUser> {
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
     * Get the messages in the signed-in user's mailbox
     */
    public get messages(): Messages {
        return new Messages(this);
    }

    /**
     * Get the MailboxSettings in the signed-in user's mailbox
     */
    public get mailboxSettings(): MailboxSettings {
        return new MailboxSettings(this);
    }

    /**
     * Get the MailboxSettings in the signed-in user's mailbox
     */
    public get mailFolders(): MailFolders {
        return new MailFolders(this);
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

    /**
     * Send the message specified in the request body. The message is saved in the Sent Items folder by default.
     */
    public sendMail(message: IMessage): Promise<void> {

        return this.clone(User, "sendMail").postCore({
            body: jsS(message),
        });
    }
}

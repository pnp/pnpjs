import { jsS } from "@pnp/common";
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
import { DirectoryObjects } from "./directoryobjects";
import { People } from "./people";
import { Photo } from "./photos";
import { Calendar } from "./calendars";

import { InsightsMethods, Insights } from "./insights";

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

    /**
     * The calendar associated with the user
     */
    public get calendar(): Calendar {
        return new Calendar(this, "calendar");
    }

    /**
    * The photo associated with the user
    */
    public get photo(): Photo {
        return new Photo(this);
    }

    /**
    * The Teams associated with the user
    */
    public get joinedTeams(): Teams {
        return new Teams(this, "joinedTeams");
    }

    /**
    * The groups and directory roles associated with the user
    */
    public get memberOf(): DirectoryObjects {
        return new DirectoryObjects(this, "memberOf");
    }

    /**
     * Returns all the groups and directory roles that the specified useris a member of. The check is transitive
     * 
     * @param securityEnabledOnly 
     */
    public getMemberObjects(securityEnabledOnly = false): Promise<{ value: string[] }> {
        return this.clone(User, "getMemberObjects").postCore({
            body: jsS({
                securityEnabledOnly: securityEnabledOnly,
            }),
        });
    }

    /**
     * Return all the groups that the specified user is a member of. The check is transitive
     * 
     * @param securityEnabledOnly 
     */
    public getMemberGroups(securityEnabledOnly = false): Promise<{ value: string[] }> {

        return this.clone(User, "getMemberGroups").postCore({
            body: jsS({
                securityEnabledOnly: securityEnabledOnly,
            }),
        });
    }

    /**
     * Check for membership in a specified list of groups, and returns from that list those groups of which the specified user, group, or directory object is a member. 
     * This function is transitive.
     * @param groupIds A collection that contains the object IDs of the groups in which to check membership. Up to 20 groups may be specified.
     */
    public checkMemberGroups(groupIds: String[]): Promise<{ value: string[] }> {
        return this.clone(User, "checkMemberGroups").postCore({
            body: jsS({
                groupIds: groupIds,
            }),
        });
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
    public update(properties: IUser): Promise<void> {

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
     * 
     * @param message The message details to send
     * @param saveToSentItems If true the message will be saved to sent items. Default: false
     */
    public sendMail(message: IMessage, saveToSentItems = false): Promise<void> {

        return this.clone(User, "sendMail").postCore({
            body: jsS({ message, saveToSentItems }),
        });
    }

    /**
    * People ordered by their relevance to the user
    */
    public get people(): People {
        return new People(this);
    }

    /**
    * People that have direct reports to the user
    */
    public get directReports(): People {
        return new People(this, "directReports");
    }

    /**
    * The Insights associated with this user
    */
    public get insights(): InsightsMethods {
        return new Insights(this);
    }

    /**
    * The manager associated with this user
    */
    public get manager(): User {
        return new User(this, "manager");
    }
}

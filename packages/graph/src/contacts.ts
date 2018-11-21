import { GraphQueryableInstance, GraphQueryableCollection, defaultPath } from "./graphqueryable";
import { jsS, TypedHash, extend } from "@pnp/common";
import {
    Contact as IContact,
    ContactFolder as IContactFolder,
    EmailAddress,
} from "@microsoft/microsoft-graph-types";

@defaultPath("contacts")
export class Contacts extends GraphQueryableCollection<IContact[]> {

    public getById(id: string): Contact {
        return new Contact(this, id);
    }

    /**
    * Create a new Contact for the user.
    * 
    * @param givenName The contact's given name.
    * @param surName The contact's surname.
    * @param emailAddresses The contact's email addresses.
    * @param businessPhones The contact's business phone numbers.
    * @param additionalProperties A plain object collection of additional properties you want to set on the new contact
    */
    public add(givenName: string, surName: string, emailAddresses: EmailAddress[], businessPhones: string[], additionalProperties: TypedHash<any> = {}): Promise<ContactAddResult> {

        const postBody = extend({
            businessPhones: businessPhones,
            emailAddresses: emailAddresses,
            givenName: givenName,
            surName: surName,
        }, additionalProperties);

        return this.postCore({
            body: jsS(postBody),
        }).then(r => {
            return {
                contact: this.getById(r.id),
                data: r,
            };
        });
    }
}

export class Contact extends GraphQueryableInstance<IContact> {
    /**
     * Deletes this contact
     */
    public delete(): Promise<void> {
        return this.deleteCore();
    }

    /**
     * Update the properties of a contact object
     * 
     * @param properties Set of properties of this contact to update
     */
    public update(properties: TypedHash<string | number | boolean | string[]>): Promise<void> {

        return this.patchCore({
            body: jsS(properties),
        });
    }
}

@defaultPath("contactFolders")
export class ContactFolders extends GraphQueryableCollection<IContactFolder[]> {

    public getById(id: string): ContactFolder {
        return new ContactFolder(this, id);
    }

    /**
     * Create a new Contact Folder for the user.
     * 
     * @param displayName The folder's display name.
     * @param parentFolderId The ID of the folder's parent folder.
     */
    public add(displayName: string, parentFolderId?: string): Promise<ContactFolderAddResult> {

        const postBody = {
            displayName: displayName,
            parentFolderId: parentFolderId,
        };

        return this.postCore({
            body: jsS(postBody),
        }).then(r => {
            return {
                contactFolder: this.getById(r.id),
                data: r,
            };
        });
    }
}

export class ContactFolder extends GraphQueryableInstance<IContactFolder> {
    /**
     * Gets the contacts in this contact folder
     */
    public get contacts(): Contacts {
        return new Contacts(this);
    }

    /**
    * Gets the contacts in this contact folder
    */
    public get childFolders(): ContactFolders {
        return new ContactFolders(this, "childFolders");
    }

    /**
     * Deletes this contact folder
     */
    public delete(): Promise<void> {
        return this.deleteCore();
    }

    /**
     * Update the properties of a contact folder
     * 
     * @param properties Set of properties of this contact folder to update
     */
    public update(properties: IContactFolder): Promise<void> {

        return this.patchCore({
            body: jsS(properties),
        });
    }
}

export interface ContactFolderAddResult {
    data: IContactFolder;
    contactFolder: ContactFolder;
}

export interface ContactAddResult {
    data: IContact;
    contact: Contact;
}

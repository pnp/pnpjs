import { GraphQueryable, GraphQueryableInstance, GraphQueryableCollection } from "./graphqueryable";
import { jsS, TypedHash, extend } from "@pnp/common";
import { Contact as IContact, ContactFolder as IContactFolder, EmailAddress } from "@microsoft/microsoft-graph-types";

export class Contacts extends GraphQueryableCollection {

    constructor(baseUrl: string | GraphQueryable, path = "contacts") {
        super(baseUrl, path);
    }

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

        let postBody = extend({
            givenName: givenName,
            surName: surName,
            emailAddresses: emailAddresses,
            businessPhones: businessPhones,
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

export class Contact extends GraphQueryableInstance {
}

export class ContactFolders extends GraphQueryableCollection {

    constructor(baseUrl: string | GraphQueryable, path = "contactFolders") {
        super(baseUrl, path);
    }

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

export class ContactFolder extends GraphQueryableInstance {
    public get contacts(): Contacts {
        return new Contacts(this);
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
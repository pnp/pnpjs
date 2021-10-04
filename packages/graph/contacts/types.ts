import { _GraphQueryableCollection, _GraphQueryableInstance, graphInvokableFactory } from "../graphqueryable.js";
import { Contact as IContactType, ContactFolder as IContactFolderType, EmailAddress as IEmailAddressType } from "@microsoft/microsoft-graph-types";
import { defaultPath, updateable, deleteable, IUpdateable, IDeleteable, getById, IGetById } from "../decorators.js";
import { graphPost } from "../operations.js";
import { body } from "@pnp/queryable";

/**
 * Contact
 */
@updateable()
@deleteable()
export class _Contact extends _GraphQueryableInstance<IContactType> { }
export interface IContact extends _Contact, IUpdateable<IContactType>, IDeleteable { }
export const Contact = graphInvokableFactory<IContact>(_Contact);

/**
 * Contacts
 */
@defaultPath("contacts")
@getById(Contact)
export class _Contacts extends _GraphQueryableCollection<IContactType[]> {

    /**
    * Create a new Contact for the user.
    *
    * @param givenName The contact's given name.
    * @param surName The contact's surname.
    * @param emailAddresses The contact's email addresses.
    * @param businessPhones The contact's business phone numbers.
    * @param additionalProperties A plain object collection of additional properties you want to set on the new contact
    */
    public async add(
        givenName: string,
        surName: string,
        emailAddresses: IEmailAddressType[],
        businessPhones: string[],
        additionalProperties: Record<string, any> = {}): Promise<IContactAddResult> {

        const postBody = {
            businessPhones,
            emailAddresses,
            givenName,
            surName,
            ...additionalProperties,
        };

        const data = await graphPost(this, body(postBody));

        return {
            contact: (<any>this).getById(data.id),
            data,
        };
    }
}
export interface IContacts extends _Contacts, IGetById<IContact> { }
export const Contacts = graphInvokableFactory<IContacts>(_Contacts);

/**
 * Contact Folder
 */
@deleteable()
@updateable()
export class _ContactFolder extends _GraphQueryableInstance<IContactFolderType> {
    /**
     * Gets the contacts in this contact folder
     */
    public get contacts(): IContacts {
        return Contacts(this);
    }

    /**
    * Gets the contacts in this contact folder
    */
    public get childFolders(): IContactFolders {
        return ContactFolders(this, "childFolders");
    }
}
export interface IContactFolder extends _ContactFolder, IUpdateable, IDeleteable { }
export const ContactFolder = graphInvokableFactory<IContactFolder>(_ContactFolder);

/**
 * Contact Folders
 */
@defaultPath("contactFolders")
@getById(ContactFolder)
export class _ContactFolders extends _GraphQueryableCollection<IContactFolderType[]> {

    /**
     * Create a new Contact Folder for the user.
     *
     * @param displayName The folder's display name.
     * @param parentFolderId The ID of the folder's parent folder.
     */
    public async add(displayName: string, parentFolderId?: string): Promise<IContactFolderAddResult> {

        const postBody = {
            displayName: displayName,
            parentFolderId: parentFolderId,
        };

        const data = await graphPost(this, body(postBody));

        return {
            contactFolder: (<any>this).getById(data.id),
            data,
        };
    }
}
export interface IContactFolders extends _ContactFolders, IGetById<IContactFolder> { }
export const ContactFolders = graphInvokableFactory<IContactFolders>(_ContactFolders);

/**
 * IContactFolderAddResult
 */
export interface IContactFolderAddResult {
    data: IContactFolderType;
    contactFolder: IContactFolder;
}

/**
 * IContactAddResult
 */
export interface IContactAddResult {
    data: IContactType;
    contact: IContact;
}

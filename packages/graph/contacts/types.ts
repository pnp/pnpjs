import { _GraphQueryableCollection, IGraphQueryableCollection, _GraphQueryableInstance, IGraphQueryableInstance, graphInvokableFactory } from "../graphqueryable";
import { ITypedHash, assign } from "@pnp/common";
import { Contact as IContactType, ContactFolder as IContactFolderType, EmailAddress as IEmailAddressType } from "@microsoft/microsoft-graph-types";
import { defaultPath, updateable, deleteable, IUpdateable, IDeleteable, getById, IGetById } from "../decorators";
import { graphPost } from "../operations";
import { body, IInvokable } from "@pnp/odata";

/**
 * Contact
 */
@updateable()
@deleteable()
export class _Contact extends _GraphQueryableInstance<IContactType> implements _IContact { }
export interface _IContact { }
export interface IContact extends _IContact, IInvokable, IUpdateable<IContactType>, IDeleteable, IGraphQueryableInstance<IContactType> { }
export const Contact = graphInvokableFactory<IContact>(_Contact);

/**
 * Contacts
 */
@defaultPath("contacts")
@getById(Contact)
export class _Contacts extends _GraphQueryableCollection<IContactType[]> implements _IContacts {

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
        additionalProperties: ITypedHash<any> = {}): Promise<IContactAddResult> {

        const postBody = assign({ businessPhones, emailAddresses, givenName, surName }, additionalProperties);

        const data = await graphPost(this, body(postBody));

        return {
            contact: (<any>this).getById(data.id),
            data,
        };
    }
}
export interface _IContacts {
    add(
        givenName: string,
        surName: string,
        emailAddresses: IEmailAddressType[],
        businessPhones: string[],
        additionalProperties: ITypedHash<any>): Promise<IContactAddResult>;
}
export interface IContacts extends _IContacts, IInvokable, IGetById<IContact>, IGraphQueryableCollection<IContactType[]> {}
export const Contacts = graphInvokableFactory<IContacts>(_Contacts);

/**
 * Contact Folder
 */
@deleteable()
@updateable()
export class _ContactFolder extends _GraphQueryableInstance<IContactFolderType> implements _IContactFolder {
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
export interface _IContactFolder {
    readonly contacts: IContacts;
    readonly childFolders: IContactFolders;
}
export interface IContactFolder extends _IContactFolder, IInvokable, IUpdateable, IDeleteable, IGraphQueryableInstance<IContactFolderType> {}
export const ContactFolder = graphInvokableFactory<IContactFolder>(_ContactFolder);

/**
 * Contact Folders
 */
@defaultPath("contactFolders")
@getById(ContactFolder)
export class _ContactFolders extends _GraphQueryableCollection<IContactFolderType[]> implements _IContactFolders {

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
export interface _IContactFolders {
    add(displayName: string, parentFolderId?: string): Promise<IContactFolderAddResult>;
}
export interface IContactFolders extends _IContactFolders, IInvokable, IGetById<IContactFolder>, IGraphQueryableCollection<IContactFolderType[]> {}
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

import { _GraphQueryableCollection, IGraphQueryableCollection, _GraphQueryableInstance, IGraphQueryableInstance, graphInvokableFactory } from "../graphqueryable";
import { TypedHash, extend } from "@pnp/common";
import { Contact as IContactType, ContactFolder as IContactFolderType, EmailAddress as IEmailAddressType } from "@microsoft/microsoft-graph-types";
import { defaultPath, updateable, deleteable, IUpdateable, IDeleteable, getById, IGetById } from "../decorators";
import { graphPost } from "../operations";
import { body, IGetable } from "@pnp/odata";

/**
 * Contact
 */
@updateable()
@deleteable()
export class _Contact extends _GraphQueryableInstance<IContactType> implements IContact { }
export interface IContact extends IGetable, IUpdateable<IContactType>, IDeleteable, IGraphQueryableInstance<IContactType> { }
export interface _Contact extends IGetable, IUpdateable<IContactType>, IDeleteable { }
export const Contact = graphInvokableFactory<IContact>(_Contact);

/**
 * Contacts
 */
@defaultPath("contacts")
@getById(Contact)
export class _Contacts extends _GraphQueryableCollection<IContactType[]> implements IContacts {

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
        additionalProperties: TypedHash<any> = {}): Promise<IContactAddResult> {

        const postBody = extend({ businessPhones, emailAddresses, givenName, surName }, additionalProperties);

        const data = await graphPost(this, body(postBody));

        return {
            contact: this.getById(data.id),
            data,
        };
    }
}
export interface IContacts extends IGetable, IGetById<IContact>, IGraphQueryableCollection<IContactType[]> {
    add(
        givenName: string,
        surName: string,
        emailAddresses: IEmailAddressType[],
        businessPhones: string[],
        additionalProperties: TypedHash<any>): Promise<IContactAddResult>;
}
export interface _Contacts extends IGetable, IGetById<IContact> { }
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
export interface IContactFolder extends IGetable, IUpdateable, IDeleteable, IGraphQueryableInstance<IContactFolderType> {
    readonly contacts: IContacts;
    readonly childFolders: IContactFolders;
}
export interface _ContactFolder extends IGetable, IUpdateable, IDeleteable { }
export const ContactFolder = graphInvokableFactory<IContactFolder>(_ContactFolder);

/**
 * Contact Folders
 */
@defaultPath("contactFolders")
@getById(ContactFolder)
export class _ContactFolders extends _GraphQueryableCollection<IContactFolderType[]> implements IContactFolders {

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
            contactFolder: this.getById(data.id),
            data,
        };
    }
}
export interface IContactFolders extends IGetable, IGetById<IContactFolder>, IGraphQueryableCollection<IContactFolderType[]> {
    add(displayName: string, parentFolderId?: string): Promise<IContactFolderAddResult>;
}
export interface _ContactFolders extends IGetable, IGetById<IContactFolder> { }
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

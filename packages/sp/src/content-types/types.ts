import { TypedHash } from "@pnp/common";
import { IInvokable, body } from "@pnp/odata";
import {
    SharePointQueryableCollection,
    _SharePointQueryableInstance,
    ISharePointQueryableCollection,
    ISharePointQueryableInstance,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { defaultPath, deleteable, IDeleteable } from "../decorators";
import { metadata } from "../utils/metadata";
import { spPost } from "../operations";

/**
 * Describes a collection of content types
 *
 */
@defaultPath("contenttypes")
export class _ContentTypes extends _SharePointQueryableCollection {

    /**
     * Adds an existing contenttype to a content type collection
     *
     * @param contentTypeId in the following format, for example: 0x010102
     */
    public async addAvailableContentType(contentTypeId: string): Promise<ContentTypeAddResult> {

        const data = await spPost(this.clone(ContentTypes, "addAvailableContentType"), body({ "contentTypeId": contentTypeId }));
        return {
            contentType: this.getById(data.id),
            data: data,
        };
    }

    /**	
     * Gets a ContentType by content type id	
     */
    public getById(id: string): IContentType {
        return ContentType(this).concat(`('${id}')`);
    }

    /**
     * Adds a new content type to the collection
     *
     * @param id The desired content type id for the new content type (also determines the parent content type)
     * @param name The name of the content type
     * @param description The description of the content type
     * @param group The group in which to add the content type
     * @param additionalSettings Any additional settings to provide when creating the content type
     *
     */
    public async add(
        id: string,
        name: string,
        description = "",
        group = "Custom Content Types",
        additionalSettings: TypedHash<string | number | boolean> = {}): Promise<ContentTypeAddResult> {

        const postBody = body(Object.assign(metadata("SP.ContentType"), {
            "Description": description,
            "Group": group,
            "Id": { "StringValue": id },
            "Name": name,
        }, additionalSettings));

        const data = await spPost(this, postBody);
        return { contentType: this.getById(data.id), data };
    }
}

export interface IContentTypes extends IInvokable, ISharePointQueryableCollection {
    addAvailableContentType(contentTypeId: string): Promise<ContentTypeAddResult>;
    getById(id: string): IContentType;
    add(id: string, name: string, description?: string, group?: string, additionalSettings?: TypedHash<string | number | boolean>): Promise<ContentTypeAddResult>;
}

/**
 * Invokable factory for IContentTypes instances
 */
export const ContentTypes = spInvokableFactory<IContentTypes>(_ContentTypes);

/**
 * Describes a single ContentType instance
 *
 */
@deleteable()
export class _ContentType extends _SharePointQueryableInstance implements _IContentType {

    /**
     * Gets the column (also known as field) references in the content type.
    */
    public get fieldLinks(): IFieldLinks {
        return FieldLinks(this);
    }

    /**
     * Gets a value that specifies the collection of fields for the content type.
     */
    public get fields(): ISharePointQueryableCollection {
        return SharePointQueryableCollection(this, "fields");
    }

    /**
     * Gets the parent content type of the content type.
     */
    public get parent(): IContentType {
        return ContentType(this, "parent");
    }

    /**
     * Gets a value that specifies the collection of workflow associations for the content type.
     */
    public get workflowAssociations(): ISharePointQueryableCollection {
        return SharePointQueryableCollection(this, "workflowAssociations");
    }
}

export interface _IContentType {
    readonly fieldLinks: IFieldLinks;
    readonly fields: ISharePointQueryableCollection;
    readonly parent: IContentType;
    readonly workflowAssociations: ISharePointQueryableCollection;
}

export interface IContentType extends _IContentType, IInvokable, ISharePointQueryableInstance, IDeleteable { }

/**
 * Invokable factory for IContentType instances
 */
export const ContentType = spInvokableFactory<IContentType>(_ContentType);

export interface ContentTypeAddResult {
    contentType: IContentType;
    data: any;
}

/**
 * Represents a collection of field link instances
 */
@defaultPath("fieldlinks")
export class _FieldLinks extends _SharePointQueryableCollection implements _IFieldLinks {
    /**	
     * Gets a FieldLink by GUID id	
     *	
     * @param id The GUID id of the field link	
     */
    public getById(id: string): IFieldLink {
        return FieldLink(this).concat(`(guid'${id}')`);
    }
}

export interface _IFieldLinks {
    getById(id: string): IFieldLink;
}

export interface IFieldLinks extends _IFieldLinks, IInvokable, ISharePointQueryableCollection { }

/**
 * Invokable factory for IFieldLinks instances
 */
export const FieldLinks = spInvokableFactory<IFieldLinks>(_FieldLinks);

/**
 * Represents a field link instance
 */
export class _FieldLink extends _SharePointQueryableInstance implements _IFieldLink { }

export interface _IFieldLink {}

export interface IFieldLink extends _IFieldLink, IInvokable, _SharePointQueryableInstance { }

/**
 * Invokable factory for IFieldLink instances
 */
export const FieldLink = spInvokableFactory<IFieldLink>(_FieldLink);

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
import { defaultPath, deleteable, IDeleteable, clientTagMethod } from "../decorators";
import { metadata } from "../utils/metadata";
import { spPost } from "../operations";

@defaultPath("contenttypes")
export class _ContentTypes extends _SharePointQueryableCollection {

    @clientTagMethod("cts.addAvailableContentType")
    public async addAvailableContentType(contentTypeId: string): Promise<ContentTypeAddResult> {

        const data = await spPost(this.clone(ContentTypes, "addAvailableContentType"), body({ "contentTypeId": contentTypeId }));
        return {
            contentType: this.getById(data.id),
            data: data,
        };
    }

    public getById(id: string): IContentType {
        return clientTagMethod.configure(ContentType(this).concat(`('${id}')`), "cts.getById");
    }

    @clientTagMethod("cts.add")
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

/**
 * Describes a collection of content types
 *
 */
export interface IContentTypes extends IInvokable, ISharePointQueryableCollection {

    /**
     * Adds an existing contenttype to a content type collection
     *
     * @param contentTypeId in the following format, for example: 0x010102
     */
    addAvailableContentType(contentTypeId: string): Promise<ContentTypeAddResult>;

    /**	
     * Gets a ContentType by content type id
     * @param id The id of the content type to get, in the following format, for example: 0x010102	
     */
    getById(id: string): IContentType;

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
    add(id: string, name: string, description?: string, group?: string, additionalSettings?: TypedHash<string | number | boolean>): Promise<ContentTypeAddResult>;
}

/**
 * Invokable factory for IContentTypes instances
 */
export const ContentTypes = spInvokableFactory<IContentTypes>(_ContentTypes);


@deleteable()
export class _ContentType extends _SharePointQueryableInstance implements _IContentType {

    public get fieldLinks(): IFieldLinks {
        return clientTagMethod.configure(FieldLinks(this), "ct.fieldLinks");
    }

    public get fields(): ISharePointQueryableCollection {
        return clientTagMethod.configure(SharePointQueryableCollection(this, "fields"), "ct.fields");
    }

    public get parent(): IContentType {
        return clientTagMethod.configure(ContentType(this, "parent"), "ct.parent");
    }

    public get workflowAssociations(): ISharePointQueryableCollection {
        return clientTagMethod.configure(SharePointQueryableCollection(this, "workflowAssociations"), "ct.workflowAssociations");
    }
}

/**
 * Describes a single ContentType instance
 *
 */
export interface _IContentType {

    /**
     * Gets the column (also known as field) references in the content type.
     */
    readonly fieldLinks: IFieldLinks;

    /**
     * Gets a value that specifies the collection of fields for the content type.
     */
    readonly fields: ISharePointQueryableCollection;

    /**
     * Gets the parent content type of the content type.
     */
    readonly parent: IContentType;

    /**
     * Gets a value that specifies the collection of workflow associations for the content type.
     */
    readonly workflowAssociations: ISharePointQueryableCollection;
}

export interface IContentType extends _IContentType, IInvokable, ISharePointQueryableInstance, IDeleteable { }

/**
 * Invokable factory for IContentType instances
 */
export const ContentType = spInvokableFactory<IContentType>(_ContentType);

/**
 * Represents the output of adding a content type
 */
export interface ContentTypeAddResult {
    contentType: IContentType;
    data: any;
}

@defaultPath("fieldlinks")
export class _FieldLinks extends _SharePointQueryableCollection implements _IFieldLinks {

    public getById(id: string): IFieldLink {
        return clientTagMethod.configure(FieldLink(this).concat(`(guid'${id}')`), "fls.getById");
    }
}

/**
 * Represents a collection of field link instances
 */
export interface _IFieldLinks {

    /**	
     * Gets a FieldLink by GUID id	
     *	
     * @param id The GUID id of the field link	
     */
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

export interface _IFieldLink { }

export interface IFieldLink extends _IFieldLink, IInvokable, _SharePointQueryableInstance { }

/**
 * Invokable factory for IFieldLink instances
 */
export const FieldLink = spInvokableFactory<IFieldLink>(_FieldLink);

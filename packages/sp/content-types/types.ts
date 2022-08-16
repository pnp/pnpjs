import { body } from "@pnp/queryable";
import {
    _SPCollection,
    _SPInstance,
    spInvokableFactory,
    SPCollection,
    ISPCollection,
    deleteable,
    IDeleteable,
} from "../spqueryable.js";
import { defaultPath } from "../decorators.js";
import { spPost, spPostMerge } from "../operations.js";

@defaultPath("contenttypes")
export class _ContentTypes extends _SPCollection<IContentTypeInfo[]> {

    /**
     * Adds an existing contenttype to a content type collection
     *
     * @param contentTypeId in the following format, for example: 0x010102
     */
    public async addAvailableContentType(contentTypeId: string): Promise<IContentTypeAddResult> {

        const data = await spPost(ContentTypes(this, "addAvailableContentType"), body({ "contentTypeId": contentTypeId }));
        return {
            contentType: this.getById(data.id),
            data: data,
        };
    }

    /**
     * Gets a ContentType by content type id
     * @param id The id of the content type to get, in the following format, for example: 0x010102
     */
    public getById(id: string): IContentType {
        return ContentType(this).concat(`('${id}')`);
    }

    /**
     * Adds a new content type to the collection
     *
     * @param id The desired content type id for the new content type (also determines the parent
     *   content type)
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
        additionalSettings: Record<string, string | number | boolean> = {}): Promise<IContentTypeAddResult> {

        const postBody = body({
            Description: description,
            Group: group,
            Id: { StringValue: id },
            Name: name,
            ...additionalSettings,
        });

        const data = await spPost(this, postBody);

        return { contentType: this.getById(data.id), data };
    }
}
export interface IContentTypes extends _ContentTypes { }
export const ContentTypes = spInvokableFactory<IContentTypes>(_ContentTypes);

export class _ContentType extends _SPInstance<IContentTypeInfo> {

    public delete = deleteable();

    /**
     * Updates this list instance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the web
     */
    public async update(properties: Record<string, any>): Promise<void> {
        return spPostMerge(this, body(properties));
    }

    /**
     * Gets the column (also known as field) references in the content type.
     */
    public get fieldLinks(): IFieldLinks {
        return FieldLinks(this);
    }

    /**
     * Gets a value that specifies the collection of fields for the content type.
     */
    public get fields(): ISPCollection {
        return SPCollection(this, "fields");
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
    public get workflowAssociations(): ISPCollection {
        return SPCollection(this, "workflowAssociations");
    }
}
export interface IContentType extends _ContentType, IDeleteable { }
export const ContentType = spInvokableFactory<IContentType>(_ContentType);

/**
 * Represents the output of adding a content type
 */
export interface IContentTypeAddResult {
    contentType: IContentType;
    data: Partial<IContentTypeInfo>;
}

@defaultPath("fieldlinks")
export class _FieldLinks extends _SPCollection<IFieldLinkInfo[]> {

    /**
    *  Gets a FieldLink by GUID id
    *
    * @param id The GUID id of the field link
    */
    public getById(id: string): IFieldLink {
        return FieldLink(this).concat(`(guid'${id}')`);
    }
}
export interface IFieldLinks extends _FieldLinks { }
export const FieldLinks = spInvokableFactory<IFieldLinks>(_FieldLinks);

export class _FieldLink extends _SPInstance<IFieldLinkInfo> { }
export interface IFieldLink extends _FieldLink { }
export const FieldLink = spInvokableFactory<IFieldLink>(_FieldLink);

export interface IContentTypeInfo {
    Description: string;
    DispFormClientSideComponentId: string;
    DispFormClientSideComponentProperties: string;
    DisplayFormTemplateName: string;
    DisplayFormUrl: string;
    DocumentTemplate: string;
    DocumentTemplateUrl: string;
    EditFormClientSideComponentId: string;
    EditFormClientSideComponentProperties: string;
    EditFormTemplateName: string;
    EditFormUrl: string;
    Group: string;
    Hidden: boolean;
    Id: { StringValue: string };
    JSLink: string;
    MobileDisplayFormUrl: string;
    MobileEditFormUrl: string;
    MobileNewFormUrl: string;
    Name: string;
    NewFormClientSideComponentId: string;
    NewFormClientSideComponentProperties: string;
    NewFormTemplateName: string;
    NewFormUrl: string;
    ReadOnly: boolean;
    SchemaXml: string;
    Scope: string;
    Sealed: boolean;
    StringId: string;
}

export interface IFieldLinkInfo {
    FieldInternalName: string | null;
    Hidden: boolean;
    Id: string;
    Name: string;
    Required: boolean;
}

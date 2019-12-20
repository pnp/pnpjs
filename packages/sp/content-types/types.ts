import { ITypedHash } from "@pnp/common";
import { body } from "@pnp/odata";
import {
    SharePointQueryableCollection,
    _SharePointQueryableInstance,
    ISharePointQueryableCollection,
    _SharePointQueryableCollection,
    spInvokableFactory,
    deleteable,
    IDeleteable,
} from "../sharepointqueryable";
import { defaultPath } from "../decorators";
import { metadata } from "../utils/metadata";
import { spPost } from "../operations";
import { tag } from "../telemetry";

@defaultPath("contenttypes")
export class _ContentTypes extends _SharePointQueryableCollection<IContentTypeInfo[]> {

    /**
     * Adds an existing contenttype to a content type collection
     *
     * @param contentTypeId in the following format, for example: 0x010102
     */
    @tag("cts.addAvailableContentType")
    public async addAvailableContentType(contentTypeId: string): Promise<IContentTypeAddResult> {

        const data = await spPost(this.clone(ContentTypes, "addAvailableContentType"), body({ "contentTypeId": contentTypeId }));
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
        return tag.configure(ContentType(this).concat(`('${id}')`), "cts.getById");
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
    @tag("cts.add")
    public async add(
        id: string,
        name: string,
        description = "",
        group = "Custom Content Types",
        additionalSettings: ITypedHash<string | number | boolean> = {}): Promise<IContentTypeAddResult> {

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
export interface IContentTypes extends _ContentTypes { }
export const ContentTypes = spInvokableFactory<IContentTypes>(_ContentTypes);


export class _ContentType extends _SharePointQueryableInstance<IContentTypeInfo> {

    public delete = deleteable("ct");

    /**
     * Gets the column (also known as field) references in the content type.
     */
    public get fieldLinks(): IFieldLinks {
        return tag.configure(FieldLinks(this), "ct.fieldLinks");
    }

    /**
     * Gets a value that specifies the collection of fields for the content type.
     */
    public get fields(): ISharePointQueryableCollection {
        return tag.configure(SharePointQueryableCollection(this, "fields"), "ct.fields");
    }

    /**
     * Gets the parent content type of the content type.
     */
    public get parent(): IContentType {
        return tag.configure(ContentType(this, "parent"), "ct.parent");
    }

    /**
     * Gets a value that specifies the collection of workflow associations for the content type.
     */
    public get workflowAssociations(): ISharePointQueryableCollection {
        return tag.configure(SharePointQueryableCollection(this, "workflowAssociations"), "ct.workflowAssociations");
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

export interface IContentTypeInfo {
    Description: string;
    DisplayFormTemplateName: string;
    DisplayFormUrl: string;
    DocumentTemplate: string;
    DocumentTemplateUrl: string;
    EditFormTemplateName: string;
    EditFormUrl: string;
    Group: string;
    Hidden: boolean;
    Id: { StringValue: string; };
    JSLink: string;
    MobileDisplayFormUrl: string;
    MobileEditFormUrl: string;
    MobileNewFormUrl: string;
    Name: string;
    NewFormTemplateName: string;
    NewFormUrl: string;
    ReadOnly: boolean;
    SchemaXml: string;
    Scope: string;
    Sealed: boolean;
    StringId: string;
}

@defaultPath("fieldlinks")
export class _FieldLinks extends _SharePointQueryableCollection<IFieldLinkInfo[]> {

    /**
    *  Gets a FieldLink by GUID id	
    * 
    * @param id The GUID id of the field link
    */
    public getById(id: string): IFieldLink {
        return tag.configure(FieldLink(this).concat(`(guid'${id}')`), "fls.getById");
    }
}
export interface IFieldLinks extends _FieldLinks { }
export const FieldLinks = spInvokableFactory<IFieldLinks>(_FieldLinks);

export class _FieldLink extends _SharePointQueryableInstance<IFieldLinkInfo> { }
export interface IFieldLink extends _FieldLink { }
export const FieldLink = spInvokableFactory<IFieldLink>(_FieldLink);

export interface IFieldLinkInfo {
    FieldInternalName: string | null;
    Hidden: boolean;
    Id: string;
    Name: string;
    Required: boolean;
}

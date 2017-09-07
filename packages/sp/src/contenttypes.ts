import { Util } from "../utils/util";
import { TypedHash } from "../collections/collections";
import { SharePointQueryable, SharePointQueryableCollection, SharePointQueryableInstance } from "./sharepointqueryable";

/**
 * Describes a collection of content types
 *
 */
export class ContentTypes extends SharePointQueryableCollection {

    /**
     * Creates a new instance of the ContentTypes class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this content types collection
     */
    constructor(baseUrl: string | SharePointQueryable, path = "contenttypes") {
        super(baseUrl, path);
    }

    /**
     * Gets a ContentType by content type id
     */
    public getById(id: string): ContentType {
        const ct: ContentType = new ContentType(this);
        ct.concat(`('${id}')`);
        return ct;
    }

    /**
     * Adds an existing contenttype to a content type collection
     *
     * @param contentTypeId in the following format, for example: 0x010102
     */
    public addAvailableContentType(contentTypeId: string): Promise<ContentTypeAddResult> {

        const postBody: string = JSON.stringify({
            "contentTypeId": contentTypeId,
        });

        return this.clone(ContentTypes, "addAvailableContentType").postAsCore<{ id: string }>({ body: postBody }).then((data) => {
            return {
                contentType: this.getById(data.id),
                data: data,
            };
        });
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
    public add(
        id: string,
        name: string,
        description = "",
        group = "Custom Content Types",
        additionalSettings: TypedHash<string | number | boolean> = {}): Promise<ContentTypeAddResult> {

        const postBody = JSON.stringify(Util.extend({
            "Description": description,
            "Group": group,
            "Id": { "StringValue": id },
            "Name": name,
            "__metadata": { "type": "SP.ContentType" },
        }, additionalSettings));

        return this.postCore({ body: postBody }).then((data) => {
            return { contentType: this.getById(data.id), data: data };
        });
    }
}

/**
 * Describes a single ContentType instance
 *
 */
export class ContentType extends SharePointQueryableInstance {

    /**
     * Gets the column (also known as field) references in the content type.
    */
    public get fieldLinks(): FieldLinks {
        return new FieldLinks(this);
    }

    /**
     * Gets a value that specifies the collection of fields for the content type.
     */
    public get fields(): SharePointQueryableCollection {
        return new SharePointQueryableCollection(this, "fields");
    }

    /**
     * Gets the parent content type of the content type.
     */
    public get parent(): ContentType {
        return new ContentType(this, "parent");
    }

    /**
     * Gets a value that specifies the collection of workflow associations for the content type.
     */
    public get workflowAssociations(): SharePointQueryableCollection {
        return new SharePointQueryableCollection(this, "workflowAssociations");
    }

    /**
     * Delete this content type
     */
    public delete(): Promise<void> {
        return this.postCore({
            headers: {
                "X-HTTP-Method": "DELETE",
            },
        });
    }
}

export interface ContentTypeAddResult {
    contentType: ContentType;
    data: any;
}

/**
 * Represents a collection of field link instances
 */
export class FieldLinks extends SharePointQueryableCollection {

    /**
     * Creates a new instance of the ContentType class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this content type instance
     */
    constructor(baseUrl: string | SharePointQueryable, path = "fieldlinks") {
        super(baseUrl, path);
    }

    /**
     * Gets a FieldLink by GUID id
     *
     * @param id The GUID id of the field link
     */
    public getById(id: string) {
        const fl = new FieldLink(this);
        fl.concat(`(guid'${id}')`);
        return fl;
    }
}

/**
 * Represents a field link instance
 */
export class FieldLink extends SharePointQueryableInstance { }

import { SharePointQueryable, SharePointQueryableCollection, SharePointQueryableInstance } from "./sharepointqueryable";
import { SharePointQueryableShareableItem } from "./sharepointqueryableshareable";
import { Folder } from "./folders";
import { File } from "./files";
import { ContentType } from "./contenttypes";
import { TypedHash } from "../collections/collections";
import { Util } from "../utils/util";
import { ListItemFormUpdateValue } from "./types";
import { ODataParserBase } from "../odata/core";
import { AttachmentFiles } from "./attachmentfiles";
import { List } from "./lists";

/**
 * Describes a collection of Item objects
 *
 */
export class Items extends SharePointQueryableCollection {

    /**
     * Creates a new instance of the Items class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | SharePointQueryable, path = "items") {
        super(baseUrl, path);
    }

    /**
     * Gets an Item by id
     *
     * @param id The integer id of the item to retrieve
     */
    public getById(id: number): Item {
        const i = new Item(this);
        i.concat(`(${id})`);
        return i;
    }

    /**
     * Skips the specified number of items (https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#sectionSection6)
     *
     * @param skip The starting id where the page should start, use with top to specify pages
     */
    public skip(skip: number): this {
        this._query.add("$skiptoken", encodeURIComponent(`Paged=TRUE&p_ID=${skip}`));
        return this;
    }

    /**
     * Gets a collection designed to aid in paging through data
     *
     */
    public getPaged(): Promise<PagedItemCollection<any>> {
        return this.getAs(new PagedItemCollectionParser());
    }

    //

    /**
     * Adds a new item to the collection
     *
     * @param properties The new items's properties
     */
    public add(properties: TypedHash<any> = {}, listItemEntityTypeFullName: string = null): Promise<ItemAddResult> {

        const removeDependency = this.addBatchDependency();

        return this.ensureListItemEntityTypeName(listItemEntityTypeFullName).then(listItemEntityType => {

            const postBody = JSON.stringify(Util.extend({
                "__metadata": { "type": listItemEntityType },
            }, properties));

            const promise = this.clone(Items, null).postAsCore<{ Id: number }>({ body: postBody }).then((data) => {
                return {
                    data: data,
                    item: this.getById(data.Id),
                };
            });

            removeDependency();

            return promise;
        });
    }

    /**
     * Ensures we have the proper list item entity type name, either from the value provided or from the list
     *
     * @param candidatelistItemEntityTypeFullName The potential type name
     */
    private ensureListItemEntityTypeName(candidatelistItemEntityTypeFullName: string): Promise<string> {

        return candidatelistItemEntityTypeFullName ?
            Promise.resolve(candidatelistItemEntityTypeFullName) :
            this.getParent(List).getListItemEntityTypeFullName();
    }
}

/**
 * Descrines a single Item instance
 *
 */
export class Item extends SharePointQueryableShareableItem {

    /**
     * Gets the set of attachments for this item
     *
     */
    public get attachmentFiles(): AttachmentFiles {
        return new AttachmentFiles(this);
    }

    /**
     * Gets the content type for this item
     *
     */
    public get contentType(): ContentType {
        return new ContentType(this, "ContentType");
    }

    /**
     * Gets the effective base permissions for the item
     *
     */
    public get effectiveBasePermissions(): SharePointQueryable {
        return new SharePointQueryable(this, "EffectiveBasePermissions");
    }

    /**
     * Gets the effective base permissions for the item in a UI context
     *
     */
    public get effectiveBasePermissionsForUI(): SharePointQueryable {
        return new SharePointQueryable(this, "EffectiveBasePermissionsForUI");
    }

    /**
     * Gets the field values for this list item in their HTML representation
     *
     */
    public get fieldValuesAsHTML(): SharePointQueryableInstance {
        return new SharePointQueryableInstance(this, "FieldValuesAsHTML");
    }

    /**
     * Gets the field values for this list item in their text representation
     *
     */
    public get fieldValuesAsText(): SharePointQueryableInstance {
        return new SharePointQueryableInstance(this, "FieldValuesAsText");
    }

    /**
     * Gets the field values for this list item for use in editing controls
     *
     */
    public get fieldValuesForEdit(): SharePointQueryableInstance {
        return new SharePointQueryableInstance(this, "FieldValuesForEdit");
    }

    /**
     * Gets the folder associated with this list item (if this item represents a folder)
     *
     */
    public get folder(): Folder {
        return new Folder(this, "folder");
    }

    /**
     * Gets the folder associated with this list item (if this item represents a folder)
     *
     */
    public get file(): File {
        return new File(this, "file");
    }

    /**
     * Updates this list intance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the list
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    public update(properties: TypedHash<any>, eTag = "*"): Promise<ItemUpdateResult> {

        return new Promise<ItemUpdateResult>((resolve, reject) => {

            const removeDependency = this.addBatchDependency();

            const parentList = this.getParent(SharePointQueryableInstance, this.parentUrl.substr(0, this.parentUrl.lastIndexOf("/")));

            parentList.select("ListItemEntityTypeFullName").getAs<{ ListItemEntityTypeFullName: string }>().then((d) => {

                const postBody = JSON.stringify(Util.extend({
                    "__metadata": { "type": d.ListItemEntityTypeFullName },
                }, properties));

                removeDependency();

                return this.postCore({
                    body: postBody,
                    headers: {
                        "IF-Match": eTag,
                        "X-HTTP-Method": "MERGE",
                    },
                }, new ItemUpdatedParser()).then((data) => {
                    resolve({
                        data: data,
                        item: this,
                    });
                });
            }).catch(e => reject(e));
        });
    }

    /**
     * Delete this item
     *
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    public delete(eTag = "*"): Promise<void> {
        return this.postCore({
            headers: {
                "IF-Match": eTag,
                "X-HTTP-Method": "DELETE",
            },
        });
    }

    /**
     * Moves the list item to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     */
    public recycle(): Promise<string> {
        return this.clone(Item, "recycle").postCore();
    }

    /**
     * Gets a string representation of the full URL to the WOPI frame.
     * If there is no associated WOPI application, or no associated action, an empty string is returned.
     *
     * @param action Display mode: 0: view, 1: edit, 2: mobileView, 3: interactivePreview
     */
    public getWopiFrameUrl(action = 0): Promise<string> {
        const i = this.clone(Item, "getWOPIFrameUrl(@action)");
        i._query.add("@action", <any>action);
        return i.postCore().then((data: any) => {

            // handle verbose mode
            if (data.hasOwnProperty("GetWOPIFrameUrl")) {
                return data.GetWOPIFrameUrl;
            }

            return data;
        });
    }

    /**
     * Validates and sets the values of the specified collection of fields for the list item.
     *
     * @param formValues The fields to change and their new values.
     * @param newDocumentUpdate true if the list item is a document being updated after upload; otherwise false.
     */
    public validateUpdateListItem(formValues: ListItemFormUpdateValue[], newDocumentUpdate = false): Promise<ListItemFormUpdateValue[]> {
        return this.clone(Item, "validateupdatelistitem").postCore({
            body: JSON.stringify({ "formValues": formValues, bNewDocumentUpdate: newDocumentUpdate }),
        });
    }
}

export interface ItemAddResult {
    item: Item;
    data: any;
}

export interface ItemUpdateResult {
    item: Item;
    data: ItemUpdateResultData;
}

export interface ItemUpdateResultData {
    "odata.etag": string;
}

/**
 * Provides paging functionality for list items
 */
export class PagedItemCollection<T> {

    constructor(private nextUrl: string, public results: T) { }

    /**
     * If true there are more results available in the set, otherwise there are not
     */
    public get hasNext(): boolean {
        return typeof this.nextUrl === "string" && this.nextUrl.length > 0;
    }

    /**
     * Gets the next set of results, or resolves to null if no results are available
     */
    public getNext(): Promise<PagedItemCollection<any>> {

        if (this.hasNext) {
            const items = new Items(this.nextUrl, null);
            return items.getPaged();
        }

        return new Promise<any>(r => r(null));
    }
}

class PagedItemCollectionParser extends ODataParserBase<PagedItemCollection<any>> {
    public parse(r: Response): Promise<PagedItemCollection<any>> {

        return new Promise<PagedItemCollection<any>>((resolve, reject) => {

            if (this.handleError(r, reject)) {
                r.json().then(json => {
                    const nextUrl = json.hasOwnProperty("d") && json.d.hasOwnProperty("__next") ? json.d.__next : json["odata.nextLink"];
                    resolve(new PagedItemCollection(nextUrl, this.parseODataJSON(json)));
                });
            }
        });
    }
}

class ItemUpdatedParser extends ODataParserBase<ItemUpdateResultData> {
    public parse(r: Response): Promise<ItemUpdateResultData> {

        return new Promise<ItemUpdateResultData>((resolve, reject) => {

            if (this.handleError(r, reject)) {
                resolve({
                    "odata.etag": r.headers.get("etag"),
                });
            }
        });
    }
}


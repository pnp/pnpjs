import { SharePointQueryable, SharePointQueryableCollection, SharePointQueryableInstance, defaultPath } from "./sharepointqueryable";
import { SharePointQueryableShareableItem } from "./sharepointqueryableshareable";
import { Folder } from "./folders";
import { File } from "./files";
import { ContentType } from "./contenttypes";
import { extend, TypedHash, jsS, hOP } from "@pnp/common";
import { ListItemFormUpdateValue, LikeData } from "./types";
import { ODataParserBase, ODataDefaultParser, ODataParser } from "@pnp/odata";
import { AttachmentFiles } from "./attachmentfiles";
import { List } from "./lists";
import { Logger, LogLevel } from "@pnp/logging";
import { Comments } from "./comments";
import { metadata } from "./utils/metadata";

/**
 * Describes a collection of Item objects
 *
 */
@defaultPath("items")
export class Items extends SharePointQueryableCollection {

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
     * Gets BCS Item by string id
     *
     * @param stringId The string id of the BCS item to retrieve
     */
    public getItemByStringId(stringId: string): Item {
        // creates an item with the parent list path and append out method call
        return new Item(this.parentUrl, `getItemByStringId('${stringId}')`);
    }

    /**
     * Skips the specified number of items (https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#sectionSection6)
     *
     * @param skip The starting id where the page should start, use with top to specify pages
     * @param reverse It true the PagedPrev=true parameter is added allowing backwards navigation in the collection
     */
    public skip(skip: number, reverse = false): this {
        if (reverse) {
            this.query.set("$skiptoken", encodeURIComponent(`Paged=TRUE&PagedPrev=TRUE&p_ID=${skip}`));
        } else {
            this.query.set("$skiptoken", encodeURIComponent(`Paged=TRUE&p_ID=${skip}`));
        }
        return this;
    }

    /**
     * Gets a collection designed to aid in paging through data
     *
     */
    public getPaged<T = any[]>(parser: ODataParser<any> = new ODataDefaultParser()): Promise<PagedItemCollection<T>> {

        return this.get(new PagedItemCollectionParser<any>(this, parser));
    }

    /**
     * Gets all the items in a list, regardless of count. Does not support batching or caching
     *
     *  @param requestSize Number of items to return in each request (Default: 2000)
     *  @param acceptHeader Allows for setting the value of the Accept header for SP 2013 support
     */
    public getAll(requestSize = 2000, acceptHeader = "application/json;odata=nometadata"): Promise<any[]> {

        Logger.write("Calling items.getAll should be done sparingly. Ensure this is the correct choice. If you are unsure, it is not.", LogLevel.Warning);

        // this will be used for the actual query
        // and we set no metadata here to try and reduce traffic
        const items = new Items(this, "").top(requestSize).configure({
            headers: {
                "Accept": acceptHeader,
            },
        });

        // let's copy over the odata query params that can be applied
        // $top - allow setting the page size this way (override what we did above)
        // $select - allow picking the return fields (good behavior)
        // $filter - allow setting a filter, though this may fail due for large lists
        this.query.forEach((v: string, k: string) => {
            if (/^\$select|filter|top|expand$/i.test(k)) {
                items.query.set(k, v);
            }
        });

        // give back the promise
        return new Promise((resolve, reject) => {

            // this will eventually hold the items we return
            const itemsCollector: any[] = [];

            // action that will gather up our results recursively
            const gatherer = (last: PagedItemCollection<any>) => {

                // collect that set of results
                [].push.apply(itemsCollector, last.results);

                // if we have more, repeat - otherwise resolve with the collected items
                if (last.hasNext) {
                    last.getNext().then(gatherer).catch(reject);
                } else {
                    resolve(itemsCollector);
                }
            };

            // start the cycle
            items.getPaged().then(gatherer).catch(reject);
        });
    }

    /**
     * Adds a new item to the collection
     *
     * @param properties The new items's properties
     * @param listItemEntityTypeFullName The type name of the list's entities
     */
    public add(properties: TypedHash<any> = {}, listItemEntityTypeFullName: string = null): Promise<ItemAddResult> {

        const removeDependency = this.addBatchDependency();

        return this.ensureListItemEntityTypeName(listItemEntityTypeFullName).then(listItemEntityType => {

            const postBody = jsS(extend(metadata(listItemEntityType), properties));

            const promise = this.clone(Items, "").postCore<{ Id: number }>({ body: postBody }).then((data) => {
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
     * Delete this item
     *
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    public delete = this._deleteWithETag;

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
     * Gets the collection of comments associated with this list item
     */
    public get comments(): Comments {
        return new Comments(this);
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
     * Gets the collection of versions associated with this item
     */
    public get versions(): ItemVersions {
        return new ItemVersions(this);
    }

    public get list(): List {
        return this.getParent(List, this.parentUrl.substr(0, this.parentUrl.lastIndexOf("/")));
    }

    /**
     * Updates this list intance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the list
     * @param eTag Value used in the IF-Match header, by default "*"
     * @param listItemEntityTypeFullName The type name of the list's entities
     */
    public update(properties: TypedHash<any>, eTag = "*", listItemEntityTypeFullName: string = null): Promise<ItemUpdateResult> {

        return new Promise<ItemUpdateResult>((resolve, reject) => {

            const removeDependency = this.addBatchDependency();

            return this.ensureListItemEntityTypeName(listItemEntityTypeFullName).then(listItemEntityType => {

                const postBody = jsS(extend(metadata(listItemEntityType), properties));

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
     * Gets the collection of people who have liked this item
     */
    public getLikedBy(): Promise<LikeData[]> {
        return this.clone(Item, "likedBy").postCore<LikeData[]>();
    }

    /**
     * Likes this item as the current user
     */
    public like(): Promise<void> {
        return this.clone(Item, "like").postCore<void>();
    }

    /**
     * Unlikes this item as the current user
     */
    public unlike(): Promise<void> {
        return this.clone(Item, "unlike").postCore<void>();
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
        i.query.set("@action", <any>action);
        return i.postCore().then((data: any) => {

            // handle verbose mode
            if (hOP(data, "GetWOPIFrameUrl")) {
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
            body: jsS({ "formValues": formValues, bNewDocumentUpdate: newDocumentUpdate }),
        });
    }

    /**
     * Get the like by information for a modern site page     
     */
    public getLikedByInformation(): Promise<void> {
        return this.clone(Item, "likedByInformation").expand("likedby").getCore<void>();
    }

    /**
     * Ensures we have the proper list item entity type name, either from the value provided or from the list
     *
     * @param candidatelistItemEntityTypeFullName The potential type name
     */
    private ensureListItemEntityTypeName(candidatelistItemEntityTypeFullName: string): Promise<string> {

        return candidatelistItemEntityTypeFullName ?
            Promise.resolve(candidatelistItemEntityTypeFullName) :
            this.list.getListItemEntityTypeFullName();
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
 * Describes a collection of Version objects
 *
 */
@defaultPath("versions")
export class ItemVersions extends SharePointQueryableCollection {
    /**	
     * Gets a version by id	
     *	
     * @param versionId The id of the version to retrieve	
     */
    public getById(versionId: number): ItemVersion {
        const v = new ItemVersion(this);
        v.concat(`(${versionId})`);
        return v;
    }
}

/**
 * Describes a single Version instance
 *
 */
export class ItemVersion extends SharePointQueryableInstance {

    /**
    * Delete a specific version of a file.
    *
    * @param eTag Value used in the IF-Match header, by default "*"
    */
    public delete = this._deleteWithETag;
}

/**
 * Provides paging functionality for list items
 */
export class PagedItemCollection<T> {

    constructor(private parent: Items, private nextUrl: string, public results: T, private innerParser: ODataParser<T>) { }

    /**
     * If true there are more results available in the set, otherwise there are not
     */
    public get hasNext(): boolean {
        return typeof this.nextUrl === "string" && this.nextUrl.length > 0;
    }

    /**
     * Gets the next set of results, or resolves to null if no results are available
     */
    public getNext(): Promise<PagedItemCollection<T>> {

        if (this.hasNext) {
            const items = new Items(this.nextUrl, null).configureFrom(this.parent);
            return items.getPaged<T>(this.innerParser);
        }

        return new Promise<any>(r => r(null));
    }
}

class PagedItemCollectionParser<T> extends ODataParserBase<PagedItemCollection<T>> {

    constructor(private _parent: Items, private innerParser: ODataParser<T>) {
        super();
    }

    public parse(r: Response): Promise<PagedItemCollection<T>> {

        return this.innerParser.parse(r).then(async items => {

            const json = (<any>this.innerParser).rawJson;

            const nextUrl = hOP(json, "d") && hOP(json.d, "__next") ? json.d.__next : json["odata.nextLink"];

            return new PagedItemCollection(this._parent, nextUrl, items, this.innerParser);
        });
    }
}

class ItemUpdatedParser extends ODataParserBase<ItemUpdateResultData> {
    public async parse(r: Response): Promise<ItemUpdateResultData> {
        return new Promise<ItemUpdateResultData>((resolve, reject) => {

            if (this.handleError(r, reject)) {
                resolve({
                    "odata.etag": r.headers.get("etag"),
                });
            }
        });
    }
}

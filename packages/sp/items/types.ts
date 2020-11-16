import {
    SharePointQueryable,
    _SharePointQueryableInstance,
    ISharePointQueryableInstance,
    _SharePointQueryableCollection,
    ISharePointQueryable,
    SharePointQueryableInstance,
    spInvokableFactory,
    deleteableWithETag,
    IDeleteableWithETag,
} from "../sharepointqueryable";
import { assign, ITypedHash, hOP } from "@pnp/common";
import { IListItemFormUpdateValue, List } from "../lists/types";
import { ODataParser, body, headers } from "@pnp/odata";
import { IList } from "../lists";
import { Logger, LogLevel } from "@pnp/logging";
import { metadata } from "../utils/metadata";
import { defaultPath } from "../decorators";
import { spPost } from "../operations";
import { tag } from "../telemetry";
import { IResourcePath } from '../utils/toResourcePath';

/**
 * Describes a collection of Item objects
 *
 */
@defaultPath("items")
export class _Items extends _SharePointQueryableCollection {

    /**	
    * Gets an Item by id	
    *	
    * @param id The integer id of the item to retrieve	
    */
    public getById(id: number): IItem {
        return tag.configure(Item(this).concat(`(${id})`), "is.getById");
    }

    /**
     * Gets BCS Item by string id
     *
     * @param stringId The string id of the BCS item to retrieve
     */
    public getItemByStringId(stringId: string): IItem {
        // creates an item with the parent list path and append out method call
        return tag.configure(Item(this.parentUrl, `getItemByStringId('${stringId}')`), "is.getItemByStringId");
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
    @tag("is.getPaged")
    public getPaged<T = any[]>(): Promise<PagedItemCollection<T>> {
        return this.usingParser(new PagedItemCollectionParser<T>(this))();
    }

    /**
     * Gets all the items in a list, regardless of count. Does not support batching or caching
     *
     *  @param requestSize Number of items to return in each request (Default: 2000)
     *  @param acceptHeader Allows for setting the value of the Accept header for SP 2013 support
     */
    @tag("is.getAll")
    public getAll(requestSize = 2000, acceptHeader = "application/json;odata=nometadata"): Promise<any[]> {

        Logger.write("Calling items.getAll should be done sparingly. Ensure this is the correct choice. If you are unsure, it is not.", LogLevel.Warning);

        // this will be used for the actual query
        // and we set no metadata here to try and reduce traffic
        const items = <IItems>Items(this, "").top(requestSize).configure({
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
    @tag("is.add")
    public async add(properties: ITypedHash<any> = {}, listItemEntityTypeFullName: string = null): Promise<IItemAddResult> {

        const removeDependency = this.addBatchDependency();

        const listItemEntityType = await this.ensureListItemEntityTypeName(listItemEntityTypeFullName);

        const postBody = body(assign(metadata(listItemEntityType), properties));

        const promise = spPost<{ Id: number }>(this.clone(Items, ""), postBody).then((data) => {
            return {
                data: data,
                item: this.getById(data.Id),
            };
        });

        removeDependency();

        return promise;
    }

    /**
     * Ensures we have the proper list item entity type name, either from the value provided or from the list
     *
     * @param candidatelistItemEntityTypeFullName The potential type name
     */
    private ensureListItemEntityTypeName(candidatelistItemEntityTypeFullName: string): Promise<string> {

        return candidatelistItemEntityTypeFullName ?
            Promise.resolve(candidatelistItemEntityTypeFullName) :
            this.getParent<IList>(List).getListItemEntityTypeFullName();
    }
}
export interface IItems extends _Items { }
export const Items = spInvokableFactory<IItems>(_Items);

/**
 * Descrines a single Item instance
 *
 */
export class _Item extends _SharePointQueryableInstance {

    public delete = deleteableWithETag("i");

    /**
     * Gets the effective base permissions for the item
     *
     */
    public get effectiveBasePermissions(): ISharePointQueryable {
        return tag.configure(SharePointQueryable(this, "EffectiveBasePermissions"), "i.effectiveBasePermissions");
    }

    /**
     * Gets the effective base permissions for the item in a UI context
     *
     */
    public get effectiveBasePermissionsForUI(): ISharePointQueryable {
        return tag.configure(SharePointQueryable(this, "EffectiveBasePermissionsForUI"), "i.effectiveBasePermissionsForUI");
    }

    /**
     * Gets the field values for this list item in their HTML representation
     *
     */
    public get fieldValuesAsHTML(): ISharePointQueryableInstance {
        return tag.configure(SharePointQueryableInstance(this, "FieldValuesAsHTML"), "i.fvHTML");
    }

    /**
     * Gets the field values for this list item in their text representation
     *
     */
    public get fieldValuesAsText(): ISharePointQueryableInstance {
        return tag.configure(SharePointQueryableInstance(this, "FieldValuesAsText"), "i.fvText");
    }

    /**
     * Gets the field values for this list item for use in editing controls
     *
     */
    public get fieldValuesForEdit(): ISharePointQueryableInstance {
        return tag.configure(SharePointQueryableInstance(this, "FieldValuesForEdit"), "i.fvEdit");
    }

    /**
     * Gets the collection of versions associated with this item
     */
    public get versions(): IItemVersions {
        return tag.configure(ItemVersions(this), "i.versions");
    }

    public get list(): IList {
        return this.getParent<IList>(List, this.parentUrl.substr(0, this.parentUrl.lastIndexOf("/")));
    }

    /**
     * Updates this list intance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the list
     * @param eTag Value used in the IF-Match header, by default "*"
     * @param listItemEntityTypeFullName The type name of the list's entities
     */
    public async update(properties: ITypedHash<any>, eTag = "*", listItemEntityTypeFullName: string = null): Promise<IItemUpdateResult> {

        const removeDependency = this.addBatchDependency();

        const listItemEntityType = await this.ensureListItemEntityTypeName(listItemEntityTypeFullName);

        const postBody = body(assign(metadata(listItemEntityType), properties), headers({
            "IF-Match": eTag,
            "X-HTTP-Method": "MERGE",
        }));

        removeDependency();

        const poster = tag.configure(this.clone(Item).usingParser(new ItemUpdatedParser()), "i.update");
        const data = await spPost(poster, postBody);

        return {
            data,
            item: this,
        };
    }

    /**
     * Moves the list item to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     */
    @tag("i.recycle")
    public recycle(): Promise<string> {
        return spPost<string>(this.clone(Item, "recycle"));
    }

    /**
     * Deletes the item object with options.
     * 
     * @param parameters Specifies the options to use when deleting a item.
     */
    @tag("i.del-params")
    public async deleteWithParams(parameters: Partial<IItemDeleteParams>): Promise<void> {
        return spPost(this.clone(Item, "DeleteWithParameters"), body({ parameters }));
    }

    /**
     * Gets a string representation of the full URL to the WOPI frame.
     * If there is no associated WOPI application, or no associated action, an empty string is returned.
     *
     * @param action Display mode: 0: view, 1: edit, 2: mobileView, 3: interactivePreview
     */
    @tag("i.getWopiFrameUrl")
    public async getWopiFrameUrl(action = 0): Promise<string> {
        const i = this.clone(Item, "getWOPIFrameUrl(@action)");
        i.query.set("@action", <any>action);

        const data = await spPost(i);

        // handle verbose mode
        if (hOP(data, "GetWOPIFrameUrl")) {
            return data.GetWOPIFrameUrl;
        }

        return data;
    }

    /**
     * Validates and sets the values of the specified collection of fields for the list item.
     *
     * @param formValues The fields to change and their new values.
     * @param bNewDocumentUpdate true if the list item is a document being updated after upload; otherwise false.
     */
    @tag("i.validateUpdateListItem")
    public validateUpdateListItem(formValues: IListItemFormUpdateValue[], bNewDocumentUpdate = false): Promise<IListItemFormUpdateValue[]> {
        return spPost(this.clone(Item, "validateupdatelistitem"), body({ formValues, bNewDocumentUpdate }));
    }

    /**
     * Gets the parent information for this item's list and web
     */
    public async getParentInfos(): Promise<IItemParentInfos> {

        const urlInfo: any =
            await this.select(
                "Id",
                "ParentList/Id",
                "ParentList/RootFolder/UniqueId",
                "ParentList/RootFolder/ServerRelativeUrl",
                "ParentList/RootFolder/ServerRelativePath",
                "ParentList/ParentWeb/Id",
                "ParentList/ParentWeb/Url",
                "ParentList/ParentWeb/ServerRelativeUrl",
                "ParentList/ParentWeb/ServerRelativePath",
            ).expand(
                "ParentList",
                "ParentList/RootFolder",
                "ParentList/ParentWeb")();

        return {
            Item: {
                Id: urlInfo.Id,
            },
            ParentList: {
                Id: urlInfo.ParentList.Id,
                RootFolderServerRelativePath: urlInfo.ParentList.RootFolder.ServerRelativePath,
                RootFolderServerRelativeUrl: urlInfo.ParentList.RootFolder.ServerRelativeUrl,
                RootFolderUniqueId: urlInfo.ParentList.RootFolder.UniqueId,
            },
            ParentWeb: {
                Id: urlInfo.ParentList.ParentWeb.Id,
                ServerRelativePath: urlInfo.ParentList.ParentWeb.ServerRelativePath,
                ServerRelativeUrl: urlInfo.ParentList.ParentWeb.ServerRelativeUrl,
                Url: urlInfo.ParentList.ParentWeb.Url,
            },
        };
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
export interface IItem extends _Item, IDeleteableWithETag { }
export const Item = spInvokableFactory<IItem>(_Item);

/**
 * Describes a collection of Version objects
 *
 */
@defaultPath("versions")
export class _ItemVersions extends _SharePointQueryableCollection {
    /**	
     * Gets a version by id	
     *	
     * @param versionId The id of the version to retrieve	
     */
    public getById(versionId: number): IItemVersion {
        return tag.configure(ItemVersion(this).concat(`(${versionId})`), "iv.getById");
    }
}
export interface IItemVersions extends _ItemVersions { }
export const ItemVersions = spInvokableFactory<IItemVersions>(_ItemVersions);

/**
 * Describes a single Version instance
 *
 */
export class _ItemVersion extends _SharePointQueryableInstance {
    public delete = deleteableWithETag("iv");
}
export interface IItemVersion extends _ItemVersion, IDeleteableWithETag { }
export const ItemVersion = spInvokableFactory<IItemVersion>(_ItemVersion);

/**
 * Provides paging functionality for list items
 */
export class PagedItemCollection<T> {

    constructor(private parent: _Items, private nextUrl: string, public results: T) { }

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
            const items = tag.configure(<IItems>Items(this.nextUrl, null).configureFrom(this.parent), "ip.getNext");
            return items.getPaged<T>();
        }

        return new Promise<any>(r => r(null));
    }
}

class PagedItemCollectionParser<T = any[]> extends ODataParser<PagedItemCollection<T>> {

    constructor(private _parent: _Items) {
        super();
    }

    public parse(r: Response): Promise<PagedItemCollection<T>> {

        return new Promise((resolve, reject) => {

            if (this.handleError(r, reject)) {
                r.json().then(json => {
                    const nextUrl = hOP(json, "d") && hOP(json.d, "__next") ? json.d.__next : json["odata.nextLink"];
                    resolve(new PagedItemCollection<T>(this._parent, nextUrl, this.parseODataJSON(json)));
                });
            }
        });
    }
}

class ItemUpdatedParser extends ODataParser<IItemUpdateResultData> {
    public parse(r: Response): Promise<IItemUpdateResultData> {

        return new Promise<IItemUpdateResultData>((resolve, reject) => {

            if (this.handleError(r, reject)) {
                resolve({
                    "odata.etag": r.headers.get("etag"),
                });
            }
        });
    }
}

export interface IItemAddResult {
    item: IItem;
    data: any;
}

export interface IItemUpdateResult {
    item: IItem;
    data: IItemUpdateResultData;
}

export interface IItemUpdateResultData {
    "odata.etag": string;
}

export interface IItemDeleteParams {

    /**
     * If true, delete or recycle a file when the LockType 
     * value is SPLockType.Shared or SPLockType.None.
     * When false, delete or recycle the file when
     * the LockType value SPLockType.None.
     */
    BypassSharedLock: boolean;
}

export interface IItemParentInfos {
    Item: {
        Id: string;
    };
    ParentList: {
        Id: string;
        RootFolderServerRelativePath: IResourcePath;
        RootFolderServerRelativeUrl: string;
        RootFolderUniqueId: string;
    };
    ParentWeb: {
        Id: string;
        ServerRelativePath: IResourcePath;
        ServerRelativeUrl: string;
        Url: string;
    };
}

import {
    _SPCollection,
    spInvokableFactory,
    IDeleteableWithETag,
    _SPInstance,
    deleteableWithETag,
    SPQueryable,
    ISPQueryable,
    SPInstance,
    ISPInstance,
} from "../spqueryable.js";
import { hOP } from "@pnp/core";
import { extractWebUrl } from "@pnp/sp";
import { IListItemFormUpdateValue, List } from "../lists/types.js";
import { body, headers, parseBinderWithErrorCheck, parseODataJSON } from "@pnp/queryable";
import { IList } from "../lists/index.js";
import { defaultPath } from "../decorators.js";
import { spPost } from "../operations.js";
import { IResourcePath } from "../utils/to-resource-path.js";

/**
 * Describes a collection of Item objects
 *
 */
@defaultPath("items")
export class _Items extends _SPCollection {

    /**
    * Gets an Item by id
    *
    * @param id The integer id of the item to retrieve
    */
    public getById(id: number): IItem {
        return Item(this).concat(`(${id})`);
    }

    /**
     * Gets BCS Item by string id
     *
     * @param stringId The string id of the BCS item to retrieve
     */
    public getItemByStringId(stringId: string): IItem {
        // creates an item with the parent list path and append out method call
        return Item([this, this.parentUrl], `getItemByStringId('${stringId}')`);
    }

    /**
     * Skips the specified number of items (https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#sectionSection6)
     *
     * @param skip The starting id where the page should start, use with top to specify pages
     * @param reverse It true the PagedPrev=true parameter is added allowing backwards navigation in the collection
     */
    public skip(skip: number, reverse = false): this {
        if (reverse) {
            this.query.set("$skiptoken", `Paged=TRUE&PagedPrev=TRUE&p_ID=${skip}`);
        } else {
            this.query.set("$skiptoken", `Paged=TRUE&p_ID=${skip}`);
        }
        return this;
    }

    /**
     * Gets a collection designed to aid in paging through data
     *
     */
    public getPaged<T = any[]>(): Promise<PagedItemCollection<T>> {
        return this.using(PagedItemParser(this))();
    }

    /**
     * Adds a new item to the collection
     *
     * @param properties The new items's properties
     * @param listItemEntityTypeFullName The type name of the list's entities
     */
    public async add(properties: Record<string, any> = {}): Promise<IItemAddResult> {

        return spPost<{ Id: number }>(this, body(properties)).then((data) => ({
            data: data,
            item: this.getById(data.Id),
        }));
    }
}
export interface IItems extends _Items { }
export const Items = spInvokableFactory<IItems>(_Items);

/**
 * Descrines a single Item instance
 *
 */
export class _Item extends _SPInstance {

    public delete = deleteableWithETag();

    /**
     * Gets the effective base permissions for the item
     *
     */
    public get effectiveBasePermissions(): ISPQueryable {
        return SPQueryable(this, "EffectiveBasePermissions");
    }

    /**
     * Gets the effective base permissions for the item in a UI context
     *
     */
    public get effectiveBasePermissionsForUI(): ISPQueryable {
        return SPQueryable(this, "EffectiveBasePermissionsForUI");
    }

    /**
     * Gets the field values for this list item in their HTML representation
     *
     */
    public get fieldValuesAsHTML(): ISPInstance {
        return SPInstance(this, "FieldValuesAsHTML");
    }

    /**
     * Gets the field values for this list item in their text representation
     *
     */
    public get fieldValuesAsText(): ISPInstance {
        return SPInstance(this, "FieldValuesAsText");
    }

    /**
     * Gets the field values for this list item for use in editing controls
     *
     */
    public get fieldValuesForEdit(): ISPInstance {
        return SPInstance(this, "FieldValuesForEdit");
    }

    /**
     * Gets the collection of versions associated with this item
     */
    public get versions(): IItemVersions {
        return ItemVersions(this);
    }

    /**
     * this item's list
     */
    public get list(): IList {
        return this.getParent<IList>(List, "", this.parentUrl.substring(0, this.parentUrl.lastIndexOf("/")));
    }

    /**
     * Updates this list instance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the list
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    public async update(properties: Record<string, any>, eTag = "*"): Promise<IItemUpdateResult> {

        const postBody = body(properties, headers({
            "IF-Match": eTag,
            "X-HTTP-Method": "MERGE",
        }));

        const data = await spPost(Item(this).using(ItemUpdatedParser()), postBody);

        return {
            data,
            item: this,
        };
    }

    /**
     * Moves the list item to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     */
    public recycle(): Promise<string> {
        return spPost<string>(Item(this, "recycle"));
    }

    /**
     * Deletes the item object with options.
     *
     * @param parameters Specifies the options to use when deleting a item.
     */
    public async deleteWithParams(parameters: Partial<IItemDeleteParams>): Promise<void> {
        return spPost(Item(this, "DeleteWithParameters"), body({ parameters }));
    }

    /**
     * Gets a string representation of the full URL to the WOPI frame.
     * If there is no associated WOPI application, or no associated action, an empty string is returned.
     *
     * @param action Display mode: 0: view, 1: edit, 2: mobileView, 3: interactivePreview
     */
    public async getWopiFrameUrl(action = 0): Promise<string> {
        const i = Item(this, "getWOPIFrameUrl(@action)");
        i.query.set("@action", <any>action);

        return spPost(i);
    }

    /**
     * Validates and sets the values of the specified collection of fields for the list item.
     *
     * @param formValues The fields to change and their new values.
     * @param bNewDocumentUpdate true if the list item is a document being updated after upload; otherwise false.
     */
    public validateUpdateListItem(formValues: IListItemFormUpdateValue[], bNewDocumentUpdate = false): Promise<IListItemFormUpdateValue[]> {
        return spPost(Item(this, "validateupdatelistitem"), body({ formValues, bNewDocumentUpdate }));
    }

    /**
     * Gets the parent information for this item's list and web
     */
    public async getParentInfos(): Promise<IItemParentInfos> {

        const urlInfo: any =
            await this.select(
                "Id",
                "ParentList/Id",
                "ParentList/Title",
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
                Title: urlInfo.ParentList.Title,
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

    public async setImageField(fieldName: string, imageName: string, imageContent: any): Promise<any> {

        const contextInfo = await this.getParentInfos();

        const webUrl = extractWebUrl(this.toUrl());

        const q = SPQueryable([this, webUrl], "/_api/web/UploadImage");
        q.concat("(listTitle=@a1,imageName=@a2,listId=@a3,itemId=@a4)");
        q.query.set("@a1", `'${contextInfo.ParentList.Title}'`);
        q.query.set("@a2", `'${imageName}'`);
        q.query.set("@a3", `'${contextInfo.ParentList.Id}'`);
        q.query.set("@a4", contextInfo.Item.Id);

        const result = await spPost<IItemImageUploadResult>(q, { body: imageContent });

        const itemInfo = {
            "type": "thumbnail",
            "fileName": result.Name,
            "nativeFile": {},
            "fieldName": fieldName,
            "serverUrl": contextInfo.ParentWeb.Url.replace(contextInfo.ParentWeb.ServerRelativeUrl, ""),
            "serverRelativeUrl": result.ServerRelativeUrl,
            "id": result.UniqueId,
        };

        return this.validateUpdateListItem([{
            FieldName: fieldName,
            FieldValue: JSON.stringify(itemInfo),
        }]);
    }

}
export interface IItem extends _Item, IDeleteableWithETag { }
export const Item = spInvokableFactory<IItem>(_Item);

/**
 * Describes a collection of Version objects
 *
 */
@defaultPath("versions")
export class _ItemVersions extends _SPCollection {
    /**
     * Gets a version by id
     *
     * @param versionId The id of the version to retrieve
     */
    public getById(versionId: number): IItemVersion {
        return ItemVersion(this).concat(`(${versionId})`);
    }
}
export interface IItemVersions extends _ItemVersions { }
export const ItemVersions = spInvokableFactory<IItemVersions>(_ItemVersions);

/**
 * Describes a single Version instance
 *
 */
export class _ItemVersion extends _SPInstance {
    public delete = deleteableWithETag();
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
    public async getNext(): Promise<PagedItemCollection<T> | null> {

        if (this.hasNext) {
            const items = <IItems>Items([this.parent, this.nextUrl], "");
            return items.getPaged<T>();
        }

        return null;
    }
}

function PagedItemParser(parent: _Items) {

    return parseBinderWithErrorCheck(async (r) => {
        const json = await r.json();
        const nextUrl = hOP(json, "d") && hOP(json.d, "__next") ? json.d.__next : json["odata.nextLink"];
        return new PagedItemCollection(parent, nextUrl, parseODataJSON(json));
    });
}

function ItemUpdatedParser() {
    return parseBinderWithErrorCheck(async (r) => (<IItemUpdateResultData>{
        etag: r.headers.get("etag"),
    }));
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
    etag: string;
}

export interface IItemImageUploadResult {
    Name: string;
    ServerRelativeUrl: string;
    UniqueId: string;
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
        Title: string;
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

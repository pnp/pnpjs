import { assign, TypedHash } from "@pnp/common";
import {
    SharePointQueryable,
    SharePointQueryableCollection,
    SharePointQueryableInstance,
    _SharePointQueryableInstance,
    ISharePointQueryableCollection,
    _SharePointQueryableCollection,
    ISharePointQueryableInstance,
    ISharePointQueryable,
    spInvokableFactory,
} from "../sharepointqueryable";
import { odataUrlFrom } from "../odata";
import { IItem, Item } from "../items/types";
import { IInvokable, body } from "@pnp/odata";
import { defaultPath, deleteableWithETag, IDeleteableWithETag, clientTagMethod } from "../decorators";
import { spPost } from "../operations";
import { escapeQueryStrValue } from "../utils/escapeSingleQuote";

@defaultPath("folders")
export class _Folders extends _SharePointQueryableCollection implements _IFolders {

    public getByName(name: string): IFolder {
        return clientTagMethod.configure(Folder(this).concat(`('${escapeQueryStrValue(name)}')`), "fs.getByName");
    }

    @clientTagMethod("fs.add")
    public async add(url: string): Promise<IFolderAddResult> {

        const data = await spPost(this.clone(Folders, `add('${escapeQueryStrValue(url)}')`));

        return {
            data,
            folder: this.getByName(url),
        };
    }
}

/**
 * Describes a collection of Folder objects
 *
 */
export interface _IFolders {

    /**
     * Gets a folder by folder name
     * @param name Folder name
     */
    getByName(name: string): IFolder;

    /**
    * Adds a new folder to the current folder (relative) or any folder (absolute)
    *
    * @param url The relative or absolute url where the new folder will be created. Urls starting with a forward slash are absolute.
    * @returns The new Folder and the raw response.
    */
    add(url: string): Promise<IFolderAddResult>;
}

export interface IFolders extends _IFolders, IInvokable, ISharePointQueryableCollection { }

/**
 * Invokable factory for IFolders instances
 */
export const Folders = spInvokableFactory<IFolders>(_Folders);

@deleteableWithETag()
export class _Folder extends _SharePointQueryableInstance implements _IFolder {

    public get contentTypeOrder(): ISharePointQueryableCollection {
        return clientTagMethod.configure(SharePointQueryableCollection(this, "contentTypeOrder"), "f.contentTypeOrder");
    }

    public get folders(): IFolders {
        return Folders(this);
    }

    public get listItemAllFields(): ISharePointQueryableInstance {
        return clientTagMethod.configure(SharePointQueryableInstance(this, "listItemAllFields"), "f.listItemAllFields");
    }

    public get parentFolder(): IFolder {
        return clientTagMethod.configure(Folder(this, "parentFolder"), "f.parentFolder");
    }

    public get properties(): ISharePointQueryableInstance {
        return clientTagMethod.configure(SharePointQueryableInstance(this, "properties"), "f.properties");
    }

    public get serverRelativeUrl(): ISharePointQueryable {
        return clientTagMethod.configure(SharePointQueryable(this, "serverRelativeUrl"), "f.serverRelativeUrl");
    }

    public get uniqueContentTypeOrder(): ISharePointQueryableCollection {
        return clientTagMethod.configure(SharePointQueryableCollection(this, "uniqueContentTypeOrder"), "f.uniqueContentTypeOrder");
    }

    public update = this._update<IFolderUpdateResult, TypedHash<any>>("SP.Folder", data => ({ data, folder: <any>this }));

    @clientTagMethod("f.recycle")
    public recycle(): Promise<string> {
        return spPost(this.clone(Folder, "recycle"));
    }

    @clientTagMethod("f.getItem")
    public async getItem<T>(...selects: string[]): Promise<IItem & T> {

        const q = this.listItemAllFields;
        const d = await q.select.apply(q, selects)();

        return assign(Item(odataUrlFrom(d)), d);
    }

    @clientTagMethod("f.moveTo")
    public async moveTo(destUrl: string): Promise<void> {

        const srcUrl = await this.select("ServerRelativeUrl")<{ ServerRelativeUrl: string }>();

        const webBaseUrl = this.toUrl().split("/_api")[0];
        const hostUrl = webBaseUrl.replace("://", "___").split("/")[0].replace("___", "://");
        return spPost(SharePointQueryable(`${webBaseUrl}/_api/SP.MoveCopyUtil.MoveFolder()`), body({
            destUrl: destUrl.indexOf("http") === 0 ? destUrl : `${hostUrl}${destUrl}`,
            srcUrl: `${hostUrl}${srcUrl.ServerRelativeUrl}`,
        }));
    }

    @clientTagMethod("f.moveTo")
    protected async getShareable(): Promise<IItem> {
        // sharing only works on the item end point, not the file one - so we create a folder instance with the item url internally
        const d = await this.clone(SharePointQueryableInstance, "listItemAllFields", false).select("odata.id")();

        let shareable = Item(odataUrlFrom(d));

        // we need to handle batching
        if (this.hasBatch) {
            shareable = shareable.inBatch(this.batch);
        }

        return shareable;
    }
}

/**
 * Describes a single Folder instance
 *
 */
export interface _IFolder {
    /**
     * Specifies the sequence in which content types are displayed.
     *
     */
    readonly contentTypeOrder: ISharePointQueryableCollection;

    /**
     * Gets this folder's sub folders
     *
     */
    readonly folders: IFolders;

    /**
     * Gets this folder's list item field values
     *
     */
    readonly listItemAllFields: ISharePointQueryableInstance;

    /**
     * Gets the parent folder, if available
     *
     */
    readonly parentFolder: IFolder;

    /**
     * Gets this folder's properties
     *
     */
    readonly properties: ISharePointQueryableInstance;

    /**
     * Gets this folder's server relative url
     *
     */
    readonly serverRelativeUrl: ISharePointQueryable;

    /**
     * Gets a value that specifies the content type order.
     *
     */
    readonly uniqueContentTypeOrder: ISharePointQueryableCollection;

    /**
     * Updates folder's properties
     * @param props Folder's properties to update
     */
    update(props: TypedHash<any>): Promise<IFolderUpdateResult>;

    /**
     * Moves the folder to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     */
    recycle(): Promise<string>;

    /**
     * Gets the associated list item for this folder, loading the default properties
     */
    getItem<T>(...selects: string[]): Promise<IItem & T>;

    /**
     * Moves a folder to destination path
     *
     * @param destUrl Absolute or relative URL of the destination path
     */
    moveTo(destUrl: string): Promise<void>;
}

export interface IFolder extends _IFolder, IInvokable, ISharePointQueryableInstance, IDeleteableWithETag { }

export const Folder = spInvokableFactory<IFolder>(_Folder);

/**
 * Describes result of adding a folder
 */
export interface IFolderAddResult {

    /**
     * A folder's instance
     */
    folder: IFolder;

    /**
     * Additional data from the server 
     */
    data: any;
}

/**
 * Describes result of updating a folder
 */
export interface IFolderUpdateResult {

    /**
     * A folder's instance
     */
    folder: IFolder;

    /**
     * Additional data from the server 
     */
    data: any;
}

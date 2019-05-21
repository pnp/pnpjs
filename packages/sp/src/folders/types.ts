import { extend, TypedHash } from "@pnp/common";
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
import { defaultPath, deleteableWithETag, IDeleteableWithETag } from "../decorators";
import { spPost } from "../operations";
import { escapeQueryStrValue } from "../utils/escapeSingleQuote";

/**
 * Describes a collection of Folder objects
 *
 */
@defaultPath("folders")
export class _Folders extends _SharePointQueryableCollection implements IFolders {

    /**
     * Gets a folder by folder name
     *
     */
    public getByName(name: string): IFolder {
        return Folder(this).concat(`('${escapeQueryStrValue(name)}')`);
    }

    /**
     * Adds a new folder to the current folder (relative) or any folder (absolute)
     *
     * @param url The relative or absolute url where the new folder will be created. Urls starting with a forward slash are absolute.
     * @returns The new Folder and the raw response.
     */
    public async add(url: string): Promise<IFolderAddResult> {

        const data = await spPost(this.clone(Folders, `add('${escapeQueryStrValue(url)}')`));

        return {
            data,
            folder: this.getByName(url),
        };
    }
}

export interface IFolders extends IInvokable, ISharePointQueryableCollection {
    getByName(name: string): IFolder;
    add(url: string): Promise<IFolderAddResult>;
}
export interface _Folders extends IInvokable { }
export const Folders = spInvokableFactory<IFolders>(_Folders);

/**
 * Describes a single Folder instance
 *
 */
@deleteableWithETag()
export class _Folder extends _SharePointQueryableInstance implements IFolder {

    /**
     * Specifies the sequence in which content types are displayed.
     *
     */
    public get contentTypeOrder(): ISharePointQueryableCollection {
        return SharePointQueryableCollection(this, "contentTypeOrder");
    }

    /**
     * Gets this folder's sub folders
     *
     */
    public get folders(): IFolders {
        return Folders(this);
    }

    /**
     * Gets this folder's list item field values
     *
     */
    public get listItemAllFields(): ISharePointQueryableInstance {
        return SharePointQueryableInstance(this, "listItemAllFields");
    }

    /**
     * Gets the parent folder, if available
     *
     */
    public get parentFolder(): IFolder {
        return Folder(this, "parentFolder");
    }

    /**
     * Gets this folder's properties
     *
     */
    public get properties(): _SharePointQueryableInstance {
        return new _SharePointQueryableInstance(this, "properties");
    }

    /**
     * Gets this folder's server relative url
     *
     */
    public get serverRelativeUrl(): ISharePointQueryable {
        return SharePointQueryable(this, "serverRelativeUrl");
    }

    /**
     * Gets a value that specifies the content type order.
     *
     */
    public get uniqueContentTypeOrder(): ISharePointQueryableCollection {
        return SharePointQueryableCollection(this, "uniqueContentTypeOrder");
    }

    // TODO:: this typing is broken
    public update: any = this._update<IFolderUpdateResult, TypedHash<any>>("SP.Folder", data => ({ data, folder: <IFolder>this }));

    /**
     * Moves the folder to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     */
    public recycle(): Promise<string> {
        return spPost(this.clone(Folder, "recycle"));
    }

    /**
     * Gets the associated list item for this folder, loading the default properties
     */
    public getItem<T>(...selects: string[]): Promise<IItem & T> {

        const q = this.listItemAllFields;
        return q.select.apply(q, selects).get().then((d: any) => {

            return extend(Item(odataUrlFrom(d)), d);
        });
    }

    /**
     * Moves a folder to destination path
     *
     * @param destUrl Absolute or relative URL of the destination path
     */
    public async moveTo(destUrl: string): Promise<void> {

        const srcUrl = await this.select("ServerRelativeUrl")();

        const webBaseUrl = this.toUrl().split("/_api")[0];
        const hostUrl = webBaseUrl.replace("://", "___").split("/")[0].replace("___", "://");
        return spPost(SharePointQueryable(`${webBaseUrl}/_api/SP.MoveCopyUtil.MoveFolder()`), body({
            destUrl: destUrl.indexOf("http") === 0 ? destUrl : `${hostUrl}${destUrl}`,
            srcUrl: `${hostUrl}${srcUrl}`,
        }));
    }
}

export interface IFolder extends IInvokable, ISharePointQueryableInstance, IDeleteableWithETag {
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
    readonly properties: _SharePointQueryableInstance;

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

    update: <Return, Props, Data>(type: string, mapper: (data: Data, props: Props) => Return) => (props: Props) => Promise<Return>;

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

export interface _Folder extends IInvokable, IDeleteableWithETag { }
export const Folder = spInvokableFactory<IFolder>(_Folder);

export interface IFolderAddResult {
    folder: IFolder;
    data: any;
}

export interface IFolderUpdateResult {
    folder: IFolder;
    data: any;
}

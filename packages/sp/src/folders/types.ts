import { assign, TypedHash, isUrlAbsolute } from "@pnp/common";
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
    deleteableWithETag,
    IDeleteableWithETag,
} from "../sharepointqueryable";
import { odataUrlFrom } from "../odata";
import { IItem, Item } from "../items/types";
import { body } from "@pnp/odata";
import { defaultPath } from "../decorators";
import { spPost } from "../operations";
import { escapeQueryStrValue } from "../utils/escapeQueryStrValue";
import { extractWebUrl } from "../utils/extractweburl";
import { tag } from "../telemetry";

@defaultPath("folders")
export class _Folders extends _SharePointQueryableCollection {

    /**
     * Gets a folder by it's name
     * 
     * @param name Folder's name
     */
    public getByName(name: string): IFolder {
        return tag.configure(Folder(this).concat(`('${escapeQueryStrValue(name)}')`), "fs.getByName");
    }

    /**
     * Adds a new folder at the specified URL
     * 
     * @param url 
     */
    @tag("fs.add")
    public async add(url: string): Promise<IFolderAddResult> {

        const data = await spPost(this.clone(Folders, `add('${escapeQueryStrValue(url)}')`));

        return {
            data,
            folder: this.getByName(url),
        };
    }

    /**
     * Adds a new folder by path and should be prefered over add
     * 
     * @param serverRelativeUrl The server relative url of the new folder to create
     * @param overwrite True to overwrite an existing folder, default false
     */
    public async addUsingPath(serverRelativeUrl: string, overwrite = false): Promise<IFolderAddResult> {

        const data = await spPost(this.clone(Folders, `addUsingPath(DecodedUrl='${escapeQueryStrValue(serverRelativeUrl)}',overwrite=${overwrite})`));

        return {
            data,
            folder: Folder(extractWebUrl(this.toUrl()), `_api/web/getFolderByServerRelativePath(decodedUrl='${escapeQueryStrValue(serverRelativeUrl)}')`),
        };
    }
}
export interface IFolders extends _Folders { }
export const Folders = spInvokableFactory<IFolders>(_Folders);


export class _Folder extends _SharePointQueryableInstance {

    public delete = deleteableWithETag("f");

    /**
     * Specifies the sequence in which content types are displayed.
     *
     */
    public get contentTypeOrder(): ISharePointQueryableCollection {
        return tag.configure(SharePointQueryableCollection(this, "contentTypeOrder"), "f.contentTypeOrder");
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
        return tag.configure(SharePointQueryableInstance(this, "listItemAllFields"), "f.listItemAllFields");
    }

    /**
     * Gets the parent folder, if available
     *
     */
    public get parentFolder(): IFolder {
        return tag.configure(Folder(this, "parentFolder"), "f.parentFolder");
    }

    /**
     * Gets this folder's properties
     *
     */
    public get properties(): ISharePointQueryableInstance {
        return tag.configure(SharePointQueryableInstance(this, "properties"), "f.properties");
    }

    /**
     * Gets this folder's server relative url
     *
     */
    public get serverRelativeUrl(): ISharePointQueryable {
        return tag.configure(SharePointQueryable(this, "serverRelativeUrl"), "f.serverRelativeUrl");
    }

    /**
     * Gets a value that specifies the content type order.
     *
     */
    public get uniqueContentTypeOrder(): ISharePointQueryableCollection {
        return tag.configure(SharePointQueryableCollection(this, "uniqueContentTypeOrder"), "f.uniqueContentTypeOrder");
    }

    /**
     * Updates folder's properties
     * @param props Folder's properties to update
     */
    public update = this._update<IFolderUpdateResult, TypedHash<any>>("SP.Folder", data => ({ data, folder: <any>this }));

    /**
     * Moves the folder to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     */
    @tag("f.recycle")
    public recycle(): Promise<string> {
        return spPost(this.clone(Folder, "recycle"));
    }

    /**
     * Gets the associated list item for this folder, loading the default properties
     */
    @tag("f.getItem")
    public async getItem<T>(...selects: string[]): Promise<IItem & T> {

        const q = this.listItemAllFields;
        const d = await q.select.apply(q, selects)();

        return assign(Item(odataUrlFrom(d)), d);
    }

    /**
     * Moves a folder to destination path
     *
     * @param destUrl Absolute or relative URL of the destination path
     */
    @tag("f.moveTo")
    public async moveTo(destUrl: string): Promise<void> {

        const { ServerRelativeUrl: srcUrl, ["odata.id"]: absoluteUrl } = await this.select("ServerRelativeUrl")();
        const webBaseUrl = extractWebUrl(absoluteUrl);
        const hostUrl = webBaseUrl.replace("://", "___").split("/")[0].replace("___", "://");
        await spPost(Folder(webBaseUrl, "/_api/SP.MoveCopyUtil.MoveFolder()"),
            body({
                destUrl: isUrlAbsolute(destUrl) ? destUrl : `${hostUrl}${destUrl}`,
                srcUrl: `${hostUrl}${srcUrl}`,
            }));
    }

    @tag("f.moveTo")
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
export interface IFolder extends _Folder, IDeleteableWithETag {}
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

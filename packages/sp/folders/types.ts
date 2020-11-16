import { assign, ITypedHash, isUrlAbsolute, combine } from "@pnp/common";
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
import { toResourcePath, IResourcePath } from "../utils/toResourcePath";

@defaultPath("folders")
export class _Folders extends _SharePointQueryableCollection<IFolderInfo[]> {

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
    @tag("fs.addUsingPath")
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


export class _Folder extends _SharePointQueryableInstance<IFolderInfo> {

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
    public update = this._update<IFolderUpdateResult, ITypedHash<any>>("SP.Folder", data => ({ data, folder: <any>this }));

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
        const q = await this.listItemAllFields.select(...selects)();
        return assign(Item(odataUrlFrom(q)), q);
    }

    /**
     * Moves a folder to destination path
     *
     * @param destUrl Absolute or relative URL of the destination path
     */
    @tag("f.moveTo")
    public async moveTo(destUrl: string): Promise<void> {

        const urlInfo = await this.getParentInfos();

        const uri = new URL(urlInfo.ParentWeb.Url);

        await spPost(Folder(uri.origin, "/_api/SP.MoveCopyUtil.MoveFolder()"),
            body({
                destUrl: isUrlAbsolute(destUrl) ? destUrl : combine(uri.origin, destUrl),
                srcUrl: combine(uri.origin, urlInfo.Folder.ServerRelativeUrl),
            }));
    }

    /**
     * Moves a folder by path to destination path
     * Also works with different site collections.
     *
     * @param destUrl Absolute or relative URL of the destination path
     * @param keepBoth Keep both if folder with the same name in the same location already exists?
     */
    @tag("f.moveByPath")
    public async moveByPath(destUrl: string, KeepBoth = false): Promise<void> {

        const urlInfo = await this.getParentInfos();

        const uri = new URL(urlInfo.ParentWeb.Url);

        await spPost(Folder(uri.origin, `/_api/SP.MoveCopyUtil.MoveFolderByPath()`),
            body({
                destPath: toResourcePath(isUrlAbsolute(destUrl) ? destUrl : combine(uri.origin, destUrl)),
                options: {
                    KeepBoth,
                    ResetAuthorAndCreatedOnCopy: true,
                    ShouldBypassSharedLocks: true,
                    __metadata: {
                        type: "SP.MoveCopyOptions",
                    },
                },
                srcPath: toResourcePath(combine(uri.origin, urlInfo.Folder.ServerRelativeUrl)),
            }));
    }

    /**
     * Copies a folder to destination path
     *
     * @param destUrl Absolute or relative URL of the destination path
     */
    @tag("f.copyTo")
    public async copyTo(destUrl: string): Promise<void> {

        const urlInfo = await this.getParentInfos();

        const uri = new URL(urlInfo.ParentWeb.Url);

        await spPost(Folder(uri.origin, "/_api/SP.MoveCopyUtil.CopyFolder()"),
            body({
                destUrl: isUrlAbsolute(destUrl) ? destUrl : combine(uri.origin, destUrl),
                srcUrl: combine(uri.origin, urlInfo.Folder.ServerRelativeUrl),
            }));
    }

    /**
     * Copies a folder by path to destination path
     * Also works with different site collections.
     *
     * @param destUrl Absolute or relative URL of the destination path
     * @param keepBoth Keep both if folder with the same name in the same location already exists?
     */
    @tag("f.copyByPath")
    public async copyByPath(destUrl: string, KeepBoth = false): Promise<void> {

        const urlInfo = await this.getParentInfos();

        const uri = new URL(urlInfo.ParentWeb.Url);

        await spPost(Folder(uri.origin, `/_api/SP.MoveCopyUtil.CopyFolderByPath()`),
            body({
                destPath: toResourcePath(isUrlAbsolute(destUrl) ? destUrl : combine(uri.origin, destUrl)),
                options: {
                    KeepBoth: KeepBoth,
                    ResetAuthorAndCreatedOnCopy: true,
                    ShouldBypassSharedLocks: true,
                    __metadata: {
                        type: "SP.MoveCopyOptions",
                    },
                },
                srcPath: toResourcePath(combine(uri.origin, urlInfo.Folder.ServerRelativeUrl)),
            }));
    }

    /**
     * Deletes the folder object with options.
     * 
     * @param parameters Specifies the options to use when deleting a folder.
     */
    @tag("f.del-params")
    public async deleteWithParams(parameters: Partial<IFolderDeleteParams>): Promise<void> {
        return spPost(this.clone(Folder, "DeleteWithParameters"), body({ parameters }));
    }

    /**
     * Create the subfolder inside the current folder, as specified by the leafPath
     * 
     * @param leafPath leafName of the new folder
     */
    public async addSubFolderUsingPath(leafPath: string): Promise<IFolder> {
        await spPost(this.clone(Folder, "AddSubFolderUsingPath"), body({ leafPath: toResourcePath(leafPath) }));
        return this.folders.getByName(leafPath);
    }

    /**
     * Gets the parent information for this folder's list and web
     */
    public async getParentInfos(): Promise<IFolderParentInfos> {

        const urlInfo: any =
            await this.select(
                "ServerRelativeUrl",
                "ListItemAllFields/ParentList/Id",
                "ListItemAllFields/ParentList/RootFolder/UniqueId",
                "ListItemAllFields/ParentList/RootFolder/ServerRelativeUrl",
                "ListItemAllFields/ParentList/RootFolder/ServerRelativePath",
                "ListItemAllFields/ParentList/ParentWeb/Id",
                "ListItemAllFields/ParentList/ParentWeb/Url",
                "ListItemAllFields/ParentList/ParentWeb/ServerRelativeUrl",
                "ListItemAllFields/ParentList/ParentWeb/ServerRelativePath",
            ).expand(
                "ListItemAllFields/ParentList",
                "ListItemAllFields/ParentList/RootFolder",
                "ListItemAllFields/ParentList/ParentWeb")();

        return {
            Folder: {
                ServerRelativeUrl: urlInfo.ServerRelativeUrl,
            },
            ParentList: {
                Id: urlInfo.ListItemAllFields.ParentList.Id,
                RootFolderServerRelativePath: urlInfo.ListItemAllFields.ParentList.RootFolder.ServerRelativePath,
                RootFolderServerRelativeUrl: urlInfo.ListItemAllFields.ParentList.RootFolder.ServerRelativeUrl,
                RootFolderUniqueId: urlInfo.ListItemAllFields.ParentList.RootFolder.UniqueId,
            },
            ParentWeb: {
                Id: urlInfo.ListItemAllFields.ParentList.ParentWeb.Id,
                ServerRelativePath: urlInfo.ListItemAllFields.ParentList.ParentWeb.ServerRelativePath,
                ServerRelativeUrl: urlInfo.ListItemAllFields.ParentList.ParentWeb.ServerRelativeUrl,
                Url: urlInfo.ListItemAllFields.ParentList.ParentWeb.Url,
            },
        };
    }

    /**
     * Gets the shareable item associated with this folder
     */
    @tag("f.getShareable")
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
export interface IFolder extends _Folder, IDeleteableWithETag { }
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

export interface IFolderInfo {
    readonly "odata.id": string;
    Exists: boolean;
    IsWOPIEnabled: boolean;
    ItemCount: number;
    Name: string;
    ProgID: string | null;
    ServerRelativeUrl: string;
    ServerRelativePath: IResourcePath;
    TimeCreated: string;
    TimeLastModified: string;
    UniqueId: string;
    WelcomePage: string;
}

export interface IFolderDeleteParams {


    /**
     * If true, delete or recycle a folder iff all files have
     * LockType values SPLockType.Shared or SPLockType.None.
     * When false, delete or recycle the folder if all files
     * have  the LockType value SPLockType.None. See the <see cref="SPFile.SPLockType"/> enum.
     */
    BypassSharedLock: boolean;

    /**
     * Gets or sets a string value that allows SPFolder delete
     * and recycle methods to target a folder with a matching value
     */
    ETagMatch: string;

    /**
     * Gets or sets a Boolean that controls the way in which folders
     * are deleted. If set to true, only empty folders will be deleted.
     * If set to false, folders that are not empty may be deleted.
     */
    DeleteIfEmpty: boolean;
}

export interface IFolderParentInfos {
    Folder: {
        ServerRelativeUrl: string;
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

import { isUrlAbsolute, combine, noInherit } from "@pnp/core";
import { body, cancelableScope } from "@pnp/queryable";
import {
    _SPCollection,
    spInvokableFactory,
    _SPInstance,
    deleteableWithETag,
    SPInstance,
    ISPInstance,
    IDeleteableWithETag,
    ISPQueryable,
} from "../spqueryable.js";
import { odataUrlFrom } from "../utils/odata-url-from.js";
import { IItem, Item } from "../items/types.js";
import { defaultPath } from "../decorators.js";
import { spPost, spPostMerge } from "../operations.js";
import { extractWebUrl } from "../utils/extract-web-url.js";
import { toResourcePath, IResourcePath } from "../utils/to-resource-path.js";
import { encodePath } from "../utils/encode-path-str.js";
import "../context-info/index.js";
import { IMoveCopyOptions } from "../types.js";
import { BatchNever } from "../batching.js";

@defaultPath("folders")
export class _Folders extends _SPCollection<IFolderInfo[]> {

    /**
     * Gets a folder by it's name
     *
     * @param name Folder's name
     */
    public getByUrl(name: string): IFolder {
        return Folder(this).concat(`('${encodePath(name)}')`);
    }

    /**
     * Adds a new folder by path and should be prefered over add
     *
     * @param serverRelativeUrl The server relative url of the new folder to create
     * @param overwrite True to overwrite an existing folder, default false
     */
    public async addUsingPath(serverRelativeUrl: string, overwrite = false): Promise<IFolderAddResult> {

        const data: IFolderInfo = await spPost(Folders(this, `addUsingPath(DecodedUrl='${encodePath(serverRelativeUrl)}',overwrite=${overwrite})`));

        return {
            data,
            folder: folderFromServerRelativePath(this, data.ServerRelativeUrl),
        };
    }
}
export interface IFolders extends _Folders { }
export const Folders = spInvokableFactory<IFolders>(_Folders);


export class _Folder extends _SPInstance<IFolderInfo> {

    public delete = deleteableWithETag();

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
    public get listItemAllFields(): ISPInstance {
        return SPInstance(this, "listItemAllFields");
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
    public get properties(): ISPInstance {
        return SPInstance(this, "properties");
    }

    /**
     * Gets this folder's storage metrics information
     *
     */
    public get storageMetrics(): ISPInstance<IStorageMetrics> {
        return SPInstance(this, "storagemetrics");
    }

    /**
     * Updates folder's properties
     * @param props Folder's properties to update
     */
    public async update(props: Partial<IFolderInfo>): Promise<IFolderUpdateResult> {

        const data = await spPostMerge(this, body(props));

        return {
            data,
            folder: this,
        };
    }

    /**
     * Moves the folder to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     */
    public recycle(): Promise<string> {
        return spPost(Folder(this, "recycle"));
    }

    /**
     * Gets the associated list item for this folder, loading the default properties
     */
    public async getItem<T>(...selects: string[]): Promise<IItem & T> {

        const q = this.listItemAllFields;
        const d = await q.select(...selects)();
        if (d["odata.null"]) {
            throw Error("No associated item was found for this folder. It may be the root folder, which does not have an item.");
        }
        return Object.assign(Item([this, odataUrlFrom(d)]), d);
    }

    /**
     * Moves the file by path to the specified destination url.
     * Also works with different site collections.
     *
     * @param destUrl The absolute url or server relative url of the destination file path to move to.
     * @param shouldOverWrite Should a file with the same name in the same location be overwritten?
     * @param options Allows you to supply the full set of options controlling the move behavior
     */
    public async moveByPath(destUrl: string, options: Partial<Omit<IMoveCopyOptions, "ResetAuthorAndCreatedOnCopy">>): Promise<IFolder>;
    /**
     * Moves the file by path to the specified destination url.
     * Also works with different site collections.
     *
     * @param destUrl The absolute url or server relative url of the destination file path to move to.
     * @param keepBoth Keep both if file with the same name in the same location already exists? Only relevant when shouldOverWrite is set to false.
     */
    public async moveByPath(destUrl: string, KeepBoth?: boolean): Promise<IFolder>;
    @cancelableScope
    public async moveByPath(destUrl: string, ...rest: [Partial<Omit<IMoveCopyOptions, "ResetAuthorAndCreatedOnCopy">>] | [boolean?]): Promise<IFolder> {

        let options: Partial<IMoveCopyOptions> = {
            KeepBoth: false,
            ShouldBypassSharedLocks: true,
            RetainEditorAndModifiedOnMove: false,
        };

        if (rest.length === 1) {
            if (typeof rest[0] === "boolean") {
                options.KeepBoth = rest[0];
            } else if (typeof rest[0] === "object") {
                options = { ...options, ...rest[0] };
            }
        }

        return this.moveCopyImpl(destUrl, options, "MoveFolderByPath");
    }

    /**
     * Moves the folder by path to the specified destination url.
     * Also works with different site collections.
     *
     * @param destUrl The absolute url or server relative url of the destination folder path to move to.
     * @param shouldOverWrite Should a folder with the same name in the same location be overwritten?
     * @param options Allows you to supply the full set of options controlling the copy behavior
     */
    public async copyByPath(destUrl: string, options: Partial<Omit<IMoveCopyOptions, "RetainEditorAndModifiedOnMove">>): Promise<IFolder>;
    /**
     * Copies a folder by path to destination path
     * Also works with different site collections.
     *
     * @param destUrl Absolute or relative URL of the destination path
     * @param keepBoth Keep both if folder with the same name in the same location already exists?
     */
    public async copyByPath(destUrl: string, KeepBoth?: boolean): Promise<IFolder>;
    @cancelableScope
    public async copyByPath(destUrl: string, ...rest: [Partial<Omit<IMoveCopyOptions, "RetainEditorAndModifiedOnMove">>] | [boolean?]): Promise<IFolder> {

        let options: Partial<IMoveCopyOptions> = {
            ShouldBypassSharedLocks: true,
            ResetAuthorAndCreatedOnCopy: true,
            KeepBoth: false,
        };

        if (rest.length === 1) {
            if (typeof rest[0] === "boolean") {
                options.KeepBoth = rest[0];
            } else if (typeof rest[0] === "object") {
                options = { ...options, ...rest[0] };
            }
        }

        return this.moveCopyImpl(destUrl, options, "CopyFolderByPath");
    }

    /**
     * Deletes the folder object with options.
     *
     * @param parameters Specifies the options to use when deleting a folder.
     */
    public async deleteWithParams(parameters: Partial<IFolderDeleteParams>): Promise<void> {
        return spPost(Folder(this, "DeleteWithParameters"), body({ parameters }));
    }

    /**
     * Create the subfolder inside the current folder, as specified by the leafPath
     *
     * @param leafPath leafName of the new folder
     */
    public async addSubFolderUsingPath(leafPath: string): Promise<IFolder> {
        await spPost(Folder(this, "AddSubFolderUsingPath"), body({ leafPath: toResourcePath(leafPath) }));
        return this.folders.getByUrl(leafPath);
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
     * Implementation of folder move/copy
     *
     * @param destUrl The server relative path to which the folder will be copied/moved
     * @param options Any options
     * @param methodName The method to call
     * @returns An IFolder representing the moved or copied folder
     */
    protected moveCopyImpl(destUrl: string, options: Partial<IMoveCopyOptions>, methodName: "MoveFolderByPath" | "CopyFolderByPath"): Promise<IFolder> {

        // create a timeline we will manipulate for this request
        const poster = Folder(this);

        // add our pre-request actions, this fixes issues with batching hanging #2668
        poster.on.pre(noInherit(async (url, init, result) => {

            const urlInfo = await Folder(this).using(BatchNever()).getParentInfos();

            const uri = new URL(urlInfo.ParentWeb.Url);

            url = combine(urlInfo.ParentWeb.Url, `/_api/SP.MoveCopyUtil.${methodName}()`);

            init = body({
                destPath: toResourcePath(isUrlAbsolute(destUrl) ? destUrl : combine(uri.origin, destUrl)),
                options,
                srcPath: toResourcePath(combine(uri.origin, urlInfo.Folder.ServerRelativeUrl)),
            }, init);

            return [url, init, result];
        }));

        return spPost(poster).then(() => folderFromPath(this, destUrl));
    }
}
export interface IFolder extends _Folder, IDeleteableWithETag { }
export const Folder = spInvokableFactory<IFolder>(_Folder);

/**
 * Creates an IFolder instance given a base object and a server relative path
 *
 * @param base Valid SPQueryable from which the observers will be used and the web url extracted
 * @param serverRelativePath The server relative url to the folder (ex: '/sites/dev/documents/folder3')
 * @returns IFolder instance referencing the folder described by the supplied parameters
 */
export function folderFromServerRelativePath(base: ISPQueryable, serverRelativePath: string): IFolder {

    return Folder([base, extractWebUrl(base.toUrl())], `_api/web/getFolderByServerRelativePath(decodedUrl='${encodePath(serverRelativePath)}')`);
}

/**
 * Creates an IFolder instance given a base object and an absolute path
 *
 * @param base Valid SPQueryable from which the observers will be used
 * @param serverRelativePath The absolute url to the folder (ex: 'https://tenant.sharepoint.com/sites/dev/documents/folder/')
 * @returns IFolder instance referencing the folder described by the supplied parameters
 */
export async function folderFromAbsolutePath(base: ISPQueryable, absoluteFolderPath: string): Promise<IFolder> {

    const { WebFullUrl } = await Folder(this).using(BatchNever()).getContextInfo(absoluteFolderPath);
    const { pathname } = new URL(absoluteFolderPath);
    return folderFromServerRelativePath(Folder([base, combine(WebFullUrl, "_api/web")]), decodeURIComponent(pathname));
}

/**
 * Creates an IFolder intance given a base object and either an absolute or server relative path to a folder
 *
 * @param base Valid SPQueryable from which the observers will be used
 * @param serverRelativePath server relative or absolute url to the file (ex: 'https://tenant.sharepoint.com/sites/dev/documents/folder' or '/sites/dev/documents/folder')
 * @returns IFile instance referencing the file described by the supplied parameters
 */
export async function folderFromPath(base: ISPQueryable, path: string): Promise<IFolder> {
    return (isUrlAbsolute(path) ? folderFromAbsolutePath : folderFromServerRelativePath)(base, path);
}

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
    ContentTypeOrder: string[];
    UniqueContentTypeOrder: string[];
    StorageMetrics?: IStorageMetrics;
}

export interface IStorageMetrics {
    LastModified: string;
    TotalFileCount: number;
    TotalFileStreamSize: number;
    TotalSize: number;
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

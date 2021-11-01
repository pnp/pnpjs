import { isUrlAbsolute, combine } from "@pnp/core";
import { body } from "@pnp/queryable";
import {
    _SPCollection,
    spInvokableFactory,
    _SPInstance,
    deleteableWithETag,
    SPInstance,
    ISPInstance,
    IDeleteableWithETag,
} from "../spqueryable.js";
import { odataUrlFrom } from "../utils/odata-url-from.js";
import { IItem, Item } from "../items/types.js";
import { defaultPath } from "../decorators.js";
import { spPost, spPostMerge } from "../operations.js";
import { escapeQueryStrValue } from "../utils/escape-query-str.js";
import { extractWebUrl } from "../utils/extract-web-url.js";
import { toResourcePath, IResourcePath } from "../utils/to-resource-path.js";

@defaultPath("folders")
export class _Folders extends _SPCollection<IFolderInfo[]> {

    /**
     * Gets a folder by it's name
     *
     * @param name Folder's name
     */
    public getByUrl(name: string): IFolder {
        return Folder(this).concat(`('${escapeQueryStrValue(name)}')`);
    }

    /**
     * Adds a new folder by path and should be prefered over add
     *
     * @param serverRelativeUrl The server relative url of the new folder to create
     * @param overwrite True to overwrite an existing folder, default false
     */
    public async addUsingPath(serverRelativeUrl: string, overwrite = false): Promise<IFolderAddResult> {

        const data = await spPost(Folders(this, `addUsingPath(DecodedUrl='${escapeQueryStrValue(serverRelativeUrl)}',overwrite=${overwrite})`));

        return {
            data,
            folder: Folder([this, extractWebUrl(this.toUrl())], `_api/web/getFolderByServerRelativePath(decodedUrl='${escapeQueryStrValue(data.ServerRelativeUrl)}')`),
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
        const q = await this.listItemAllFields.select(...selects)();
        if (q["odata.null"]) {
            throw Error("No associated item was found for this folder. It may be the root folder, which does not have an item.");
        }
        return Object.assign(Item([this, odataUrlFrom(q)]), q);
    }

    /**
     * Moves a folder by path to destination path
     * Also works with different site collections.
     *
     * @param destUrl Absolute or relative URL of the destination path
     * @param keepBoth Keep both if folder with the same name in the same location already exists?
     */
    public async moveByPath(destUrl: string, KeepBoth = false): Promise<void> {

        const urlInfo = await this.getParentInfos();

        const uri = new URL(urlInfo.ParentWeb.Url);

        await spPost(Folder(uri.origin, "/_api/SP.MoveCopyUtil.MoveFolderByPath()"),
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
     * Copies a folder by path to destination path
     * Also works with different site collections.
     *
     * @param destUrl Absolute or relative URL of the destination path
     * @param keepBoth Keep both if folder with the same name in the same location already exists?
     */
    public async copyByPath(destUrl: string, KeepBoth = false): Promise<void> {

        const urlInfo = await this.getParentInfos();

        const uri = new URL(urlInfo.ParentWeb.Url);

        await spPost(Folder(uri.origin, "/_api/SP.MoveCopyUtil.CopyFolderByPath()"),
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
     * Gets the shareable item associated with this folder
     */
    protected async getShareable(): Promise<IItem> {

        // sharing only works on the item end point, not the file one - so we create a folder instance with the item url internally
        const d = await SPInstance(this, "listItemAllFields").select("odata.id")();
        return Item([this, odataUrlFrom(d)]);
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

import { assign, ITypedHash, isUrlAbsolute, isArray } from "@pnp/common";
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
import { Web } from "../webs/types";
import "../lists/web";

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

        const q = await this.listItemAllFields();
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

    /**
     * Moves a folder by path to destination path
     * Also works with different site collections.
     *
     * @param destUrl Absolute or relative URL of the destination path
     * @param keepBoth Keep both if folder with the same name in the same location already exists?
     */
    @tag("f.moveByPath")
    public async moveByPath(destUrl: string, KeepBoth = false): Promise<void> {

        const { ServerRelativeUrl: srcUrl, ["odata.id"]: absoluteUrl } = await this.select("ServerRelativeUrl")();
        const webBaseUrl = extractWebUrl(absoluteUrl);
        const hostUrl = webBaseUrl.replace("://", "___").split("/")[0].replace("___", "://");
        await spPost(Folder(webBaseUrl, `/_api/SP.MoveCopyUtil.MoveFolderByPath()`),
            body({
                destPath: toResourcePath(isUrlAbsolute(destUrl) ? destUrl : `${hostUrl}${destUrl}`),
                options: {
                    KeepBoth: KeepBoth,
                    ResetAuthorAndCreatedOnCopy: true,
                    ShouldBypassSharedLocks: true,
                    __metadata: {
                        type: "SP.MoveCopyOptions",
                    },
                },
                srcPath: toResourcePath(`${hostUrl}${srcUrl}`),
            }));
    }

    /**
     * Copies a folder to destination path
     *
     * @param destUrl Absolute or relative URL of the destination path
     */
    @tag("f.copyTo")
    public async copyTo(destUrl: string): Promise<void> {

        const { ServerRelativeUrl: srcUrl, ["odata.id"]: absoluteUrl } = await this.select("ServerRelativeUrl")();
        const webBaseUrl = extractWebUrl(absoluteUrl);
        const hostUrl = webBaseUrl.replace("://", "___").split("/")[0].replace("___", "://");
        await spPost(Folder(webBaseUrl, "/_api/SP.MoveCopyUtil.CopyFolder()"),
            body({
                destUrl: isUrlAbsolute(destUrl) ? destUrl : `${hostUrl}${destUrl}`,
                srcUrl: `${hostUrl}${srcUrl}`,
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

        const { ServerRelativeUrl: srcUrl, ["odata.id"]: absoluteUrl } = await this.select("ServerRelativeUrl")();
        const webBaseUrl = extractWebUrl(absoluteUrl);
        const hostUrl = webBaseUrl.replace("://", "___").split("/")[0].replace("___", "://");
        await spPost(Folder(webBaseUrl, `/_api/SP.MoveCopyUtil.CopyFolderByPath()`),
            body({
                destPath: toResourcePath(isUrlAbsolute(destUrl) ? destUrl : `${hostUrl}${destUrl}`),
                options: {
                    KeepBoth: KeepBoth,
                    ResetAuthorAndCreatedOnCopy: true,
                    ShouldBypassSharedLocks: true,
                    __metadata: {
                        type: "SP.MoveCopyOptions",
                    },
                },
                srcPath: toResourcePath(`${hostUrl}${srcUrl}`),
            }));
    }

    @tag("f.getDefVal")
    public async getDefaultColumnValues(): Promise<IFieldDefault[]> {

        const folderProps = await Folder(this, "Properties").select("vti_x005f_listname")<{ vti_x005f_listname: string; }>();
        const { ServerRelativePath: serRelPath } = await this.select("ServerRelativePath")<{ ServerRelativePath: IResourcePath }>();

        const web = Web(extractWebUrl(odataUrlFrom(folderProps)));
        const docLib = web.lists.getById(folderProps.vti_x005f_listname);

        // and we return the defaults associated with this folder's server relative path only
        // if you want all the defaults use list.getDefaultColumnValues()
        return (await docLib.getDefaultColumnValues()).filter(v => v.path.toLowerCase() === serRelPath.DecodedUrl.toLowerCase());
    }

    /**
     * 
     * Sets the default column values for this folder
     * 
     * @param fieldDefaults The values to set including field name and appropriate value
     * @param merge If true (default) existing values will be updated and new values added, otherwise all defaults are replaced for this folder
     */
    @tag("f.setDefVal")
    public async setDefaultColumnValues(fieldDefaults: IFieldDefaultProps[], merge = true): Promise<void> {

        // we start by figuring out where we are
        const folderProps = await Folder(this, "Properties").select("vti_x005f_listname")<{ vti_x005f_listname: string; }>();

        // now we create a web, list and batch to get some info we need
        const web = Web(extractWebUrl(odataUrlFrom(folderProps)));
        const docLib = web.lists.getById(folderProps.vti_x005f_listname);
        const batch = web.createBatch();

        const vals: {
            folderPath?: string;
            fieldDefs?: { name: string, type: string }[];
        } = {};

        this.select("ServerRelativePath").inBatch(batch)().then(i => {
            vals.folderPath = i.ServerRelativePath.DecodedUrl;
        });

        SharePointQueryableCollection(docLib, "fields").select("InternalName", "TypeAsString")
            .filter("Hidden ne true")
            .inBatch(batch)<{ InternalName: string, TypeAsString: string }[]>().then(fs => fs.map(f => ({
                name: f.InternalName,
                type: f.TypeAsString,
            }))).then(fieldDefs => {
                assign(vals, { fieldDefs });
            });

        await batch.execute();

        // @ts-ignore
        const defaultsToUpdate: {
            name: string;
            value: string;
        }[] = fieldDefaults.map(fieldDefault => {

            const index = vals.fieldDefs.findIndex(fd => fd.name === fieldDefault.name);

            if (index < 0) {
                throw Error(`Field '${fieldDefault.name}' does not exist in the list. Please check the internal field name. Failed to set defaults.`);
            }

            const fieldDef = vals.fieldDefs[index];
            let value = "";

            switch (fieldDef.type) {
                case "Boolean":
                case "Currency":
                case "Text":
                case "DateTime":
                case "Number":
                case "Choice":
                case "User":
                    if (isArray(fieldDefault.value)) {
                        throw Error(`The type '${fieldDef.type}' does not support multiple values.`);
                    }
                    value = `${fieldDefault.value}`;
                    break;

                case "MultiChoice":
                    if (isArray(fieldDefault.value)) {
                        value = (<any[]>fieldDefault.value).map(v => `${v}`).join(";");
                    } else {
                        value = `${fieldDefault.value}`;
                    }
                    break;

                case "UserMulti":
                    if (isArray(fieldDefault.value)) {
                        value = (<any[]>fieldDefault.value).map(v => `${v}`).join(";#");
                    } else {
                        value = `${fieldDefault.value}`;
                    }
                    break;

                case "Taxonomy":
                    if (isArray(fieldDefault.value)) {
                        throw Error(`The type '${fieldDef.type}' does not support multiple values.`);
                    } else {
                        value = `${(<any>fieldDefault.value).wssId};#${(<any>fieldDefault.value).termName}|${(<any>fieldDefault.value).termId}`;
                    }
                    break;

                case "TaxonomyMulti":
                    if (isArray(fieldDefault.value)) {
                        value = (<{ wssId: string, termName: string, termId: string }[]>fieldDefault.value).map(v => `${v.wssId};#${v.termName}|${v.termId}`).join(";#");
                    }
                    value = `${(<any>fieldDefault.value).wssId};#${(<any>fieldDefault.value).termName}|${(<any>fieldDefault.value).termId}`;
                    break;
            }

            return {
                name: fieldDefault.name,
                value,
            };
        });

        // at this point we should have all the defaults to update
        // and we need to get all the defaults to update the entire doc
        const existingDefaults = await docLib.getDefaultColumnValues();

        // we filter all defaults to remove any associated with this folder if merge is false
        // @ts-ignore
        const filteredExistingDefaults = merge ? existingDefaults : existingDefaults.filter(f => f.serverRelativePath !== vals.folderPath);

        // we update / add any new defaults from those passed to this method
        defaultsToUpdate.forEach(d => {

            const existing = filteredExistingDefaults.find(ed => ed.name === d.name && ed.path === vals.folderPath);

            if (existing) {
                existing.value = d.value;
            } else {
                filteredExistingDefaults.push({
                    name: d.name,
                    path: vals.folderPath,
                    value: d.value,
                });
            }
        });

        // after this operation filteredExistingDefaults should contain all the value we want to write to the file
        await docLib.setDefaultColumnValues(filteredExistingDefaults);
    }

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

export type AllowedDefaultColumnValues = number | string | boolean | { wssId: string, termName: string, termId: string };

export interface IFieldDefaultProps {
    /**
     * Internal name of the field
     */
    name: string;
    /**
     * The value of the field to set
     */
    value: AllowedDefaultColumnValues | AllowedDefaultColumnValues[];
}

export interface IFieldDefault extends IFieldDefaultProps {
    /**
     * The unencoded server relative path for this default
     */
    path: string;
}

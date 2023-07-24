import {
    GraphQueryableInstance,
    GraphQueryableCollection,
    _GraphQueryableInstance,
    IGraphQueryableInstance,
    IGraphQueryableCollection,
    _GraphQueryableCollection,
    graphInvokableFactory,
    GraphQueryable,
} from "../graphqueryable.js";
import { Drive as IDriveType, DriveItem as IDriveItemType, ItemPreviewInfo as IDriveItemPreviewInfo, ItemAnalytics as IItemAnalytics } from "@microsoft/microsoft-graph-types";
import { combine } from "@pnp/core";
import { defaultPath, getById, IGetById, deleteable, IDeleteable, updateable, IUpdateable } from "../decorators.js";
import { body, BlobParse, CacheNever, errorCheck, InjectHeaders } from "@pnp/queryable";
import { graphPatch, graphPost, graphPut } from "../operations.js";
import { driveItemUpload } from "./funcs.js";
import { AsPaged } from "../behaviors/paged.js";

/**
 * Describes a Drive instance
 *
 */
@defaultPath("drive")
export class _Drive extends _GraphQueryableInstance<IDriveType> {

    /**
     * Method for retrieving the root folder of a drive.
     * @returns IRoot
     */
    public get root(): IRoot {
        return Root(this);
    }

    /**
     * Method for retrieving the related list resource, for use with SharePoint drives.
     * @returns IGraphQueryableInstance
     */
    public get list(): IGraphQueryableInstance {
        return GraphQueryableInstance(this, "list");
    }

    /**
     * Method for retrieving recently accessed drive items by the user.
     * @returns IDriveItems
     */
    public get recent(): IDriveItems {
        return DriveItems(this, "recent");
    }

    /**
     * Method for retrieving drive items shared with the user.
     * @param options - ISharingWithMeOptions (Optional)
     * @returns IDriveItems
     */
    public async sharedWithMe(options: ISharingWithMeOptions = null): Promise<IDriveItems> {
        const q = DriveItems(this, "sharedWithMe");
        if (options?.allowExternal != null) {
            q.query.set("allowexternal", options?.allowExternal.toString());
        }

        return q();
    }

    /**
     * Method for retrieving a drive item by id.
     * @param id - string - the drive item id to retrieve
     * @returns IDriveItem
     */
    public getItemById(id: string): IDriveItem {
        return DriveItem(this, combine("items", id));
    }

    /**
     * Method for retrieving drive items the user is following.
     * @returns IDriveItems
     */
    public get following(): IDriveItems {
        return DriveItems(this, "following");
    }

    /**
     * Get DriveItems by Path
     * @param path string, partial path to folder must not contain a leading or trailing "/" e.g. folderA/folderB/folderC
     * @returns IDriveItems
     */
    public getItemsByPath(path: string): IDriveItems {
        return DriveItems(this, combine("root:/", `${path}:/children`));
    }

    /**
     * Get DriveItem by Path
     * @param path string, partial path to folder must not contain a leading or trailing "/" e.g. folderA/folderB/fileName.txt
     * @returns IDriveItems
     */
    public getItemByPath(path: string): IDriveItem {
        return DriveItem(this, combine("root:/", `${path}:`));
    }
}
export interface IDrive extends _Drive { }
export const Drive = graphInvokableFactory<IDrive>(_Drive);

/**
 * Describes a collection of Drive objects
 *
 */
@defaultPath("drives")
@getById(Drive)
export class _Drives extends _GraphQueryableCollection<IDriveType[]> { }
export interface IDrives extends _Drives, IGetById<IDrive> { }
export const Drives = graphInvokableFactory<IDrives>(_Drives);

/**
 * Describes a Root instance
 *
 */
@defaultPath("root")
export class _Root extends _GraphQueryableInstance<IDriveItemType> {

    /**
     * Method for retrieving children of a folder drive item.
     * @returns IDriveItems
     */
    public get children(): IDriveItems {
        return DriveItems(this, "children");
    }

    /**
     * Search drive for items matching the query
     * @param query string, search parameter
     * @returns IGraphQueryableCollection
     */
    public search(query: string): IGraphQueryableCollection {
        return GraphQueryableCollection(this, `search(q='${query}')`);
    }

    /**
     * Method for retrieving thumbnails of the drive items.
     * @returns IGraphQueryableCollection
     */
    public get thumbnails(): IGraphQueryableCollection {
        return GraphQueryableCollection(this, "thumbnails");
    }

    /**
     * Get changes since optional change token
     * @param token - string (Optional)
     * change token
     * @returns IDeltaItems
     */
    public delta(token?: string): IGraphQueryableCollection<IDeltaItems> {
        const path = `delta${(token) ? `(token=${token})` : ""}`;

        const query = GraphQueryableCollection(this, path);
        query.on.parse.replace(errorCheck);
        query.on.parse(async (url: URL, response: Response, result: any): Promise<[URL, Response, any]> => {
            const json = await response.json();
            const nextLink = json["@odata.nextLink"];
            const deltaLink = json["@odata.deltaLink"];

            result = {
                next: () => (nextLink ? AsPaged(GraphQueryableCollection([this, nextLink]))() : null),
                delta: () => (deltaLink ? GraphQueryableCollection([query, deltaLink])() : null),
                values: json.value,
            };

            return [url, response, result];
        });

        return query;
    }

    /**
     * Method for uploading a new file, or updating the contents of an existing file.
     * @param fileOptions - IFileOptions
     * @param content - any
     * @param filePathName - string (Optional)
     * e.g. myfile.txt or myfolder/myfile.txt, unneeded for updates
     * @param contentType - string (Optional)
     * e.g. "application/json; charset=utf-8" for JSON files
     * @returns IDriveItem
     */
    public async upload(fileOptions: IFileOptions): Promise<IDriveItemAddResult> {
        return Reflect.apply(driveItemUpload, this, [fileOptions]);
    }
}
export interface IRoot extends _Root { }
export const Root = graphInvokableFactory<IRoot>(_Root);

/**
 * Describes a Drive Item instance
 *
 */
@deleteable()
@updateable()
export class _DriveItem extends _GraphQueryableInstance<IDriveItemType> {

    /**
     * Method for retrieving children of a folder drive item.
     * @returns IDriveItems
     */
    public get children(): IDriveItems {
        return DriveItems(this, "children");
    }

    /**
     * Method for retrieving thumbnails of the drive items.
     * @returns IGraphQueryableCollection
     */
    public get thumbnails(): IGraphQueryableCollection {
        return GraphQueryableCollection(this, "thumbnails");
    }

    /**
     * Method for retrieving the versions of a drive item.
     * @returns IDriveItemVersionInfo
     */
    public get versions(): IGraphQueryableCollection<IDriveItemVersionInfo> {
        return <any>GraphQueryableCollection(this, "versions");
    }

    /**
     * Method for moving a drive item
     * @param parentReference - { id: string} - reference to destination folder drive item
     * @param name - string - name of the file in the destination
     * @deprecated (v3.11.0) use `moveItem`
     */
    public move(parentReference: { id: "string" }, name: string): Promise<void> {
        return graphPatch(this, body({ name, ...parentReference }));
    }

    /**
     * Method for moving a file to a new location and/or name.
     * @param moveOptions - IItemOptions object
     * @returns string - the URL where the new file is located
     */
    public async moveItem(moveOptions: IItemOptions): Promise<IDriveItem> {
        return graphPatch(this, body(moveOptions));
    }

    /**
     * Method for retrieving the contents of a drive item.
     * @returns Blob
     */
    public async getContent(): Promise<Blob> {
        const info = await this();
        const query = GraphQueryable([this, info["@microsoft.graph.downloadUrl"]], null)
            .using(BlobParse())
            .using(CacheNever());

        query.on.pre(async (url, init, result) => {

            (<any>init).responseType = "arraybuffer";

            return [url, init, result];
        });

        return query();
    }

    /**
     * Method for setting the contents of a IDriveItem
     * @param content - any - content to upload to the drive item
     * @returns - { id: string; name: string; size: number }
     * @deprecated (v3.11.0) use `upload`
     */
    public setContent(content: any): Promise<{ id: string; name: string; size: number }> {
        return graphPut(DriveItem(this, "content"), {
            body: content,
        });
    }

    /**
     * Method for copying a file to a new location and/or name.
     * @param copyOptions - IItemOptions
     * @returns string, the URL where the new file is located
     */
    public async copyItem(copyOptions: IItemOptions): Promise<string> {
        const creator = DriveItem(this, "copy").using((instance: IDriveItem) => {

            instance.on.parse(async (url, response, result) => {

                result = response.headers.has("location") ? response.headers : response;

                return [url, response, result];
            });

            return instance;
        });

        const data: Headers = await graphPost(creator, body(copyOptions));
        let result: string = null;
        if (data.has("location")) {
            result = data.get("location");
        }

        return result;
    }

    /**
     * Method for converting the format of a drive item.
     * @param format - string - "pdf" is only option
     * @returns Blob - content of the converted file
     */
    public async convertContent(format: "pdf"): Promise<Blob> {
        const query = GraphQueryable(this, `content?format=${format}`)
            .using(BlobParse())
            .using(CacheNever());

        query.on.pre(async (url, init, result) => {

            (<any>init).responseType = "arraybuffer";

            return [url, init, result];
        });

        return query();
    }

    /**
     * Method for uploading a new file, or updating the contents of an existing file.
     * @param fileOptions - IFileOptions object
     * @param content - any
     * @param filePathName - string (Optional)
     * e.g. myfile.txt or myfolder/myfile.txt, unneeded for updates
     * @param contentType - string (Optional)
     * e.g. "application/json; charset=utf-8" for JSON files
     * @returns IDriveItem
     */
    public async upload(fileOptions: IFileOptions): Promise<IDriveItemAddResult> {
        return Reflect.apply(driveItemUpload, this, [fileOptions]);
    }

    // TODO: Upload Session for large files
    // public uploadSession(fileOptions: IFileOptions): Promise<void> {

    // }

    /**
     * Method for getting a temporary preview image of a drive item.
     * @param previewOptions - IPreviewOptions (Optional)
     * @returns IDriveItemPreviewInfo
     */
    public async preview(previewOptions?: IPreviewOptions): Promise<IDriveItemPreviewInfo> {
        return graphPost(DriveItem(this, "preview"), body(previewOptions));
    }

    /**
     * Method for getting item analytics. Defaults to lastSevenDays.
     * @param analyticsOptions - IAnalyticsOptions (Optional)
     * @returns IGraphQueryableCollection<IItemAnalytics>
     */
    public analytics(analyticsOptions?: IAnalyticsOptions): IGraphQueryableCollection<IItemAnalytics> {
        const query = `analytics/${analyticsOptions?analyticsOptions.timeRange:"lastSevenDays"}`;
        return GraphQueryableCollection(this, query);
    }
}
export interface IDriveItem extends _DriveItem, IDeleteable, IUpdateable { }
export const DriveItem = graphInvokableFactory<IDriveItem>(_DriveItem);


/**
 * Describes a collection of Drive Item objects
 *
 */
@getById(DriveItem)
export class _DriveItems extends _GraphQueryableCollection<IDriveItemType[]> {
    /**
     * Adds a file to this collection of drive items.
     * For more upload options please see the .upload method on DriveItem and Root.
     * @param filename - string - name of new file
     * @param content - string - contents of file
     * @param contentType - string - content type for header - default to "application/json"
     * @returns IDriveItemAddResult - result with file data and chainable drive item object
     */
    public async add(filename: string, content: string, contentType = "application/json"): Promise<IDriveItemAddResult> {
        const postBody = {
            name: filename,
            file: {},
            "@microsoft.graph.conflictBehavior": "rename",
        };

        const driveItem = await graphPost(this, body(postBody));

        const q = DriveItem([this, `${combine("drives", driveItem.parentReference.driveId, "items", driveItem.id)}`], "content");
        q.using(InjectHeaders({
            "Content-Type": contentType,
        }));

        const data = await graphPut(q, { body: content });

        return {
            data,
            driveItem: DriveItem([this, `${combine("drives", driveItem.parentReference.driveId, "items", driveItem.id)}`]),
        };
    }

    /**
     * Adds a folder to this collection of drive items.
     * @param name - string, name of new folder
     * @param driveItem - DriveItem (Optional) - override default drive item properties
     * @returns IDriveItemAddResult - result with folder data and chainable drive item object
     */
    public async addFolder(name: string, driveItem?: any): Promise<IDriveItemAddResult> {
        let postBody = {
            name,
            folder: {},
            "@microsoft.graph.conflictBehavior": "rename",
        };

        if (driveItem) {
            if (driveItem.name == null) {
                driveItem.name = name;
            }
            if (driveItem["@microsoft.graph.conflictBehavior"] == null) {
                driveItem["@microsoft.graph.conflictBehavior"] = "rename";
            }
            postBody = driveItem;
        }
        const data = await graphPost(this, body(postBody));

        return {
            data,
            driveItem: DriveItem([this, `${combine("drives", data.parentReference.driveId, "items", data.id)}`]),
        };
    }
}
export interface IDriveItems extends _DriveItems, IGetById<IDriveItem> { }
export const DriveItems = graphInvokableFactory<IDriveItems>(_DriveItems);

/**
 * IDriveItemAddResult
 */
export interface IDriveItemAddResult {
    data: any;
    driveItem: IDriveItem;
}

export interface IDriveItemVersionInfo {
    id: string;
    lastModifiedBy: {
        user: {
            id: string;
            displayName: string;
        };
    };
    lastModifiedDateTime: string;
    size: number;
}

export interface ISharingWithMeOptions {
    allowExternal: boolean;
}

export interface IItemOptions {
    parentReference?: {
        id?: string;
        driveId?: string;
    };
    name?: string;
}

export interface IFileOptions {
    content: any;
    filePathName?: string;
    contentType?: string;
}

export interface IPreviewOptions {
    page?: string | number;
    zoom?: number;
}

export interface IDeltaItems {
    next: IGraphQueryableCollection<IDeltaItems>;
    delta: IGraphQueryableCollection<IDeltaItems>;
    values: any[];
}

export interface IAnalyticsOptions {
    timeRange: "allTime" | "lastSevenDays";
}

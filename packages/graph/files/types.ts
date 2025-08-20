import {
    GraphCollection,
    _GraphInstance,
    IGraphCollection,
    _GraphCollection,
    IGraphQueryable,
    graphInvokableFactory,
    GraphQueryable,
    graphPatch,
    graphPost,
    graphPut,
    graphDelete,
    GraphInstance,
    IGraphInstance,
} from "../graphqueryable.js";
import {
    Drive as IDriveType,
    DriveItem as IDriveItemType,
    ItemPreviewInfo as IDriveItemPreviewType,
    ThumbnailSet as IThumbnailSetType,
    DriveItemVersion as IDriveItemVersionType,
    UploadSession as IUploadSessionType,
    DriveItemUploadableProperties as IDriveItemUploadablePropertiesType,
    SensitivityLabelAssignmentMethod as ISensitivityLabelAssignmentMethodType,
    ExtractSensitivityLabelsResult as IExtractSensitivityLabelsResultType,
    ItemRetentionLabel as IItemRetentionLabelType,
} from "@microsoft/microsoft-graph-types";
import { combine } from "@pnp/core";
import { defaultPath, getById, IGetById, deleteable, IDeleteable, updateable, IUpdateable, hasDelta, IHasDelta, IDeltaProps } from "../decorators.js";
import { body, BlobParse, CacheNever, InjectHeaders } from "@pnp/queryable";
import { driveItemUpload } from "./funcs.js";
import { IResumableUpload, IResumableUploadOptions, getUploadSession } from "./resumableUpload.js";

/**
 * Describes a Drive instance
 *
 */
@defaultPath("drive")
export class _Drive extends _GraphInstance<IDriveType> {

    /**
     * Method for retrieving the root folder of a drive.
     * @returns IRoot
     */
    public get root(): IRoot {
        return Root(this);
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
export class _Drives extends _GraphCollection<IDriveType[]> { }
export interface IDrives extends _Drives, IGetById<IDrive> { }
export const Drives = graphInvokableFactory<IDrives>(_Drives);

/**
 * Describes a Root instance
 *
 */
@defaultPath("root")
@hasDelta()
export class _Root extends _GraphInstance<IDriveItemType> {

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
     * @returns IGraphCollection
     */
    public search(query: string): IGraphCollection {
        return GraphCollection(this, `search(q='${query}')`);
    }

    /**
     * Method for retrieving thumbnails of the drive items.
     * @returns IGraphCollection
     */
    public get thumbnails(): IGraphInstance<IThumbnailSetType> {
        return GraphInstance(this, "thumbnails");
    }

    /**
     * Method for uploading a new file, or updating the contents of an existing file.
     * @param fileOptions - IFileOptions object
     * @returns IDriveItem
     */
    public async upload(fileOptions: IFileUploadOptions): Promise<IDriveItemType> {
        return Reflect.apply(driveItemUpload, this, [fileOptions]);
    }
}
export interface IRoot extends _Root, IHasDelta<Omit<IDeltaProps, "deltatoken">, IDriveItemType> { }
export const Root = graphInvokableFactory<IRoot>(_Root);

/**
 * Describes a Drive Item instance
 *
 */
@deleteable()
@updateable()
export class _DriveItem extends _GraphInstance<IDriveItemType> {

    /**
     * Method for retrieving children of a folder drive item.
     * @returns IDriveItems
     */
    public get children(): IDriveItems {
        return DriveItems(this, "children");
    }

    public get items(): IDriveItems {
        return DriveItems(this, "items");
    }

    /**
     * Method for retrieving thumbnails of the drive items.
     * @returns Microsoft Graph - ThumbnailSet
     */
    public get thumbnails(): IGraphCollection<IThumbnailSetType[]> {
        return <any>GraphCollection(this, "thumbnails");
    }

    /**
     * Method for retrieving the versions of a drive item.
     * @returns IDriveItemVersionInfo
     */
    public get versions(): IGraphCollection<IDriveItemVersionType[]> {
        return <any>GraphCollection(this, "versions");
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

        const query = GraphQueryable(this, "content").using(BlobParse(), CacheNever());
        query.on.pre(async (url, init, result) => {

            (<any>init).responseType = "arraybuffer";

            return [url, init, result];
        });

        return query();
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
     * Method for getting a temporary preview image of a drive item.
     * @returns Microsoft Graph - DriveItem
     */
    public async follow(): Promise<IDriveItemType> {
        return await graphPost(DriveItem(this, "follow"), body(null));
    }

    /**
     * Method for getting a temporary preview image of a drive item.
     * @returns void
     */
    public async unfollow(): Promise<void> {
        return await graphPost(DriveItem(this, "unfollow"), body(null));
    }

    /**
     * Method for uploading a new file, or updating the contents of an existing file.
     * @param fileOptions - IFileUploadOptions object
     * @returns Microsoft Graph - DriveItem
     */
    public async upload(fileOptions: IFileUploadOptions): Promise<IDriveItemType> {
        return Reflect.apply(driveItemUpload, this, [fileOptions]);
    }

    /**
     * Method for uploading a new file, or updating the contents of an existing file.
     * @param resuableUploadOptions - IResumableUploadOptions object
     * @returns session: Microsoft Graph - UploadSession, resumableUpload: IResumableUpload
     */
    public async createUploadSession(resuableUploadOptions: IResumableUploadOptions<IDriveItemUploadablePropertiesType>):
    Promise<{ session: IUploadSessionType; resumableUpload: IResumableUpload }> {
        return Reflect.apply(getUploadSession, this, [resuableUploadOptions]);
    }

    /**
     * Method for getting a temporary preview image of a drive item.
     * @param previewOptions - IPreviewOptions (Optional)
     * @returns Microsoft Graph - DriveItemPreview
     */
    public async preview(previewOptions?: IPreviewOptions): Promise<IDriveItemPreviewType> {
        return graphPost(DriveItem(this, "preview"), body(previewOptions));
    }

    /**
     * Method for permanently deleting a driveItem by using its ID.
     * @returns void
     */
    public async permanentDelete(): Promise<void> {
        return graphPost(DriveItem(this, "permanentDelete"), body(null));
    }

    /**
     * Method for permanently deleting a driveItem by using its ID.
     * @param label: ISensitivityLabel
     * @returns string - long running operation status URL
     */
    public async assignSensitivityLabel(label: ISensitivityLabel): Promise<string> {
        const data: Headers = await graphPost(DriveItem(this, "assignSensitivityLabel"), body(label));
        let result: string = null;
        if (data.has("location")) {
            result = data.get("location");
        }

        return result;
    }

    /**
     * Method for permanently deleting a driveItem by using its ID.
     * @returns Microsoft Graph - ExtractSensitivityLabelsResult
     */
    public async extractSensitivityLabels(): Promise<IExtractSensitivityLabelsResultType> {
        return graphPost(DriveItem(this, "extractSensitivityLabels"), body(null));
    }

    /**
     * Method for retrieving the retention label of the drive item.
     * @returns Microsoft Graph - ItemRetentionLabel
     */
    public retentionLabel(): IGraphQueryable<IItemRetentionLabelType> {
        return GraphQueryable(this, "retentionLabel");
    }

    /**
     * Method for locking/unlocking a record of the drive item.
     * @returns Microsoft Graph - ItemRetentionLabel
     */
    public async recordLocked(locked: boolean): Promise<IItemRetentionLabelType> {
        const postBody = {
            retentionSettings: {
                "isRecordLocked": locked,
            },
        };
        return graphPatch(DriveItem(this, "retentionLabel"), body(postBody));
    }

    /**
     * Method for deleting a retention label from a driveItem.
     * @returns void
     */
    public async removeRetentionLabel(): Promise<void> {
        return graphDelete(DriveItem(this, "retentionLabel"));
    }

    /**
     * Method for updating a retention label on a driveItem.
     * @returns Microsoft Graph - ItemRetentionLabel
     */
    public async updateRetentionLabel(name: string): Promise<IItemRetentionLabelType> {
        const postBody = { name };
        return graphPatch(DriveItem(this, "retentionLabel"), body(postBody));
    }

    public async checkIn(checkInOptions?: ICheckInOptions): Promise<void> {
        return graphPost(DriveItem(this, "checkin"), body(checkInOptions));
    }

    public async checkOut(): Promise<void> {
        return graphPost(DriveItem(this, "checkout"));
    }
}

export interface IDriveItem extends _DriveItem, IDeleteable, IUpdateable { }
export const DriveItem = graphInvokableFactory<IDriveItem>(_DriveItem);

/**
 * Describes a collection of Drive Item objects
 *
 */
@getById(DriveItem)
export class _DriveItems extends _GraphCollection<IDriveItemType[]> {
    /**
     * Adds a file to this collection of drive items.
     * This method allows more control for conflict behavior and affecting other properties of the DriveItem than the .upload method.
     * For more upload options please see the .upload method on DriveItem.
     * @param fileInfo - IDriveItemAdd
     * @returns Microsoft Graph - DriveItem
     */
    public async add(fileInfo: IDriveItemAdd): Promise<IDriveItemType> {

        const q = DriveItem([this, this.parentUrl]).concat(`:/${fileInfo.filename}:/content`).using(InjectHeaders({
            "Content-Type": fileInfo.contentType,
        }));
        q.query.set("@name.conflictBehavior", fileInfo.conflictBehavior);

        return  graphPut(q, {
            body: fileInfo.content,
        });
    }

    /**
     * Adds a folder to this collection of drive items.
     * @param folderInfo - an object of type IDriveItemAddFolder specifying the properties of the new folder
     * @returns Microsoft Graph - DriveItem
     */
    public async addFolder(folderInfo: IDriveItemAddFolder): Promise<IDriveItemType> {
        const postBody = {
            name: folderInfo.name,
            folder: folderInfo.driveItem || {},
            "@microsoft.graph.conflictBehavior": folderInfo.conflictBehavior || "rename",
        };

        return await graphPost(this, body(postBody));
    }
}
export interface IDriveItems extends _DriveItems, IGetById<IDriveItemType> { }
export const DriveItems = graphInvokableFactory<IDriveItems>(_DriveItems);


/**
 * IDriveItemAdd - for adding a drive item and the corresponding contents
 * @param filename - string - file name.
 * @param content - any - file content.
 * @param contentType - string (Optional) - e.g. "application/json; charset=utf-8" for JSON files
 * @param driveItem - DriveItem (Optional).
 * @param conflictBehavior - string (Optional) - "rename" | "replace" | "fail" rename is default
 */
export interface IDriveItemAdd {
    filename: string;
    content: string;
    contentType: string;
    driveItem?: IDriveItem;
    conflictBehavior?: "rename" | "replace" | "fail" | "defaultName";
}

/**
 * IDriveItemAddFolder - for adding a folder drive item
 * @param name - string - folder name.
 * @param driveItem - DriveItem (Optional).
 * @param conflictBehavior - string (Optional) - "rename" | "replace" | "fail" rename is default
 */
export interface IDriveItemAddFolder {
    name: string;
    driveItem?: IDriveItem;
    conflictBehavior?: "rename" | "replace" | "fail";
}

/**
 * ISharingWithMeOptions - Sharing file with me options
 * @param allowExternal - boolean - To include items shared from external tenants set to true - default false
 */
export interface ISharingWithMeOptions {
    allowExternal: boolean;
}

/**
 * IItemOptions - for copy/move operations
 * @param name - string (Optional) - destination file name.
 * @param parentReference - Parent DriveItem Info (Optional). id of Drive Item and driveId of Drive.
 */
export interface IItemOptions {
    parentReference?: {
        id?: string;
        driveId?: string;
    };
    name?: string;
}

/**
 * IFileUploadOptions for uploading a file.
 * @param content - any
 * @param filePathName - string (Optional)
 * e.g. myfile.txt or myfolder/myfile.txt, unneeded for updates
 * @param contentType - string (Optional)
 * e.g. "application/json; charset=utf-8" for JSON files
 * @param eTag - string (Optional)
 * @param eTagMatch - string (Optional) - eTag header "If-Match" or "If-None-Match"
 */
export interface IFileUploadOptions {
    content: any;
    filePathName?: string;
    contentType?: string;
    eTag?: string;
    eTagMatch?: "If-Match" | "If-None-Match";
}

/**
 * IPreviewOptions for getting a file preview image.
 * @param page - string/number (Optional) - Page number of document to start at, if applicable.
 * @param zoom - number (Optional) - Zoom level to start at, if applicable.
 */
export interface IPreviewOptions {
    page?: string | number;
    zoom?: number;
}

/**
 * ISensitivityLabel - for assigning a sensitivity label to a drive item
 * @param sensitivityLabelId - string - the id of the sensitivity label
 * @param assignmentMethod - Microsoft Graph SensitivityLabelAssignmentMethod - "standard" | "privileged" | "auto" | "none"
 * @param justificationText - string - the justification for the sensitivity label
 */
export interface ISensitivityLabel {
    sensitivityLabelId: string;
    assignmentMethod: ISensitivityLabelAssignmentMethodType;
    justificationText: string;
}

/**
 * ICheckInOptions - parameters for checkIn a DriveItem
 * @param checkInAs - string - Optional. The status of the document after the check-in operation is complete. Can be `published` or unspecified.
 * @param comment - string - A check-in comment that is associated with the version.
 */
export interface ICheckInOptions {
    checkInAs?: string;
    comment?: string;
}

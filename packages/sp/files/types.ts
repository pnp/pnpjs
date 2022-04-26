import { body, TextParse, BlobParse, BufferParse, JSONParse } from "@pnp/queryable";
import { getGUID, isFunc, stringIsNullOrEmpty, isUrlAbsolute } from "@pnp/core";
import {
    _SPCollection,
    spInvokableFactory,
    _SPInstance,
    SPInstance,
    ISPInstance,
    IDeleteableWithETag,
    deleteableWithETag,
    ISPQueryable,
} from "../spqueryable.js";
import { Item, IItem } from "../items/index.js";
import { odataUrlFrom } from "../utils/odata-url-from.js";
import { defaultPath } from "../decorators.js";
import { spPost } from "../operations.js";
import { escapeQueryStrValue } from "../utils/escape-query-str.js";
import { extractWebUrl } from "../utils/extract-web-url.js";
import { toResourcePath } from "../utils/to-resource-path.js";

/**
 * Describes a collection of File objects
 *
 */
@defaultPath("files")
export class _Files extends _SPCollection<IFileInfo[]> {

    /**
     * Gets a File by filename
     *
     * @param name The name of the file, including extension.
     */
    public getByUrl(name: string): IFile {
        if (/%#/.test(name)) {
            throw Error("For file names containing % or # please use web.getFileByServerRelativePath");
        }
        return File(this).concat(`('${escapeQueryStrValue(name)}')`);
    }

    /**
     * Adds a file using the pound percent safe methods
     *
     * @param url Encoded url of the file
     * @param content The file content
     * @param parameters Additional parameters to control method behavior
     */
    public async addUsingPath(url: string, content: string | ArrayBuffer | Blob, parameters: IAddUsingPathProps = { Overwrite: false }): Promise<IFileAddResult> {

        const path = [`AddUsingPath(decodedurl='${escapeQueryStrValue(url)}'`];

        if (parameters) {
            if (parameters.Overwrite) {
                path.push(",Overwrite=true");
            }
            if (parameters.AutoCheckoutOnInvalidData) {
                path.push(",AutoCheckoutOnInvalidData=true");
            }
            if (!stringIsNullOrEmpty(parameters.XorHash)) {
                path.push(`,XorHash=${escapeQueryStrValue(parameters.XorHash)}`);
            }
        }

        path.push(")");

        const resp: IFileInfo = await spPost(Files(this, path.join("")), { body: content });

        return {
            data: resp,
            file: fileFromServerRelativePath(this, resp.ServerRelativeUrl),
        };
    }

    /**
     * Uploads a file. Not supported for batching
     *
     * @param url The folder-relative url of the file.
     * @param content The Blob file content to add
     * @param progress A callback function which can be used to track the progress of the upload
     * @param shouldOverWrite Should a file with the same name in the same location be overwritten? (default: true)
     * @param chunkSize The size of each file slice, in bytes (default: 10485760)
     * @returns The new File and the raw response.
     */
    public async addChunked(url: string, content: Blob, progress?: (data: IFileUploadProgressData) => void, shouldOverWrite = true, chunkSize = 10485760): Promise<IFileAddResult> {

        const response: IFileInfo = await spPost(Files(this, `add(overwrite=${shouldOverWrite},url='${escapeQueryStrValue(url)}')`));

        const file = fileFromServerRelativePath(this, response.ServerRelativeUrl);

        return await file.setContentChunked(content, progress, chunkSize);
    }

    /**
     * Adds a ghosted file to an existing list or document library. Not supported for batching.
     *
     * @param fileUrl The server-relative url where you want to save the file.
     * @param templateFileType The type of use to create the file.
     * @returns The template file that was added and the raw response.
     */
    public async addTemplateFile(fileUrl: string, templateFileType: TemplateFileType): Promise<IFileAddResult> {
        const response: IFileInfo = await spPost(Files(this, `addTemplateFile(urloffile='${escapeQueryStrValue(fileUrl)}',templatefiletype=${templateFileType})`));
        return {
            data: response,
            file: fileFromServerRelativePath(this, response.ServerRelativeUrl),
        };
    }
}
export interface IFiles extends _Files { }
export const Files = spInvokableFactory<IFiles>(_Files);

/**
 * Describes a single File instance
 *
 */
export class _File extends _SPInstance<IFileInfo> {

    public delete = deleteableWithETag();

    /**
     * Gets a value that specifies the list item field values for the list item corresponding to the file.
     *
     */
    public get listItemAllFields(): ISPInstance {
        return SPInstance(this, "listItemAllFields");
    }

    /**
     * Gets a collection of versions
     *
     */
    public get versions(): IVersions {
        return Versions(this);
    }

    /**
     * Approves the file submitted for content approval with the specified comment.
     * Only documents in lists that are enabled for content approval can be approved.
     *
     * @param comment The comment for the approval.
     */
    public approve(comment = ""): Promise<void> {
        return spPost(File(this, `approve(comment='${escapeQueryStrValue(comment)}')`));
    }

    /**
     * Stops the chunk upload session without saving the uploaded data. Does not support batching.
     * If the file doesn’t already exist in the library, the partially uploaded file will be deleted.
     * Use this in response to user action (as in a request to cancel an upload) or an error or exception.
     * Use the uploadId value that was passed to the StartUpload method that started the upload session.
     * This method is currently available only on Office 365.
     *
     * @param uploadId The unique identifier of the upload session.
     */
    public cancelUpload(uploadId: string): Promise<void> {
        return spPost(File(this, `cancelUpload(uploadId=guid'${uploadId}')`));
    }

    /**
     * Checks the file in to a document library based on the check-in type.
     *
     * @param comment A comment for the check-in. Its length must be <= 1023.
     * @param checkinType The check-in type for the file.
     */
    public checkin(comment = "", checkinType = CheckinType.Major): Promise<void> {

        if (comment.length > 1023) {
            throw Error("The maximum comment length is 1023 characters.");
        }

        return spPost(File(this, `checkin(comment='${escapeQueryStrValue(comment)}',checkintype=${checkinType})`));
    }

    /**
     * Checks out the file from a document library.
     */
    public checkout(): Promise<void> {
        return spPost(File(this, "checkout"));
    }

    /**
     * Copies the file to the destination url.
     *
     * @param url The absolute url or server relative url of the destination file path to copy to.
     * @param shouldOverWrite Should a file with the same name in the same location be overwritten?
     */
    public copyTo(url: string, shouldOverWrite = true): Promise<void> {
        return spPost(File(this, `copyTo(strnewurl='${escapeQueryStrValue(url)}',boverwrite=${shouldOverWrite})`));
    }

    /**
     * Copies the file by path to destination path.
     * Also works with different site collections.
     *
     * @param destUrl The absolute url or server relative url of the destination file path to copy to.
     * @param shouldOverWrite Should a file with the same name in the same location be overwritten?
     * @param keepBoth Keep both if file with the same name in the same location already exists? Only relevant when shouldOverWrite is set to false.
     */
    public async copyByPath(destUrl: string, shouldOverWrite: boolean, KeepBoth = false): Promise<void> {

        const { ServerRelativeUrl: srcUrl, ["odata.id"]: absoluteUrl } = await this.select("ServerRelativeUrl")();
        const webBaseUrl = new URL(extractWebUrl(absoluteUrl));
        return spPost(File([this, webBaseUrl.toString()], `/_api/SP.MoveCopyUtil.CopyFileByPath(overwrite=@a1)?@a1=${shouldOverWrite}`),
            body({
                destPath: toResourcePath(isUrlAbsolute(destUrl) ? destUrl : `${webBaseUrl.protocol}//${webBaseUrl.host}${destUrl}`),
                options: {
                    KeepBoth,
                    ResetAuthorAndCreatedOnCopy: true,
                    ShouldBypassSharedLocks: true,
                },
                srcPath: toResourcePath(isUrlAbsolute(srcUrl) ? srcUrl : `${webBaseUrl.protocol}//${webBaseUrl.host}${srcUrl}`),
            }));
    }

    /**
     * Denies approval for a file that was submitted for content approval.
     * Only documents in lists that are enabled for content approval can be denied.
     *
     * @param comment The comment for the denial.
     */
    public deny(comment = ""): Promise<void> {
        if (comment.length > 1023) {
            throw Error("The maximum comment length is 1023 characters.");
        }
        return spPost(File(this, `deny(comment='${escapeQueryStrValue(comment)}')`));
    }

    /**
     * Moves the file by path to the specified destination url.
     * Also works with different site collections.
     *
     * @param destUrl The absolute url or server relative url of the destination file path to move to.
     * @param shouldOverWrite Should a file with the same name in the same location be overwritten?
     * @param keepBoth Keep both if file with the same name in the same location already exists? Only relevant when shouldOverWrite is set to false.
     */
    public async moveByPath(destUrl: string, shouldOverWrite: boolean, KeepBoth = false): Promise<void> {

        const { ServerRelativeUrl: srcUrl, ["odata.id"]: absoluteUrl } = await this.select("ServerRelativeUrl")();
        const webBaseUrl = new URL(extractWebUrl(absoluteUrl));
        return spPost(File([this, webBaseUrl.toString()], `/_api/SP.MoveCopyUtil.MoveFileByPath(overwrite=@a1)?@a1=${shouldOverWrite}`),
            body({
                destPath: toResourcePath(isUrlAbsolute(destUrl) ? destUrl : `${webBaseUrl.protocol}//${webBaseUrl.host}${destUrl}`),
                options: {
                    KeepBoth,
                    ResetAuthorAndCreatedOnCopy: false,
                    ShouldBypassSharedLocks: true,
                },
                srcPath: toResourcePath(isUrlAbsolute(srcUrl) ? srcUrl : `${webBaseUrl.protocol}//${webBaseUrl.host}${srcUrl}`),
            }));
    }

    /**
     * Submits the file for content approval with the specified comment.
     *
     * @param comment The comment for the published file. Its length must be <= 1023.
     */
    public publish(comment = ""): Promise<void> {
        if (comment.length > 1023) {
            throw Error("The maximum comment length is 1023 characters.");
        }
        return spPost(File(this, `publish(comment='${escapeQueryStrValue(comment)}')`));
    }

    /**
     * Moves the file to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     *
     * @returns The GUID of the recycled file.
     */
    public recycle(): Promise<string> {
        return spPost(File(this, "recycle"));
    }

    /**
     * Deletes the file object with options.
     *
     * @param parameters Specifies the options to use when deleting a file.
     */
    public async deleteWithParams(parameters: Partial<IFileDeleteParams>): Promise<void> {
        return spPost(File(this, "DeleteWithParameters"), body({ parameters }));
    }

    /**
     * Reverts an existing checkout for the file.
     *
     */
    public undoCheckout(): Promise<void> {
        return spPost(File(this, "undoCheckout"));
    }

    /**
     * Removes the file from content approval or unpublish a major version.
     *
     * @param comment The comment for the unpublish operation. Its length must be <= 1023.
     */
    public unpublish(comment = ""): Promise<void> {
        if (comment.length > 1023) {
            throw Error("The maximum comment length is 1023 characters.");
        }
        return spPost(File(this, `unpublish(comment='${escapeQueryStrValue(comment)}')`));
    }

    /**
     * Checks to see if the file represented by this object exists
     *
     */
    public async exists(): Promise<boolean> {
        try {
            const r = await File(this).select("Exists")();
            return r.Exists;
        } catch (e) {
            // this treats any error here as the file not existing, which
            // might not be true, but is good enough.
            return false;
        }
    }

    /**
     * Gets the contents of the file as text. Not supported in batching.
     *
     */
    public getText(): Promise<string> {

        return File(this, "$value").using(TextParse())();
    }

    /**
     * Gets the contents of the file as a blob, does not work in Node.js. Not supported in batching.
     *
     */
    public getBlob(): Promise<Blob> {

        return File(this, "$value").using(BlobParse())();
    }

    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js. Not supported in batching.
     */
    public getBuffer(): Promise<ArrayBuffer> {

        return File(this, "$value").using(BufferParse())();
    }

    // (headers({ "binaryStringResponseBody": "true" })

    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js. Not supported in batching.
     */
    public getJSON(): Promise<any> {

        return File(this, "$value").using(JSONParse())();
    }

    /**
     * Sets the content of a file, for large files use setContentChunked. Not supported in batching.
     *
     * @param content The file content
     *
     */
    public async setContent(content: string | ArrayBuffer | Blob): Promise<IFile> {

        await spPost(File(this, "$value"), {
            body: content,
            headers: {
                "X-HTTP-Method": "PUT",
            },
        });
        return File(this);
    }

    /**
     * Gets the associated list item for this folder, loading the default properties
     */
    public async getItem<T>(...selects: string[]): Promise<IItem & T> {

        const q = this.listItemAllFields;
        const d = await q.select(...selects)();
        return Object.assign(Item([this, odataUrlFrom(d)]), d);
    }

    /**
     * Sets the contents of a file using a chunked upload approach. Not supported in batching.
     *
     * @param file The file to upload
     * @param progress A callback function which can be used to track the progress of the upload
     * @param chunkSize The size of each file slice, in bytes (default: 10485760)
     */
    public async setContentChunked(file: Blob, progress?: (data: IFileUploadProgressData) => void, chunkSize = 10485760): Promise<IFileAddResult> {

        if (!isFunc(progress)) {
            progress = () => null;
        }

        const fileSize = file?.size || (<any>file).length;
        const totalBlocks = parseInt((fileSize / chunkSize).toString(), 10) + ((fileSize % chunkSize === 0) ? 1 : 0);
        const uploadId = getGUID();

        // report that we are starting
        progress({ uploadId, blockNumber: 1, chunkSize, currentPointer: 0, fileSize, stage: "starting", totalBlocks });
        let currentPointer = await File(this).startUpload(uploadId, file.slice(0, chunkSize));

        // skip the first and last blocks
        for (let i = 2; i < totalBlocks; i++) {
            progress({ uploadId, blockNumber: i, chunkSize, currentPointer, fileSize, stage: "continue", totalBlocks });
            currentPointer = await File(this).continueUpload(uploadId, currentPointer, file.slice(currentPointer, currentPointer + chunkSize));
        }

        progress({ uploadId, blockNumber: totalBlocks, chunkSize, currentPointer, fileSize, stage: "finishing", totalBlocks });
        return File(this).finishUpload(uploadId, currentPointer, file.slice(currentPointer));
    }

    /**
     * Starts a new chunk upload session and uploads the first fragment.
     * The current file content is not changed when this method completes.
     * The method is idempotent (and therefore does not change the result) as long as you use the same values for uploadId and stream.
     * The upload session ends either when you use the CancelUpload method or when you successfully
     * complete the upload session by passing the rest of the file contents through the ContinueUpload and FinishUpload methods.
     * The StartUpload and ContinueUpload methods return the size of the running total of uploaded data in bytes,
     * so you can pass those return values to subsequent uses of ContinueUpload and FinishUpload.
     * This method is currently available only on Office 365.
     *
     * @param uploadId The unique identifier of the upload session.
     * @param fragment The file contents.
     * @returns The size of the total uploaded data in bytes.
     */
    protected async startUpload(uploadId: string, fragment: ArrayBuffer | Blob): Promise<number> {
        let n = await spPost(File(this, `startUpload(uploadId=guid'${uploadId}')`), { body: fragment });
        if (typeof n === "object") {
            // When OData=verbose the payload has the following shape:
            // { StartUpload: "10485760" }
            n = (n as any).StartUpload;
        }
        return parseFloat(n);
    }

    /**
     * Continues the chunk upload session with an additional fragment.
     * The current file content is not changed.
     * Use the uploadId value that was passed to the StartUpload method that started the upload session.
     * This method is currently available only on Office 365.
     *
     * @param uploadId The unique identifier of the upload session.
     * @param fileOffset The size of the offset into the file where the fragment starts.
     * @param fragment The file contents.
     * @returns The size of the total uploaded data in bytes.
     */
    protected async continueUpload(uploadId: string, fileOffset: number, fragment: ArrayBuffer | Blob): Promise<number> {
        let n = await spPost(File(this, `continueUpload(uploadId=guid'${uploadId}',fileOffset=${fileOffset})`), { body: fragment });
        if (typeof n === "object") {
            // When OData=verbose the payload has the following shape:
            // { ContinueUpload: "20971520" }
            n = (n as any).ContinueUpload;
        }
        return parseFloat(n);
    }

    /**
     * Uploads the last file fragment and commits the file. The current file content is changed when this method completes.
     * Use the uploadId value that was passed to the StartUpload method that started the upload session.
     * This method is currently available only on Office 365.
     *
     * @param uploadId The unique identifier of the upload session.
     * @param fileOffset The size of the offset into the file where the fragment starts.
     * @param fragment The file contents.
     * @returns The newly uploaded file.
     */
    protected async finishUpload(uploadId: string, fileOffset: number, fragment: ArrayBuffer | Blob): Promise<IFileAddResult> {
        const response: IFileInfo = await spPost(File(this, `finishUpload(uploadId=guid'${uploadId}',fileOffset=${fileOffset})`), { body: fragment });
        return {
            data: response,
            file: fileFromServerRelativePath(this, response.ServerRelativeUrl),
        };
    }
}

export interface IFile extends _File, IDeleteableWithETag { }
export const File = spInvokableFactory<IFile>(_File);

/**
 * Creates an IFile instance given a base object and a server relative path
 *
 * @param base Valid SPQueryable from which the observers will be used and the web url extracted
 * @param serverRelativePath The server relative url to the file (ex: '/sites/dev/documents/file.txt')
 * @returns IFile instance referencing the file described by the supplied parameters
 */
export function fileFromServerRelativePath(base: ISPQueryable, serverRelativePath: string): IFile {

    return File([base, extractWebUrl(base.toUrl())], `_api/web/getFileByServerRelativePath(decodedUrl='${escapeQueryStrValue(serverRelativePath)}')`);
}

/**
 * Describes a collection of Version objects
 *
 */
@defaultPath("versions")
export class _Versions extends _SPCollection {

    /**
     * Gets a version by id
     *
     * @param versionId The id of the version to retrieve
     */
    public getById(versionId: number): IVersion {
        return Version(this).concat(`(${versionId})`);
    }

    /**
     * Deletes all the file version objects in the collection.
     *
     */
    public deleteAll(): Promise<void> {
        return spPost(Versions(this, "deleteAll"));
    }

    /**
     * Deletes the specified version of the file.
     *
     * @param versionId The ID of the file version to delete.
     */
    public deleteById(versionId: number): Promise<void> {
        return spPost(Versions(this, `deleteById(vid=${versionId})`));
    }

    /**
     * Recycles the specified version of the file.
     *
     * @param versionId The ID of the file version to delete.
     */
    public recycleByID(versionId: number): Promise<void> {
        return spPost(Versions(this, `recycleByID(vid=${versionId})`));
    }

    /**
     * Deletes the file version object with the specified version label.
     *
     * @param label The version label of the file version to delete, for example: 1.2
     */
    public deleteByLabel(label: string): Promise<void> {
        return spPost(Versions(this, `deleteByLabel(versionlabel='${escapeQueryStrValue(label)}')`));
    }

    /**
     * Recycles the file version object with the specified version label.
     *
     * @param label The version label of the file version to delete, for example: 1.2
     */
    public recycleByLabel(label: string): Promise<void> {
        return spPost(Versions(this, `recycleByLabel(versionlabel='${escapeQueryStrValue(label)}')`));
    }

    /**
     * Creates a new file version from the file specified by the version label.
     *
     * @param label The version label of the file version to restore, for example: 1.2
     */
    public restoreByLabel(label: string): Promise<void> {
        return spPost(Versions(this, `restoreByLabel(versionlabel='${escapeQueryStrValue(label)}')`));
    }
}
export interface IVersions extends _Versions { }
export const Versions = spInvokableFactory<IVersions>(_Versions);

/**
 * Describes a single Version instance
 *
 */
export class _Version extends _SPInstance { }
export interface IVersion extends _Version, IDeleteableWithETag { }
export const Version = spInvokableFactory<IVersion>(_Version);

/**
 * Types for document check in.
 * Minor = 0
 * Major = 1
 * Overwrite = 2
 */
export enum CheckinType {
    Minor = 0,
    Major = 1,
    Overwrite = 2,
}
/**
 * Describes file and result
 */
export interface IFileAddResult {
    file: IFile;
    data: IFileInfo;
}

/**
 * File move opertions
 */
export enum MoveOperations {
    /**
     * Produce an error if a file with the same name exists in the destination
     */
    None = 0,
    /**
     * Overwrite a file with the same name if it exists. Value is 1.
     */
    Overwrite = 1,
    /**
     * Complete the move operation even if supporting files are separated from the file. Value is 8.
     */
    AllowBrokenThickets = 8,
    /**
     * Boolean specifying whether to retain the source of the move's editor and modified by datetime.
     */
    RetainEditorAndModifiedOnMove = 2048,
}

export enum TemplateFileType {
    StandardPage = 0,
    WikiPage = 1,
    FormPage = 2,
    ClientSidePage = 3,
}

/**
 * Describes SharePoint file upload progress data
 */
export interface IFileUploadProgressData {
    uploadId: string;
    stage: "starting" | "continue" | "finishing";
    blockNumber: number;
    totalBlocks: number;
    chunkSize: number;
    currentPointer: number;
    fileSize: number;
}

export interface IAddUsingPathProps {
    /**
     * Overwrite the file if it exists
     */
    Overwrite: boolean;
    /**
     * specifies whether to auto checkout on invalid Data. It'll be useful if the list contains validation whose requirements upload will not be able to meet.
     */
    AutoCheckoutOnInvalidData?: boolean;
    /**
     * Specifies a XOR hash of the file data which should be used to ensure end-2-end data integrity, base64 representation
     */
    XorHash?: string;
}

export interface IFileInfo {
    readonly "odata.id": string;
    CheckInComment: string;
    CheckOutType: number;
    ContentTag: string;
    CustomizedPageStatus: number;
    ETag: string;
    Exists: boolean;
    IrmEnabled: boolean;
    Length: string;
    Level: number;
    LinkingUri: string | null;
    LinkingUrl: string;
    ListId: string;
    MajorVersion: number;
    MinorVersion: number;
    Name: string;
    ServerRelativeUrl: string;
    SiteId: string;
    TimeCreated: string;
    TimeLastModified: string;
    Title: string | null;
    UIVersion: number;
    UIVersionLabel: string;
    UniqueId: string;
    WebId: string;
}

export interface IFileDeleteParams {
    /**
     * If true, delete or recyle a file when the LockType
     * value is SPLockType.Shared or SPLockType.None.
     * When false, delete or recycle the file when
     * the LockType value SPLockType.None.
     */
    BypassSharedLock: boolean;

    /**
     * Gets or sets a string value that allows SPfile delete and recycle methods
     * to target a file with a matching value. Use null to unconditionally delete the file.
     */
    ETagMatch: string;
}

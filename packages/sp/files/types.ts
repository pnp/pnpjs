import {
    _SharePointQueryableInstance,
    ISharePointQueryableInstance,
    _SharePointQueryableCollection,
    spInvokableFactory,
    SharePointQueryableInstance,
    IDeleteableWithETag,
    deleteableWithETag,
} from "../sharepointqueryable";
import { TextParser, BlobParser, JSONParser, BufferParser, headers, body } from "@pnp/odata";
import { assign, getGUID, isFunc, stringIsNullOrEmpty, isUrlAbsolute } from "@pnp/common";
import { Item, IItem } from "../items";
import { odataUrlFrom } from "../odata";
import { defaultPath } from "../decorators";
import { spPost } from "../operations";
import { escapeQueryStrValue } from "../utils/escapeQueryStrValue";
import { extractWebUrl } from "../utils/extractweburl";
import { tag } from "../telemetry";
import { toResourcePath } from "../utils/toResourcePath";

/**
 * Describes a collection of File objects
 *
 */
@defaultPath("files")
export class _Files extends _SharePointQueryableCollection<IFileInfo[]> {

    /**
     * Gets a File by filename
     *
     * @param name The name of the file, including extension.
     */
    public getByName(name: string): IFile {
        if (/\%#/.test(name)) {
            throw Error("For file names containing % or # please use web.getFileByServerRelativePath");
        }
        return tag.configure(File(this).concat(`('${escapeQueryStrValue(name)}')`), "fis.getByName");
    }

    /**
     * Uploads a file. Not supported for batching
     *
     * @param url The folder-relative url of the file.
     * @param content The file contents
     * @param shouldOverWrite Should a file with the same name in the same location be overwritten? (default: true)
     * @returns The new File and the raw response.
     */
    @tag("fis.add")
    public async add(url: string, content: any, shouldOverWrite = true): Promise<IFileAddResult> {
        const response = await spPost(Files(this, `add(overwrite=${shouldOverWrite},url='${escapeQueryStrValue(url)}')`), {
            body: content,
        });
        return {
            data: response,
            file: this.getByName(url),
        };
    }

    /**
     * Adds a file using the pound percent safe methods
     * 
     * @param url Excoded url of the file
     * @param content The file content
     * @param parameters Additional parameters to control method behavior
     */
    @tag("fis.addUsingPath")
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
            file: File(odataUrlFrom(resp)),
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
    @tag("fis.addChunked")
    public async addChunked(url: string, content: Blob, progress?: (data: IFileUploadProgressData) => void, shouldOverWrite = true, chunkSize = 10485760): Promise<IFileAddResult> {

        const info: { ServerRelativeUrl: string } = await spPost(this.clone(Files, `add(overwrite=${shouldOverWrite},url='${escapeQueryStrValue(url)}')`, false));
        const file = File(`_api/web/getFileByServerRelativeUrl('${info.ServerRelativeUrl}')`);
        return await file.setContentChunked(content, progress, chunkSize);
    }

    /**
     * Adds a ghosted file to an existing list or document library. Not supported for batching.
     *
     * @param fileUrl The server-relative url where you want to save the file.
     * @param templateFileType The type of use to create the file.
     * @returns The template file that was added and the raw response.
     */
    @tag("fis.addTemplateFile")
    public async addTemplateFile(fileUrl: string, templateFileType: TemplateFileType): Promise<IFileAddResult> {
        const response = await spPost(this.clone(Files, `addTemplateFile(urloffile='${escapeQueryStrValue(fileUrl)}',templatefiletype=${templateFileType})`, false));
        return {
            data: response,
            file: File(odataUrlFrom(response)),
        };
    }
}
export interface IFiles extends _Files { }
export const Files = spInvokableFactory<IFiles>(_Files);

/**
 * Describes a single File instance
 *
 */
export class _File extends _SharePointQueryableInstance<IFileInfo> {

    public delete = deleteableWithETag("fi");

    /**
     * Gets a value that specifies the list item field values for the list item corresponding to the file.
     *
     */
    public get listItemAllFields(): ISharePointQueryableInstance {
        return tag.configure(SharePointQueryableInstance(this, "listItemAllFields"), "fi.listItemAllFields");
    }

    /**
     * Gets a collection of versions
     *
     */
    public get versions(): IVersions {
        return tag.configure(Versions(this), "fi.versions");
    }

    /**
     * Approves the file submitted for content approval with the specified comment.
     * Only documents in lists that are enabled for content approval can be approved.
     *
     * @param comment The comment for the approval.
     */
    @tag("fi.approve")
    public approve(comment = ""): Promise<void> {
        return spPost(this.clone(File, `approve(comment='${escapeQueryStrValue(comment)}')`));
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
    @tag("fi.cancelUpload")
    public cancelUpload(uploadId: string): Promise<void> {
        return spPost(this.clone(File, `cancelUpload(uploadId=guid'${uploadId}')`, false));
    }

    /**
     * Checks the file in to a document library based on the check-in type.
     *
     * @param comment A comment for the check-in. Its length must be <= 1023.
     * @param checkinType The check-in type for the file.
     */
    @tag("fi.checkin")
    public checkin(comment = "", checkinType = CheckinType.Major): Promise<void> {

        if (comment.length > 1023) {
            throw Error("The maximum comment length is 1023 characters.");
        }

        return spPost(this.clone(File, `checkin(comment='${escapeQueryStrValue(comment)}',checkintype=${checkinType})`));
    }

    /**
     * Checks out the file from a document library.
     */
    @tag("fi.checkout")
    public checkout(): Promise<void> {
        return spPost(this.clone(File, "checkout"));
    }

    /**
     * Copies the file to the destination url.
     *
     * @param url The absolute url or server relative url of the destination file path to copy to.
     * @param shouldOverWrite Should a file with the same name in the same location be overwritten?
     */
    @tag("fi.copyTo")
    public copyTo(url: string, shouldOverWrite = true): Promise<void> {
        return spPost(this.clone(File, `copyTo(strnewurl='${escapeQueryStrValue(url)}',boverwrite=${shouldOverWrite})`));
    }

    /**
     * Copies the file by path to destination path.
     * Also works with different site collections.
     *
     * @param destUrl The absolute url or server relative url of the destination file path to copy to.
     * @param shouldOverWrite Should a file with the same name in the same location be overwritten?
     * @param keepBoth Keep both if file with the same name in the same location already exists? Only relevant when shouldOverWrite is set to false.
     */
    @tag("fi.copyByPath")
    public async copyByPath(destUrl: string, shouldOverWrite: boolean, KeepBoth = false): Promise<void> {

        const { ServerRelativeUrl: srcUrl, ["odata.id"]: absoluteUrl } = await this.select("ServerRelativeUrl")();
        const webBaseUrl = extractWebUrl(absoluteUrl);
        const hostUrl = webBaseUrl.replace("://", "___").split("/")[0].replace("___", "://");
        await spPost(File(webBaseUrl, `/_api/SP.MoveCopyUtil.CopyFileByPath(overwrite=@a1)?@a1=${shouldOverWrite}`),
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
                srcPath: toResourcePath(isUrlAbsolute(srcUrl) ? srcUrl : `${hostUrl}${srcUrl}`),
            }));
    }

    /**
     * Denies approval for a file that was submitted for content approval.
     * Only documents in lists that are enabled for content approval can be denied.
     *
     * @param comment The comment for the denial.
     */
    @tag("fi.deny")
    public deny(comment = ""): Promise<void> {
        if (comment.length > 1023) {
            throw Error("The maximum comment length is 1023 characters.");
        }
        return spPost(this.clone(File, `deny(comment='${escapeQueryStrValue(comment)}')`));
    }

    /**
     * Moves the file to the specified destination url.
     *
     * @param url The absolute url or server relative url of the destination file path to move to.
     * @param moveOperations The bitwise MoveOperations value for how to move the file.
     */
    @tag("fi.moveTo")
    public moveTo(url: string, moveOperations = MoveOperations.Overwrite): Promise<void> {
        return spPost(this.clone(File, `moveTo(newurl='${escapeQueryStrValue(url)}',flags=${moveOperations})`));
    }

    /**
     * Moves the file by path to the specified destination url.
     * Also works with different site collections.
     *
     * @param destUrl The absolute url or server relative url of the destination file path to move to.
     * @param shouldOverWrite Should a file with the same name in the same location be overwritten?
     * @param keepBoth Keep both if file with the same name in the same location already exists? Only relevant when shouldOverWrite is set to false.
     */
    @tag("fi.moveByPath")
    public async moveByPath(destUrl: string, shouldOverWrite: boolean, KeepBoth = false): Promise<void> {

        const { ServerRelativeUrl: srcUrl, ["odata.id"]: absoluteUrl } = await this.select("ServerRelativeUrl")();
        const webBaseUrl = extractWebUrl(absoluteUrl);
        const hostUrl = webBaseUrl.replace("://", "___").split("/")[0].replace("___", "://");
        await spPost(File(webBaseUrl, `/_api/SP.MoveCopyUtil.MoveFileByPath(overwrite=@a1)?@a1=${shouldOverWrite}`),
            body({
                destPath: toResourcePath(isUrlAbsolute(destUrl) ? destUrl : `${hostUrl}${destUrl}`),
                options: {
                    KeepBoth: KeepBoth,
                    ResetAuthorAndCreatedOnCopy: false,
                    ShouldBypassSharedLocks: true,
                    __metadata: {
                        type: "SP.MoveCopyOptions",
                    },
                },
                srcPath: toResourcePath(isUrlAbsolute(srcUrl) ? srcUrl : `${hostUrl}${srcUrl}`),
            }));
    }

    /**
     * Submits the file for content approval with the specified comment.
     *
     * @param comment The comment for the published file. Its length must be <= 1023.
     */
    @tag("fi.publish")
    public publish(comment = ""): Promise<void> {
        if (comment.length > 1023) {
            throw Error("The maximum comment length is 1023 characters.");
        }
        return spPost(this.clone(File, `publish(comment='${escapeQueryStrValue(comment)}')`));
    }

    /**
     * Moves the file to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     *
     * @returns The GUID of the recycled file.
     */
    @tag("fi.recycle")
    public recycle(): Promise<string> {
        return spPost(this.clone(File, "recycle"));
    }

    /**
     * Deletes the file object with options.
     * 
     * @param parameters Specifies the options to use when deleting a file.
     */
    @tag("fi.del-params")
    public async deleteWithParams(parameters: Partial<IFileDeleteParams>): Promise<void> {
        return spPost(this.clone(File, "DeleteWithParameters"), body({ parameters }));
    }

    /**
     * Reverts an existing checkout for the file.
     *
     */
    @tag("fi.undoCheckout")
    public undoCheckout(): Promise<void> {
        return spPost(this.clone(File, "undoCheckout"));
    }

    /**
     * Removes the file from content approval or unpublish a major version.
     *
     * @param comment The comment for the unpublish operation. Its length must be <= 1023.
     */
    @tag("fi.unpublish")
    public unpublish(comment = ""): Promise<void> {
        if (comment.length > 1023) {
            throw Error("The maximum comment length is 1023 characters.");
        }
        return spPost(this.clone(File, `unpublish(comment='${escapeQueryStrValue(comment)}')`));
    }

    /**
     * Checks to see if the file represented by this object exists
     *
     */
    @tag("fi.exists")
    public async exists(): Promise<boolean> {
        try {
            const r = await this.clone(File).select("Exists")();
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
    @tag("fi.getText")
    public getText(): Promise<string> {

        return this.clone(File, "$value", false).usingParser(new TextParser())(headers({ "binaryStringResponseBody": "true" }));
    }

    /**
     * Gets the contents of the file as a blob, does not work in Node.js. Not supported in batching.
     *
     */
    @tag("fi.getBlob")
    public getBlob(): Promise<Blob> {

        return this.clone(File, "$value", false).usingParser(new BlobParser())(headers({ "binaryStringResponseBody": "true" }));
    }

    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js. Not supported in batching.
     */
    @tag("fi.getBuffer")
    public getBuffer(): Promise<ArrayBuffer> {

        return this.clone(File, "$value", false).usingParser(new BufferParser())(headers({ "binaryStringResponseBody": "true" }));
    }

    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js. Not supported in batching.
     */
    @tag("fi.getJSON")
    public getJSON(): Promise<any> {

        return this.clone(File, "$value", false).usingParser(new JSONParser())(headers({ "binaryStringResponseBody": "true" }));
    }

    /**
     * Sets the content of a file, for large files use setContentChunked. Not supported in batching.
     *
     * @param content The file content
     *
     */
    @tag("fi.setContent")
    public async setContent(content: string | ArrayBuffer | Blob): Promise<IFile> {

        await spPost(this.clone(File, "$value", false), {
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
    @tag("fi.getItem")
    public async getItem<T>(...selects: string[]): Promise<IItem & T> {

        const q = this.listItemAllFields;
        const d = await q.select.apply(q, selects)();
        return assign(Item(odataUrlFrom(d)), d);
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

        const fileSize = file.size;
        const totalBlocks = parseInt((fileSize / chunkSize).toString(), 10) + ((fileSize % chunkSize === 0) ? 1 : 0);
        const uploadId = getGUID();

        // report that we are starting
        progress({ uploadId, blockNumber: 1, chunkSize, currentPointer: 0, fileSize, stage: "starting", totalBlocks });
        let currentPointer = await this.startUpload(uploadId, file.slice(0, chunkSize));

        // skip the first and last blocks
        for (let i = 2; i < totalBlocks; i++) {
            progress({ uploadId, blockNumber: i, chunkSize, currentPointer, fileSize, stage: "continue", totalBlocks });
            currentPointer = await this.continueUpload(uploadId, currentPointer, file.slice(currentPointer, currentPointer + chunkSize));
        }

        progress({ uploadId, blockNumber: totalBlocks, chunkSize, currentPointer, fileSize, stage: "finishing", totalBlocks });
        return this.finishUpload(uploadId, currentPointer, file.slice(currentPointer));
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
    @tag("fi.startUpload")
    protected async startUpload(uploadId: string, fragment: ArrayBuffer | Blob): Promise<number> {
        let n = await spPost(this.clone(File, `startUpload(uploadId=guid'${uploadId}')`, false), { body: fragment });
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
    @tag("fi.continueUpload")
    protected async continueUpload(uploadId: string, fileOffset: number, fragment: ArrayBuffer | Blob): Promise<number> {
        let n = await spPost(this.clone(File, `continueUpload(uploadId=guid'${uploadId}',fileOffset=${fileOffset})`, false), { body: fragment });
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
    @tag("fi.finishUpload")
    protected async finishUpload(uploadId: string, fileOffset: number, fragment: ArrayBuffer | Blob): Promise<IFileAddResult> {
        const response = await spPost(this.clone(File, `finishUpload(uploadId=guid'${uploadId}',fileOffset=${fileOffset})`, false), { body: fragment });
        return {
            data: response,
            file: File(odataUrlFrom(response)),
        };
    }
}

export interface IFile extends _File, IDeleteableWithETag { }
export const File = spInvokableFactory<IFile>(_File);

/**
 * Describes a collection of Version objects
 *
 */
@defaultPath("versions")
export class _Versions extends _SharePointQueryableCollection {

    /**	
     * Gets a version by id	
     *	
     * @param versionId The id of the version to retrieve	
     */
    public getById(versionId: number): IVersion {
        return tag.configure(Version(this).concat(`(${versionId})`), "vers.getById");
    }

    /**
     * Deletes all the file version objects in the collection.
     *
     */
    @tag("vers.deleteAll")
    public deleteAll(): Promise<void> {
        return spPost(Versions(this, "deleteAll"));
    }

    /**
     * Deletes the specified version of the file.
     *
     * @param versionId The ID of the file version to delete.
     */
    @tag("vers.deleteById")
    public deleteById(versionId: number): Promise<void> {
        return spPost(this.clone(Versions, `deleteById(vid=${versionId})`));
    }

    /**
     * Recycles the specified version of the file.
     *
     * @param versionId The ID of the file version to delete.
     */
    @tag("vers.recycleByID")
    public recycleByID(versionId: number): Promise<void> {
        return spPost(this.clone(Versions, `recycleByID(vid=${versionId})`));
    }

    /**
     * Deletes the file version object with the specified version label.
     *
     * @param label The version label of the file version to delete, for example: 1.2
     */
    @tag("vers.deleteByLabel")
    public deleteByLabel(label: string): Promise<void> {
        return spPost(this.clone(Versions, `deleteByLabel(versionlabel='${escapeQueryStrValue(label)}')`));
    }

    /**
     * Recycles the file version object with the specified version label.
     *
     * @param label The version label of the file version to delete, for example: 1.2
     */
    @tag("vers.recycleByLabel")
    public recycleByLabel(label: string): Promise<void> {
        return spPost(this.clone(Versions, `recycleByLabel(versionlabel='${escapeQueryStrValue(label)}')`));
    }

    /**
     * Creates a new file version from the file specified by the version label.
     *
     * @param label The version label of the file version to restore, for example: 1.2
     */
    @tag("vers.restoreByLabel")
    public restoreByLabel(label: string): Promise<void> {
        return spPost(this.clone(Versions, `restoreByLabel(versionlabel='${escapeQueryStrValue(label)}')`));
    }
}
export interface IVersions extends _Versions { }
export const Versions = spInvokableFactory<IVersions>(_Versions);

/**
 * Describes a single Version instance
 *
 */
export class _Version extends _SharePointQueryableInstance {
    public delete = deleteableWithETag("ver");
}
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
 * Overwrite = 1
 * AllowBrokenThickets = 8
 */
export enum MoveOperations {
    Overwrite = 1,
    AllowBrokenThickets = 8,
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

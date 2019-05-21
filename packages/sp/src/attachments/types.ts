import { defaultPath, deleteableWithETag, IDeleteableWithETag } from "../decorators";
import { spPost } from "../operations";
import {
    _SharePointQueryableInstance,
    ISharePointQueryableCollection,
    ISharePointQueryableInstance,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { TextParser, BlobParser, JSONParser, BufferParser, ODataParser, IInvokable, headers } from "@pnp/odata";

export interface AttachmentFileInfo {
    name: string;
    content: string | Blob | ArrayBuffer;
}

/**
 * Describes a collection of Attachment objects
 *
 */
@defaultPath("AttachmentFiles")
export class _Attachments extends _SharePointQueryableCollection implements IAttachments {

    /**
     * Gets a Attachment File by filename
     *
     * @param name The name of the file, including extension.
     */
    public getByName(name: string): IAttachment {
        const f = Attachment(this);
        f.concat(`('${name}')`);
        return f;
    }

    /**
     * Adds a new attachment to the collection. Not supported for batching.
     *
     * @param name The name of the file, including extension.
     * @param content The Base64 file content.
     */
    public async add(name: string, content: string | Blob | ArrayBuffer): Promise<AttachmentAddResult> {
        const response = await spPost(this.clone(Attachments, `add(FileName='${name}')`, false), { body: content });
        return {
            data: response,
            file: this.getByName(name),
        };
    }

    /**
     * Adds multiple new attachment to the collection. Not supported for batching.
     *
     * @param files The collection of files to add
     */
    public addMultiple(files: AttachmentFileInfo[]): Promise<void> {

        // add the files in series so we don't get update conflicts
        return files.reduce((chain, file) => chain.then(() => spPost(this.clone(Attachments, `add(FileName='${file.name}')`, false), {
            body: file.content,
        })), Promise.resolve());
    }

    /**
     * Delete multiple attachments from the collection. Not supported for batching.
     *
     * @param files The collection of files to delete
     */
    public deleteMultiple(...files: string[]): Promise<void> {
        return files.reduce((chain, file) => chain.then(() => this.getByName(file).delete()), Promise.resolve());
    }

    /**
     * Delete multiple attachments from the collection and send to recycle bin. Not supported for batching.
     *
     * @param files The collection of files to be deleted and sent to recycle bin
     */
    public recycleMultiple(...files: string[]): Promise<void> {
        return files.reduce((chain, file) => chain.then(() => this.getByName(file).recycle()), Promise.resolve());
    }
}

export interface IAttachments extends IInvokable, ISharePointQueryableCollection {
    getByName(name: string): IAttachment;
    add(name: string, content: string | Blob | ArrayBuffer): Promise<AttachmentAddResult>;
    addMultiple(files: AttachmentFileInfo[]): Promise<void>;
    deleteMultiple(...files: string[]): Promise<void>;
    recycleMultiple(...files: string[]): Promise<void>;
}
export interface _Attachments extends IInvokable { }
export const Attachments = spInvokableFactory<IAttachments>(_Attachments);

/**
 * Describes a single attachment file instance
 *
 */
@deleteableWithETag()
export class _Attachment extends _SharePointQueryableInstance implements IAttachment {

    /**
     * Gets the contents of the file as text
     *
     */
    public getText(): Promise<string> {
        return this.getParsed(new TextParser());
    }

    /**
     * Gets the contents of the file as a blob, does not work in Node.js
     *
     */
    public getBlob(): Promise<Blob> {
        return this.getParsed(new BlobParser());
    }

    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js
     */
    public getBuffer(): Promise<ArrayBuffer> {
        return this.getParsed(new BufferParser());
    }

    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js
     */
    public getJSON(): Promise<any> {
        return this.getParsed(new JSONParser());
    }

    /**
     * Sets the content of a file. Not supported for batching
     *
     * @param content The value to set for the file contents
     */
    public async setContent(content: string | ArrayBuffer | Blob): Promise<IAttachment> {

        await spPost(this.clone(Attachment, "$value", false), headers({ "X-HTTP-Method": "PUT" }, {
            body: content,
        }));
        return Attachment(this);
    }

    /**
     * Delete this attachment file and send it to recycle bin
     *
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    public recycle(eTag = "*"): Promise<void> {
        return spPost(this.clone(Attachment, "recycleObject"), headers({
            "IF-Match": eTag,
            "X-HTTP-Method": "DELETE",
        }));
    }

    private getParsed<T>(parser: ODataParser<T>): Promise<T> {
        return this.clone(Attachment, "$value", false).usingParser(parser)();
    }
}

export interface IAttachment extends IInvokable, ISharePointQueryableInstance, IDeleteableWithETag {
    getText(): Promise<string>;
    getBlob(): Promise<Blob>;
    getBuffer(): Promise<ArrayBuffer>;
    getJSON(): Promise<any>;
    setContent(content: string | ArrayBuffer | Blob): Promise<IAttachment>;
    recycle(eTag?: string): Promise<void>;
}
export interface _Attachment extends IInvokable, IDeleteableWithETag { }
export const Attachment = spInvokableFactory<IAttachment>(_Attachment);

export interface AttachmentAddResult {
    file: IAttachment;
    data: any;
}

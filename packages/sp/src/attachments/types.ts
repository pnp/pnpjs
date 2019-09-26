import { defaultPath, deleteableWithETag, IDeleteableWithETag, clientTagMethod } from "../decorators";
import { spPost } from "../operations";
import {
    _SharePointQueryableInstance,
    ISharePointQueryableCollection,
    ISharePointQueryableInstance,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { TextParser, BlobParser, JSONParser, BufferParser, ODataParser, IInvokable, headers } from "@pnp/odata";

@defaultPath("AttachmentFiles")
export class _Attachments extends _SharePointQueryableCollection<IAttachmentInfo[]> {

    public getByName(name: string): IAttachment {
        const f = clientTagMethod.configure(Attachment(this), "ats.getByName");
        f.concat(`('${name}')`);
        return f;
    }

    @clientTagMethod("ats.add")
    public async add(name: string, content: string | Blob | ArrayBuffer): Promise<IAttachmentAddResult> {
        const response = await spPost(this.clone(Attachments, `add(FileName='${name}')`, false), { body: content });
        return {
            data: response,
            file: this.getByName(name),
        };
    }

    @clientTagMethod("ats.addMultiple")
    public async addMultiple(files: IAttachmentFileInfo[]): Promise<void> {

        for (let i = 0; i < files.length; i++) {
            await this.add(files[i].name, files[i].content);
        }
    }

    @clientTagMethod("ats.deleteMultiple")
    public async deleteMultiple(...files: string[]): Promise<void> {

        for (let i = 0; i < files.length; i++) {
            await this.getByName(files[i]).delete();
        }
    }

    @clientTagMethod("ats.recycleMultiple")
    public async recycleMultiple(...files: string[]): Promise<void> {
        for (let i = 0; i < files.length; i++) {
            await this.getByName(files[i]).recycle();
        }
    }
}

/**
 * Describes a collection of Attachment objects
 *
 */
export interface _IAttachments extends IInvokable<IAttachmentInfo[]>, ISharePointQueryableCollection<IAttachmentInfo[]> {
    /**
     * Gets a Attachment File by filename
     *
     * @param name The name of the file, including extension.
     */
    getByName(name: string): IAttachment;
    /**
     * Adds a new attachment to the collection. Not supported for batching.
     *
     * @param name The name of the file, including extension.
     * @param content The Base64 file content.
     */
    add(name: string, content: string | Blob | ArrayBuffer): Promise<IAttachmentAddResult>;
    /**
     * Adds multiple new attachment to the collection. Not supported for batching.
     *
     * @param files The collection of files to add
     */
    addMultiple(files: IAttachmentFileInfo[]): Promise<void>;
    /**
     * Delete multiple attachments from the collection. Not supported for batching.
     *
     * @param files The collection of files to delete
     */
    deleteMultiple(...files: string[]): Promise<void>;
    /**
     * Delete multiple attachments from the collection and send to recycle bin. Not supported for batching.
     *
     * @param files The collection of files to be deleted and sent to recycle bin
     */
    recycleMultiple(...files: string[]): Promise<void>;
}

export interface IAttachments extends _IAttachments, IInvokable<IAttachmentInfo[]>, ISharePointQueryableCollection<IAttachmentInfo[]> { }
export const Attachments = spInvokableFactory<IAttachments>(_Attachments);

@deleteableWithETag("at")
export class _Attachment extends _SharePointQueryableInstance<IAttachmentInfo> implements _IAttachment {

    @clientTagMethod("at.getText")
    public getText(): Promise<string> {

        return this.getParsed(new TextParser());
    }

    @clientTagMethod("at.getBlob")
    public getBlob(): Promise<Blob> {

        return this.getParsed(new BlobParser());
    }

    @clientTagMethod("at.getBuffer")
    public getBuffer(): Promise<ArrayBuffer> {

        return this.getParsed(new BufferParser());
    }

    @clientTagMethod("at.getJSON")
    public getJSON(): Promise<any> {

        return this.getParsed(new JSONParser());
    }

    @clientTagMethod("at.setContent")
    public async setContent(content: string | ArrayBuffer | Blob): Promise<IAttachment> {

        await spPost(this.clone(Attachment, "$value", false), headers({ "X-HTTP-Method": "PUT" }, {
            body: content,
        }));

        return Attachment(this);
    }

    @clientTagMethod("at.recycle")
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

/**
 * Describes a single attachment file instance
 *
 */
export interface _IAttachment {
    /**
     * Gets the contents of the file as text
     *
     */
    getText(): Promise<string>;
    /**
     * Gets the contents of the file as a blob, does not work in Node.js
     *
     */
    getBlob(): Promise<Blob>;
    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js
     */
    getBuffer(): Promise<ArrayBuffer>;
    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js
     */
    getJSON(): Promise<any>;
    /**
     * Sets the content of a file. Not supported for batching
     *
     * @param content The value to set for the file contents
     */
    setContent(content: string | ArrayBuffer | Blob): Promise<IAttachment>;
    /**
     * Delete this attachment file and send it to recycle bin
     *
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    recycle(eTag?: string): Promise<void>;
}

export interface IAttachment extends _IAttachment, IInvokable<IAttachmentInfo>, ISharePointQueryableInstance<IAttachmentInfo>, IDeleteableWithETag { }
export const Attachment = spInvokableFactory<IAttachment>(_Attachment);

export interface IAttachmentAddResult {
    file: IAttachment;
    data: any;
}

export interface IAttachmentFileInfo {
    name: string;
    content: string | Blob | ArrayBuffer;
}

export interface IAttachmentInfo {
    FileName: string;
    FileNameAsPath: {
        DecodedUrl: string;
    };
    ServerRelativePath: {
        DecodedUrl: string;
    };
    ServerRelativeUrl: string;
}

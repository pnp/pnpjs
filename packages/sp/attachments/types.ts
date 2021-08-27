import { TimelinePipe } from "@pnp/core";
import { headers, BlobParse, TextParse, JSONParse, BufferParse } from "@pnp/queryable";
import { defaultPath } from "../decorators.js";
import { spPost } from "../operations.js";
import {
    IDeleteableWithETag,
    _SPCollection,
    spInvokableFactory,
    _SPInstance,
    deleteableWithETag,
} from "../sharepointqueryable.js";

@defaultPath("AttachmentFiles")
export class _Attachments extends _SPCollection<IAttachmentInfo[]> {

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
    public async add(name: string, content: string | Blob | ArrayBuffer): Promise<IAttachmentAddResult> {
        const response = await spPost(Attachments(this, `add(FileName='${name}')`), { body: content });
        return {
            data: response,
            file: this.getByName(name),
        };
    }
}
export interface IAttachments extends _Attachments { }
export const Attachments = spInvokableFactory<IAttachments>(_Attachments);

export class _Attachment extends _SPInstance<IAttachmentInfo> {

    public delete = deleteableWithETag();

    /**
     * Gets the contents of the file as text
     *
     */
    public getText(): Promise<string> {

        return this.getParsed(TextParse());
    }

    /**
     * Gets the contents of the file as a blob, does not work in Node.js
     *
     */
    public getBlob(): Promise<Blob> {

        return this.getParsed(BlobParse());
    }

    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js
     */
    public getBuffer(): Promise<ArrayBuffer> {

        return this.getParsed(BufferParse());
    }

    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js
     */
    public getJSON(): Promise<any> {

        return this.getParsed(JSONParse());
    }

    /**
     * Sets the content of a file. Not supported for batching
     *
     * @param content The value to set for the file contents
     */
    public async setContent(content: string | ArrayBuffer | Blob): Promise<IAttachment> {

        await spPost(Attachment(this, "$value"), headers({ "X-HTTP-Method": "PUT" }, {
            body: content,
        }));

        return this;
    }

    /**
     * Delete this attachment file and send it to recycle bin
     *
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    public recycle(eTag = "*"): Promise<void> {

        return spPost(Attachment(this, "recycleObject"), headers({
            "IF-Match": eTag,
            "X-HTTP-Method": "DELETE",
        }));
    }

    private getParsed<T>(parser: TimelinePipe): Promise<T> {
        return Attachment(this, "$value").using(parser)();
    }
}
export interface IAttachment extends _Attachment, IDeleteableWithETag { }
export const Attachment = spInvokableFactory<IAttachment>(_Attachment);

export interface IAttachmentAddResult {
    file: IAttachment;
    data: IAttachmentFileInfo;
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

import { headers } from "@pnp/queryable";
import { defaultPath } from "../decorators.js";
import { ReadableFile } from "../files/readable-file.js";
import { spPost } from "../operations.js";
import { encodePath } from "../utils/encode-path-str.js";
import {
    IDeleteableWithETag,
    _SPCollection,
    spInvokableFactory,
    deleteableWithETag,
} from "../spqueryable.js";

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
        const response = await spPost(Attachments(this, `add(FileName='${encodePath(name)}')`), { body: content });
        return {
            data: response,
            file: this.getByName(name),
        };
    }
}
export interface IAttachments extends _Attachments { }
export const Attachments = spInvokableFactory<IAttachments>(_Attachments);

export class _Attachment extends ReadableFile<IAttachmentInfo> {

    public delete = deleteableWithETag();

    /**
     * Sets the content of a file. Not supported for batching
     *
     * @param content The value to set for the file contents
     */
    public async setContent(body: string | ArrayBuffer | Blob): Promise<IAttachment> {

        await spPost(Attachment(this, "$value"), headers({ "X-HTTP-Method": "PUT" }, { body }));

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

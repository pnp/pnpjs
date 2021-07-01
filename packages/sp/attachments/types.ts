import { defaultPath } from "../decorators.js";
import { OLD_spPost } from "../operations.js";
import {
    _OLD_SharePointQueryableInstance,
    _OLD_SharePointQueryableCollection,
    OLD_spInvokableFactory,
    OLD_deleteableWithETag,
    OLD_IDeleteableWithETag,
} from "../sharepointqueryable.js";
import { TextParser, BlobParser, JSONParser, BufferParser, ODataParser, headers } from "@pnp/queryable";
import { tag } from "../telemetry.js";

@defaultPath("AttachmentFiles")
export class _Attachments extends _OLD_SharePointQueryableCollection<IAttachmentInfo[]> {

    /**
    * Gets a Attachment File by filename
    *
    * @param name The name of the file, including extension.
    */
    public getByName(name: string): IAttachment {
        const f = tag.configure(Attachment(this), "ats.getByName");
        f.concat(`('${name}')`);
        return f;
    }

    /**
     * Adds a new attachment to the collection. Not supported for batching.
     *
     * @param name The name of the file, including extension.
     * @param content The Base64 file content.
     */
    @tag("ats.add")
    public async add(name: string, content: string | Blob | ArrayBuffer): Promise<IAttachmentAddResult> {
        const response = await OLD_spPost(this.clone(Attachments, `add(FileName='${name}')`, false), { body: content });
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
    @tag("ats.addMultiple")
    public async addMultiple(files: IAttachmentFileInfo[]): Promise<void> {

        for (let i = 0; i < files.length; i++) {
            await this.add(files[i].name, files[i].content);
        }
    }

    /**
     * Delete multiple attachments from the collection. Not supported for batching.
     *
     * @param files The collection of files to delete
     */
    @tag("ats.deleteMultiple")
    public async deleteMultiple(...files: string[]): Promise<void> {

        for (let i = 0; i < files.length; i++) {
            await this.getByName(files[i]).delete();
        }
    }

    /**
     * Delete multiple attachments from the collection and send to recycle bin. Not supported for batching.
     *
     * @param files The collection of files to be deleted and sent to recycle bin
     */
    @tag("ats.recycleMultiple")
    public async recycleMultiple(...files: string[]): Promise<void> {
        for (let i = 0; i < files.length; i++) {
            await this.getByName(files[i]).recycle();
        }
    }
}
export interface IAttachments extends _Attachments {}
export const Attachments = OLD_spInvokableFactory<IAttachments>(_Attachments);

export class _Attachment extends _OLD_SharePointQueryableInstance<IAttachmentInfo> {

    public delete = OLD_deleteableWithETag("at");

    /**
     * Gets the contents of the file as text
     *
     */
    @tag("at.getText")
    public getText(): Promise<string> {

        return this.getParsed(new TextParser());
    }

    /**
     * Gets the contents of the file as a blob, does not work in Node.js
     *
     */
    @tag("at.getBlob")
    public getBlob(): Promise<Blob> {

        return this.getParsed(new BlobParser());
    }

    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js
     */
    @tag("at.getBuffer")
    public getBuffer(): Promise<ArrayBuffer> {

        return this.getParsed(new BufferParser());
    }

    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js
     */
    @tag("at.getJSON")
    public getJSON(): Promise<any> {

        return this.getParsed(new JSONParser());
    }

    /**
     * Sets the content of a file. Not supported for batching
     *
     * @param content The value to set for the file contents
     */
    @tag("at.setContent")
    public async setContent(content: string | ArrayBuffer | Blob): Promise<IAttachment> {

        await OLD_spPost(this.clone(Attachment, "$value", false), headers({ "X-HTTP-Method": "PUT" }, {
            body: content,
        }));

        return Attachment(this);
    }

    /**
     * Delete this attachment file and send it to recycle bin
     *
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    @tag("at.recycle")
    public recycle(eTag = "*"): Promise<void> {

        return OLD_spPost(this.clone(Attachment, "recycleObject"), headers({
            "IF-Match": eTag,
            "X-HTTP-Method": "DELETE",
        }));
    }

    private getParsed<T>(parser: ODataParser<T>): Promise<T> {

        return this.clone(Attachment, "$value", false).usingParser(parser)();
    }
}
export interface IAttachment extends _Attachment, OLD_IDeleteableWithETag { }
export const Attachment = OLD_spInvokableFactory<IAttachment>(_Attachment);

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

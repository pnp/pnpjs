import { SharePointQueryableInstance, SharePointQueryableCollection, defaultPath } from "./sharepointqueryable";
import { TextParser, BlobParser, JSONParser, BufferParser, ODataParser } from "@pnp/odata";

export interface AttachmentFileInfo {
    name: string;
    content: string | Blob | ArrayBuffer;
}

/**
 * Describes a collection of Item objects
 *
 */
@defaultPath("AttachmentFiles")
export class AttachmentFiles extends SharePointQueryableCollection {

    /**
     * Gets a Attachment File by filename
     *
     * @param name The name of the file, including extension.
     */
    public getByName(name: string): AttachmentFile {
        const f = new AttachmentFile(this);
        f.concat(`('${name}')`);
        return f;
    }

    /**
     * Adds a new attachment to the collection. Not supported for batching.
     *
     * @param name The name of the file, including extension.
     * @param content The Base64 file content.
     */
    public add(name: string, content: string | Blob | ArrayBuffer): Promise<AttachmentFileAddResult> {
        return this.clone(AttachmentFiles, `add(FileName='${name}')`, false).postCore({
            body: content,
        }).then((response) => {
            return {
                data: response,
                file: this.getByName(name),
            };
        });
    }

    /**
     * Adds multiple new attachment to the collection. Not supported for batching.
     *
     * @param files The collection of files to add
     */
    public addMultiple(files: AttachmentFileInfo[]): Promise<void> {

        // add the files in series so we don't get update conflicts
        return files.reduce((chain, file) => chain.then(() => this.clone(AttachmentFiles, `add(FileName='${file.name}')`, false).postCore({
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

/**
 * Describes a single attachment file instance
 *
 */
export class AttachmentFile extends SharePointQueryableInstance {

    public delete = this._deleteWithETag;

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
    public setContent(content: string | ArrayBuffer | Blob): Promise<AttachmentFile> {

        return this.clone(AttachmentFile, "$value", false).postCore({
            body: content,
            headers: {
                "X-HTTP-Method": "PUT",
            },
        }).then(_ => new AttachmentFile(this));
    }

    /**
     * Delete this attachment file and send it to recycle bin
     *
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    public recycle(eTag = "*"): Promise<void> {
        return this.clone(AttachmentFile, "recycleObject").postCore({
            headers: {
                "IF-Match": eTag,
                "X-HTTP-Method": "DELETE",
            },
        });
    }

    // /**
    //  * Delete this attachment file
    //  *
    //  * @param eTag Value used in the IF-Match header, by default "*"
    //  */
    // public delete(eTag = "*"): Promise<void> {
    //     return this.postCore({
    //         headers: {
    //             "IF-Match": eTag,
    //             "X-HTTP-Method": "DELETE",
    //         },
    //     });
    // }

    private getParsed<T>(parser: ODataParser<T>): Promise<T> {
        return this.clone(AttachmentFile, "$value", false).get(parser);
    }
}

export interface AttachmentFileAddResult {
    file: AttachmentFile;
    data: any;
}

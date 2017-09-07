import { SharePointQueryable, SharePointQueryableInstance, SharePointQueryableCollection } from "./sharepointqueryable";
import { TextFileParser, BlobFileParser, JSONFileParser, BufferFileParser } from "../odata/parsers";

export interface AttachmentFileInfo {
    name: string;
    content: string | Blob | ArrayBuffer;
}

/**
 * Describes a collection of Item objects
 *
 */
export class AttachmentFiles extends SharePointQueryableCollection {

    /**
     * Creates a new instance of the AttachmentFiles class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this attachments collection
     */
    constructor(baseUrl: string | SharePointQueryable, path = "AttachmentFiles") {
        super(baseUrl, path);
    }

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
     * Adds mjultiple new attachment to the collection. Not supported for batching.
     *
     * @files name The collection of files to add
     */
    public addMultiple(files: AttachmentFileInfo[]): Promise<void> {

        // add the files in series so we don't get update conflicts
        return files.reduce((chain, file) => chain.then(() => this.clone(AttachmentFiles, `add(FileName='${file.name}')`, false).postCore({
            body: file.content,
        })), Promise.resolve());
    }
}

/**
 * Describes a single attachment file instance
 *
 */
export class AttachmentFile extends SharePointQueryableInstance {

    /**
     * Gets the contents of the file as text
     *
     */
    public getText(): Promise<string> {

        return this.clone(AttachmentFile, "$value", false).get(new TextFileParser());
    }

    /**
     * Gets the contents of the file as a blob, does not work in Node.js
     *
     */
    public getBlob(): Promise<Blob> {

        return this.clone(AttachmentFile, "$value", false).get(new BlobFileParser());
    }

    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js
     */
    public getBuffer(): Promise<ArrayBuffer> {

        return this.clone(AttachmentFile, "$value", false).get(new BufferFileParser());
    }

    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js
     */
    public getJSON(): Promise<any> {

        return this.clone(AttachmentFile, "$value", false).get(new JSONFileParser());
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
     * Delete this attachment file
     *
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    public delete(eTag = "*"): Promise<void> {
        return this.postCore({
            headers: {
                "IF-Match": eTag,
                "X-HTTP-Method": "DELETE",
            },
        });
    }
}

export interface AttachmentFileAddResult {
    file: AttachmentFile;
    data: any;
}

import { GraphQueryable, GraphQueryableInstance } from "./graphqueryable";
import { BlobFileParser, BufferFileParser } from "@pnp/odata";

export class Photo extends GraphQueryableInstance {

    constructor(baseUrl: string | GraphQueryable, path = "photo") {
        super(baseUrl, path);
    }

    /**
     * Gets the image bytes as a blob (browser)
     */
    public getBlob(): Promise<Blob> {
        return this.clone(Photo, "$value", false).get(new BlobFileParser());
    }

    /**
     * Gets the image file byets as a Buffer (node.js)
     */
    public getBuffer(): Promise<Blob> {
        return this.clone(Photo, "$value", false).get(new BufferFileParser());
    }

    /**
     * Sets the file bytes
     * 
     * @param content Image file contents, max 4 MB
     */
    public setContent(content: ArrayBuffer | Blob): Promise<void> {

        return this.clone(Photo, "$value", false).patchCore({
            body: content,
        });
    }
}

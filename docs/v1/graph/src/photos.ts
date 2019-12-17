import { GraphQueryableInstance, defaultPath } from "./graphqueryable";
import { BlobParser, BufferParser } from "@pnp/odata";
import { Photo as IPhoto } from "@microsoft/microsoft-graph-types";

@defaultPath("photo")
export class Photo extends GraphQueryableInstance<IPhoto> {

    /**
     * Gets the image bytes as a blob (browser)
     */
    public getBlob(): Promise<Blob> {
        return this.clone(Photo, "$value", false).get(new BlobParser());
    }

    /**
     * Gets the image file byets as a Buffer (node.js)
     */
    public getBuffer(): Promise<ArrayBuffer> {
        return this.clone(Photo, "$value", false).get(new BufferParser());
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

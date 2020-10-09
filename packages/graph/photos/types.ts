import { _GraphQueryableInstance, graphInvokableFactory } from "../graphqueryable";
import { BlobParser, BufferParser } from "@pnp/odata";
import { Photo as IPhotoType } from "@microsoft/microsoft-graph-types";
import { defaultPath } from "../decorators";
import { graphPatch } from "../operations";

@defaultPath("photo")
export class _Photo extends _GraphQueryableInstance<IPhotoType> {
    /**
     * Gets the image bytes as a blob (browser)
     */
    public getBlob(): Promise<Blob> {
        return this.clone(Photo, "$value", false).usingParser(new BlobParser())<Blob>();
    }

    /**
     * Gets the image file bytes as a Buffer (node.js)
     */
    public getBuffer(): Promise<ArrayBuffer> {
        return this.clone(Photo, "$value", false).usingParser(new BufferParser())<ArrayBuffer>();
    }

    /**
     * Sets the file bytes
     * 
     * @param content Image file contents, max 4 MB
     */
    public setContent(content: ArrayBuffer | Blob): Promise<void> {
        return graphPatch(this.clone(Photo, "$value", false), { body: content });
    }
}
export interface IPhoto extends _Photo { }
export const Photo = graphInvokableFactory<IPhoto>(_Photo);

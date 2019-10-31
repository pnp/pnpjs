import { _GraphQueryableInstance, IGraphQueryableInstance, graphInvokableFactory } from "../graphqueryable";
import { BlobParser, BufferParser, IInvokable } from "@pnp/odata";
import { Photo as IPhotoType } from "@microsoft/microsoft-graph-types";
import { defaultPath } from "../decorators";
import { graphPatch } from "../operations";

@defaultPath("photo")
export class _Photo extends _GraphQueryableInstance<IPhotoType> implements _IPhoto {
    /**
     * Gets the image bytes as a blob (browser)
     */
    public getBlob(): Promise<Blob> {
        return this.clone(Photo, "$value", false).usingParser(new BlobParser())<Blob>();
    }

    /**
     * Gets the image file byets as a Buffer (node.js)
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
export interface _IPhoto {
    getBlob(): Promise<Blob>;
    getBuffer(): Promise<ArrayBuffer>;
    setContent(content: ArrayBuffer | Blob): Promise<void>;
}
export interface IPhoto extends _IPhoto, IInvokable, IGraphQueryableInstance<IPhotoType> { }
export const Photo = graphInvokableFactory<IPhoto>(_Photo);

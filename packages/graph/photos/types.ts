import { _GraphQueryableInstance, graphInvokableFactory } from "../graphqueryable.js";
import { BlobParse, BufferParse } from "@pnp/queryable";
import { Photo as IPhotoType } from "@microsoft/microsoft-graph-types";
import { defaultPath } from "../decorators.js";
import { graphPatch } from "../operations.js";

@defaultPath("photo")
export class _Photo extends _GraphQueryableInstance<IPhotoType> {
    /**
     * Gets the image bytes as a blob (browser)
     */
    public getBlob(): Promise<Blob> {
        return Photo(this, "$value").using(BlobParse())<Blob>();
    }

    /**
     * Gets the image file bytes as a Buffer (node.js)
     */
    public getBuffer(): Promise<ArrayBuffer> {
        return Photo(this, "$value").using(BufferParse())<ArrayBuffer>();
    }

    /**
     * Sets the file bytes
     *
     * @param content Image file contents, max 4 MB
     */
    public setContent(content: ArrayBuffer | Blob): Promise<void> {
        return graphPatch(Photo(this, "$value"), { body: content });
    }
}
export interface IPhoto extends _Photo { }
export const Photo = graphInvokableFactory<IPhoto>(_Photo);

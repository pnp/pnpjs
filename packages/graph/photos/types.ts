import { _GraphCollection, _GraphInstance, graphInvokableFactory, graphPatch } from "../graphqueryable.js";
import { BlobParse, BufferParse } from "@pnp/queryable";
import { ProfilePhoto as IProfilePhotoType } from "@microsoft/microsoft-graph-types";
import { defaultPath } from "../decorators.js";

@defaultPath("photo")
export class _Photo extends _GraphInstance<IProfilePhotoType> {
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

@defaultPath("photos")
export class _Photos extends _GraphCollection<IProfilePhotoType[]> {
    /**
     * Gets the image reference by size. 48x48, 64x64, 96x96, 120x120, 240x240, 360x360, 432x432, 504x504, and 648x648.
     */
    public getBySize(size: string): IPhoto {
        return Photo(this, `/${size}`);
    }
}
export interface IPhotos extends _Photos { }
export const Photos = graphInvokableFactory<IPhotos>(_Photos);

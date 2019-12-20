import { Attachment as IAttachmentType } from "@microsoft/microsoft-graph-types";
import { body } from "@pnp/odata";
import { _GraphQueryableCollection, _GraphQueryableInstance, graphInvokableFactory } from "../graphqueryable";
import { graphPost } from "../operations";
import { defaultPath, getById, IGetById } from "../decorators";
import { type } from "../utils/type";

/**
 * Attachment
 */
export class _Attachment extends _GraphQueryableInstance<IAttachmentType> { }
export interface IAttachment extends _Attachment { }
export const Attachment = graphInvokableFactory<IAttachment>(_Attachment);

/**
 * Attachments
 */
@defaultPath("attachments")
@getById(Attachment)
export class _Attachments extends _GraphQueryableCollection<IAttachmentType[]> {

    /**
     * Add attachment to this collection
     * 
     * @param name Name given to the attachment file
     * @param bytes File content
     */
    public addFile(name: string, bytes: string | Blob): Promise<IAttachmentType> {

        return graphPost(this, body(type("#microsoft.graph.fileAttachment", {
            contentBytes: bytes,
            name,
        })));
    }
}
export interface IAttachments extends _Attachments, IGetById<IAttachment> {}
export const Attachments = graphInvokableFactory<IAttachments>(_Attachments);

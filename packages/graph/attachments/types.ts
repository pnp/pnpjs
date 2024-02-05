import { Attachment as IAttachmentType } from "@microsoft/microsoft-graph-types";
import { body } from "@pnp/queryable";
import { GraphInstance, _GraphCollection, _GraphInstance, graphInvokableFactory, graphPost } from "../graphqueryable.js";
import { defaultPath, deleteable, getById, IDeleteable, IGetById } from "../decorators.js";
import { type } from "../utils/type.js";

/**
 * Attachment
 */
@deleteable()
export class _Attachment extends _GraphInstance<IAttachmentType> { }
export interface IAttachment extends _Attachment, IDeleteable { }
export const Attachment = graphInvokableFactory<IAttachment>(_Attachment);

/**
 * Attachments
 */
@defaultPath("attachments")
@getById(Attachment)
export class _Attachments extends _GraphCollection<IAttachmentType[]> {

    // TODO: Adding attachments is not implemented correctly. I believe it requires updating the parent item but needs further investigation.
    
    /**
     * Add attachment to this collection
     *
     * @param attachmentInfo Attachment properties
     * @param bytes File content
     */
    public addFile(attachmentInfo:IAttachmentType, bytes:string | Blob): Promise<IAttachmentType> {

        return graphPost(GraphInstance(this), body(type("#microsoft.graph.fileAttachment", {
            contentBytes: bytes,
            ...attachmentInfo
        })));
    }
    
}
export interface IAttachments extends _Attachments, IGetById<IAttachment> {}
export const Attachments = graphInvokableFactory<IAttachments>(_Attachments);

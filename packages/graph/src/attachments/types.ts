import { Attachment as IAttachmentType } from "@microsoft/microsoft-graph-types";
import { body, IInvokable } from "@pnp/odata";
import { _GraphQueryableCollection, _GraphQueryableInstance, IGraphQueryableInstance, IGraphQueryableCollection, graphInvokableFactory } from "../graphqueryable";
import { graphPost } from "../operations";
import { defaultPath, getById, IGetById } from "../decorators";
import { type } from "../utils/type";

/**
 * Attachment
 */
export class _Attachment extends _GraphQueryableInstance<IAttachmentType> { }
export interface IAttachment extends IInvokable, IGraphQueryableInstance<IAttachmentType> { }
export interface _Attachment extends IInvokable { }
export const Attachment = graphInvokableFactory<IAttachment>(_Attachment);

/**
 * Attachments
 */
@defaultPath("attachments")
@getById(Attachment)
export class _Attachments extends _GraphQueryableCollection<IAttachmentType[]> implements IAttachments {

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
export interface IAttachments extends IInvokable, IGetById<IAttachment>, IGraphQueryableCollection<IAttachmentType[]> {
    addFile(name: string, bytes: string | Blob): Promise<IAttachmentType>;
}
export interface _Attachments extends IInvokable, IGetById<IAttachment> { }
export const Attachments = graphInvokableFactory<IAttachments>(_Attachments);

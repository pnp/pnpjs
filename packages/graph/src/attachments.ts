import { GraphQueryableInstance, GraphQueryableCollection, defaultPath } from "./graphqueryable";
import { Attachment as IAttachment } from "@microsoft/microsoft-graph-types";
import { jsS } from "@pnp/common";

@defaultPath("attachments")
export class Attachments extends GraphQueryableCollection<IAttachment[]> {

    /**
     * Gets a member of the group by id
     * 
     * @param id Attachment id
     */
    public getById(id: string): Attachment {
        return new Attachment(this, id);
    }

    /**
     * Add attachment to this collection
     * 
     * @param name Name given to the attachment file
     * @param bytes File content
     */
    public addFile(name: string, bytes: string | Blob): Promise<IAttachment> {

        return this.postCore({
            body: jsS({
                "@odata.type": "#microsoft.graph.fileAttachment",
                contentBytes: bytes,
                name: name,
            }),
        });
    }
}

export class Attachment extends GraphQueryableInstance<IAttachment> {
}

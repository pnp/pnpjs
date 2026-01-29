import { defaultPath, getById, IGetById } from "../decorators.js";
import { graphInvokableFactory, _GraphCollection, _GraphInstance, GraphQueryable, graphPost, graphGet } from "../graphqueryable.js";
import { Message as IMessageType } from "@microsoft/microsoft-graph-types";
import { body } from "@pnp/queryable";

/**
 * Message
 */
export class _Message extends _GraphInstance<IMessageType> {
    /**
     * Gets all the replies to a message.
     *
     */
    public async replies(): Promise<IMessageType> {
        return graphGet(GraphQueryable(this, "replies"));
    }
}
export interface IMessage extends _Message { }
export const Message = graphInvokableFactory<IMessage>(_Message);

/**
 * Messages
 */
@defaultPath("messages")
@getById(Message)
export class _Messages extends _GraphCollection<IMessageType[]> {

    /**
     * Adds a message
     * @param message ChatMessage object that defines the message
     *
     */
    public async add(message: IMessageType): Promise<IMessageCreateResult> {

        const data = await graphPost(this, body(message));

        return {
            message: (<any>this).getById(data.id),
            data,
        };
    }
}
export interface IMessages extends _Messages, IGetById<IMessage> { }
export const Messages = graphInvokableFactory<IMessages>(_Messages);

export interface IMessageCreateResult {
    data: any;
    message: IMessage;
}

import { defaultPath, getById, IGetById, addable, IAddable } from "../decorators.js";
import { graphInvokableFactory, _GraphCollection, _GraphInstance, GraphQueryable, graphGet } from "../graphqueryable.js";
import { Message as IMessageType } from "@microsoft/microsoft-graph-types";

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
@addable()
export class _Messages extends _GraphCollection<IMessageType[]> { }
export interface IMessages extends _Messages, IGetById<IMessage>, IAddable<IMessageType, IMessageType> { }
export const Messages = graphInvokableFactory<IMessages>(_Messages);

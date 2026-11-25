import { defaultPath, getById, IGetById, addable, IAddable } from "../decorators.js";
import { graphInvokableFactory, _GraphCollection, _GraphInstance, GraphQueryable, graphGet } from "../graphqueryable.js";
import { ChatMessage as IMessageType } from "@microsoft/microsoft-graph-types";

/**
 * Teams chat or channel message
 */
export class _TeamsChatMessage extends _GraphInstance<IMessageType> {
    /**
     * Gets all the replies to a message.
     *
     */
    public async replies(): Promise<IMessageType[]> {
        return graphGet(GraphQueryable(this, "replies"));
    }
}
export interface ITeamsChatMessage extends _TeamsChatMessage { }
export const TeamsChatMessage = graphInvokableFactory<ITeamsChatMessage>(_TeamsChatMessage);

/**
 * Teams chat or channel messages
 */
@defaultPath("messages")
@getById(TeamsChatMessage)
@addable()
export class _TeamsChatMessages extends _GraphCollection<IMessageType[]> { }
export interface ITeamsChatMessages extends _TeamsChatMessages, IGetById<ITeamsChatMessage>, IAddable<IMessageType, IMessageType> { }
export const TeamsChatMessages = graphInvokableFactory<ITeamsChatMessages>(_TeamsChatMessages);

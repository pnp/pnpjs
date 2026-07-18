
import { addable, defaultPath, updateable, getById, deleteable, IDeleteable, IUpdateable, IAddable, IGetById } from "../decorators.js";
import { graphInvokableFactory, _GraphCollection, _GraphInstance, graphPost } from "../graphqueryable.js";
import { Chat as IChatType, TeamworkUserIdentity as ITeamworkUserIdentityType } from "@microsoft/microsoft-graph-types";
import { body } from "@pnp/queryable";

/**
 * Chat
 */
@updateable()
@deleteable()
export class _Chat extends _GraphInstance<IChatType> {
    /**
     * Remove all users
     * @param user: TeamworkUserIdentity
     * @returns void
    */
    public async removeAllAccessForUser(user: ITeamworkUserIdentityType): Promise<void> {
        return graphPost(Chat(this, "removeAllAccessForUser"), body(user));
    }
}
export interface IChat extends _Chat, IDeleteable, IUpdateable  { }
export const Chat = graphInvokableFactory<IChat>(_Chat);

/**
 * Chats
 */
@defaultPath("chats")
@getById(Chat)
@addable()
export class _Chats extends _GraphCollection<IChatType[]> {}
export interface IChats extends _Chats, IGetById<IChat>, IAddable<IChatType, IChatType> { }
export const Chats = graphInvokableFactory<IChats>(_Chats);



import { addProp, body } from "@pnp/queryable";
import { ConversationMember as IConversationMemberType } from "@microsoft/microsoft-graph-types";
import { _Chat } from "../chats/types.js";
import { _GraphCollection, _GraphInstance, graphInvokableFactory, graphDelete, graphPost } from "../graphqueryable.js";
import { defaultPath, getById, IGetById } from "../decorators.js";

/**
 * Member of a chat
 */
export class _ChatMember extends _GraphInstance<IConversationMemberType> {
    /**
     * Removes this member from the chat
     */
    public remove(): Promise<void> {
        return graphDelete(this);
    }
}
export interface IChatMember extends _ChatMember { }
export const ChatMember = graphInvokableFactory<IChatMember>(_ChatMember);

/**
 * Members of a chat.
 * Chats can't use the group Members class because they add and remove members without the $ref segment.
 */
@defaultPath("members")
@getById(ChatMember)
export class _ChatMembers extends _GraphCollection<IConversationMemberType[]> {
    /**
     * Adds a user to the chat
     *
     * @param member The user to add and their roles
     */
    public add(member: IChatMemberAdd): Promise<void> {
        return graphPost(this, body({ "@odata.type": "#microsoft.graph.aadUserConversationMember", ...member }));
    }
}
export interface IChatMembers extends _ChatMembers, IGetById<IChatMember> { }
export const ChatMembers = graphInvokableFactory<IChatMembers>(_ChatMembers);

export interface IChatMemberAdd {
    /**
     * Full url of the user to add (ex: `https://graph.microsoft.com/v1.0/users/${id}`)
     */
    "user@odata.bind": string;
    roles: string[];
    visibleHistoryStartDateTime?: string;
    tenantId?: string;
}

declare module "../chats/types" {
    interface _Chat {
        readonly members: IChatMembers;
    }
    interface IChat {
        readonly members: IChatMembers;
    }
}

addProp(_Chat, "members", ChatMembers);

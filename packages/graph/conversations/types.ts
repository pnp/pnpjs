import { body } from "@pnp/queryable";
import {
    ConversationThread as IConversationThreadType,
    Post as IPostType,
    Recipient as IRecipientType,
    Conversation as IConversationType,
    User as IUserType,
} from "@microsoft/microsoft-graph-types";
import {
    _GraphQueryableCollection,
    _GraphQueryableInstance,
    graphInvokableFactory,
} from "../graphqueryable.js";
import { defaultPath, updateable, IUpdateable, deleteable, IDeleteable, addable, IAddable, getById, IGetById } from "../decorators.js";
import { graphPost, graphDelete } from "../operations.js";

/**
 * Conversation
 */
@updateable()
@deleteable()
export class _Conversation extends _GraphQueryableInstance<IConversationType> {

    /**
     * Get all the threads in a group conversation.
     */
    public get threads(): IThreads {
        return Threads(this);
    }
}
export interface IConversation extends _Conversation, IUpdateable<IConversationType>, IDeleteable { }
export const Conversation = graphInvokableFactory<IConversation>(_Conversation);

/**
 * Conversations
 */
@defaultPath("conversations")
@addable()
@getById(Conversation)
export class _Conversations extends _GraphQueryableCollection<IConversationType[]> { }
export interface IConversations extends _Conversations, IGetById<IConversation>, IAddable<IConversationType> { }
export const Conversations = graphInvokableFactory<IConversations>(_Conversations);

/**
 * Thread
 */
@deleteable()
export class _Thread extends _GraphQueryableInstance {

    /**
     * Get all the threads in a group conversation.
     */
    public get posts(): IPosts {
        return Posts(this);
    }

    /**
     * Reply to a thread in a group conversation and add a new post to it
     *
     * @param post Contents of the post
     */
    public reply(post: IPostType): Promise<void> {
        return graphPost(Thread(this, "reply"), body(post));
    }
}
export interface IThread extends _Thread, IDeleteable { }
export const Thread = graphInvokableFactory<IThread>(_Thread);

/**
 * Threads
 */
@defaultPath("threads")
@addable()
@getById(Thread)
export class _Threads extends _GraphQueryableCollection<IConversationThreadType[]> { }
export interface IThreads extends _Threads, IGetById<IThread>, IAddable<IConversationThreadType, { id: string }> { }
export const Threads = graphInvokableFactory<IThreads>(_Threads);


/**
 * Post
 */
@deleteable()
export class _Post extends _GraphQueryableInstance<IPostType> {
    /**
     * Forward a post to a recipient
     */
    public forward(info: IPostForwardInfo): Promise<void> {
        return graphPost(Post(this, "forward"), body(info));
    }

    /**
     * Reply to a thread in a group conversation and add a new post to it
     *
     * @param post Contents of the post
     */
    public reply(post: IPostType): Promise<void> {
        return graphPost(Post(this, "reply"), body(post));
    }
}
export interface IPost extends _Post, IDeleteable { }
export const Post = graphInvokableFactory<IPost>(_Post);

/**
 * Posts
 */
@defaultPath("posts")
@addable()
@getById(Post)
export class _Posts extends _GraphQueryableCollection<IPostType[]> { }
export interface IPosts extends _Posts, IGetById<IPost>, IAddable<IPostType> { }
export const Posts = graphInvokableFactory<IPosts>(_Posts);

/**
 * Senders
 */
export class _Senders extends _GraphQueryableCollection<IUserType[]> {

    /**
     * Add a new user or group to this senders collection
     * @param id The full @odata.id value to add (ex: https://graph.microsoft.com/v1.0/users/user@contoso.com)
     */
    public add(id: string): Promise<any> {
        return graphPost(Senders(this, "$ref"), body({ "@odata.id": id }));
    }

    /**
     * Removes the entity from the collection
     *
     * @param id The full @odata.id value to remove (ex: https://graph.microsoft.com/v1.0/users/user@contoso.com)
     */
    public remove(id: string): Promise<void> {
        const remover = Senders(this, "$ref");
        remover.query.set("$id", id);
        return graphDelete(remover);
    }
}
export interface ISenders extends _Senders { }
export const Senders = graphInvokableFactory<ISenders>(_Senders);

/**
 * Information used to forward a post
 */
export interface IPostForwardInfo {
    comment?: string;
    toRecipients: IRecipientType[];
}

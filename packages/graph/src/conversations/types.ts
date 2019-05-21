import { body, IInvokable } from "@pnp/odata";
import {
    ConversationThread as IConversationThreadType,
    Post as IPostType,
    Recipient as IRecipientType,
    Conversation as IConversationType,
    User as IUserType,
} from "@microsoft/microsoft-graph-types";
import {
    _GraphQueryableCollection,
    IGraphQueryableCollection,
    _GraphQueryableInstance,
    IGraphQueryableInstance,
    graphInvokableFactory,
} from "../graphqueryable";
import { defaultPath, updateable, IUpdateable, deleteable, IDeleteable, addable, IAddable, getById, IGetById } from "../decorators";
import { graphPost, graphDelete } from "../operations";

/**
 * Conversations
 */
@defaultPath("conversations")
@addable()
export class _Conversations extends _GraphQueryableCollection<IConversationType[]> implements IConversations {
    /**
     * Gets a conversation from this collection by id
     * 
     * @param id Group member's id
     */
    public getById(id: string): IConversation {
        return Conversation(this, id);
    }
}
export interface IConversations extends IInvokable, IAddable<IConversationType>, IGraphQueryableCollection<IConversationType[]> {
    getById(id: string): IConversation;
}
export interface _Conversations extends IInvokable, IAddable<IConversationType> { }
export const Conversations = graphInvokableFactory<IConversations>(_Conversations);

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
export interface IConversation extends IInvokable, IUpdateable<IConversationType>, IDeleteable, IGraphQueryableInstance<IConversationType> { }
export interface _Conversation extends IInvokable, IUpdateable<IConversationType>, IDeleteable { }
export const Conversation = graphInvokableFactory<IConversation>(_Conversation);

/**
 * Threads
 */
@defaultPath("threads")
@addable()
export class _Threads extends _GraphQueryableCollection<IConversationThreadType[]> implements IThreads {

    /**
     * Gets a thread from this collection by id
     * 
     * @param id Group member's id
     */
    public getById(id: string): IThread {
        return Thread(this, id);
    }
}
export interface IThreads extends IInvokable, IAddable<IConversationThreadType, { id: string }>, IGraphQueryableCollection<IConversationThreadType[]> {
    getById(id: string): IThread;
}
export interface _Threads extends IInvokable, IAddable<IConversationThreadType, { id: string }> { }
export const Threads = graphInvokableFactory<IThreads>(_Threads);

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
        return graphPost(this.clone(Thread, "reply"), body(post));
    }
}
export interface IThread extends IInvokable, IDeleteable, IGraphQueryableInstance<IConversationThreadType> {
    readonly posts: IPosts;
    reply(post: IPostType): Promise<void>;
}
export interface _Thread extends IInvokable, IDeleteable { }
export const Thread = graphInvokableFactory<IThread>(_Thread);

/**
 * Post
 */
@deleteable()
export class _Post extends _GraphQueryableInstance<IPostType> implements IPost {
    /**
     * Forward a post to a recipient
     */
    public forward(info: IPostForwardInfo): Promise<void> {
        return graphPost(this.clone(Post, "forward"), body(info));
    }

    /**
     * Reply to a thread in a group conversation and add a new post to it
     * 
     * @param post Contents of the post 
     */
    public reply(post: IPostType): Promise<void> {
        return graphPost(this.clone(Post, "reply"), body(post));
    }
}
export interface IPost extends IInvokable, IDeleteable, IGraphQueryableInstance<IPostType> {
    forward(info: IPostForwardInfo): Promise<void>;
    reply(post: IPostType): Promise<void>;
}
export interface _Post extends IInvokable, IDeleteable { }
export const Post = graphInvokableFactory<IPost>(_Post);

/**
 * Posts
 */
@defaultPath("posts")
@addable()
@getById(Post)
export class _Posts extends _GraphQueryableCollection<IPostType[]> implements IPosts { }
export interface IPosts extends IInvokable, IGetById<IPost>, IAddable<IPostType>, IGraphQueryableCollection<IPostType[]> { }
export interface _Posts extends IInvokable, IGetById<IPost>, IAddable<IPostType> { }
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
        return graphPost(this.clone(Senders, "$ref"), body({ "@odata.id": id }));
    }

    /**
     * Removes the entity from the collection
     * 
     * @param id The full @odata.id value to remove (ex: https://graph.microsoft.com/v1.0/users/user@contoso.com)
     */
    public remove(id: string): Promise<void> {
        const remover = this.clone(Senders, "$ref");
        remover.query.set("$id", id);
        return graphDelete(remover);
    }
}
export interface ISenders extends IInvokable, IGraphQueryableCollection<IUserType[]> {
    add(id: string): Promise<any>;
    remove(id: string): Promise<void>;
}
export interface _Senders extends IInvokable { }
export const Senders = graphInvokableFactory<ISenders>(_Senders);

/**
 * Information used to forward a post
 */
export interface IPostForwardInfo {
    comment?: string;
    toRecipients: IRecipientType[];
}

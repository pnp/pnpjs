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
 * Conversation
 */
@updateable()
@deleteable()
export class _Conversation extends _GraphQueryableInstance<IConversationType> implements _IConversation {

    /**
     * Get all the threads in a group conversation.
     */
    public get threads(): IThreads {
        return Threads(this);
    }
}
export interface _IConversation {
    readonly threads: IThreads;
}
export interface IConversation extends _IConversation, IInvokable, IUpdateable<IConversationType>, IDeleteable, IGraphQueryableInstance<IConversationType> { }
export const Conversation = graphInvokableFactory<IConversation>(_Conversation);

/**
 * Conversations
 */
@defaultPath("conversations")
@addable()
@getById(Conversation)
export class _Conversations extends _GraphQueryableCollection<IConversationType[]> implements _IConversations { }
export interface _IConversations { }
export interface IConversations extends IInvokable, IGetById<IConversation>, IAddable<IConversationType>, IGraphQueryableCollection<IConversationType[]> { }
export const Conversations = graphInvokableFactory<IConversations>(_Conversations);

/**
 * Thread
 */
@deleteable()
export class _Thread extends _GraphQueryableInstance implements _IThread {

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
export interface _IThread {
    readonly posts: IPosts;
    reply(post: IPostType): Promise<void>;
}
export interface IThread extends _IThread, IInvokable, IDeleteable, IGraphQueryableInstance<IConversationThreadType> { }
export const Thread = graphInvokableFactory<IThread>(_Thread);

/**
 * Threads
 */
@defaultPath("threads")
@addable()
@getById(Thread)
export class _Threads extends _GraphQueryableCollection<IConversationThreadType[]> implements _IThreads { }
export interface _IThreads { }
/* tslint:disable-next-line:max-line-length */
export interface IThreads extends _IThreads, IInvokable, IGetById<IThread>, IAddable<IConversationThreadType, { id: string }>, IGraphQueryableCollection<IConversationThreadType[]> { }
export const Threads = graphInvokableFactory<IThreads>(_Threads);


/**
 * Post
 */
@deleteable()
export class _Post extends _GraphQueryableInstance<IPostType> implements _IPost {
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
export interface _IPost {
    forward(info: IPostForwardInfo): Promise<void>;
    reply(post: IPostType): Promise<void>;
}
export interface IPost extends _IPost, IInvokable, IDeleteable, IGraphQueryableInstance<IPostType> { }
export const Post = graphInvokableFactory<IPost>(_Post);

/**
 * Posts
 */
@defaultPath("posts")
@addable()
@getById(Post)
export class _Posts extends _GraphQueryableCollection<IPostType[]> implements _IPosts { }
export interface _IPosts { }
export interface IPosts extends _IPosts, IInvokable, IGetById<IPost>, IAddable<IPostType>, IGraphQueryableCollection<IPostType[]> { }
export const Posts = graphInvokableFactory<IPosts>(_Posts);

/**
 * Senders
 */
export class _Senders extends _GraphQueryableCollection<IUserType[]> implements _ISenders {

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
export interface _ISenders {
    add(id: string): Promise<any>;
    remove(id: string): Promise<void>;
}
export interface ISenders extends _ISenders, IInvokable, IGraphQueryableCollection<IUserType[]> {}
export const Senders = graphInvokableFactory<ISenders>(_Senders);

/**
 * Information used to forward a post
 */
export interface IPostForwardInfo {
    comment?: string;
    toRecipients: IRecipientType[];
}

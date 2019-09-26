import { defaultPath } from "../decorators";
import {
    _SharePointQueryableInstance,
    ISharePointQueryableCollection,
    ISharePointQueryableInstance,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { assign } from "@pnp/common";
import { odataUrlFrom } from "../odata";
import { metadata } from "../utils/metadata";
import { IInvokable, body } from "@pnp/odata";
import { spPost } from "../operations";

export interface ICommentAuthorData {
    email: string;
    id: number;
    isActive: boolean;
    isExternal: boolean;
    jobTitle: string | null;
    loginName: string;
    name: string;
    principalType: number;
    userId: any | null;
}

export interface ICommentData {
    author: ICommentAuthorData;
    createdDate: string;
    id: string;
    isLikedByUser: boolean;
    isReply: boolean;
    itemId: number;
    likeCount: number;
    listId: string;
    mentions: any | null;
    parentId: string;
    replyCount: number;
    text: string;
}

export interface ICommentInfo {
    text: string;
    mentions?: {
        loginName: string;
        email: string;
        name: string;
    };
}

/**
 * Represents a Collection of comments
 */
@defaultPath("comments")
export class _Comments extends _SharePointQueryableCollection<ICommentData[]> implements _IComments {

    /**
     * Adds a new comment to this collection
     * 
     * @param info Comment information to add
     */
    public async add(info: string | ICommentInfo): Promise<IComment & ICommentData> {

        if (typeof info === "string") {
            info = { text: info };
        }

        const postBody = body(assign(metadata("Microsoft.SharePoint.Comments.comment"), info));

        const d = await spPost(this.clone(Comments, null), postBody);

        return assign(this.getById(d.id), d);
    }

    /**
     * Gets a comment by id
     * 
     * @param id Id of the comment to load
     */
    public getById(id: string | number): IComment {
        const c = Comment(this);
        c.concat(`(${id})`);
        return c;
    }

    /**
     * Deletes all the comments in this collection
     */
    public clear(): Promise<boolean> {
        return spPost<boolean>(this.clone(Comments, "DeleteAll"));
    }
}

export interface _IComments {
    add(info: string | ICommentInfo): Promise<IComment & ICommentData>;
    getById(id: string | number): IComment;
    clear(): Promise<boolean>;
}

export interface IComments extends _IComments, IInvokable<ICommentData[]>, ISharePointQueryableCollection<ICommentData[]> { }

/**
 * Invokable factory for IComments instances
 */
export const Comments = spInvokableFactory<IComments>(_Comments);

/**
 * Represents a comment
 */
export class _Comment extends _SharePointQueryableInstance<ICommentData> implements _IComment {

    public get replies(): IReplies {
        return Replies(this);
    }

    /**
     * Likes the comment as the current user
     */
    public like(): Promise<void> {
        return spPost(this.clone(Comment, "Like"));
    }

    /**
     * Unlikes the comment as the current user
     */
    public unlike(): Promise<void> {
        return spPost(this.clone(Comment, "Unlike"));
    }

    /**
     * Deletes this comment
     */
    public delete(): Promise<void> {
        return spPost(this.clone(Comment, "DeleteComment"));
    }
}

export interface _IComment {
    readonly replies: IReplies;
    like(): Promise<void>;
    unlike(): Promise<void>;
    delete(): Promise<void>;
}

export interface IComment extends _IComment, IInvokable<ICommentData>, ISharePointQueryableInstance<ICommentData> { }

/**
 * Invokable factory for IComment instances
 */
export const Comment = spInvokableFactory<IComment>(_Comment);

/**
 * Represents a Collection of comments
 */
@defaultPath("replies")
export class _Replies extends _SharePointQueryableCollection<ICommentData[]> implements _IReplies {

    /**
     * Adds a new reply to this collection
     * 
     * @param info Comment information to add
     */
    public async add(info: string | ICommentInfo): Promise<IComment & ICommentData> {

        if (typeof info === "string") {
            info = { text: info };
        }

        const postBody = body(assign(metadata("Microsoft.SharePoint.Comments.comment"), info));

        const d = await spPost(this.clone(Replies, null), postBody);

        return assign(Comment(odataUrlFrom(d)), d);
    }
}

export interface _IReplies {
    add(info: string | ICommentInfo): Promise<IComment & ICommentData>;
}

export interface IReplies extends _IReplies, IInvokable<ICommentData[]>, ISharePointQueryableCollection<ICommentData[]> { }

/**
 * Invokable factory for IReplies instances
 */
export const Replies = spInvokableFactory<IReplies>(_Replies);

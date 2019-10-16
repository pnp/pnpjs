import { defaultPath, clientTagMethod } from "../decorators";
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

@defaultPath("comments")
export class _Comments extends _SharePointQueryableCollection<ICommentData[]> implements _IComments {

    @clientTagMethod("coms.add")
    public async add(info: string | ICommentInfo): Promise<IComment & ICommentData> {

        if (typeof info === "string") {
            info = { text: info };
        }

        const postBody = body(assign(metadata("Microsoft.SharePoint.Comments.comment"), info));

        const d = await spPost(this.clone(Comments, null), postBody);

        return assign(this.getById(d.id), d);
    }

    public getById(id: string | number): IComment {
        return Comment(this).concat(`(${id})`);
    }

    public clear(): Promise<boolean> {
        return spPost<boolean>(clientTagMethod.configure(this.clone(Comments, "DeleteAll"), "coms.clear"));
    }
}

/**
 * Represents a Collection of comments
 */
export interface _IComments {
    /**
     * Adds a new comment to this collection
     * 
     * @param info Comment information to add
     */
    add(info: string | ICommentInfo): Promise<IComment & ICommentData>;
    /**
     * Gets a comment by id
     * 
     * @param id Id of the comment to load
     */
    getById(id: string | number): IComment;
    /**
     * Deletes all the comments in this collection
     */
    clear(): Promise<boolean>;
}

export interface IComments extends _IComments, IInvokable<ICommentData[]>, ISharePointQueryableCollection<ICommentData[]> { }
export const Comments = spInvokableFactory<IComments>(_Comments);

export class _Comment extends _SharePointQueryableInstance<ICommentData> implements _IComment {

    public get replies(): IReplies {
        return clientTagMethod.configure(Replies(this), "com.replies");
    }

    @clientTagMethod("com.like")
    public like(): Promise<void> {
        return spPost(this.clone(Comment, "Like"));
    }

    @clientTagMethod("com.unlike")
    public unlike(): Promise<void> {
        return spPost(this.clone(Comment, "Unlike"));
    }

    @clientTagMethod("com.delete")
    public delete(): Promise<void> {
        return spPost(this.clone(Comment, "DeleteComment"));
    }
}

/**
 * Represents a comment
 */
export interface _IComment {
    /**
     * A comment's replies
     */
    readonly replies: IReplies;
    /**
     * Likes the comment as the current user
     */
    like(): Promise<void>;
    /**
     * Unlikes the comment as the current user
     */
    unlike(): Promise<void>;
    /**
     * Deletes this comment
     */
    delete(): Promise<void>;
}

export interface IComment extends _IComment, IInvokable<ICommentData>, ISharePointQueryableInstance<ICommentData> { }
export const Comment = spInvokableFactory<IComment>(_Comment);

@defaultPath("replies")
export class _Replies extends _SharePointQueryableCollection<ICommentData[]> implements _IReplies {

    @clientTagMethod("reps.add")
    public async add(info: string | ICommentInfo): Promise<IComment & ICommentData> {

        if (typeof info === "string") {
            info = { text: info };
        }

        const postBody = body(assign(metadata("Microsoft.SharePoint.Comments.comment"), info));

        const d = await spPost(this.clone(Replies, null), postBody);

        return assign(Comment(odataUrlFrom(d)), d);
    }
}

/**
 * Represents a Collection of comments
 */
export interface _IReplies {
    /**
     * Adds a new reply to this collection
     * 
     * @param info Comment information to add
     */
    add(info: string | ICommentInfo): Promise<IComment & ICommentData>;
}

export interface IReplies extends _IReplies, IInvokable<ICommentData[]>, ISharePointQueryableCollection<ICommentData[]> { }
export const Replies = spInvokableFactory<IReplies>(_Replies);

/**
 * Defines the information for a comment author
 */
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

/**
 * Defines the information for a comment
 */
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

/**
 * Defines a comment's core info
 */
export interface ICommentInfo {
    text: string;
    mentions?: {
        loginName: string;
        email: string;
        name: string;
    };
}

export interface ILikeData {
    name: string;
    loginName: string;
    id: number;
    email: string;
    creationDate: string;
}

export interface ILikedByInformation {
    likedBy: {
        creationDate: string;
        email: string;
        id: number;
        loginName: string;
        name: string;
    }[];
    isLikedByUser: boolean;
    likeCount: number;
}

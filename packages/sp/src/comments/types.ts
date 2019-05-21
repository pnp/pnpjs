import { defaultPath } from "../decorators";
import {
    _SharePointQueryableInstance,
    ISharePointQueryableCollection,
    ISharePointQueryableInstance,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { extend } from "@pnp/common";
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
export class _Comments extends _SharePointQueryableCollection<ICommentData[]> implements IComments {

    /**
     * Adds a new comment to this collection
     * 
     * @param info Comment information to add
     */
    public async add(info: string | ICommentInfo): Promise<IComment & ICommentData> {

        if (typeof info === "string") {
            info = { text: info };
        }

        const postBody = body(extend(metadata("Microsoft.SharePoint.Comments.comment"), info));

        const d = await spPost(this.clone(Comments, null), postBody);

        return extend(this.getById(d.id), d);
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

export interface IComments extends IInvokable, ISharePointQueryableCollection<ICommentData[]> {
    add(info: string | ICommentInfo): Promise<IComment & ICommentData>;
    getById(id: string | number): IComment;
    clear(): Promise<boolean>;
}
export interface _Comments extends IInvokable { }
export const Comments = spInvokableFactory<IComments>(_Comments);

/**
 * Represents a comment
 */
export class _Comment extends _SharePointQueryableInstance<ICommentData> {

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

export interface IComment extends IInvokable, ISharePointQueryableInstance<ICommentData> {
    readonly replies: IReplies;
    like(): Promise<void>;
    unlike(): Promise<void>;
    delete(): Promise<void>;
}
export interface _Comment extends IInvokable { }
export const Comment = spInvokableFactory<IComment>(_Comment);

/**
 * Represents a Collection of comments
 */
@defaultPath("replies")
export class _Replies extends _SharePointQueryableCollection<ICommentData[]> implements IReplies {

    /**
     * Adds a new reply to this collection
     * 
     * @param info Comment information to add
     */
    public async add(info: string | ICommentInfo): Promise<IComment & ICommentData> {

        if (typeof info === "string") {
            info = { text: info };
        }

        const postBody = body(extend(metadata("Microsoft.SharePoint.Comments.comment"), info));

        const d = await spPost(this.clone(Replies, null), postBody);

        return extend(Comment(odataUrlFrom(d)), d);
    }
}

export interface IReplies extends IInvokable, ISharePointQueryableCollection<ICommentData[]> {
    add(info: string | ICommentInfo): Promise<IComment & ICommentData>;
}
export interface _Replies extends IInvokable { }
export const Replies = spInvokableFactory<IReplies>(_Replies);

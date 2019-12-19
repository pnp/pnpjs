import { defaultPath } from "../decorators";
import {
    _SharePointQueryableInstance,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { assign } from "@pnp/common";
import { odataUrlFrom } from "../odata";
import { metadata } from "../utils/metadata";
import { body } from "@pnp/odata";
import { spPost } from "../operations";
import { tag } from "../telemetry";

@defaultPath("comments")
export class _Comments extends _SharePointQueryableCollection<ICommentInfo[]> {

    /**
     * Adds a new comment to this collection
     * 
     * @param info Comment information to add
     */
    @tag("coms.add")
    public async add(info: string | ICommentInfo): Promise<IComment & ICommentInfo> {

        if (typeof info === "string") {
            info = <ICommentInfo>{ text: info };
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
        return tag.configure(Comment(this).concat(`(${id})`), "coms.getById");
    }

    /**
     * Deletes all the comments in this collection
     */
    public clear(): Promise<boolean> {
        return spPost<boolean>(tag.configure(this.clone(Comments, "DeleteAll"), "coms.clear"));
    }
}
export interface IComments extends _Comments {}
export const Comments = spInvokableFactory<IComments>(_Comments);

export class _Comment extends _SharePointQueryableInstance<ICommentInfo> {

    /**
     * A comment's replies
     */
    public get replies(): IReplies {
        return tag.configure(Replies(this), "com.replies");
    }

    /**
     * Likes the comment as the current user
     */
    @tag("com.like")
    public like(): Promise<void> {
        return spPost(this.clone(Comment, "Like"));
    }

    /**
     * Unlikes the comment as the current user
     */
    @tag("com.unlike")
    public unlike(): Promise<void> {
        return spPost(this.clone(Comment, "Unlike"));
    }

    /**
     * Deletes this comment
     */
    @tag("com.delete")
    public delete(): Promise<void> {
        return spPost(this.clone(Comment, "DeleteComment"));
    }
}
export interface IComment extends _Comment {}
export const Comment = spInvokableFactory<IComment>(_Comment);

@defaultPath("replies")
export class _Replies extends _SharePointQueryableCollection<ICommentInfo[]> {

    /**
     * Adds a new reply to this collection
     * 
     * @param info Comment information to add
     */
    @tag("reps.add")
    public async add(info: string | ICommentInfo): Promise<IComment & ICommentInfo> {

        if (typeof info === "string") {
            info = <ICommentInfo>{ text: info };
        }

        const postBody = body(assign(metadata("Microsoft.SharePoint.Comments.comment"), info));

        const d = await spPost(this.clone(Replies, null), postBody);

        return assign(Comment(odataUrlFrom(d)), d);
    }
}
export interface IReplies extends _Replies {}
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
export interface ICommentInfo {
    author: ICommentAuthorData;
    createdDate: string;
    id: string;
    isLikedByUser: boolean;
    isReply: boolean;
    itemId: number;
    likeCount: number;
    listId: string;
    mentions: {
        loginName: string;
        email: string;
        name: string;
    } | null;
    parentId: string;
    replyCount: number;
    text: string;
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

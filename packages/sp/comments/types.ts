import { defaultPath } from "../decorators.js";
import {
    _SPCollection,
    spInvokableFactory,
    _SPInstance,
} from "../spqueryable.js";
import { odataUrlFrom } from "../utils/odata-url-from.js";
import { body } from "@pnp/queryable";
import { spDelete, spPost } from "../operations.js";

@defaultPath("comments")
export class _Comments extends _SPCollection<ICommentInfo[]> {

    /**
     * Adds a new comment to this collection
     *
     * @param info Comment information to add
     */
    public async add(info: string | ICommentInfo): Promise<IComment & ICommentInfo> {

        if (typeof info === "string") {
            info = <ICommentInfo>{ text: info };
        }

        const d = await spPost(Comments(this, null), body(info));

        return Object.assign(this.getById(d.id), d);
    }

    /**
     * Gets a comment by id
     *
     * @param id Id of the comment to load
     */
    public getById(id: string | number): IComment {
        return Comment(this).concat(`(${id})`);
    }

    /**
     * Deletes all the comments in this collection
     */
    public clear(): Promise<boolean> {
        return spPost<boolean>(Comments(this, "DeleteAll"));
    }
}
export interface IComments extends _Comments { }
export const Comments = spInvokableFactory<IComments>(_Comments);

export class _Comment extends _SPInstance<ICommentInfo> {

    /**
     * A comment's replies
     */
    public get replies(): IReplies {
        return Replies(this);
    }

    /**
     * Likes the comment as the current user
     */
    public like(): Promise<void> {
        return spPost(Comment(this, "Like"));
    }

    /**
     * Unlikes the comment as the current user
     */
    public unlike(): Promise<void> {
        return spPost(Comment(this, "Unlike"));
    }

    /**
     * Deletes this comment
     */
    public delete(): Promise<void> {
        return spDelete(this);
    }
}
export interface IComment extends _Comment { }
export const Comment = spInvokableFactory<IComment>(_Comment);

@defaultPath("replies")
export class _Replies extends _SPCollection<ICommentInfo[]> {

    /**
     * Adds a new reply to this collection
     *
     * @param info Comment information to add
     */
    public async add(info: string | Partial<ICommentInfo>): Promise<IComment & ICommentInfo> {

        if (typeof info === "string") {
            info = <ICommentInfo>{ text: info };
        }

        const d = await spPost(Replies(this, null), body(info));

        return Object.assign(Comment([this, odataUrlFrom(d)]), d);
    }
}
export interface IReplies extends _Replies { }
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
    mentions: [{
        loginName: string;
        email: string;
        name: string;
    }] | null;
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
export type RatingValues = 1|2|3|4|5;

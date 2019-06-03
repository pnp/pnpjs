import { SharePointQueryableCollection, SharePointQueryableInstance, defaultPath } from "./sharepointqueryable";
import { extend, jsS } from "@pnp/common";
import { odataUrlFrom } from "./odata";
import { metadata } from "./utils/metadata";

export interface CommentAuthorData {
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

export interface CommentData {
    author: CommentAuthorData;
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

export interface Identity {
    loginName: string;
    email: string;
    name: string;
}

export interface CommentInfo {
    text: string;
    mentions?: Identity[];
}

/**
 * Represents a Collection of comments
 */
@defaultPath("comments")
export class Comments extends SharePointQueryableCollection<CommentData[]> {

    /**
     * Adds a new comment to this collection
     * 
     * @param info Comment information to add
     */
    public add(info: string | CommentInfo): Promise<Comment & CommentData> {

        if (typeof info === "string") {
            info = { text: info };
        }

        const postBody = jsS(extend(metadata("Microsoft.SharePoint.Comments.comment"), info));

        return this.clone(Comments, null).postCore<CommentData>({ body: postBody }).then(d => {
            return extend(this.getById(d.id), d);
        });
    }

    /**
     * Gets a comment by id
     * 
     * @param id Id of the comment to load
     */
    public getById(id: string | number): Comment {
        const c = new Comment(this);
        c.concat(`(${id})`);
        return c;
    }

    /**
     * Deletes all the comments in this collection
     */
    public clear(): Promise<boolean> {
        return this.clone(Comments, "DeleteAll").postCore<boolean>();
    }
}

/**
 * Represents a comment
 */
export class Comment extends SharePointQueryableInstance {

    public get replies(): Replies {
        return new Replies(this);
    }

    /**
     * Likes the comment as the current user
     */
    public like(): Promise<void> {
        return this.clone(Comment, "Like").postCore<void>();
    }

    /**
     * Unlikes the comment as the current user
     */
    public unlike(): Promise<void> {
        return this.clone(Comment, "Unlike").postCore<void>();
    }

    /**
     * Deletes this comment
     */
    public delete(): Promise<void> {
        return this.deleteCore();
    }
}

/**
 * Represents a Collection of comments
 */
@defaultPath("replies")
export class Replies extends SharePointQueryableCollection<CommentData[]> {

    /**
     * Adds a new reply to this collection
     * 
     * @param info Comment information to add
     */
    public add(info: string | CommentInfo): Promise<Comment & CommentData> {

        if (typeof info === "string") {
            info = { text: info };
        }

        const postBody = jsS(extend(metadata("Microsoft.SharePoint.Comments.comment"), info));

        return this.clone(Replies, null).postCore<CommentData>({ body: postBody }).then(d => {
            return extend(new Comment(odataUrlFrom(d)), d);
        });
    }
}

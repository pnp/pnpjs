import { _ClientsidePage } from "../clientside-pages/types";
import { ICommentInfo, ICommentData, IComment, _Comment, Comment, ILikedByInformation } from "./types";
import { spODataEntity } from "../odata";
import { clientTagMethod } from "../decorators";

declare module "../clientside-pages/types" {
    interface _ClientsidePage {
        addComment(info: string | ICommentInfo): Promise<IComment & ICommentData>;
        getCommentById(id: string | number): Promise<IComment & ICommentData>;
        clearComments(): Promise<boolean>;
        getComments(): Promise<ICommentData[]>;
        like(): Promise<void>;
        unlike(): Promise<void>;
        getLikedByInformation(): Promise<ILikedByInformation>;
    }
    interface IClientsidePage {
        /**
         * Adds a comment to this page
         * 
         * @param info The comment information
         */
        addComment(info: string | ICommentInfo): Promise<IComment & ICommentData>;
        /**
         * 
         * @param id gets a comment by id
         */
        getCommentById(id: string | number): Promise<IComment & ICommentData>;
        /**
         * Deletes all comments for this page
         */
        clearComments(): Promise<boolean>;
        /**
         * Gets all the comments for this page
         */
        getComments(): Promise<ICommentData[]>;
        /**
         * Like this page
         */
        like(): Promise<void>;
        /**
         * Unlike this page
         */
        unlike(): Promise<void>;
        /**
         * gets list of who likes the page, current user's status, a few other details
         */
        getLikedByInformation(): Promise<ILikedByInformation>;
    }
}

_ClientsidePage.prototype.addComment = async function (this: _ClientsidePage, info: string | ICommentInfo): Promise<IComment & ICommentData> {

    const item = await this.getItem();
    return item.comments.add(info);
};

_ClientsidePage.prototype.getCommentById = async function (this: _ClientsidePage, id: string | number): Promise<IComment & ICommentData> {

    const item = await this.getItem();
    return item.comments.getById(id).usingParser(spODataEntity(Comment))();
};

_ClientsidePage.prototype.clearComments = async function (this: _ClientsidePage): Promise<boolean> {

    const item = await this.getItem();
    return item.comments.clear();
};

_ClientsidePage.prototype.getComments = async function (this: _ClientsidePage): Promise<ICommentData[]> {

    const item = await this.getItem();
    return clientTagMethod.configure(item, "").comments();
};

_ClientsidePage.prototype.like = async function (): Promise<void> {
    const item = await this.getItem("ID");
    return item.like();
};

_ClientsidePage.prototype.unlike = async function (): Promise<void> {
    const item = await this.getItem("ID");
    return item.unlike();
};

_ClientsidePage.prototype.getLikedByInformation = async function (): Promise<ILikedByInformation> {
    const item = await this.getItem("ID");
    return item.getLikedByInformation();
};

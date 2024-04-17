import { _ClientsidePage } from "../clientside-pages/types.js";
import { ICommentInfo, IComment, ILikedByInformation } from "./types.js";
import { Item } from "../items/index.js";
import { SPQueryable, spPost } from "../spqueryable.js";
import { IItemUpdateResultData } from "../items/types.js";

declare module "../clientside-pages/types" {
    interface _ClientsidePage {
        addComment(info: string | ICommentInfo): Promise<IComment & ICommentInfo>;
        getCommentById(id: string | number): Promise<IComment & ICommentInfo>;
        clearComments(): Promise<boolean>;
        getComments(): Promise<ICommentInfo[]>;
        like(): Promise<void>;
        unlike(): Promise<void>;
        getLikedByInformation(): Promise<ILikedByInformation>;
        enableComments(): Promise<IItemUpdateResultData>;
        disableComments(): Promise<IItemUpdateResultData>;
        setCommentsOn(on: boolean): Promise<IItemUpdateResultData>;
    }
    interface IClientsidePage {
        /**
         * Adds a comment to this page
         *
         * @param info The comment information
         */
        addComment(info: string | Partial<ICommentInfo>): Promise<IComment & ICommentInfo>;
        /**
         *
         * @param id gets a comment by id
         */
        getCommentById(id: string | number): Promise<IComment & ICommentInfo>;
        /**
         * Deletes all comments for this page
         */
        clearComments(): Promise<boolean>;
        /**
         * Gets all the comments for this page
         */
        getComments(): Promise<ICommentInfo[]>;
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
        /**
         * Enables comments for this page
         */
        enableComments(): Promise<IItemUpdateResultData>;
        /**
         * Disables comments for this page
         */
        disableComments(): Promise<IItemUpdateResultData>;
    }
}

_ClientsidePage.prototype.addComment = async function (this: _ClientsidePage, info: string | ICommentInfo): Promise<IComment & ICommentInfo> {

    const item = await this.getItem();
    return item.comments.add(info);
};

_ClientsidePage.prototype.getCommentById = async function (this: _ClientsidePage, id: string | number): Promise<IComment & ICommentInfo> {

    const item = await this.getItem();
    const data = await item.comments.getById(id)();
    return Object.assign(item.comments.getById(id), data);
};

_ClientsidePage.prototype.clearComments = async function (this: _ClientsidePage): Promise<boolean> {

    const item = await this.getItem();
    return item.comments.clear();
};

_ClientsidePage.prototype.getComments = async function (this: _ClientsidePage): Promise<ICommentInfo[]> {

    const item = await this.getItem();
    return item.comments();
};

_ClientsidePage.prototype.like = async function (this: _ClientsidePage): Promise<void> {
    const item = await this.getItem("ID");
    return spPost<void>(SPQueryable(item, "like"));
};

_ClientsidePage.prototype.unlike = async function (this: _ClientsidePage): Promise<void> {
    const item = await this.getItem("ID");
    return spPost<void>(SPQueryable(item, "unlike"));
};

_ClientsidePage.prototype.getLikedByInformation = async function (this: _ClientsidePage): Promise<ILikedByInformation> {
    const item = await this.getItem("ID");
    return item.getLikedByInformation();
};

_ClientsidePage.prototype.enableComments = async function (this: _ClientsidePage): Promise<IItemUpdateResultData> {
    return this.setCommentsOn(true).then(r => {
        this.commentsDisabled = false;
        return r;
    });
};

_ClientsidePage.prototype.disableComments = async function (this: _ClientsidePage): Promise<IItemUpdateResultData> {
    return this.setCommentsOn(false).then(r => {
        this.commentsDisabled = true;
        return r;
    });
};

_ClientsidePage.prototype.setCommentsOn = async function (this: _ClientsidePage, on: boolean): Promise<IItemUpdateResultData> {
    const item = await this.getItem();
    return Item(item, `SetCommentsDisabled(${!on})`).update({});
};

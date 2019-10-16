import { addProp } from "@pnp/odata";
import { _Item, Item } from "../items/types";
import { Comments, IComments, ILikeData, ILikedByInformation } from "./types";
import { spPost } from "../operations";

declare module "../items/types" {
    interface _Item {
        readonly comments: IComments;
        getLikedBy(): Promise<ILikeData[]>;
        like(): Promise<void>;
        unlike(): Promise<void>;
        getLikedByInformation(): Promise<ILikedByInformation>;
    }
    interface IItem {
        readonly comments: IComments;
        /**
         * Gets the collection of people who have liked this item
         */
        getLikedBy(): Promise<ILikeData[]>;
        /**
         * Likes this item as the current user
         */
        like(): Promise<void>;
        /**
         * Unlikes this item as the current user
         */
        unlike(): Promise<void>;
        /**
         * Get the like by information for a modern site page     
         */
        getLikedByInformation(): Promise<ILikedByInformation>;
    }
}

addProp(_Item, "comments", Comments);

_Item.prototype.getLikedBy = function (this: _Item): Promise<ILikeData[]> {
    return spPost<ILikeData[]>(this.clone(Item, "likedBy"));
};

_Item.prototype.like = function (this: _Item): Promise<void> {
    return spPost<void>(this.clone(Item, "like"));
};

_Item.prototype.unlike = function (this: _Item): Promise<void> {
    return spPost<void>(this.clone(Item, "unlike"));
};

_Item.prototype.getLikedByInformation = function (this: _Item): Promise<ILikedByInformation> {
    return this.clone(Item, "likedByInformation").expand("likedby")<ILikedByInformation>();
};

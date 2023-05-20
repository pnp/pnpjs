import { addProp } from "@pnp/queryable";
import { _Item, Item } from "../items/types.js";
import { Comments, IComments, ILikeData, ILikedByInformation, RatingValues } from "./types.js";
import { spPost } from "../operations.js";
import { extractWebUrl } from "../utils/extract-web-url.js";
import { combine } from "@pnp/core";
import { SPQueryable } from "../spqueryable.js";

declare module "../items/types" {
    interface _Item {
        readonly comments: IComments;
        getLikedBy(): Promise<ILikeData[]>;
        like(): Promise<void>;
        unlike(): Promise<void>;
        getLikedByInformation(): Promise<ILikedByInformation>;
        rate(rating: RatingValues): Promise<number>;
    }
    interface IItem {
        readonly comments: IComments;
        /**
         * Gets the collection of people who have liked this item
         */
        getLikedBy(): Promise<ILikeData[]>;
        /**
         * Likes this client-side page as the current user
         */
        like(): Promise<void>;
        /**
         * Unlikes this client-side page as the current user
         */
        unlike(): Promise<void>;
        /**
         * Unlikes this item as the current user
         */
        getLikedByInformation(): Promise<ILikedByInformation>;
        /**
         * Rates this item as the current user
         * @param rating rating number between 1-5
         * @returns rating number
         */
        rate(rating: RatingValues): Promise<number>;
    }
}

addProp(_Item, "comments", Comments);

_Item.prototype.getLikedBy = function (this: _Item): Promise<ILikeData[]> {
    return spPost<ILikeData[]>(Item(this, "likedBy"));
};

_Item.prototype.like = async function (this: _Item) {
    const itemInfo = await this.getParentInfos();
    const baseUrl = extractWebUrl(this.toUrl());
    const reputationUrl = "_api/Microsoft.Office.Server.ReputationModel.Reputation.SetLike(listID=@a1,itemID=@a2,like=@a3)";
    const likeUrl = combine(baseUrl, reputationUrl) + `?@a1='{${itemInfo.ParentList.Id}}'&@a2='${itemInfo.Item.Id}'&@a3=true`;
    return spPost(SPQueryable([this, likeUrl]));
};

_Item.prototype.unlike = async function (this: _Item) {
    const itemInfo = await this.getParentInfos();
    const baseUrl = extractWebUrl(this.toUrl());
    const reputationUrl = "_api/Microsoft.Office.Server.ReputationModel.Reputation.SetLike(listID=@a1,itemID=@a2,like=@a3)";
    const likeUrl = combine(baseUrl, reputationUrl) + `?@a1='{${itemInfo.ParentList.Id}}'&@a2='${itemInfo.Item.Id}'&@a3=false`;
    return spPost(SPQueryable([this, likeUrl]));
};

_Item.prototype.getLikedByInformation = function (this: _Item): Promise<ILikedByInformation> {
    return Item(this, "likedByInformation").expand("likedby")<ILikedByInformation>();
};

_Item.prototype.rate = async function (this: _Item, value: RatingValues): Promise<number> {
    const itemInfo = await this.getParentInfos();
    const baseUrl = extractWebUrl(this.toUrl());
    const reputationUrl = "_api/Microsoft.Office.Server.ReputationModel.Reputation.SetRating(listID=@a1,itemID=@a2,rating=@a3)";
    const rateUrl = combine(baseUrl, reputationUrl) + `?@a1='{${itemInfo.ParentList.Id}}'&@a2='${itemInfo.Item.Id}'&@a3=${value}`;
    return spPost(SPQueryable([this, rateUrl]));
};

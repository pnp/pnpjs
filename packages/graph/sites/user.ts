import { addProp } from "@pnp/queryable";
import { _User } from "../users/types.js";
import { IFollowedSites, FollowedSites } from "./types.js";

declare module "../users/types" {
    interface _User {
        followedSites: IFollowedSites;
    }
    interface IUser {
        followedSites: IFollowedSites;
    }
}

addProp(_User, "followedSites", FollowedSites);

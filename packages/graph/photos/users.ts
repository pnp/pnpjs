import { addProp } from "@pnp/queryable";
import { _User } from "../users/types.js";
import { Photo, IPhoto, IPhotos, Photos } from "./types.js";

declare module "../users/types" {
    interface _User {
        readonly photo: IPhoto;
        readonly photos: IPhotos;
    }
    interface IUser {
        readonly photo: IPhoto;
        readonly photos: IPhotos;
    }
}

addProp(_User, "photo", Photo);
addProp(_User, "photos", Photos);

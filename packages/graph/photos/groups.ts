import { addProp } from "@pnp/queryable";
import { _Group } from "../groups/types.js";
import { Photo, IPhoto, IPhotos, Photos } from "./types.js";

declare module "../groups/types" {
    interface _Group {
        readonly photo: IPhoto;
        readonly photos: IPhotos;
    }
    interface IGroup {
        readonly photo: IPhoto;
        readonly photos: IPhotos;
    }
}

addProp(_Group, "photo", Photo);
addProp(_Group, "photos", Photos);

import { addProp } from "@pnp/queryable";
import { _Group } from "../groups/types.js";
import { Photo, IPhoto } from "./types.js";

declare module "../groups/types" {
    interface _Group {
        readonly photo: IPhoto;
    }
    interface IGroup {
        readonly photo: IPhoto;
    }
}

addProp(_Group, "photo", Photo);

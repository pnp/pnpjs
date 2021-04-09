import { addProp } from "@pnp/queryable";
import { _User } from "../users/types.js";
import { Photo, IPhoto } from "./types.js";

declare module "../users/types" {
    interface _User {
        readonly photo: IPhoto;
    }
    interface IUser {
        readonly photo: IPhoto;
    }
}

addProp(_User, "photo", Photo);

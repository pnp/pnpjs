import { addProp } from "@pnp/odata";
import { _User } from "../users/types";
import { Photo, IPhoto } from "./types";

declare module "../users/types" {
    interface _User {
        readonly photo: IPhoto;
    }
    interface IUser {
        readonly photo: IPhoto;
    }
}

addProp(_User, "photo", Photo);

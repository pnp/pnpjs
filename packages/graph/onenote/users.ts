import { addProp } from "@pnp/queryable";
import { _User } from "../users/types.js";
import { IOneNote, OneNote } from "./types.js";

declare module "../users/types" {
    interface _User {
        readonly onenote: IOneNote;
    }
    interface IUser {
        readonly onenote: IOneNote;
    }
}

addProp(_User, "onenote", OneNote);

import { addProp } from "@pnp/odata";
import { _User } from "../users/types";
import { IOneNote, OneNote } from "./types";

declare module "../users/types" {
    interface _User {
        readonly onenote: IOneNote;
    }
    interface IUser {
        readonly onenote: IOneNote;
    }
}

addProp(_User, "onenote", OneNote);

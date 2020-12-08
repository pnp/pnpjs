import { addProp } from "@pnp/odata";
import { _User } from "../users/types.js";
import { IDrive, Drive, IDrives, Drives } from "./types.js";

declare module "../users/types" {
    interface _User {
        readonly drive: IDrive;
        readonly drives: IDrives;
    }
    interface IUser {
        readonly drive: IDrive;
        readonly drives: IDrives;
    }
}

addProp(_User, "drive", Drive);
addProp(_User, "drives", Drives);


import { addProp } from "@pnp/queryable";
import { _User } from "../users/types.js";
import { Presence, IPresence } from "./types.js";

declare module "../users/types" {
    interface _User {
        readonly presence: IPresence;
    }
    interface IUser {
        readonly presence: IPresence;
    }
}

addProp(_User, "presence", Presence);

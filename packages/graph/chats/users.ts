import { addProp } from "@pnp/queryable";
import { _User } from "../users/types.js";
import { IChats, Chats } from "./types.js";

declare module "../users/types" {
    interface _User {
        readonly chats: IChats;
    }
    interface IUser {
        readonly chats: IChats;
    }
}

addProp(_User, "chats", Chats);

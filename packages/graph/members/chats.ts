
import { addProp } from "@pnp/queryable";
import { _Chat } from "../chats/types.js";
import { IMembers, Members } from "./types.js";

declare module "../chats/types" {
    interface _Chat {
        readonly members: IMembers;
    }
    interface IChat {
        readonly members: IMembers;
    }
}

addProp(_Chat, "members", Members);

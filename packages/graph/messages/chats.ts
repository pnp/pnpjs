import { addProp } from "@pnp/queryable";
import { _Chat, _Chats } from "../chats/types.js";
import { IMessages, Messages } from "./types.js";
import { Message as IMessageType } from "@microsoft/microsoft-graph-types";
import { getAllMessages, getAllRetainedMessages } from "./functions.js";

declare module "../chats/types" {
    interface _Chats {
        getAllMessages(model: "A" | "B" | undefined): Promise<IMessageType[]>;
        getAllRetainedMessages(model: "A" | "B" | undefined): Promise<IMessageType[]>;
    }
    interface IChats {
        getAllMessages(model: "A" | "B" | undefined): Promise<IMessageType[]>;
        getAllRetainedMessages(model: "A" | "B" | undefined): Promise<IMessageType[]>;
    }
    interface _Chat {
        readonly messages: IMessages;
    }
    interface IChat {
        readonly messages: IMessages;
    }
}

addProp(_Chat, "messages", Messages);

_Chats.prototype.getAllMessages = getAllMessages;
_Chats.prototype.getAllRetainedMessages = getAllRetainedMessages;

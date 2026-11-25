import { addProp } from "@pnp/queryable";
import { _Chat, _Chats } from "../chats/types.js";
import { ITeamsChatMessages, TeamsChatMessages } from "./types.js";
import { ChatMessage as IMessageType } from "@microsoft/microsoft-graph-types";
import { getAllMessages, getAllRetainedMessages } from "./functions.js";
import { IGraphCollection } from "../graphqueryable.js";

declare module "../chats/types" {
    interface _Chats {
        getAllMessages(model?: "A" | "B"): IGraphCollection<IMessageType[]>;
        getAllRetainedMessages(model?: "A" | "B"): IGraphCollection<IMessageType[]>;
    }
    interface IChats {
        getAllMessages(model?: "A" | "B"): IGraphCollection<IMessageType[]>;
        getAllRetainedMessages(model?: "A" | "B"): IGraphCollection<IMessageType[]>;
    }
    interface _Chat {
        readonly messages: ITeamsChatMessages;
    }
    interface IChat {
        readonly messages: ITeamsChatMessages;
    }
}

addProp(_Chat, "messages", TeamsChatMessages);

_Chats.prototype.getAllMessages = getAllMessages;
_Chats.prototype.getAllRetainedMessages = getAllRetainedMessages;

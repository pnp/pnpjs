import { addProp } from "@pnp/queryable";
import { _Channel, _Channels } from "../teams/types.js";
import { ChatMessage as IMessageType } from "@microsoft/microsoft-graph-types";
import { ITeamsChatMessages, TeamsChatMessages } from "./types.js";
import { getAllMessages, getAllRetainedMessages } from "./functions.js";
import { IGraphCollection } from "../graphqueryable.js";

declare module "../teams/types" {
    interface _Channels {
        getAllMessages(model?: "A" | "B"): IGraphCollection<IMessageType[]>;
        getAllRetainedMessages(model?: "A" | "B"): IGraphCollection<IMessageType[]>;
    }
    interface IChannels {
        getAllMessages(model?: "A" | "B"): IGraphCollection<IMessageType[]>;
        getAllRetainedMessages(model?: "A" | "B"): IGraphCollection<IMessageType[]>;
    }
    interface _Channel {
        readonly messages: ITeamsChatMessages;
    }
    interface IChannel {
        readonly messages: ITeamsChatMessages;
    }
}

addProp(_Channel, "messages", TeamsChatMessages);

_Channels.prototype.getAllMessages = getAllMessages;
_Channels.prototype.getAllRetainedMessages = getAllRetainedMessages;

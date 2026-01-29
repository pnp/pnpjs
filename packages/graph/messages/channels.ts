import { addProp } from "@pnp/queryable";
import { _Channel, _Channels } from "../teams/types.js";
import { Message as IMessageType } from "@microsoft/microsoft-graph-types";
import { IMessages, Messages } from "./types.js";
import { getAllMessages, getAllRetainedMessages } from "./functions.js";

declare module "../teams/types" {
    interface _Channels {
        getAllMessages(model: "A" | "B" | undefined): Promise<IMessageType[]>;
        getAllRetainedMessages(model: "A" | "B" | undefined): Promise<IMessageType[]>;
    }
    interface IChannels {
        getAllMessages(model: "A" | "B" | undefined): Promise<IMessageType[]>;
        getAllRetainedMessages(model: "A" | "B" | undefined): Promise<IMessageType[]>;
    }
    interface _Channel {
        readonly messages: IMessages;
    }
    interface IChannel {
        readonly messages: IMessages;
    }
}

addProp(_Channel, "messages", Messages);

_Channels.prototype.getAllMessages = getAllMessages;
_Channels.prototype.getAllRetainedMessages = getAllRetainedMessages;

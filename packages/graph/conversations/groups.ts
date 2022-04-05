import { addProp } from "@pnp/queryable";
import { _Group } from "../groups/types.js";
import { Conversations, IConversations, ISenders, Senders } from "./types.js";

declare module "../groups/types" {
    interface _Group {
        readonly conversations: IConversations;
        readonly acceptedSenders: ISenders;
        readonly rejectedSenders: ISenders;
    }
    interface IGroup {
        readonly conversations: IConversations;
        readonly acceptedSenders: ISenders;
        readonly rejectedSenders: ISenders;
    }
}

addProp(_Group, "conversations", Conversations);
addProp(_Group, "acceptedSenders", Senders);
addProp(_Group, "rejectedSenders", Senders);

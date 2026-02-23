import { _Message } from "../mail/messages.js";
import { addProp } from "@pnp/queryable";
import { Attachments, IAttachments } from "./types.js";

declare module "../mail/messages" {
    interface _Message {
        readonly attachments: IAttachments;
    }
    interface IMessage {
        readonly attachments: IAttachments;
    }
}

addProp(_Message, "attachments", Attachments);

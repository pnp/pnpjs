import { _Event } from "../calendars/types.js";
import { addProp } from "@pnp/queryable";
import { Attachments, IAttachments } from "./types.js";

declare module "../calendars/types" {
    interface _Event {
        readonly attachments: IAttachments;
    }
    interface IEvent {
        readonly attachments: IAttachments;
    }
}

addProp(_Event, "attachments", Attachments);

import { _Post } from "../conversations/types";
import { addProp } from "@pnp/odata";
import { Attachments, IAttachments } from "./types";

declare module "../conversations/types" {
    interface _Post {
        readonly attachments: IAttachments;
    }
    interface IPost {
        readonly attachments: IAttachments;
    }
}

addProp(_Post, "attachments", Attachments);

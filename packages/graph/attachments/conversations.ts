import { _Post } from "../conversations/types.js";
import { addProp } from "@pnp/queryable";
import { Attachments, IAttachments } from "./types.js";

declare module "../conversations/types" {
    interface _Post {
        readonly attachments: IAttachments;
    }
    interface IPost {
        readonly attachments: IAttachments;
    }
}

addProp(_Post, "attachments", Attachments);

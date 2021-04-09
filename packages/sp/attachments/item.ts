import { addProp } from "@pnp/queryable";
import { _Item } from "../items/types.js";
import { Attachments, IAttachments } from "./types.js";

declare module "../items/types" {
    interface _Item {
        readonly attachmentFiles: IAttachments;
    }
    interface IItem {
        /**
         * Read the attachment files data for an item
         */
        readonly attachmentFiles: IAttachments;
    }
}

addProp(_Item, "attachmentFiles", Attachments);
